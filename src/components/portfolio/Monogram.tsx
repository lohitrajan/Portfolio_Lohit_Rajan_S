import { cn } from "@/lib/utils";

/** LS monogram — an L whose foot flows into an S, with a lime full stop. */
export function Monogram({
  className,
  animated = false,
  title = "LS monogram",
}: {
  className?: string;
  animated?: boolean;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("shrink-0", animated && "monogram-draw", className)}
    >
      <path
        d="M9 7.5V31.5H18.5"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 11.5C31.6 9.2 29.4 8 26.8 8C23.4 8 21.2 10 21.2 12.9C21.2 19.6 33.2 16.9 33.2 25C33.2 28.9 30.5 31.6 26.6 31.6C24 31.6 21.9 30.5 20.6 28.4"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="36.2" cy="31.6" r="2.4" className="fill-accent" />
    </svg>
  );
}
