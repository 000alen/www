import fs from "fs";
import { CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";

// export const languageModel = openai("o3-mini");
export const languageModel = openai("gpt-4o-mini");

export const embeddingModel = openai.embedding("text-embedding-3-small");

export const getMessages = async (query: string): Promise<CoreMessage[]> => {
  const context = await fs.promises.readFile("context.txt", "utf8");

  return [
    {
      role: "system",
      content: `You are tasked to created a tailored introduction for Alen Rubilar. The introduction should be tailored to a specific query. The introduction should be concise and to the point. The introduction should be no more than 100 words. This is the context of Alen Rubilar:\n\n"""\n${context}\n"""`,
    },
    {
      role: "user",
      content: query,
    }
  ]
}