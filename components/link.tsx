import { Link as TransitionLink } from "next-view-transitions";
import Hoverable from "@/components/Hoverable";
import { PropsWithChildren } from "react";

interface LinkProps {
  href: string;
  title?: string;
  description?: string;
}

export default function Link({ href, title, description, children }: PropsWithChildren<LinkProps>) {
  return (
    <Hoverable
      title={title || href}
      description={description || "Click to open in a new tab"}
    >
      <TransitionLink
        href={href}
        className="text-[#666666] text-xs inline-flex dark:text-[#909090]"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </TransitionLink>
    </Hoverable>
  );
} 