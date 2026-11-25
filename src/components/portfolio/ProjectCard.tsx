import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Project } from "@/content";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { ease } from "./motion";
import { DynamicFields } from './DynamicFields';

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease }}
      className="group"
    >
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="block focus-visible:outline-none"
        aria-label={`View project: ${project.title}`}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.5rem] bg-muted ring-offset-4 ring-offset-background transition-shadow duration-500 group-hover:shadow-lift group-focus-visible:ring-2 group-focus-visible:ring-ring",
            large ? "aspect-[4/3]" : "aspect-[5/4]",
          )}
        >
          {project.cover.src ? (<img
            src={project.cover.src}
            alt={project.cover.alt}
            width={1536}
            height={1024}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
          />) : <div className="aspect-[4/5] size-full bg-muted" aria-hidden />}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <StatusBadge status={project.status} />
            {project.cover.isConceptVisual ? (
              <span className="text-eyebrow rounded-full bg-background/80 px-2.5 py-1 text-[0.6rem] text-muted-foreground backdrop-blur">
                Concept visual
              </span>
            ) : null}
          </div>
          <span className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-soft transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:opacity-100">
            <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
          </span>
        </div>

        <div className="mt-6 flex items-start gap-5">
          <span className="font-mono text-sm text-muted-foreground">{project.number}</span>
          <div className="min-w-0 flex-1">
            <p className="text-eyebrow text-muted-foreground">{project.category}</p>
            <h3 className="text-display mt-2 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1]">{project.title}</h3>
            <p className="mt-3 max-w-xl text-muted-foreground">{project.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-sm font-medium text-foreground">
              View Project <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
      <DynamicFields fields={project.extraFields} />
    </motion.article>
  );
}
