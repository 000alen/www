"use server";

import { z } from "zod";
import { createCaller } from "@/trpc/server";
import { logger } from "@/lib/logging";

const log = logger.extend("actions");

export type CreateIntroState = {
  type: "idle";
} | {
  type: "loading";
} | {
  type: "success";
  slug: string;
} | {
  type: "error";
  error: string;
}

const createIntroSchema = z.object({
  query: z.string(),
});

export async function createIntro(state: CreateIntroState, formData: FormData): Promise<CreateIntroState> {
  const data = {
    query: formData.get("query"),
  }

  try {
    const { query } = await createIntroSchema
      .parseAsync(data)
      .catch((error) => {
        log("createIntro: Failed to parse form data", { error, data });
        throw error;
      });

    const trpc = createCaller({
      headers: new Headers(),
    })

    const { slug } = await trpc
      .intro
      .create({ query })
      .catch((error) => {
        log("createIntro: Failed to create intro", { error, data });
        throw error;
      });

    return {
      type: "success",
      slug,
    }
  } catch (error) {
    log("createIntro: Failed to create intro", { error, data });

    return {
      type: "error",
      error: "Failed to create intro",
    }
  }
}
