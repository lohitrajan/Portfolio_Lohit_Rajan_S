import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import { Availability } from "./Availability";
import { MenuOverlay } from "./MenuOverlay";
import { Monogram } from "./Monogram";
import { SectionLink } from "./SectionLink";
import { ThemeToggle } from "./ThemeToggle";
import { LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Nav() {
  const c = usePortfolio();
  const { navSections, profile, aboutImage } = c;
  const ids = navSections.map((s) => s.id);
  const pathname = useLocation({ select: (l) => l.pathname });
  const isHome = pathname === "/";
  const active = useActiveSection(ids, isHome);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current = isHome ? active : pathname.startsWith("/projects") ? "projects" : "";

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-16 items-center justify-between gap-4 rounded-full px-3 pl-4 transition-all duration-500 sm:px-4 sm:pl-5",
            scrolled
              ? "border border-border bg-background/80 shadow-soft backdrop-blur-xl"
              : "border border-transparent bg-transparent",
          )}
        >
          <Link to="/" className="group flex items-center gap-3" aria-label={`${profile.name} — home`}>
            {aboutImage?.src ? (
              <Avatar className="size-9 border border-border shadow-sm transition-transform duration-500 group-hover:-rotate-3">
                <AvatarImage src={aboutImage.src} alt={profile.name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Monogram className="size-8 text-foreground transition-transform duration-500 group-hover:-rotate-6" />
            )}
            <span className="text-eyebrow hidden font-medium text-foreground sm:inline">{profile.name}</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navSections.map((s) => {
              const isActive = current === s.id;
              return (
                <li key={s.id} className="relative">
                  <SectionLink
                    id={s.id}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-3.5 py-2 text-sm transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s.label}
                  </SectionLink>
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Availability short className="mr-2 hidden xl:inline-flex" />
            <Link
              to="/admin/login"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Admin login"
              title="Admin login"
            >
              <LogIn className="size-4" aria-hidden />
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex h-11 items-center gap-3 rounded-full bg-primary pl-5 pr-4 text-sm text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Menu
              <span className="flex flex-col gap-1" aria-hidden>
                <span className="block h-px w-4 bg-current transition-transform group-hover:translate-x-0.5" />
                <span className="block h-px w-4 bg-current transition-transform group-hover:-translate-x-0.5" />
              </span>
            </button>
          </div>
        </nav>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} active={current} />
    </>
  );
}
