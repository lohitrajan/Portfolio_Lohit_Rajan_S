import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { usePortfolio } from "@/hooks/use-portfolio";
import type { ProjectStatus } from "@/content";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

type Filter = "All" | ProjectStatus;

export function filterProjects<T extends { status: ProjectStatus }>(list: T[], filter: Filter) {
  return filter === "All" ? list : list.filter((p) => p.status === filter);
}

export function Projects() {
  const c = usePortfolio();
  const { projects } = c;
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(() => filterProjects(projects, filter), [projects, filter]);
  const filters: Filter[] = ["All", ...Array.from(new Set(projects.map((p) => p.status)))];

  return (
    <section id="projects" aria-labelledby="projects-title" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <SectionHeading
        index="03"
        eyebrow="Featured projects"
        title="Selected Works."
        description="Ideas, experiments and solutions brought to life through technology."
        align="split"
      />

      <div role="group" aria-label="Filter projects by status" className="mt-12 flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = filterProjects(projects, f).length;
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={cn(
                "relative rounded-full border px-4 py-2 text-sm transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {f}
              <span className={cn("ml-2 font-mono text-xs", active ? "text-primary-foreground/60" : "text-muted-foreground/70")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-14 grid gap-x-8 gap-y-20 md:grid-cols-12">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => {
            const row = Math.floor(i / 2);
            const first = i % 2 === 0;
            const wide = (row % 2 === 0) === first;
            return (
              <div
                key={p.slug}
                className={cn(
                  wide ? "md:col-span-7" : "md:col-span-5",
                  !first && "md:mt-28",
                )}
              >
                <ProjectCard project={p} large={wide} />
              </div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No projects with the status “{filter}” yet.
        </p>
      ) : null}
    </section>
  );
}
