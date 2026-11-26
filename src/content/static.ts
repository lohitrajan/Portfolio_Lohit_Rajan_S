import { bundledAssets } from "./assets";
import { achievementCategories } from "./achievements";
import { exploring } from "./exploring";
import { codingProfiles, codingTopics, education, experience, experienceFallback } from "./journey";
import { about, profile } from "./profile";
import { projects } from "./projects";
import { resume } from "./resume";
import { skillCategories } from "./skills";
import type { NavSection, PortfolioContent } from "./types";

export const defaultNavSections: NavSection[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

/** Built-in content, used when stored content can't be loaded. */
export const staticContent: PortfolioContent = {
  source: "fallback",
  siteTitle: "Lohit Rajan S — Software Developer & Computer Science Student",
  metaDescription:
    "Lohit Rajan S is a computer science student at Amrita Vishwa Vidyapeetham exploring software development, web apps, embedded systems and problem-solving.",
  profile,
  about,
  aboutImage: {
    src: bundledAssets["about-artwork"] ?? "",
    alt: "Abstract sculpture of balanced geometric forms representing curiosity and problem-solving",
  },
  skillCategories,
  projects,
  codingTopics,
  codingProfiles,
  education: education.map((e) => ({ ...e, isCurrent: true })),
  experience,
  experienceFallback,
  achievementCategories,
  exploring,
  resume,
  navSections: defaultNavSections,
  hiddenSections: [],
  heroGallery: [
    { src: bundledAssets["collage-workspace"] ?? "", alt: "A programming workspace with a laptop showing a code editor", label: "01 — Workspace" },
    { src: bundledAssets["collage-hardware"] ?? "", alt: "A microcontroller board wired to a servo motor and LCD display", label: "02 — Hardware" },
    {
      src: bundledAssets["collage-monogram"] ?? "",
      alt: "Sculptural 3D LS monogram in white ceramic and black glass wrapped by a lime light line",
      label: "Building • Learning • Creating",
    },
    { src: bundledAssets["project-skillbridge"] ?? "", alt: "Concept dashboard for the SkillBridge project", label: "03 — SkillBridge · concept" },
    { src: bundledAssets["collage-interface"] ?? "", alt: "Layered translucent software interface panels", label: "04 — Interfaces" },
  ],
  scenicBackground: bundledAssets["scenic-bg"] ?? "",
  customSections: [],
};
