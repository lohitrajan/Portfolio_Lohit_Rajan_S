import { Award, ExternalLink, FileText } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";
import { DynamicFields } from './DynamicFields';
import { visibleAchievementCategories } from "@/content/achievements";

export function Achievements() {
  const content = usePortfolio();
  const achievementCategories = Array.isArray(content.achievementCategories) ? content.achievementCategories : [];
  const categories = visibleAchievementCategories(achievementCategories);

  return (
    <section id="achievements" aria-labelledby="achievements-title" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <SectionHeading
        index="08"
        eyebrow="Achievements & certifications"
        title="Milestones Along the Way."
        description="Certificates, competitions and accomplishments — added as they're earned."
        align="split"
      />

      {categories.length === 0 ? (
        <Reveal className="mt-14 grid gap-6 overflow-hidden rounded-[1.75rem] border border-border bg-card p-8 sm:p-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Award className="size-6" aria-hidden />
            </span>
            <p className="text-display mt-6 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.05]">
              The first milestones are on their way.
            </p>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Verified certificates, hackathons and achievements will appear here as soon as they're added — nothing is listed until it's real.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 md:col-span-4 md:justify-end" aria-label="Categories that will appear">
            {achievementCategories.map((cat) => (
              <li key={cat.id} className="tag">
                {cat.label}
              </li>
            ))}
          </ul>
        </Reveal>
      ) : (
        <div className="mt-14 space-y-14">
          {categories.map((c) => (
            <div key={c.id}>
              <h3 className="text-eyebrow text-muted-foreground">{c.label}</h3>
              <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {c.items.map((a) => (
                  <li key={a.title}>
                    <Reveal className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                      {a.certificateImage ? (
                        <img src={a.certificateImage} alt={`${a.title} certificate`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                      ) : null}
                      <div className="flex flex-1 flex-col p-6">
                        <p className="font-mono text-xs text-muted-foreground">{a.date}</p>
                        <p className="mt-2 text-lg font-medium text-foreground">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.issuer}</p>
                        {a.description ? <p className="mt-3 text-sm text-muted-foreground">{a.description}</p> : null}
                        <DynamicFields fields={a.extraFields} />
                        <div className="mt-auto flex flex-wrap gap-4 pt-5 text-sm">
                          {a.credentialUrl ? (
                            <a href={a.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-foreground hover:underline">
                              Credential <ExternalLink className="size-3.5" aria-hidden />
                            </a>
                          ) : null}
                          {a.certificatePdf ? (
                            <a href={a.certificatePdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-foreground hover:underline">
                              Certificate PDF <FileText className="size-3.5" aria-hidden />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
