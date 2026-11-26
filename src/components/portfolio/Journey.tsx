import { ArrowUpRight, Briefcase, GraduationCap } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";
import { DynamicFields } from './DynamicFields';

function CodingJourney() {
  const c = usePortfolio();
  const { codingProfiles, codingTopics } = c;
  return (
    <div>
      <SectionHeading
        index="05"
        eyebrow="Coding journey — Problem solving"
        title="One Problem at a Time."
        description="The problem-solving topics I've been practising, from fundamentals to advanced patterns."
        align="split"
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border md:grid-cols-3">
        {codingTopics.map((group, gi) => (
          <Reveal key={group.label} delay={gi * 0.08} className="bg-background p-7">
            <p className="text-eyebrow text-muted-foreground">
              {String(gi + 1).padStart(2, "0")} — {group.label}
            </p>
            <ul className="mt-6 space-y-3">
              {group.topics.map((t) => (
                <li key={t} className="group flex items-center gap-3 text-foreground">
                  <span className="h-px w-4 bg-border transition-all duration-300 group-hover:w-8 group-hover:bg-accent" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h3 className="text-2xl font-medium tracking-tight">Coding profiles</h3>
          <p className="text-sm text-muted-foreground">Statistics are shown only once they're verified.</p>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {codingProfiles.map((p, i) => {
            const body = (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  {p.url ? (
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  ) : null}
                </div>
                <p className="mt-8 text-lg font-medium text-foreground">{p.platform}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.username ? `@${p.username}` : "Profile link coming soon"}
                </p>
                {p.stats.length ? (
                  <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
                    {p.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="text-xs text-muted-foreground">{s.label}</dt>
                        <dd className="font-mono text-sm text-foreground">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </>
            );
            return (
              <li key={p.platform}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block h-full rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-foreground/30 hover:shadow-soft"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="h-full rounded-2xl border border-dashed border-border p-5 opacity-80">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-eyebrow text-[0.6rem] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}

function Academic() {
  const c = usePortfolio();
  const { education } = c;
  return (
    <div>
      <SectionHeading index="06" eyebrow="Education" title="My Academic Journey." />
      <ol className="relative mt-14 border-l border-border pl-8 sm:pl-12">
        {education.map((e) => (
          <li key={e.institution} className="relative pb-4">
            <Reveal>
              <span className="absolute -left-[calc(2rem+0.5px)] top-1 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background sm:-left-[calc(3rem+0.5px)]">
                <GraduationCap className="size-4" aria-hidden />
              </span>
              <div className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  {e.startYear || e.graduationYear ? (
                    <span className="pill">
                      {[e.startYear, e.graduationYear].filter(Boolean).join(" — ")}
                    </span>
                  ) : null}
                  <span className="pill">
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden /> Currently studying
                  </span>
                </div>
                <h3 className="text-display mt-5 text-[clamp(1.75rem,4vw,3rem)]">{e.institution}</h3>
                <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Degree" value={e.degree} />
                  <Field label="Department" value={e.department} />
                  <Field label="Academic year" value={e.academicYear} />
                  <Field label="CGPA" value={e.cgpa} />
                </dl>
                <DynamicFields fields={e.extraFields} />
                {e.coursework.length ? (
                  <div className="mt-8">
                    <p className="text-eyebrow text-muted-foreground">Relevant learning areas</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {e.coursework.map((c) => (
                        <li key={c} className="tag text-foreground">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {e.achievements.length ? (
                  <div className="mt-6">
                    <p className="text-eyebrow text-muted-foreground">Academic achievements</p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-foreground">
                      {e.achievements.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {e.certifications.length ? (
                  <div className="mt-6">
                    <p className="text-eyebrow text-muted-foreground">Certifications</p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-foreground">
                      {e.certifications.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Experience() {
  const c = usePortfolio();
  const { experience, experienceFallback } = c;
  return (
    <div>
      <SectionHeading index="07" eyebrow="Experience & development" title="Growing Through Experience." />
      {experience.length === 0 ? (
        <Reveal className="mt-12 flex flex-col gap-6 rounded-[1.75rem] border border-dashed border-border p-8 sm:flex-row sm:items-center sm:p-10">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary">
            <Briefcase className="size-5" aria-hidden />
          </span>
          <p className="max-w-2xl text-xl leading-snug text-foreground">{experienceFallback}</p>
        </Reveal>
      ) : (
        <ol className="mt-12 space-y-4">
          {experience.map((x) => (
            <li key={`${x.organization}-${x.position}`}>
              <Reveal className="grid gap-4 rounded-[1.75rem] border border-border bg-card p-6 sm:p-8 md:grid-cols-12">
                <div className="md:col-span-4">
                  <p className="text-eyebrow text-muted-foreground">{x.type}</p>
                  <p className="mt-2 font-mono text-sm text-muted-foreground">{x.duration}</p>
                </div>
                <div className="md:col-span-8">
                  <h3 className="text-2xl font-medium tracking-tight">{x.position}</h3>
                  <p className="text-muted-foreground">{x.organization}</p>
                  {x.description ? <p className="mt-4 text-foreground">{x.description}</p> : null}
                  {x.responsibilities.length ? (
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-muted-foreground">
                      {x.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  ) : null}
                  {x.achievements.length ? (
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-foreground">
                      {x.achievements.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  ) : null}
                  <DynamicFields fields={x.extraFields} />
                  {x.technologies.length ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {x.technologies.map((t) => (
                        <li key={t} className="tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function Journey() {
  return (
    <section
      id="journey"
      aria-label="Journey"
      className="space-y-28 px-5 py-24 sm:px-8 lg:space-y-36 lg:px-12 lg:py-32"
    >
      <CodingJourney />
      <Academic />
      <Experience />
    </section>
  );
}
