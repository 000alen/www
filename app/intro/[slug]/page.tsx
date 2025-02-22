import { createCaller } from "@/trpc/server";
import { logger } from "@/lib/logging";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import EmailRequest from "@/components/EmailRequest";
import Paragraph from "@/components/paragraph";
import Header from "@/components/header";
import { TetrisEasterEgg } from "@/components/tetris";

const log = logger.extend("intro");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params.catch((error) => {
    log("metadata: Failed to get params", { error });
    throw redirect(`/`);
  });

  const trpc = createCaller({
    headers: new Headers(),
  });

  const intro = await trpc.intro.get({ slug }).catch((error) => {
    log("metadata: Failed to get intro", { error, slug });
    throw redirect(`/`);
  });

  return {
    title: `${slug} | intro`,
    description: intro.text,
    openGraph: {
      title: `${slug} | intro`,
      description: intro.text,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${slug} | intro`,
      description: intro.text,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params.catch((error) => {
    log("page: Failed to get params", { error });

    throw redirect(`/`);
  });

  const trpc = createCaller({
    headers: new Headers(),
  });

  const intro = await trpc.intro.get({ slug }).catch((error) => {
    log("page: Failed to get intro", { error, slug });
    throw redirect(`/`);
  });

  return (
    <div className="max-w-2xl w-full text-sm uppercase">
      <Header />

      <h1 className="font-normal mb-2">{slug}</h1>

      <h2 className="font-normal mb-2">intro</h2>

      <Paragraph>{intro.text}</Paragraph>

      <div className="mb-8" />
      <EmailRequest slug={slug} />

      <TetrisEasterEgg />
    </div>
  );
}
