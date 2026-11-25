import type { ProjectStatus } from "@/content";
import { cn } from "@/lib/utils";

const styles: Record<ProjectStatus, string> = {
  Concept: "border-border text-muted-foreground",
  "In Progress": "border-foreground/20 text-foreground",
  Completed: "border-transparent bg-primary text-primary-foreground",
  Published: "border-transparent bg-accent text-accent-foreground",
};

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      className={cn(
        "text-eyebrow inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 text-[0.6rem] backdrop-blur",
        styles[status],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status === "Concept" && "border border-current",
          status === "In Progress" && "bg-accent",
          (status === "Completed" || status === "Published") && "bg-current",
        )}
      />
      {status}
    </span>
  );
}
