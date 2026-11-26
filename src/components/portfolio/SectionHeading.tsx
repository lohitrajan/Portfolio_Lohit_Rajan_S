import { cn } from "@/lib/utils";
import { Reveal, TextReveal } from "./motion";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "split";
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        align === "split" && "lg:grid-cols-12 lg:items-end",
        className,
      )}
    >
      <div className={cn(align === "split" && "lg:col-span-8")}>
        <Reveal>
          <p className="text-eyebrow flex items-center gap-3 text-muted-foreground">
            <span className="text-foreground">{index}</span>
            <span className="h-px w-8 bg-border" />
            {eyebrow}
          </p>
        </Reveal>
        <h2 className="text-display mt-5 text-[clamp(2.5rem,6vw,5.5rem)]">
          <TextReveal text={title} />
        </h2>
      </div>
      {description ? (
        <Reveal
          delay={0.15}
          className={cn("max-w-md text-base leading-relaxed text-muted-foreground", align === "split" && "lg:col-span-4 lg:justify-self-end")}
        >
          <p>{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
