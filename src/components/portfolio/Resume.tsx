import { Download, ExternalLink, FileText } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Button } from "@/components/ui/button";
import { Monogram } from "./Monogram";
import { Reveal, TextReveal } from "./motion";

export function Resume() {
  const c = usePortfolio();
  const { profile, resume } = c;
  const hasFile = Boolean(resume.fileUrl);

  return (
    <section id="resume" aria-labelledby="resume-title" className="px-3 py-12 sm:px-5 lg:py-16">
      <div className="grid gap-10 overflow-hidden rounded-[1.75rem] bg-primary p-5 text-primary-foreground sm:gap-12 sm:rounded-[2rem] sm:p-10 lg:grid-cols-12 lg:p-14">
        <div className="flex flex-col lg:col-span-6">
          <p className="text-eyebrow flex items-center gap-3 text-primary-foreground/60">
            <span className="text-primary-foreground">10</span>
            <span className="h-px w-8 bg-primary-foreground/20" />
            Resume
          </p>
          <h2 id="resume-title" className="text-display mt-5 text-[clamp(2.25rem,7vw,5.5rem)]">
            <TextReveal text="Everything in One Document." />
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/70 sm:mt-6 sm:text-base">
            Education, projects and skills — the full picture in a single, printable page.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
            {hasFile ? (
              <>
                <Button asChild variant="lime" size="xl" className="w-full sm:w-auto">
                  <a href={resume.fileUrl} download>
                    Download PDF <Download />
                  </a>
                </Button>
                <Button asChild variant="invert" size="xl" className="w-full sm:w-auto">
                  <a href={resume.fileUrl} target="_blank" rel="noreferrer">
                    Open in new tab <ExternalLink />
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button variant="lime" size="xl" disabled className="w-full sm:w-auto">
                  Download PDF <Download />
                </Button>
                <Button variant="invert" size="xl" disabled className="w-full sm:w-auto">
                  Open in new tab <ExternalLink />
                </Button>
              </>
            )}
          </div>
          {!hasFile ? (
            <p className="mt-4 text-sm text-primary-foreground/60">
              The resume is being finalised and will be available to download here soon.
            </p>
          ) : null}

          <dl className="mt-auto grid grid-cols-2 gap-6 border-t border-primary-foreground/15 pt-8 max-lg:mt-10">
            <div>
              <dt className="text-eyebrow text-primary-foreground/50">Last updated</dt>
              <dd className="mt-1 font-mono text-sm">{resume.lastUpdated || "—"}</dd>
            </div>
            <div>
              <dt className="text-eyebrow text-primary-foreground/50">Version</dt>
              <dd className="mt-1 font-mono text-sm">{resume.version || "—"}</dd>
            </div>
          </dl>
        </div>

        <Reveal className="lg:col-span-6">
          {hasFile ? (
            <div className="overflow-hidden rounded-2xl bg-background">
              <iframe
                src={`${resume.fileUrl}#view=FitH`}
                title={`${profile.name} resume preview`}
                className="aspect-[1/1.3] w-full"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="relative mx-auto flex w-full max-w-md flex-col aspect-[1/1.25] rotate-[-1.5deg] rounded-xl bg-background p-5 text-foreground shadow-lift transition-transform duration-700 hover:rotate-0 sm:aspect-[1/1.3] sm:p-8 sm:rotate-[-2deg]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-semibold tracking-tight sm:text-2xl">
                    {profile.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                    {profile.roles.join(" · ")}
                  </p>
                </div>
                <Monogram className="size-8 shrink-0 sm:size-9" />
              </div>

              <div className="mt-6 flex-1 space-y-5 sm:mt-8 sm:space-y-6" aria-hidden>
                {[0, 1, 2].map((block) => (
                  <div key={block} className="space-y-2">
                    <div className="h-2 w-16 rounded-full bg-foreground/80 sm:w-20" />
                    <div className="h-1.5 w-full rounded-full bg-muted" />
                    <div className="h-1.5 w-11/12 rounded-full bg-muted" />
                    <div className="h-1.5 w-4/5 rounded-full bg-muted" />
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-start gap-2.5 rounded-xl border border-dashed border-border p-3 text-xs leading-snug text-muted-foreground sm:items-center sm:gap-3 sm:p-4 sm:text-sm">
                <FileText className="mt-0.5 size-4 shrink-0 sm:mt-0 sm:size-5" aria-hidden />
                <span className="min-w-0">
                  Resume preview will appear here once published.
                </span>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
