import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ParagraphProps {
  className?: string;
}

export default function Paragraph({ children, className }: PropsWithChildren<ParagraphProps>) {
  return <p className={cn("mb-8 text-xs text-[#666666] dark:text-[#909090]", className)}>{children}</p>;
}
