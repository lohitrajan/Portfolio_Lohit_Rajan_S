import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Award, BadgeCheck, BookOpen, BriefcaseBusiness, Code2, FileText, FolderKanban, Gauge, GraduationCap, Inbox, LogOut, PlusSquare, Settings, UserRound, PanelsTopLeft } from "lucide-react";
import { Monogram } from "@/components/portfolio/Monogram";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/admin/profile", label: "Profile", icon: UserRound },
  { to: "/admin/about", label: "About", icon: BookOpen },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
  { to: "/admin/skills", label: "Skills", icon: Code2 },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
  { to: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { to: "/admin/coding-profiles", label: "Coding profiles", icon: BadgeCheck },
  { to: "/admin/achievements", label: "Achievements", icon: Award },
  { to: "/admin/certifications", label: "Certifications", icon: BadgeCheck },
  { to: "/admin/resume", label: "Resume", icon: FileText },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox },
  { to: "/admin/sections", label: "Your sections", icon: PanelsTopLeft },
  { to: "/admin/fields", label: "Custom fields", icon: PlusSquare },
] as const;

export function AdminShell({ email, onSignOut, children }: { email: string; onSignOut: () => void; children: ReactNode }) {
  const initials = email
    .split("@")[0]
    ?.split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "AD";

  return (
    <div className="min-h-screen bg-secondary text-foreground lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-border bg-background lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 font-medium">
            <Monogram className="size-8" />
            <span>Portfolio admin</span>
          </Link>
          <ThemeToggle />
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto p-3 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/admin/dashboard" }}
              activeProps={{ "aria-current": "page" }}
              className={cn(
                "group flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                "[&[aria-current=page]]:bg-primary [&[aria-current=page]]:text-primary-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-border p-4 lg:block">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border border-border">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{initials}</AvatarFallback>
            </Avatar>
            <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={email}>
              {email}
            </p>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <Button asChild variant="line" size="sm" className="flex-1">
                <Link to="/">View site</Link>
              </Button>
              <Button asChild variant="line" size="sm" className="flex-1">
                <a href="/?preview=drafts">Preview drafts</a>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={onSignOut}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-6 lg:hidden">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar className="size-8 border border-border">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{initials}</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button asChild variant="line" size="sm" className="hidden sm:inline-flex">
              <Link to="/">View site</Link>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={onSignOut}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
