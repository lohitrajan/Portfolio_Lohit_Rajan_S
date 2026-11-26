import type { PortfolioContent } from "@/content/types";
import { staticContent } from "@/content/static";

export type TerminalTone = "default" | "muted" | "accent" | "error";

export interface TerminalLine {
  text: string;
  tone?: TerminalTone;
  href?: string;
}

export interface CommandResult {
  lines: TerminalLine[];
  clear?: boolean;
}

export const TERMINAL_COMMANDS: Record<string, string> = {
  help: "List available commands",
  about: "About the portfolio owner",
  skills: "Technical toolkit by category",
  projects: "Selected works and their status",
  education: "Academic journey",
  journey: "Problem-solving topics",
  contact: "How to get in touch",
  socials: "GitHub, LinkedIn and more",
  whoami: "You, the visitor",
  clear: "Clear the terminal",
};

function distance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        (prev[j] ?? 0) + 1,
        (row[j - 1] ?? 0) + 1,
        (prev[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = row;
  }
  return prev[b.length] ?? 0;
}

export function suggestCommand(input: string): string | null {
  let best: string | null = null;
  let bestScore = Infinity;
  for (const cmd of Object.keys(TERMINAL_COMMANDS)) {
    const score = cmd.startsWith(input) ? 0 : distance(input, cmd);
    if (score < bestScore) {
      bestScore = score;
      best = cmd;
    }
  }
  return bestScore <= 2 ? best : null;
}

const pending = (what: string): TerminalLine => ({ text: `${what}: not published yet`, tone: "muted" });

export function runCommand(raw: string, content: PortfolioContent = staticContent): CommandResult {
  const { about, codingTopics, education, profile, projects, skillCategories } = content;
  const input = raw.trim().toLowerCase();
  if (!input) return { lines: [] };
  const cmd = input.split(/\s+/)[0] ?? "";

  switch (cmd) {
    case "help":
      return {
        lines: [
          { text: "Available commands:", tone: "accent" },
          ...Object.entries(TERMINAL_COMMANDS).map(([name, desc]) => ({
            text: `  ${name.padEnd(10)} ${desc}`,
          })),
          { text: "Tip: use ↑ / ↓ to browse history.", tone: "muted" },
        ],
      };
    case "about":
      return {
        lines: [
          { text: profile.name, tone: "accent" },
          { text: profile.roles.join(" · ") },
          { text: profile.institution, tone: "muted" },
          { text: "" },
          { text: profile.shortIntro },
          { text: `Current focus → ${about.currentFocus}`, tone: "muted" },
        ],
      };
    case "skills":
      return {
        lines: skillCategories.flatMap((c) => [
          { text: `[${c.code}] ${c.label}`, tone: "accent" as const },
          { text: `    ${c.items.map((i) => i.name).join(", ")}` },
        ]),
      };
    case "projects":
      return {
        lines: [
          ...projects.map((p) => ({
            text: `${p.number}  ${p.title.padEnd(36)} [${p.status}]`,
            href: `/projects/${p.slug}`,
          })),
          { text: "Click a project to open its case study.", tone: "muted" },
        ],
      };
    case "education":
      return {
        lines: education.flatMap((e) => [
          { text: e.institution, tone: "accent" as const },
          { text: [e.degree, e.department].filter(Boolean).join(" — ") },
          { text: `Learning areas: ${e.coursework.join(", ")}`, tone: "muted" as const },
        ]),
      };
    case "journey":
      return {
        lines: codingTopics.flatMap((g) => [
          { text: g.label, tone: "accent" as const },
          { text: `    ${g.topics.join(" · ")}` },
        ]),
      };
    case "contact":
      return {
        lines: [
          profile.email
            ? { text: `email → ${profile.email}`, href: `mailto:${profile.email}` }
            : pending("email"),
          { text: "Or use the contact form below →", tone: "muted", href: "/#contact" },
        ],
      };
    case "socials":
      return {
        lines: profile.socials.map((s) =>
          s.url ? { text: `${s.label.padEnd(10)} ${s.url}`, href: s.url } : pending(s.label),
        ),
      };
    case "whoami":
      return { lines: [{ text: "guest@lohit.exe — curious visitor. Welcome!" }] };
    case "clear":
      return { lines: [], clear: true };
    default: {
      const suggestion = suggestCommand(cmd);
      return {
        lines: [
          { text: `command not found: ${cmd}`, tone: "error" },
          {
            text: suggestion ? `Did you mean "${suggestion}"? Type "help" for all commands.` : `Type "help" for all commands.`,
            tone: "muted",
          },
        ],
      };
    }
  }
}
