import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Monogram } from "@/components/portfolio/Monogram";
import { ThemeToggle } from '@/components/portfolio/ThemeToggle';

/** Quiet, centred frame shared by the sign-in, setup and password pages. */
export function AuthFrame({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-secondary px-4 py-8 text-foreground sm:py-14">
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium" aria-label="Back to the portfolio">
          <Monogram className="size-8" />
          <span className="hidden sm:inline">Lohit Rajan S</span>
        </Link>
        <div className="flex items-center gap-2"><ThemeToggle /><span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Admin</span></div>
      </div>
      <main className="mx-auto mt-10 w-full max-w-md flex-1">
        <div className="rounded-[1.5rem] border border-border bg-background p-6 shadow-soft sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">{title}</h1>
          {description ? <div className="mt-2 text-sm text-muted-foreground">{description}</div> : null}
          <div className="mt-7">{children}</div>
        </div>
        {footer ? <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div> : null}
      </main>
    </div>
  );
}

export function FormMessage({ tone, children }: { tone: "error" | "success" | "info"; children: ReactNode }) {
  const styles =
    tone === "error"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : tone === "success"
        ? "border-success/30 bg-success/10 text-foreground"
        : "border-border bg-secondary text-foreground";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
