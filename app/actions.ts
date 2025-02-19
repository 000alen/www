"use server";

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
