import { z } from "zod";

export const introSchema = z
  .object({
    text: z
      .string()
      .describe("The introduction."),
  })
  .passthrough();

export const introGenerationSchema = z
  .object({
    slug: z
      .string()
      .describe("A slug that identifies the introduction."),

    text: z
      .string()
      .describe("The introduction.."),
  });
