import { createCaller } from "@/trpc/server";
import { logger } from "@/lib/logging";
import { redirect } from "next/navigation";

const log = logger.extend("intro");

export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
    .catch((error) => {
      log("page: Failed to get params", { error });

      throw redirect(`/`);
    });

  const trpc = createCaller({
    headers: new Headers(),
  })

  const intro = await trpc
    .intro
    .get({ slug })
    .catch((error) => {
      log("page: Failed to get intro", { error, slug });
      throw redirect(`/`);
    });

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono flex items-center justify-center">
      <div className="max-w-2xl w-full text-sm [&>p]:text-xs [&>p]:text-[#909090] [&_a]:text-xs [&_a]:text-[#909090]">
        <h1 className="font-normal mb-2">
          {slug}
        </h1>

        <h2 className="font-normal mb-2">intro</h2>
        <p className="mb-8">
          {intro.text}
        </p>
      </div>
    </div>
  )
}