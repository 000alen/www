import { NOTION_PROJECTS_URL } from "@/lib/constants";
import CustomLink from "@/components/CustomLink";

export default function Page() {
  return <div className="min-h-screen bg-black text-white p-6 font-mono flex items-center justify-center">
    <div className="max-w-2xl w-full text-sm [&>p]:text-xs [&>p]:text-[#909090] [&_a]:text-xs [&_a]:text-[#909090]">
      <h1 className="font-normal mb-2">
        alen rubilar<span className="caret">_</span>
      </h1>

      <p className="mb-4">
        san francisco, usa
      </p>

      <div className="mb-8"></div>

      <h2 className="font-normal mb-2">today</h2>
      <p className="mb-8">
        i&apos;m a machine learning engineer at dataroot, building a paas for
        managed machine learning powered applications.
      </p>

      <p className="mb-8">
        on the side, i&apos;m currently working on{" "}
        <CustomLink
          href={NOTION_PROJECTS_URL}
          title="Projects"
          description="I decided I would start documenting and keeping track of my projects. I'm not sure how long I'll keep this up, but here are some of the things I've worked on."
        >
          these projects
        </CustomLink>
        .
      </p>

      <h2 className="font-normal mb-2">research</h2>
      <p className="mb-8">
        deep learning research at vanderbilt university, working on protein
        folding and structural biology. previously at leipzig university,
        developing topological neural networks for molecule optimization.
      </p>

      <h2 className="font-normal mb-2">education</h2>
      <p className="mb-8">
        b.sc. computer science and mathematics at minerva university
        (2024-2026). previously studied at pontificia universidad católica
        de chile and universidad técnica federico santa maría.
      </p>

      <h2 className="font-normal mb-2">awards</h2>
      <ul className="list-none p-0 space-y-1 mb-8">
        <li>
          <CustomLink
            href="https://github.com/000alen/pulsebud"
            title="PulseBud @ CalHacks"
            description="I won the competition by building a model to predict seizures on real-time from measurements taken by a smartwatch."
          >
            CalHacks and several partner challenges
          </CustomLink>
        </li>
        <li>
          <CustomLink
            href="https://github.com/000alen/phaedra"
            title="Phaedra @ HackMIT"
            description="I won some partner challenge by building a platform to facilitate traditional knowledge transfer in the workplace."
          >
            HackMIT&apos;s Inclusive Workplace challenge
          </CustomLink>
        </li>
        <li>
          <CustomLink
            href="https://github.com/000alen/totemuv"
            title="TotemUV @ Solve for Tomorrow"
            description="I won the competition by building a device to predict skin cancer from UV imaging."
          >
            Solve for Tomorrow
          </CustomLink>
        </li>
      </ul>

      <h2 className="font-normal mb-2">connect</h2>
      <p className="mb-8">
        reach me on{" "}
        <CustomLink
          href="https://x.com/000alen"
          title="𝕏"
          description="I retweet a lot of cool stuff."
        >
          𝕏
        </CustomLink>{" "}
        or find me on{" "}
        <CustomLink
          href="https://github.com/000alen"
          title="GitHub"
          description="I'm very active on GitHub, so you can find some of my projects there."
        >
          github
        </CustomLink>{" "}
        and{" "}
        <CustomLink
          href="https://www.linkedin.com/in/000alen/"
          title="LinkedIn"
          description="I'm not very active on LinkedIn, but you can find some of my projects there."
        >
          linkedin
        </CustomLink>
        .
      </p>
    </div>
  </div>;
}
