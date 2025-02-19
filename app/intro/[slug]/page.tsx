import { createCaller } from "@/trpc/server";
import { logger } from "@/lib/logging";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

const log = logger.extend("intro");

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
    .catch((error) => {
      log("metadata: Failed to get params", { error });
      throw redirect(`/`);
    });

  const trpc = createCaller({
    headers: new Headers(),
  });

  const intro = await trpc.intro.get({ slug })
    .catch((error) => {
      log("metadata: Failed to get intro", { error, slug });
      throw redirect(`/`);
    });

  return {
    title: `${slug} | intro`,
    description: intro.text,
    openGraph: {
      title: `${slug} | intro`,
      description: intro.text,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${slug} | intro`,
      description: intro.text,
    },
  };
}

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
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/" 
            className="text-xs text-[#909090] hover:text-white transition-colors"
          >
            ← back
          </Link>
        </div>
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