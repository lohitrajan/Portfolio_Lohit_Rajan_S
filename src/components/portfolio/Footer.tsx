import { ArrowUp, ArrowUpRight } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Monogram } from "./Monogram";
import { SectionLink } from "./SectionLink";
import { SocialIcon } from "./SocialIcon";
import { Magnetic } from "./motion";

export function Footer() {
  const c = usePortfolio();
  const { navSections, profile } = c;
  const year = new Date().getFullYear();
  const links = [
    ...profile.socials,
    ...(profile.email ? [{ platform: "email" as const, label: "Email", url: `mailto:${profile.email}` }] : []),
  ];

  return (
    <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card px-6 pb-8 pt-14 sm:px-10 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <Monogram className="size-12" />
              <p className="text-eyebrow text-foreground">{profile.name}</p>
            </div>
            <p className="mt-6 max-w-sm text-muted-foreground">{profile.footerStatement}</p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="text-eyebrow text-muted-foreground">Navigate</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {navSections.map((s) => (
                <li key={s.id}>
                  <SectionLink id={s.id} className="text-foreground hover:underline">
                    {s.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-eyebrow text-muted-foreground">Connect</p>
            <ul className="mt-4 space-y-2">
              {links.map((s) =>
                s.url ? (
                  <li key={s.platform}>
                    <a href={s.url} target={s.platform === "email" ? undefined : "_blank"} rel="noreferrer" className="group inline-flex items-center gap-2 text-foreground">
                      <SocialIcon platform={s.platform} className="size-4" />
                      <span className="group-hover:underline">{s.label}</span>
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </li>
                ) : (
                  <li key={s.platform} className="flex items-center gap-2 text-muted-foreground">
                    <SocialIcon platform={s.platform} className="size-4" /> {s.label} <span className="text-xs">(soon)</span>
                  </li>
                ),
              )}
              <li>
                <SectionLink id="contact" className="group inline-flex items-center gap-2 text-foreground">
                  <span className="group-hover:underline">Contact form</span>
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </SectionLink>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1 lg:justify-self-end">
            <Magnetic>
              <SectionLink
                id="home"
                aria-label="Back to top"
                className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:-translate-y-1"
              >
                <ArrowUp className="size-5" aria-hidden />
              </SectionLink>
            </Magnetic>
          </div>
        </div>

        <p className="text-display mt-20 text-[clamp(2.25rem,8vw,8rem)] leading-[0.95]">
          <span className="text-ink-soft">{profile.signature.muted}</span>
          <br />
          {profile.signature.strong}
        </p>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {year} {profile.name}. All rights reserved.</p>
          <p className="font-serif text-base italic">{profile.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
