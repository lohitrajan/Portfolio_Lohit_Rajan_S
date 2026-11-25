import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Button } from "@/components/ui/button";
import { Availability } from "./Availability";
import { HeroCollage } from "./HeroCollage";
import { Magnetic, TextReveal, ease } from "./motion";
import { SectionLink } from "./SectionLink";
import { SocialIcon } from "./SocialIcon";

export function Hero() {
  const c = usePortfolio();
  const { profile, resume } = c;
  const github = profile.socials.find((s) => s.platform === "github");
  const linkedin = profile.socials.find((s) => s.platform === "linkedin");

  return (
    <section id="home" aria-labelledby="hero-title" className="relative px-5 pb-16 pt-10 sm:px-8 md:pt-16 lg:px-12">
      <motion.div
        initial={{ opacity: 1, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.8, ease }}
        className="flex flex-wrap items-center gap-2"
      >
        {profile.heroPills.map((p) => (
          <span key={p} className="pill">
            [ {p} ]
          </span>
        ))}
        <Availability className="ml-1 sm:ml-3" />
      </motion.div>

      <h1 id="hero-title" className="text-display mt-8 text-[clamp(3.1rem,10vw,10.5rem)]">
        <TextReveal text={profile.heroHeadline.muted} className="text-ink-soft" delay={1.85} />
        <TextReveal text={profile.heroHeadline.strong} className="text-foreground" delay={2.05} />
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <motion.p
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.3, ease }}
          className="max-w-xl text-lg leading-relaxed text-muted-foreground lg:col-span-6"
        >
          {profile.heroDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4, ease }}
          className="flex flex-col gap-5 lg:col-span-6 lg:items-end"
        >
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild variant="ink" size="xl">
                <SectionLink id="projects">
                  Explore My Work <ArrowDown />
                </SectionLink>
              </Button>
            </Magnetic>
            <Magnetic>
              {resume.fileUrl ? (
                <Button asChild variant="lime" size="xl">
                  <a href={resume.fileUrl} download>
                    Download Resume <Download />
                  </a>
                </Button>
              ) : (
                <Button asChild variant="lime" size="xl">
                  <SectionLink id="resume">
                    Download Resume <Download />
                  </SectionLink>
                </Button>
              )}
            </Magnetic>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {[github, linkedin].map((s) =>
              s ? (
                s.url ? (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-foreground"
                  >
                    <SocialIcon platform={s.platform} className="size-4" />
                    <span className="border-b border-transparent group-hover:border-foreground">{s.label}</span>
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                ) : (
                  <span key={s.platform} className="inline-flex items-center gap-2 text-muted-foreground" title="Link coming soon">
                    <SocialIcon platform={s.platform} className="size-4" />
                    {s.label}
                    <span className="text-xs">(soon)</span>
                  </span>
                )
              ) : null,
            )}
            <SectionLink id="contact" className="group inline-flex items-center gap-2 text-foreground">
              <span className="border-b border-transparent group-hover:border-foreground">Contact Me</span>
              <ArrowUpRight className="size-3.5" aria-hidden />
            </SectionLink>
          </div>
        </motion.div>
      </div>

      <HeroCollage />
    </section>
  );
}
