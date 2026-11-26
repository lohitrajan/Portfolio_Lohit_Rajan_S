import { AnimatePresence, motion } from "framer-motion";
import {
  Binary,
  Box,
  Braces,
  CircuitBoard,
  Database,
  Globe,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { ease } from "./motion";

const icons: Record<string, LucideIcon> = {
  languages: Braces,
  web: Globe,
  database: Database,
  tools: Wrench,
  hardware: CircuitBoard,
  software: Box,
  core: Binary,
};

export function Skills() {
  const c = usePortfolio();
  const { skillCategories } = c;
  const [activeId, setActiveId] = useState(skillCategories[0]?.id ?? "");
  const active = skillCategories.find((c) => c.id === activeId) ?? skillCategories[0];
  if (!active) return null;
  const Icon = icons[active.id] ?? Braces;

  return (
    <section id="skills" aria-labelledby="skills-title" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <SectionHeading
        index="04"
        eyebrow="Technical skills — My toolkit"
        title="The Tools Behind My Ideas."
        description="Grouped by what I've actually learned and used. No made-up percentages — just honest notes on how each one fits into my work."
        align="split"
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-12">
        <div
          role="tablist"
          aria-label="Skill categories"
          className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
        >
          {skillCategories.map((c) => {
            const isActive = c.id === active.id;
            return (
              <button
                key={c.id}
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${c.id}`}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-4 rounded-full border px-4 py-2.5 text-left text-sm transition-colors lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-5",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground lg:bg-transparent lg:text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono text-xs lg:w-6">{c.code}</span>
                <span className="lg:text-2xl lg:font-medium lg:tracking-tight">{c.label}</span>
                <span className="ml-auto hidden font-mono text-xs text-muted-foreground lg:inline">
                  {String(c.items.length).padStart(2, "0")}
                </span>
                {isActive ? (
                  <motion.span
                    layoutId="skill-indicator"
                    className="absolute -left-4 top-1/2 hidden h-8 w-1 -translate-y-1/2 rounded-full bg-accent lg:block"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              id={`panel-${active.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${active.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease }}
              className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-eyebrow text-muted-foreground">Category {active.code}</p>
                  <h3 className="text-display mt-2 text-4xl">{active.label}</h3>
                  <p className="mt-3 max-w-md text-muted-foreground">{active.description}</p>
                </div>
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Icon className="size-6" aria-hidden />
                </span>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {active.items.map((item, i) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * i, ease }}
                  >
                    <div
                      tabIndex={0}
                      className="group relative h-full overflow-hidden rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-soft focus-visible:border-foreground/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-secondary font-mono text-xs font-medium text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          {item.name
                            .split(/\s|&/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")}
                        </span>
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground transition-all duration-300 [@media(hover:hover)]:max-h-0 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:max-h-24 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:max-h-24 [@media(hover:hover)]:group-focus-visible:opacity-100">
                        {item.note}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
