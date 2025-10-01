// import { NOTION_PROJECTS_URL } from "@/lib/constants";
// import HaveWeMet from "@/components/HaveWeMet";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "@/components/link";
import EncryptedTextSmooth from "@/components/EncryptedTextSmooth";
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
        i&apos;m a co-founder and cto of <Link href="https://velum-labs.com/">velum labs</Link>,
        building the ai privacy company. we are backed by <Link href="https://www.ycombinator.com/">y combinator</Link>.

        previously, i was a principal software engineer at <Link href="https://dataroot.cl/">dataroot</Link>, building a paas for
        managed machine learning powered applications.
      </Paragraph>

      {/* <Paragraph className="mb-4">
        on the side, i&apos;m helping reinvent computers at <Link href="https://tetramem.com" title="Tetramem" description="Tetramem is a company that is creating in-memory analog hardware accelerators.">tetramem</Link>.
      </Paragraph> */}

      {/* <Paragraph>
        in my free time, i work on{" "}
        <Link
          href={NOTION_PROJECTS_URL}
          title="Projects"
          description="I decided I would start documenting and keeping track of my projects. I'm not sure how long I'll keep this up, but here are some of the things I've worked on."
          target="_blank"
        >
          these projects
        </Link>
        .
      </Paragraph> */}
    </section>

    <section>
      <h2 className="font-normal mb-2">research</h2>

      <Paragraph>
        deep learning research at vanderbilt university, working on protein
        folding and structural biology. previously at leipzig university,
        developing topological neural networks for molecule optimization.
      </Paragraph>
    </section>

    <section>
      <h2 className="font-normal mb-2">education</h2>

      <Paragraph>
        b.sc. computer science and mathematics at <Link href="https://www.minerva.edu/" description="Minerva is an experimental university reinventing higher education and creating a new generation of global citizens.">minerva university</Link>
        (2022-2026). previously studied at pontificia universidad católica
        de chile and universidad técnica federico santa maría.
      </Paragraph>
    </section>

    <section>
      <h2 className="font-normal mb-2">awards</h2>

      <ul className="list-none p-0 space-y-1 mb-8">
        <li>
          <Link
            href="https://github.com/000alen/pulsebud"
            title="PulseBud @ CalHacks"
            description="I won the competition by building a model to predict seizures on real-time from measurements taken by a smartwatch."
          >
            CalHacks and several partner challenges
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/000alen/phaedra"
            title="Phaedra @ HackMIT"
            description="I won some partner challenge by building a platform to facilitate traditional knowledge transfer in the workplace."
          >
            HackMIT&apos;s Inclusive Workplace challenge
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/000alen/totemuv"
            title="TotemUV @ Solve for Tomorrow"
            description="I won the competition by building a device to predict skin cancer from UV imaging."
          >
            Solve for Tomorrow
          </Link>
        </li>
      </ul>
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
