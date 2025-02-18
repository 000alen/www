import { createCaller } from "@/trpc/server";
import { logger } from "@/lib/logging";
import { redirect } from "next/navigation";

const log = logger.extend("intro:query");

export default async function Page(
  { params }: { params: Promise<{ query: string }> }
) {
  const { query } = await params
    .catch((error) => {
      log("page: Failed to get params", { error });

      throw redirect(`/`);
    });

  const trpc = createCaller({
    headers: new Headers(),
  })

  const { slug } = await trpc
    .intro
    .query({
      query: decodeURIComponent(query)
        .split("-")
        .join(" "),
    })
    .catch((error) => {
      log("page: Failed to get intro", { error, query });
      throw redirect(`/`);
    });

  throw redirect(`/intro/${slug}`);
}