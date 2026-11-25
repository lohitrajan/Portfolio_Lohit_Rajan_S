import { usePortfolio } from "@/hooks/use-portfolio";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";

export function About() {
  const c = usePortfolio();
  const { about, profile } = c;
  const highlights = about.highlights.filter((h) => h.value.trim().length > 0);

  return (
    <section id="about" aria-labelledby="about-title" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeading index="02" eyebrow="About — My story" title={about.heading} />
          <div className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-muted-foreground">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className={i === 0 ? "text-xl text-foreground" : undefined}>{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            <Reveal>
              <h3 className="text-eyebrow text-muted-foreground">Professional interests</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {about.interests.map((i) => (
                  <li key={i} className="tag text-foreground">
                    {i}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-eyebrow text-muted-foreground">Learning philosophy</h3>
              <ol className="mt-4 space-y-3">
                {about.philosophy.map((p, i) => (
                  <li key={p} className="flex gap-3 text-foreground">
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Reveal className="relative lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-muted">
              {c.aboutImage.src ? (<img
                src={c.aboutImage.src}
                alt={c.aboutImage.alt}
                width={1024}
                height={1280}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />) : <div className="aspect-[4/5] size-full bg-muted" aria-hidden />}
              <span className="pill absolute left-4 top-4 border-transparent bg-background/90 backdrop-blur">
                {profile.roles[1]}
              </span>
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-background/92 p-5 shadow-soft backdrop-blur">
                <p className="text-eyebrow flex items-center gap-2 text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-accent" aria-hidden /> Current focus
                </p>
                <p className="mt-2 text-lg font-medium leading-snug text-foreground">{about.currentFocus}</p>
              </div>
            </div>

            {highlights.length ? (
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {highlights.map((h) => (
                  <div key={h.label} className="bg-background p-4">
                    <dt className="text-eyebrow text-[0.6rem] text-muted-foreground">{h.label}</dt>
                    <dd className="mt-1.5 text-sm text-foreground">{h.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
