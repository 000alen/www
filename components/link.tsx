import { Link as TransitionLink } from "next-view-transitions";
import Hoverable from "@/components/Hoverable";
import { PropsWithChildren } from "react";

interface LinkProps {
  href: string;
  title?: string;
  description?: string;
  target?: string;
}

export default function Link({ href, title, description, children, target }: PropsWithChildren<LinkProps>) {
  return (
    <Hoverable
      title={title || href}
      description={description || "Click to open in a new tab"}
    >
      <TransitionLink
        href={href}
        className="text-[#666666] text-xs inline-flex dark:text-[#909090]"
        rel="noopener noreferrer"
        target={target}
      >
        {children}
      </TransitionLink>
    </Hoverable>
  );
} 