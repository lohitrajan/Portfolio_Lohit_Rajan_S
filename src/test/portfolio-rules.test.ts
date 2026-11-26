import { describe, expect, it } from "vitest";
import { runCommand, suggestCommand } from "@/lib/terminal";
import { contactSchema } from "@/lib/contact-schema";
import { visibleAchievementCategories } from "@/content/achievements";
import { filterProjects } from "@/components/portfolio/Projects";
import { PROJECT_STATUSES } from "@/content/types";
import { projects } from "@/content/projects";

describe("LOHIT.EXE terminal", () => {
  it("help lists the documented commands", () => {
    const text = runCommand("help").lines.map((l) => l.text).join("\n");
    for (const cmd of ["about", "skills", "projects", "education", "contact", "socials", "clear"]) {
      expect(text).toContain(cmd);
    }
  });

  it("clear empties the screen", () => {
    expect(runCommand("clear").clear).toBe(true);
  });

  it("unknown commands report not found and suggest a close match", () => {
    const result = runCommand("skils");
    expect(result.lines[0]?.text).toBe("command not found: skils");
    expect(result.lines[1]?.text).toContain('"skills"');
    expect(suggestCommand("xyzxyz")).toBeNull();
  });
});

describe("contact form validation", () => {
  const valid = { name: "Asha", email: "asha@example.com", subject: "Hello", message: "Would love to collaborate.", website: "" };

  it("accepts a complete message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects messages over 2000 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success).toBe(false);
  });

  it("rejects submissions that fill the hidden bot field", () => {
    expect(contactSchema.safeParse({ ...valid, website: "spam.example" }).success).toBe(false);
  });
});

describe("honest content rules", () => {
  it("hides achievement categories that have no entries", () => {
    const shown = visibleAchievementCategories([
      { id: "a", label: "Empty", items: [] },
      { id: "b", label: "Real", items: [{ title: "Cert", issuer: "Org", date: "2026", description: "" }] },
    ]);
    expect(shown.map((c) => c.id)).toEqual(["b"]);
  });

  it("only offers the four allowed project statuses", () => {
    expect([...PROJECT_STATUSES]).toEqual(["Concept", "In Progress", "Completed", "Published"]);
  });

  it("status filter returns only matching projects", () => {
    const list = [
      { status: "Concept" as const },
      { status: "Completed" as const },
      { status: "Concept" as const },
    ];
    expect(filterProjects(list, "Concept")).toHaveLength(2);
    expect(filterProjects(list, "All")).toHaveLength(3);
    expect(filterProjects(list, "Published")).toHaveLength(0);
  });

  it("no project claims a GitHub or live link that has not been added", () => {
    for (const p of projects) {
      if (p.githubUrl) expect(p.githubUrl).toMatch(/^https:\/\/github\.com\//);
      if (p.liveUrl) expect(p.liveUrl).toMatch(/^https:\/\//);
    }
  });
});
