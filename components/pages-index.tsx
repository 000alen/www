"use client";

import Head from "next/head";
import Link from "next/link";

export function Index() {
  return (
    <>
      <Head>
        <title>alen rubilar</title>
        <meta name="description" content="personal website of alen rubilar" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="alen rubilar" />
        <meta
          property="og:description"
          content="personal website of alen rubilar"
        />
        {/* <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com" />
        <meta property="og:type" content="website" /> */}
      </Head>

      <div className="min-h-screen bg-black text-white p-6 font-mono flex items-center justify-center">
        <div className="max-w-2xl w-full text-sm [&>p]:text-xs [&>p]:text-[#909090] [&_a]:text-xs [&_a]:text-[#909090]">
          <h1 className="font-normal mb-2">
            alen rubilar<span className="caret">_</span>
          </h1>
          <p className="mb-4">san francisco, usa</p>

          <div className="mb-8"></div>

          <h2 className="font-normal mb-2">today</h2>
          <p className="mb-8">
            i'm a machine learning engineer at dataroot, building a paas for
            managed machine learning powered applications.
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
                HackMIT's Inclusive Social Networks challenge
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
      </div>

      <style jsx global>{`
        * {
          text-transform: uppercase;
          text-rendering: geometricPrecision;
        }
        h1,
        h2 {
          font-size: 0.75rem;
        }
        body {
          background-color: black;
          margin: 0;
          padding: 0;
          font-family: monospace;
        }

        ::selection {
          background: white;
          color: black;
        }

        a {
          position: relative;
          text-decoration: none;
          color: #909090;
        }

        a::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: #909090;
          transform: scaleX(1);
          transform-origin: bottom left;
          transition: transform 0.3s ease-out;
        }

        a:hover::after {
          transform: scaleX(0);
          transform-origin: bottom right;
        }

        .caret {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          from,
          to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .mb-2 {
          margin-bottom: 0.2rem;
        }
      `}</style>
    </>
  );
}
