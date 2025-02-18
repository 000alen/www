import Link from "next/link";

export default function Home() {
  return <div className="min-h-screen bg-black text-white p-6 font-mono flex items-center justify-center">
    <div className="max-w-2xl w-full text-sm [&>p]:text-xs [&>p]:text-[#909090] [&_a]:text-xs [&_a]:text-[#909090]">
      <h1 className="font-normal mb-2">
        alen rubilar<span className="caret">_</span>
      </h1>
      <p className="mb-4">san francisco, usa</p>

      <div className="mb-8"></div>

      <h2 className="font-normal mb-2">today</h2>
      <p className="mb-8">
        i&apos;m a machine learning engineer at dataroot, building a paas for
        managed machine learning powered applications.
      </p>
      <p className="mb-8">
        on the side, i&apos;m currently working on{" "}
        <Link
          href="https://000alen.notion.site/Projects-19ede7d2d0f78030b0a2e43b3ba96391"
          className="text-[#909090]"
          target="_blank"
          rel="noopener noreferrer"
        >
          these projects
        </Link>
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
          <Link
            href="https://github.com/000alen/pulsebud"
            className="text-[#909090]"
            target="_blank"
            rel="noopener noreferrer"
          >
            CalHacks and several partner challenges
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/000alen/phaedra"
            className="text-[#909090]"
            target="_blank"
            rel="noopener noreferrer"
          >
            HackMIT&apos;s Inclusive Social Networks challenge
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/000alen/totemuv"
            className="text-[#909090]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solve for Tomorrow
          </Link>
        </li>
      </ul>

      <h2 className="font-normal mb-2">connect</h2>
      <p className="mb-8">
        reach me on{" "}
        <Link
          href="https://x.com/000alen"
          className="text-[#909090]"
          target="_blank"
          rel="noopener noreferrer"
        >
          𝕏
        </Link>{" "}
        or find me on{" "}
        <Link
          href="https://github.com/000alen"
          className="text-[#909090]"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.linkedin.com/in/000alen/"
          className="text-[#909090]"
          target="_blank"
          rel="noopener noreferrer"
        >
          linkedin
        </Link>
        .
      </p>
    </div>
  </div>;
}
