export * from "./types";
export { profile, about } from "./profile";
export { skillCategories } from "./skills";
export { projects, getProjectBySlug } from "./projects";
export { codingTopics, codingProfiles, education, experience, experienceFallback } from "./journey";
export { achievementCategories, visibleAchievementCategories } from "./achievements";
export { exploring } from "./exploring";
export { resume } from "./resume";

export const navSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;
export { staticContent, defaultNavSections } from "./static";
export { bundledAsset, bundledAssets } from "./assets";
