import { Link } from "next-view-transitions";

export default function Header() {
  return (
    <div className="flex items-center gap-4 mb-6 uppercase not-prose">
      <Link
        href="/"
        className="text-xs text-[#666666] dark:text-[#909090] hover:text-black dark:hover:text-white transition-colors"
      >
        ← back
      </Link>
    </div>
  );
}
