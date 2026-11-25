import { ArrowUpRight } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";

export function Exploring() {
  const c = usePortfolio();
  const { exploring } = c;
  const marquee = [...exploring.topics, ...exploring.topics];

  return (
    <section id="exploring" aria-labelledby="exploring-title" className="py-24 lg:py-32">
      <div className="px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading index="09" eyebrow="Currently exploring" title={exploring.heading} />
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-[1.75rem] bg-primary p-7 text-primary-foreground">
              <p className="text-eyebrow flex items-center gap-2 text-primary-foreground/60">
                <span className="relative flex size-2 rounded-full bg-accent animate-pulse-dot" aria-hidden />
                Current focus
              </p>
              <p className="text-display mt-4 text-3xl leading-[1.05]">{exploring.currentFocus.topic}</p>
              <p className="mt-3 text-primary-foreground/70">{exploring.currentFocus.note}</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden border-y border-border py-6" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {marquee.map((t, i) => (
            <span key={i} className="text-display flex items-center gap-10 text-[clamp(2rem,5vw,4rem)] text-ink-soft">
              {t.title}
              <span className="size-3 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>

      <ol className="mt-4 px-5 sm:px-8 lg:px-12">
        {exploring.topics.map((t, i) => (
          <li key={t.title} className="group border-b border-border">
            <div className="flex items-center gap-6 py-5 transition-all duration-500 group-hover:pl-4">
              <span className="w-8 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-xl font-medium tracking-tight text-foreground sm:text-2xl">{t.title}</span>
              <span className="hidden text-sm text-muted-foreground transition-opacity duration-500 sm:block sm:opacity-0 sm:group-hover:opacity-100">
                {t.note}
              </span>
              <ArrowUpRight className="size-5 text-muted-foreground transition-all duration-500 group-hover:rotate-45 group-hover:text-foreground" aria-hidden />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
