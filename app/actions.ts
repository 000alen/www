"use server";

import { createCaller } from "@/trpc/server";
import { logger } from "@/lib/logging";
import { z } from "zod";

const log = logger.extend("actions");

const emailSchema = z.string().email();

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

export type RequestEmailState = {
  type: "idle";
} | {
  type: "loading";
} | {
  type: "success";
} | {
  type: "error";
  error: string;
}

export async function createIntro(query: string): Promise<CreateIntroState> {
  try {
    const trpc = createCaller({
      headers: new Headers(),
    })

    const { slug } = await trpc
      .intro
      .create({ query })
      .catch((error) => {
        log("createIntro: Failed to create intro", { error, query });
        throw error;
      });

    return {
      type: "success",
      slug,
    }
  } catch (error) {
    log("createIntro: Failed to create intro", { error, query });

    return {
      type: "error",
      error: "Failed to create intro",
    }
  }
}

export async function requestEmail(slug: string, email: string): Promise<RequestEmailState> {
  try {
    await emailSchema.parseAsync(email);

    // const trpc = createCaller({
    //   headers: new Headers(),
    // });

    // await trpc.intro.requestEmail({
    //   slug,
    //   email: validatedEmail,
    // });

    return {
      type: "success",
    };
  } catch (error) {
    log("Failed to request email", { error, slug, email });
    return {
      type: "error",
      error: "Failed to request email",
    };
  }
}
