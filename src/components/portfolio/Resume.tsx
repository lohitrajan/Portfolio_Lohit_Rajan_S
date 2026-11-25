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
      <div className="grid gap-12 overflow-hidden rounded-[2rem] bg-primary p-7 text-primary-foreground sm:p-10 lg:grid-cols-12 lg:p-14">
        <div className="flex flex-col lg:col-span-6">
          <p className="text-eyebrow flex items-center gap-3 text-primary-foreground/60">
            <span className="text-primary-foreground">10</span>
            <span className="h-px w-8 bg-primary-foreground/20" />
            Resume
          </p>
          <h2 id="resume-title" className="text-display mt-5 text-[clamp(2.5rem,6vw,5.5rem)]">
            <TextReveal text="Everything in One Document." />
          </h2>
          <p className="mt-6 max-w-md text-primary-foreground/70">
            Education, projects and skills — the full picture in a single, printable page.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {hasFile ? (
              <>
                <Button asChild variant="lime" size="xl">
                  <a href={resume.fileUrl} download>
                    Download PDF <Download />
                  </a>
                </Button>
                <Button asChild variant="invert" size="xl">
                  <a href={resume.fileUrl} target="_blank" rel="noreferrer">
                    Open in new tab <ExternalLink />
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button variant="lime" size="xl" disabled>
                  Download PDF <Download />
                </Button>
                <Button variant="invert" size="xl" disabled>
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

          <dl className="mt-auto grid grid-cols-2 gap-6 border-t border-primary-foreground/15 pt-8 max-lg:mt-12">
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
            <div className="relative mx-auto aspect-[1/1.3] max-w-md rotate-[-2deg] rounded-xl bg-background p-8 text-foreground shadow-lift transition-transform duration-700 hover:rotate-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-semibold tracking-tight">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.roles.join(" · ")}</p>
                </div>
                <Monogram className="size-9" />
              </div>
              <div className="mt-8 space-y-6" aria-hidden>
                {[0, 1, 2].map((block) => (
                  <div key={block} className="space-y-2">
                    <div className="h-2 w-20 rounded-full bg-foreground/80" />
                    <div className="h-1.5 w-full rounded-full bg-muted" />
                    <div className="h-1.5 w-11/12 rounded-full bg-muted" />
                    <div className="h-1.5 w-4/5 rounded-full bg-muted" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-8 bottom-8 flex items-center gap-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                <FileText className="size-5 shrink-0" aria-hidden />
                Resume preview will appear here once published.
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
