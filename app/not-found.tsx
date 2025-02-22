import Link from "@/components/link";
import Paragraph from "@/components/paragraph";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function NotFound() {
  return (
    <div className="max-w-2xl w-full text-sm uppercase">
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-normal">
          404<span className="caret">_</span>
        </h1>
        <ThemeToggle />
      </div>

      <Paragraph className="mb-4">
        page not found
      </Paragraph>

      <div className="mb-8"></div>

      <section>
        <Paragraph>
          the page you&apos;re looking for doesn&apos;t exist. you can go back{" "}
          <Link
            href="/"
            title="Home"
            description="Return to the homepage"
          >
            home
          </Link>
          .
        </Paragraph>
      </section>
    </div>
  );
} 