import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "@/components/link";
import Paragraph from "@/components/paragraph";
import { TetrisEasterEgg } from "@/components/tetris";

export default function Page() {
  return (
    <main className="personal-home w-full max-w-2xl py-10 sm:py-16">
      <header className="mb-12 flex items-center justify-between gap-4">
        <h1 className="text-base font-normal sm:text-lg">
          alen rubilar-muñoz<span className="caret" aria-hidden="true">_</span>
        </h1>
        <ThemeToggle />
      </header>

      <Paragraph className="mb-12">
        co-founder and cto at{" "}
        <Link href="https://velum-labs.com/" description="Dedicated inference and research on reusing model context.">velum labs</Link>{" "}
        (<Link href="https://www.ycombinator.com/">yc w26</Link>).
        i build systems for running models and reusing the computation behind them.
      </Paragraph>

      <section aria-labelledby="building-title" className="mb-10">
        <h2 id="building-title" className="mb-3 text-sm font-normal">building</h2>
        <Paragraph className="mb-0">
          at velum, we&apos;re working on dedicated inference in your own cloud.
          i&apos;m interested in the systems underneath: where models run, where
          their context lives, and how much work we can avoid doing twice.
        </Paragraph>
      </section>

      <section aria-labelledby="research-title" className="mb-10">
        <h2 id="research-title" className="mb-3 text-sm font-normal">research</h2>
        <Paragraph className="mb-0">
          exploring portable and composable kv caches: transferring attention
          state between models, and reusing cached blocks across requests.
          the question is how to share useful computation without losing what
          makes each model work.
        </Paragraph>
      </section>

      <section aria-labelledby="previously-title" className="mb-10">
        <h2 id="previously-title" className="mb-3 text-sm font-normal">previously</h2>
        <Paragraph className="mb-4">
          worked on deep learning for protein structure at vanderbilt,
          topological neural networks for molecules in leipzig, and calibration
          and denoising for analog compute at{" "}
          <Link href="https://tetramem.com" title="tetramem" description="In-memory analog hardware accelerators.">tetramem</Link>.
        </Paragraph>
        <Paragraph className="mb-0">
          studied computer science and mathematics at{" "}
          <Link href="https://www.minerva.edu/">minerva</Link>. left to build velum.
        </Paragraph>
      </section>

      <section aria-labelledby="connect-title">
        <h2 id="connect-title" className="mb-3 text-sm font-normal">connect</h2>
        <nav aria-label="Social profiles" className="flex flex-wrap gap-x-6 gap-y-3">
          <Link href="https://github.com/000alen" title="github">github</Link>
          <Link href="https://x.com/000alen" title="x">x</Link>
          <Link href="https://www.linkedin.com/in/000alen/" title="linkedin">linkedin</Link>
        </nav>
      </section>

      <TetrisEasterEgg />
    </main>
  );
}
