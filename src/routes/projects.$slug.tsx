import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Globe } from "lucide-react";
import { getPortfolioContent } from "@/lib/portfolio.functions";
import type { PortfolioContent } from "@/content/types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/portfolio/StatusBadge";
import { Reveal, TextReveal } from "@/components/portfolio/motion";
import { DynamicFields } from '@/components/portfolio/DynamicFields';
import { usePortfolio } from "@/hooks/use-portfolio";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params, parentMatchPromise }) => {
    // Reuse the content the root route already loaded; fetch it only if it isn't there.
    const root = await parentMatchPromise;
    const content = (root.loaderData as PortfolioContent | undefined) ?? (await getPortfolioContent());
    const project = content.projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project, projects: content.projects, profileName: content.profile.name };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    if (!project) {
      return { meta: [{ title: "Project not found — Lohit Rajan S" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${project.title} — Case study by ${loaderData?.profileName ?? ""}`;
    return {
      meta: [
        { title },
        { name: "description", content: project.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: project.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(/^https:\/\//.test(project.cover.src) ? [
          { property: "og:image", content: project.cover.src },
          { name: "twitter:image", content: project.cover.src },
        ] : []),
      ],
    };
  },
  errorComponent: ProjectError,
  notFoundComponent: ProjectNotFound,
  component: ProjectPage,
});

function ProjectError() {
  const router = useRouter();
  return (
    <div className="px-5 py-40 text-center sm:px-8">
      <h1 className="text-display text-5xl">Unable to load project.</h1>
      <Button variant="ink" className="mt-8" onClick={() => void router.invalidate()}>
        Try again
      </Button>
    </div>
  );
}

function ProjectNotFound() {
  return (
    <div className="px-5 py-40 text-center sm:px-8">
      <p className="text-eyebrow text-muted-foreground">404</p>
      <h1 className="text-display mt-4 text-5xl">Project not found.</h1>
      <Button asChild variant="ink" size="xl" className="mt-8">
        <Link to="/" hash="projects">
          <ArrowLeft /> Back to Selected Works
        </Link>
      </Button>
    </div>
  );
}

const pending = "Details for this part of the case study are being documented.";

function CaseSection({
  n,
  title,
  children,
  empty,
}: {
  n: number;
  title: string;
  children?: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <Reveal className="grid gap-4 border-t border-border py-10 md:grid-cols-12">
      <h2 className="flex gap-4 md:col-span-4">
        <span className="font-mono text-sm text-muted-foreground">{String(n).padStart(2, "0")}</span>
        <span className="text-xl font-medium tracking-tight">{title}</span>
      </h2>
      <div className="text-lg leading-relaxed text-muted-foreground md:col-span-8">
        {empty ? <p className="text-base italic text-muted-foreground/80">{pending}</p> : children}
      </div>
    </Reveal>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-3 text-foreground">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
          {f}
        </li>
      ))}
    </ul>
  );
}

function ProjectPage() {
  const loaded = Route.useLoaderData();
  const live = usePortfolio(); // includes draft fields while an admin previews
  const project = live.projects.find((p) => p.slug === loaded.project.slug) ?? loaded.project;
  const projects = loaded.projects;
  let sectionNumber = 0;
  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length] ?? project;
  const next = projects[(index + 1) % projects.length] ?? project;

  return (
    <article className="px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-16">
      <Link
        to="/"
        hash="projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All projects
      </Link>

      <header className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="pill">Project {project.number}</span>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-eyebrow mt-8 text-muted-foreground">{project.category}</p>
          <h1 className="text-display mt-4 text-[clamp(2.75rem,8vw,8rem)]">
            <TextReveal text={project.title} />
          </h1>
        </div>
        <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-4">{project.summary}</p>
      </header>

      <Reveal className="relative mt-14 overflow-hidden rounded-[1.75rem] bg-muted">
        {project.cover.src ? (<img
          src={project.cover.src}
          alt={project.cover.alt}
          width={1536}
          height={1024}
          className="aspect-[16/9] w-full object-cover"
        />) : <div className="aspect-[16/9] w-full rounded-2xl bg-muted" aria-hidden />}
        {project.cover.isConceptVisual ? (
          <span className="text-eyebrow absolute bottom-4 left-4 rounded-full bg-background/85 px-3 py-1.5 text-[0.6rem] text-muted-foreground backdrop-blur">
            Concept visual — not a final screenshot
          </span>
        ) : null}
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="space-y-8 lg:sticky lg:top-28">
            <div>
              <p className="text-eyebrow text-muted-foreground">Status</p>
              <StatusBadge status={project.status} className="mt-2" />
            </div>
            <div>
              <p className="text-eyebrow text-muted-foreground">Tags</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <DynamicFields fields={project.extraFields} location="detail" />
            <div className="flex flex-col gap-2">
              {!project.hiddenSections?.includes("github") && (project.githubUrl ? (
                <Button asChild variant="ink" size="pill">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <Github /> GitHub repository <ArrowUpRight />
                  </a>
                </Button>
              ) : (
                <Button variant="line" size="pill" disabled>
                  <Github /> Repository not public yet
                </Button>
              ))}
              {!project.hiddenSections?.includes("live") && (project.liveUrl ? (
                <Button asChild variant="lime" size="pill">
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    <Globe /> Live demonstration <ArrowUpRight />
                  </a>
                </Button>
              ) : (
                <Button variant="line" size="pill" disabled>
                  <Globe /> No live demo yet
                </Button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9">
          {!project.hiddenSections?.includes("overview") && (<CaseSection empty={!project.overview} n={++sectionNumber} title={project.sectionTitles?.overview || "Project overview"}>
            <p className="text-foreground">{project.overview}</p>
          </CaseSection>)}
          {!project.hiddenSections?.includes("problem") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.problem || "Problem statement"} empty={!project.problem}>
            <p>{project.problem}</p>
          </CaseSection>)}
          {!project.hiddenSections?.includes("objective") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.objective || "Objective"} empty={!project.objective}>
            <p>{project.objective}</p>
          </CaseSection>)}
          {!project.hiddenSections?.includes("solution") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.solution || "Proposed solution"} empty={!project.solution}>
            <p>{project.solution}</p>
          </CaseSection>)}
          {!project.hiddenSections?.includes("features") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.features || "Key features"} empty={!project.features.length}>
            <List items={project.features} />
          </CaseSection>)}
          {!project.hiddenSections?.includes("stack") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.stack || "Technology stack"} empty={!project.stack.length}>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground">
                  {s}
                </li>
              ))}
            </ul>
          </CaseSection>)}
          {!project.hiddenSections?.includes("architecture") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.architecture || "Architecture"} empty={!project.architecture.length}>
            <ol className="space-y-3">
              {project.architecture.map((a, i) => (
                <li key={a} className="flex gap-4 rounded-2xl border border-border bg-card p-4 text-foreground">
                  <span className="font-mono text-xs text-muted-foreground">L{i + 1}</span>
                  {a}
                </li>
              ))}
            </ol>
          </CaseSection>)}
          {!project.hiddenSections?.includes("contribution") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.contribution || "My contribution"} empty={!project.contribution}>
            <p className="text-foreground">{project.contribution}</p>
          </CaseSection>)}
          {!project.hiddenSections?.includes("challenges") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.challenges || "Challenges"} empty={!project.challenges.length}>
            <List items={project.challenges} />
          </CaseSection>)}
          {!project.hiddenSections?.includes("future") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.future || "Future improvements"} empty={!project.futureImprovements.length}>
            <List items={project.futureImprovements} />
          </CaseSection>)}
          {!project.hiddenSections?.includes("screenshots") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.screenshots || "Screenshots"} empty={!project.screenshots.length}>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.screenshots.map((s) => (
                <img key={s.src} src={s.src} alt={s.alt} loading="lazy" className="w-full rounded-2xl border border-border" />
              ))}
            </div>
          </CaseSection>)}
          {!project.hiddenSections?.includes("github") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.github || "GitHub repository"}>
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-4">
                {project.githubUrl}
              </a>
            ) : (
              <p className="text-base italic text-muted-foreground/80">The repository hasn't been made public yet.</p>
            )}
          </CaseSection>)}
          {!project.hiddenSections?.includes("live") && (<CaseSection n={++sectionNumber} title={project.sectionTitles?.live || "Live demonstration"}>
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-4">
                {project.liveUrl}
              </a>
            ) : (
              <p className="text-base italic text-muted-foreground/80">A live demo isn't available yet.</p>
            )}
          </CaseSection>)}
          {project.extraSections?.map((section, i) => <CaseSection key={i} n={++sectionNumber} title={section.title} empty={!section.body && !section.items.length}>
            {section.body && <p>{section.body}</p>}
            {!!section.items.length && <List items={section.items} />}
          </CaseSection>)}
        </div>
      </div>

      <nav aria-label="More projects" className="mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
        <Link
          to="/projects/$slug"
          params={{ slug: prev.slug }}
          className="group rounded-[1.5rem] border border-border p-6 transition-colors hover:bg-card"
        >
          <span className="text-eyebrow flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden /> Previous
          </span>
          <span className="mt-3 block text-2xl font-medium tracking-tight">{prev.title}</span>
        </Link>
        <Link
          to="/projects/$slug"
          params={{ slug: next.slug }}
          className="group rounded-[1.5rem] border border-border p-6 text-right transition-colors hover:bg-card"
        >
          <span className="text-eyebrow flex items-center justify-end gap-2 text-muted-foreground">
            Next <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
          <span className="mt-3 block text-2xl font-medium tracking-tight">{next.title}</span>
        </Link>
      </nav>
    </article>
  );
}
