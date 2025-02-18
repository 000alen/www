import Link from "next/link";
import Hoverable from "@/components/Hoverable";

interface CustomLinkProps {
  href: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function CustomLink({ href, title, description, children }: CustomLinkProps) {
  return (
    <Hoverable
      title={title || href}
      description={description || "Click to open in a new tab"}
    >
      <Link
        href={href}
        className="text-[#909090] text-xs inline-flex"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </Link>
    </Hoverable>
  );
} 