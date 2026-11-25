/**
 * Content models for the portfolio.
 * Every piece of visible content lives in src/content/* and follows these types,
 * so the same shapes can later be served from a database behind an admin dashboard.
 * Leave a field as an empty string / empty array when the information is not confirmed yet —
 * the UI hides it or shows a clear placeholder instead of inventing anything.
 */

export type SocialPlatform = "github" | "linkedin" | "email";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  /** Full URL (or mailto:). Empty string = not provided yet; the UI shows it as pending. */
  url: string;
}

export interface ProfileHighlight {
  label: string;
  /** Empty string = not confirmed; rendered as "To be added". */
  value: string;
}

export interface Profile {
  name: string;
  initials: string;
  roles: string[];
  institution: string;
  tagline: string;
  shortIntro: string;
  heroPills: string[];
  heroHeadline: { muted: string; strong: string };
  heroDescription: string;
  availability: { open: boolean; label: string };
  location: string;
  email: string;
  socials: SocialLink[];
  footerStatement: string;
  signature: { muted: string; strong: string };
}

export interface AboutContent {
  heading: string;
  paragraphs: string[];
  interests: string[];
  philosophy: string[];
  currentFocus: string;
  highlights: ProfileHighlight[];
}

export interface SkillItem {
  name: string;
  /** What has actually been done with this skill — keep it factual. */
  note: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  code: string;
  description: string;
  items: SkillItem[];
}

export const PROJECT_STATUSES = ["Concept", "In Progress", "Completed", "Published"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface ProjectImage {
  src: string;
  alt: string;
  /** True while the image is an illustrative concept visual rather than a real screenshot. */
  isConceptVisual?: boolean;
}

/** A value from an admin-defined custom field, already formatted for display. */
export interface ExtraField {
  key: string;
  label: string;
  value: string;
  items?: string[];
  href?: string;
  image?: string;
  style?: string | undefined;
  location?: string | undefined;
  rich?: boolean;
  icon?: string;
}

export const CASE_SECTION_KINDS = [
  "overview",
  "problem",
  "objective",
  "solution",
  "features",
  "stack",
  "architecture",
  "contribution",
  "challenges",
  "future",
  "screenshots",
  "github",
  "live",
] as const;
export type CaseSectionKind = (typeof CASE_SECTION_KINDS)[number];

export interface Project {
  slug: string;
  number: string;
  title: string;
  category: string;
  status: ProjectStatus;
  summary: string;
  tags: string[];
  cover: ProjectImage;
  overview: string;
  problem: string;
  objective: string;
  solution: string;
  features: string[];
  stack: string[];
  architecture: string[];
  /** Your own role — leave empty until you write it in your own words. */
  contribution: string;
  challenges: string[];
  futureImprovements: string[];
  screenshots: ProjectImage[];
  /** Empty string = no public repository linked yet. */
  githubUrl: string;
  /** Empty string = no live demo yet. */
  liveUrl: string;
  /** Custom headings set in the admin dashboard. */
  sectionTitles?: Partial<Record<CaseSectionKind, string>>;
  /** Case-study sections switched off in the admin dashboard. */
  hiddenSections?: CaseSectionKind[];
  /** Extra free-form case-study sections. */
  extraSections?: { title: string; body: string; items: string[] }[];
  extraFields?: ExtraField[];
}

export interface CodingTopicGroup {
  label: string;
  topics: string[];
}

export interface CodingProfile {
  platform: string;
  username: string;
  url: string;
  /** Manually maintained, verified numbers only. Leave empty rather than guessing. */
  stats: { label: string; value: string }[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  department: string;
  academicYear: string;
  startYear: string;
  graduationYear: string;
  cgpa: string;
  coursework: string[];
  achievements: string[];
  certifications: string[];
  isCurrent?: boolean;
  description?: string;
  extraFields?: ExtraField[];
}

export interface ExperienceEntry {
  type:
    | "Internship"
    | "Work"
    | "Freelance"
    | "Leadership"
    | "Volunteering"
    | "Workshop"
    | "Technical Event"
    | "Responsibility";
  organization: string;
  position: string;
  duration: string;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  extraFields?: ExtraField[];
}

export interface AchievementItem {
  title: string;
  issuer: string;
  date: string;
  description: string;
  certificateImage?: string | undefined;
  certificatePdf?: string | undefined;
  credentialUrl?: string | undefined;
  extraFields?: ExtraField[];
}

export interface AchievementCategory {
  id: string;
  label: string;
  items: AchievementItem[];
}

export interface ExploringContent {
  heading: string;
  currentFocus: { topic: string; note: string };
  topics: { title: string; note: string }[];
}

export interface ResumeContent {
  /** Path to a PDF in /public (e.g. "/resume/lohit-rajan-s.pdf") or a full URL. Empty = not uploaded. */
  fileUrl: string;
  lastUpdated: string;
  version: string;
  history: { version: string; date: string; note: string }[];
}

export interface HeroTile {
  src: string;
  alt: string;
  label: string;
}

export interface NavSection {
  id: string;
  label: string;
}

export interface CustomSectionContent {
  id: string;
  layout?: string;
  image?: string;
  icon?: string;
  title: string;
  eyebrow: string;
  description: string;
  entries: { id: string; title: string; fields: ExtraField[] }[];
}

/** Everything the public site renders, whether it comes from the database or the built-in defaults. */
export interface PortfolioContent {
  source: "database" | "fallback";
  siteTitle: string;
  metaDescription: string;
  profile: Profile;
  about: AboutContent;
  aboutImage: { src: string; alt: string };
  skillCategories: SkillCategory[];
  projects: Project[];
  codingTopics: CodingTopicGroup[];
  codingProfiles: CodingProfile[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  experienceFallback: string;
  achievementCategories: AchievementCategory[];
  exploring: ExploringContent;
  resume: ResumeContent;
  navSections: NavSection[];
  /** Built-in home sections switched off in settings. */
  hiddenSections: string[];
  heroGallery: HeroTile[];
  scenicBackground: string;
  customSections: CustomSectionContent[];
}
