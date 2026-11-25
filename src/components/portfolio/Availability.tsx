import { cn } from "@/lib/utils";
import { usePortfolio } from "@/hooks/use-portfolio";

export function Availability({ className, short = false }: { className?: string; short?: boolean }) {
  const c = usePortfolio();
  const { profile } = c;
  if (!profile.availability.open) return null;
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="relative inline-flex size-2 rounded-full bg-success animate-pulse-dot" aria-hidden />
      {short ? "Available" : profile.availability.label}
    </span>
  );
}
