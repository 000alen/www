import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface HoverableProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function Hoverable({ title, description, children }: HoverableProps) {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4 bg-[#1E1E1E] border-[#333333] text-white dark:bg-white dark:border-[#333333] dark:text-black">
        <div className="space-y-2">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs">
            {description || "Click to open in a new tab"}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 