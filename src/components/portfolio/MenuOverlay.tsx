import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { cn } from "@/lib/utils";
import { Availability } from "./Availability";
import { Monogram } from "./Monogram";
import { SectionLink } from "./SectionLink";
import { SocialIcon } from "./SocialIcon";
import { ease } from "./motion";

export function MenuOverlay({
  open,
  onClose,
  active,
}: {
  open: boolean;
  onClose: () => void;
  active: string;
}) {
  const c = usePortfolio();
  const { navSections, profile } = c;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[80] p-2 sm:p-3 md:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.25 } }}
        >
          <motion.div
            className="flex h-full flex-col overflow-y-auto rounded-[2rem] bg-primary text-primary-foreground"
            initial={{ clipPath: "inset(0 0 100% 0 round 2rem)" }}
            animate={{ clipPath: "inset(0 0 0% 0 round 2rem)" }}
            exit={{ clipPath: "inset(0 0 100% 0 round 2rem)" }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex h-20 items-center justify-between px-6 sm:px-10">
              <span className="flex items-center gap-3">
                <Monogram className="size-8" />
                <span className="text-eyebrow">{profile.name}</span>
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-11 items-center gap-2 rounded-full border border-primary-foreground/20 px-5 text-sm transition-colors hover:bg-primary-foreground/10"
              >
                Close <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="grid flex-1 gap-12 px-6 pb-10 pt-6 sm:px-10 lg:grid-cols-12">
              <ul className="lg:col-span-8">
                {navSections.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.25 + i * 0.05, ease }}
                    className="border-b border-primary-foreground/10"
                  >
                    <SectionLink
                      id={s.id}
                      onNavigate={onClose}
                      className="group flex items-baseline gap-6 py-3 sm:py-4"
                    >
                      <span className="text-eyebrow w-8 text-primary-foreground/50">0{i + 1}</span>
                      <span
                        className={cn(
                          "text-display text-[clamp(2.25rem,6vw,4.75rem)] transition-all duration-500 group-hover:translate-x-3",
                          active === s.id ? "text-accent" : "group-hover:text-accent",
                        )}
                      >
                        {s.label}
                      </span>
                    </SectionLink>
                  </motion.li>
                ))}
              </ul>

              <motion.aside
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col justify-end gap-8 lg:col-span-4"
              >
                <div>
                  <p className="text-eyebrow text-primary-foreground/50">Currently</p>
                  <Availability className="mt-3 text-primary-foreground/80" />
                </div>
                <div>
                  <p className="text-eyebrow text-primary-foreground/50">Elsewhere</p>
                  <ul className="mt-3 space-y-2">
                    {profile.socials.map((s) =>
                      s.url ? (
                        <li key={s.platform}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-3 text-lg hover:text-accent"
                          >
                            <SocialIcon platform={s.platform} className="size-5" />
                            {s.label}
                            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                          </a>
                        </li>
                      ) : (
                        <li key={s.platform} className="inline-flex items-center gap-3 text-lg text-primary-foreground/40">
                          <SocialIcon platform={s.platform} className="size-5" />
                          {s.label} <span className="text-sm">— link coming soon</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <p className="font-serif text-2xl italic text-primary-foreground/70">{profile.tagline}</p>
                <Link to="/admin/login" onClick={onClose} className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 px-4 py-2 text-sm text-primary-foreground/80 transition-colors hover:text-accent">
                  Admin login <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </motion.aside>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
