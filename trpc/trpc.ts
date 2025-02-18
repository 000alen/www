import { initTRPC } from "@trpc/server";

interface Context {
  headers: Headers;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;

export const procedure = t.procedure;

export const createCallerFactory = t.createCallerFactory;
