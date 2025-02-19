import { router, createCallerFactory, procedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { generateObject, embed } from "ai"
import { db } from "@/db";
import { intros } from "@/db/schema";
import { embeddingModel, getMessages, languageModel } from "@/lib/llm";
import { introSchema, introGenerationSchema } from "@/lib/types";
import { logger } from "@/lib/logging";
import { rateLimit } from "@/lib/rate-limit";
import { redis } from "@/lib/redis";
import { cosineDistance, eq, sql, gt, desc } from "drizzle-orm";
import { waitUntil } from "@vercel/functions";

const log = logger.extend("trpc");

// Cache TTL in seconds (24 hours)
const INTRO_CACHE_TTL = 86400;

export const api = router({
  intro: router({
    get: procedure
      .input(z.object({
        slug: z.string(),
      }))
      .output(introSchema)
      .query(async ({ input }) => {
        log("api.intro.get", { input });

        const cacheKey = `intro.get:${input.slug}`;
        const unparsedCached = await redis.get(cacheKey);
        if (unparsedCached) {
          log("api.intro.get: Cache hit", { input });

          const cached = await introSchema
            .parseAsync(unparsedCached)
            .catch((error) => {
              log("api.intro.get: Failed to parse cached intro", { error, input, unparsedCached });
              return null;
            });

          if (cached) return cached;
        }

        const [record] = await db
          .select()
          .from(intros)
          .where(eq(intros.slug, input.slug))
          .limit(1)
          .catch((error) => {
            log("api.intro.get: Failed to get intro from database", { error, input });

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to get intro",
            });
          });

        if (!record) {
          log("api.intro.get: Intro not found", { input });

          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Intro not found",
          });
        }

        const parsedIntro = await introSchema
          .parseAsync(record.intro)
          .catch((error) => {
            log("api.intro.get: Failed to parse intro", { error, input, record });

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to parse intro",
            });
          });

        waitUntil(
          redis
            .set(cacheKey, parsedIntro, { ex: INTRO_CACHE_TTL })
            .catch((error) => {
              log("api.intro.get: Failed to cache intro", { error, input });
            })
        );

        return parsedIntro;
      }),

    query: procedure
      .input(z.object({
        query: z.string(),
      }))
      .output(z.object({
        slug: z.string(),
      }))
      .query(async ({ input }) => {
        log("api.intro.query", { input });

        const cacheKey = `intro.query:${input.query}`;
        const unparsedCached = await redis.get(cacheKey);
        if (unparsedCached) {
          log("api.intro.query: Cache hit", { input });

          const cached = await z
            .string()
            .parseAsync(unparsedCached)
            .catch((error) => {
              log("api.intro.query: Failed to parse cached intro", { error, input, unparsedCached });
              return null;
            });

          if (cached) return {
            slug: cached,
          };
        }

        const { embedding } = await embed({
          model: embeddingModel,
          value: input.query,
        })
          .catch((error) => {
            log("api.intro.query: Failed to embed query", { error, input });

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to embed query",
            });
          });

        const similarity = sql<number>`1 - (${cosineDistance(
          intros.embedding,
          embedding
        )})`;

        const [record] = await db
          .select({
            slug: intros.slug,
          })
          .from(intros)
          .where(gt(similarity, 0.5))
          .orderBy(desc(similarity))
          .limit(1)
          .catch((error) => {
            log("api.intro.query: Failed to get intro from database", { error, input });

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to get intro",
            });
          });

        if (!record) {
          log("api.intro.query: Intro not found", { input });

          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Intro not found",
          });
        }

        waitUntil(
          redis
            .set(cacheKey, record.slug, { ex: INTRO_CACHE_TTL })
            .catch((error) => {
              log("api.intro.query: Failed to cache intro", { error, input });
            })
        );

        return record;
      }),

    create: procedure
      .input(z.object({
        query: z.string(),
      }))
      .output(z.object({
        slug: z.string(),
        intro: introSchema
      }))
      .mutation(async ({ input }) => {
        log("api.intro.create", { input });

        const { success } = await rateLimit.limit("intro.create");

        if (!success) {
          log("api.intro.create: Too many requests", { input });

          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests",
          });
        }

        const { object } = await generateObject({
          model: languageModel,
          schema: introGenerationSchema,
          messages: await getMessages(input.query),
        })
          .catch((error) => {
            log("api.intro.create: Failed to generate intro", { error, input });

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to generate intro",
            });
          });

        const { slug, text } = object;
        const intro: z.infer<typeof introSchema> = {
          text,
        };

        waitUntil(
          (async () => {
            const cacheKey = `intro.get:${object.slug}`;

            await redis
              .set(cacheKey, intro, { ex: INTRO_CACHE_TTL })
              .catch((error) => {
                log("api.intro.create: Failed to cache intro", { error, input });
              });

            const embedding = await embed({
              model: embeddingModel,
              value: input.query,
            })
              .then((r) => r.embedding);

            await db
              .insert(intros)
              .values({
                slug,
                query: input.query,
                intro,
                embedding,
              })
              .returning()
              .catch((error) => {
                log("api.intro.create: Failed to create intro", { error, input });

                throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "Failed to create intro",
                });
              })
          })()
        );

        return {
          slug,
          intro,
        }
      })
  }),
})

export type API = typeof api;

export const createCaller = createCallerFactory(api);
