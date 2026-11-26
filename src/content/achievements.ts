import type { AchievementCategory } from "./types";

/**
 * Achievements & certifications. Categories with no items are hidden automatically.
 * For certificate files, put them in /public/certificates and reference "/certificates/<file>".
 */
export const achievementCategories: AchievementCategory[] = [
  { id: "academic", label: "Academic Achievements", items: [] },
  { id: "coding", label: "Coding Achievements", items: [] },
  { id: "certifications", label: "Technical Certifications", items: [] },
  { id: "hackathons", label: "Hackathons", items: [] },
  { id: "workshops", label: "Workshops", items: [] },
  { id: "courses", label: "Online Courses", items: [] },
  { id: "competitions", label: "Technical Competitions", items: [] },
  { id: "projects", label: "Project Accomplishments", items: [] },
];

export function visibleAchievementCategories(categories: AchievementCategory[]) {
  return categories.filter((c) => c.items.length > 0);
}
