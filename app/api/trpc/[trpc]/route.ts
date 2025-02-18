import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { api } from "@/trpc/server";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: api,
    createContext: () => ({
      headers: req.headers,
    }),
  });

export { handler as GET, handler as POST };
