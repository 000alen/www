// import { NOTION_PROJECTS_URL } from "@/lib/constants";
// import HaveWeMet from "@/components/HaveWeMet";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "@/components/link";
import Paragraph from "@/components/paragraph";
import { TetrisEasterEgg } from "@/components/tetris";

export default function Page() {
  return <div className="max-w-2xl w-full text-sm uppercase">
    <div className="flex justify-between items-center mb-2">
      <h1 className="font-normal">
        alen rubilar-muñoz<span className="caret">_</span>
      </h1>
      <ThemeToggle />
    </div>

    <Paragraph className="mb-4">
      san francisco, usa
    </Paragraph>

    <div className="mb-8"></div>

    <section>
      <h2 className="font-normal mb-2">today</h2>

      <Paragraph className="mb-4">
        co-founder and cto of <Link href="https://velum-labs.com/" description="Velum Labs builds Alma, the operating system for data integrity at scale.">velum labs</Link> (<Link href="https://www.ycombinator.com/">yc w26</Link>).
        building <Link href="https://velum-labs.com/" title="Alma" description="Alma learns ontologies from query traffic and enforces them. When definitions drift, it catches it and opens a pull request.">alma</Link>,
        the operating system for data integrity at scale. we learn ontologies from query traffic
        and distributed lineage, and enforce them. when definitions drift, we catch it and open a pull request.
      </Paragraph>
    </section>

    <section>
      <h2 className="font-normal mb-2">research</h2>

      <Paragraph>
        deep learning research at vanderbilt university, working on protein
        folding and structural biology. previously at leipzig university,
        developing topological neural networks for molecule optimization.
        also worked at <Link href="https://tetramem.com" title="Tetramem" description="Tetramem builds in-memory analog hardware accelerators.">tetramem</Link> on
        denoising algorithms for extremely energy efficient analog computers.
      </Paragraph>
    </section>

    <section>
      <h2 className="font-normal mb-2">education</h2>

      <Paragraph>
        dropped out of <Link href="https://www.minerva.edu/" description="Minerva is an experimental university reinventing higher education and creating a new generation of global citizens.">minerva university</Link> (computer science and mathematics, 2022-2024) to start velum labs.
        previously studied at pontificia universidad católica de chile and
        universidad técnica federico santa maría.
      </Paragraph>
    </section>

    <section>
      <h2 className="font-normal mb-2">connect</h2>

      <Paragraph>
        reach me on{" "}
        <Link
          href="https://x.com/000alen"
          title="𝕏"
          description="I retweet a lot of cool stuff."
        >
          𝕏
        </Link>{" "}
        or find me on{" "}
        <Link
          href="https://github.com/000alen"
          title="GitHub"
          description="I'm very active on GitHub, so you can find some of my projects there."
        >
          github
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.linkedin.com/in/000alen/"
          title="LinkedIn"
          description="I'm not very active on LinkedIn, but you can find some of my projects there."
        >
          linkedin
        </Link>
        .
      </Paragraph>
    </section>

    {/* <HaveWeMet /> */}

    <TetrisEasterEgg />
  </div>;
}
