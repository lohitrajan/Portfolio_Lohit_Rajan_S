import type { Json, Tables } from "@/integrations/supabase/types";
import { bundledAsset } from "@/content/assets";
import { staticContent } from "@/content/static";
import { unpublishedCopy } from "@/content/profile";
import {
  CASE_SECTION_KINDS,
  PROJECT_STATUSES,
  type AchievementCategory,
  type AchievementItem,
  type CaseSectionKind,
  type CustomSectionContent,
  type ExtraField,
  type NavSection,
  type PortfolioContent,
  type Project,
  type ProjectStatus,
} from "@/content/types";

/** Published rows as returned to the public (row-level security already filtered drafts out). */
export interface PortfolioRows {
  profile: Tables<"portfolio_profile"> | null;
  about: Tables<"portfolio_about"> | null;
  settings: Tables<"site_settings"> | null;
  skillCategories: Tables<"skill_categories">[];
  skills: Tables<"skills">[];
  projects: Tables<"projects">[];
  projectSections: Tables<"project_sections">[];
  projectImages: Tables<"project_images">[];
  education: Tables<"education">[];
  experience: Tables<"experience">[];
  achievements: Tables<"achievements">[];
  certifications: Tables<"certifications">[];
  codingProfiles: Tables<"coding_profiles">[];
  resume: Tables<"resume_versions">[];
  customSections: Tables<"custom_sections">[];
  customEntries: Tables<"custom_section_entries">[];
  fieldDefinitions: Tables<"custom_field_definitions">[];
  fieldValues: Tables<"custom_field_values">[];
  /** Admin preview: also show draft custom fields and values. */
  previewDrafts?: boolean;
}

/** Turns a stored path into a URL: bundled "asset:" images, full URLs, or signed storage URLs. */
export type MediaResolver = (path: string | null | undefined) => string;

export const ACHIEVEMENT_CATEGORIES = [
  "Academic Achievements",
  "Coding Achievements",
  "Technical Certifications",
  "Hackathons",
  "Workshops",
  "Online Courses",
  "Technical Competitions",
  "Project Accomplishments",
] as const;

const bySort = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

function asArray(value: Json | undefined | null): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Every storage path referenced by the rows, so they can be signed in one batch. */
export function collectMediaPaths(value: unknown, found = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    value.forEach((v) => collectMediaPaths(v, found));
  } else if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) {
      if (typeof v === "string" && /(^|_)path$/.test(key) && v && !v.startsWith("asset:") && !/^https?:\/\//.test(v)) {
        found.add(v);
      } else if (typeof v === "object") {
        collectMediaPaths(v, found);
      }
    }
  }
  return found;
}

export function makeResolver(signed: Record<string, string>): MediaResolver {
  return (path) => {
    if (!path) return "";
    return bundledAsset(path) ?? (/^https?:\/\//.test(path) ? path : (signed[path] ?? ""));
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(date: string | null | undefined): string {
  if (!date) return "";
  const m = /^(\d{4})-(\d{2})/.exec(date);
  if (!m) return "";
  return `${MONTHS[Number(m[2]) - 1] ?? ""} ${m[1]}`.trim();
}

export function formatDuration(start: string | null, end: string | null, isCurrent: boolean): string {
  const from = formatMonth(start);
  const to = isCurrent ? "Present" : formatMonth(end);
  if (from && to) return `${from} — ${to}`;
  return from || to;
}

export function toProjectStatus(progress: string): ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(progress) ? (progress as ProjectStatus) : "Concept";
}

/** Formats one custom-field value for display; returns null when there is nothing to show. */
export function formatFieldValue(
  def: Pick<Tables<"custom_field_definitions">, "key" | "label" | "field_type"> & Partial<Pick<Tables<'custom_field_definitions'>, 'display_style' | 'display_location'>>,
  value: Json | null | undefined,
  resolve: MediaResolver,
): ExtraField | null {
  if (value === null || value === undefined || value === "") return null;
  const base = { key: def.key, label: def.label, style: def.display_style, location: def.display_location, rich: def.field_type === 'richtext' };
  switch (def.field_type) {
    case "boolean":
      return typeof value === "boolean" ? { ...base, value: value ? "Yes" : "No" } : null;
    case "number":
      return typeof value === "number" ? { ...base, value: String(value) } : null;
    case "multiselect":
    case "repeater": {
      const items = asArray(value).map(v => typeof v === 'string' ? v : Object.values(asRecord(v)).map(str).filter(Boolean).join(': ')).filter(Boolean);
      return items.length ? { ...base, value: items.join(", "), items } : null;
    }
    case "url":
    case 'video': case 'profile_link': case 'reference':
      return typeof value === "string" && /^https:\/\//.test(value) ? { ...base, value, href: value } : null;
    case "email":
      return typeof value === "string" && value ? { ...base, value, href: `mailto:${value}` } : null;
    case "date":
      return typeof value === "string" && value ? { ...base, value: formatMonth(value) || value } : null;
    case 'date_range': {
      const r = asRecord(value);
      return r['start'] && r['end'] ? { ...base, value: `${str(r['start'])} — ${str(r['end'])}` } : null;
    }
    case 'icon_label': {
      const r = asRecord(value);
      return str(r['label']) ? { ...base, value: str(r['label']), icon: str(r['icon']) } : null;
    }
    case "image":
    case "pdf":
    case "file": {
      const rec = asRecord(value);
      const url = resolve(str(rec["path"]));
      if (!url) return null;
      const name = str(rec["name"]) || def.label;
      return def.field_type === "image" ? { ...base, value: name, image: url } : { ...base, value: name, href: url };
    }
    default:
      return typeof value === "string" && value.trim() ? { ...base, value } : null;
  }
}

function fieldsFor(
  rows: PortfolioRows,
  target: string,
  entityId: string,
  resolve: MediaResolver,
  sectionId: string | null = null,
): ExtraField[] {
  return rows.fieldDefinitions
    .filter((d) => d.target === target && (rows.previewDrafts ? d.status !== 'archived' : d.is_public && (!d.status || d.status === 'published')) && (sectionId === null || d.section_id === sectionId))
    .sort(bySort)
    .map((d) => {
      const v = rows.fieldValues.find((x) => x.field_id === d.id && x.entity_id === entityId && (rows.previewDrafts ? x.status !== 'archived' : (!x.status || x.status === 'published')));
      return formatFieldValue(d, v?.value, resolve);
    })
    .filter((f): f is ExtraField => f !== null);
}

function mapProject(rows: PortfolioRows, p: Tables<"projects">, index: number, resolve: MediaResolver): Project {
  const sections = rows.projectSections.filter((s) => s.project_id === p.id).sort(bySort);
  const byKind = (k: CaseSectionKind) => sections.find((s) => s.kind === k);
  const body = (k: CaseSectionKind) => byKind(k)?.body ?? "";
  const items = (k: CaseSectionKind) => byKind(k)?.items ?? [];
  const sectionTitles: Partial<Record<CaseSectionKind, string>> = {};
  for (const s of sections) {
    if ((CASE_SECTION_KINDS as readonly string[]).includes(s.kind) && s.title) {
      sectionTitles[s.kind as CaseSectionKind] = s.title;
    }
  }
  const stack = items("stack");
  return {
    slug: p.slug,
    number: String(index + 1).padStart(2, "0"),
    title: p.title,
    category: p.category,
    status: toProjectStatus(p.progress),
    summary: p.summary,
    tags: p.tags,
    cover: { src: resolve(p.cover_path), alt: p.cover_alt || p.title, isConceptVisual: p.cover_is_concept },
    overview: body("overview") || p.description,
    problem: body("problem"),
    objective: body("objective"),
    solution: body("solution"),
    features: items("features"),
    stack: stack.length ? stack : p.technologies,
    architecture: items("architecture"),
    contribution: body("contribution"),
    challenges: items("challenges"),
    futureImprovements: items("future"),
    screenshots: rows.projectImages
      .filter((i) => i.project_id === p.id)
      .sort(bySort)
      .map((i) => ({ src: resolve(i.path), alt: i.alt, isConceptVisual: i.is_concept }))
      .filter((i) => i.src),
    githubUrl: p.github_url,
    liveUrl: p.live_url,
    sectionTitles,
    // Sections hidden in the dashboard are not readable publicly, so a missing kind means hidden.
    hiddenSections: CASE_SECTION_KINDS.filter((k) => !byKind(k)),
    extraSections: sections
      .filter((s) => s.kind === "custom")
      .map((s) => ({ title: s.title, body: s.body, items: s.items })),
    extraFields: fieldsFor(rows, "project", p.id, resolve),
  };
}

function mapAchievements(rows: PortfolioRows, resolve: MediaResolver): AchievementCategory[] {
  const labels: string[] = [...ACHIEVEMENT_CATEGORIES];
  for (const a of rows.achievements) if (!labels.includes(a.category)) labels.push(a.category);
  const toId = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return labels.map((label) => {
    const items: AchievementItem[] = rows.achievements
      .filter((a) => a.category === label)
      .sort(bySort)
      .map((a) => ({
        title: a.title,
        issuer: a.organization,
        date: formatMonth(a.achieved_on),
        description: a.description,
        certificateImage: resolve(a.image_path) || undefined,
        credentialUrl: a.credential_url || undefined,
        extraFields: fieldsFor(rows, "achievement", a.id, resolve),
      }));
    if (label === "Technical Certifications") {
      items.push(
        ...rows.certifications.sort(bySort).map((c) => ({
          title: c.name,
          issuer: c.issuer,
          date: [formatMonth(c.issue_date), c.expiry_date ? `valid until ${formatMonth(c.expiry_date)}` : ""]
            .filter(Boolean)
            .join(" · "),
          description: "",
          certificateImage: resolve(c.image_path) || undefined,
          certificatePdf: resolve(c.pdf_path) || undefined,
          credentialUrl: c.credential_url || undefined,
          extraFields: fieldsFor(rows, "certification", c.id, resolve),
        })),
      );
    }
    return { id: toId(label), label, items };
  });
}

function mapNav(rows: PortfolioRows): { nav: NavSection[]; hidden: string[] } {
  const config = asArray(rows.settings?.sections).map(asRecord);
  if (!config.length) return { nav: staticContent.navSections, hidden: [] };
  const hidden = config.filter((c) => c["visible"] === false).map((c) => str(c["id"]));
  const nav: NavSection[] = config
    .filter((c) => c["visible"] !== false && c["inNav"] !== false)
    .map((c) => ({ id: str(c["id"]), label: str(c["label"]) || str(c["id"]) }));
  const custom = rows.customSections
    .filter((s) => s.show_in_nav && s.status === 'published' && rows.customEntries.some(e => e.section_id === s.id && e.status === 'published'))
    .sort(bySort)
    .map((s) => ({ id: s.slug, label: s.title }));
  // Custom sections render just before Contact, so list them there in the nav too.
  const contactAt = nav.findIndex((n) => n.id === "contact");
  if (contactAt === -1) nav.push(...custom);
  else nav.splice(contactAt, 0, ...custom);
  return { nav, hidden };
}

export function mapPortfolio(rows: PortfolioRows, resolve: MediaResolver): PortfolioContent {
  const fallback = staticContent;
  // Empty identity/settings must not prevent independently published entries from appearing.
  const p = rows.profile ?? {
    full_name: "", initials: "", roles: [], institution: "", tagline: "", short_intro: "",
    availability_open: false, availability_label: "", location: "", email: "", github_url: "",
    linkedin_url: "", photo_path: null,
  };
  const a = rows.about ?? {
    heading: "", intro: "", paragraphs: [], interests: [], philosophy: [], current_focus: "",
    career_objectives: [], personal_interests: [], highlights: [], exploring_heading: "",
    exploring_focus_topic: "", exploring_focus_note: "", exploring_topics: [],
  };
  const s = rows.settings ?? {
    site_title: "", meta_description: "", hero_gallery: [], hero_pills: [], hero_headline_muted: "",
    hero_headline_strong: "", hero_description: "", footer_statement: "", signature_muted: "",
    signature_strong: "", coding_topics: [], experience_fallback: "", scenic_bg_path: null,
  };

  const { nav, hidden } = mapNav(rows);
  const gallery = asArray(s.hero_gallery).map(asRecord);
  const careerObjectives = a.career_objectives.filter(Boolean);
  const personalInterests = a.personal_interests.filter(Boolean);

  const customSections: CustomSectionContent[] = rows.customSections.filter(sec => sec.status === 'published').sort(bySort).map((sec) => ({
    id: sec.slug,
    layout: sec.layout, image: resolve(sec.image_path), icon: sec.icon,
    title: sec.title,
    eyebrow: sec.eyebrow,
    description: sec.description,
    entries: rows.customEntries
      .filter((e) => e.section_id === sec.id && e.status === 'published')
      .sort(bySort)
      .map((e) => ({ id: e.id, title: e.title, fields: fieldsFor(rows, "section", e.id, resolve, sec.id) })),
  })).filter(sec => sec.entries.length > 0);

  const active = rows.resume.find((r) => r.is_active);

  return {
    source: "database",
    siteTitle: s.site_title || fallback.siteTitle,
    metaDescription: s.meta_description || fallback.metaDescription,
    profile: {
      name: p.full_name,
      initials: p.initials,
      roles: p.roles,
      institution: p.institution,
      tagline: p.tagline,
      shortIntro: p.short_intro,
      heroPills: s.hero_pills,
      heroHeadline: s.hero_headline_muted.trim() || s.hero_headline_strong.trim()
        ? { muted: s.hero_headline_muted, strong: s.hero_headline_strong }
        : unpublishedCopy.heroHeadline,
      heroDescription: s.hero_description.trim() || unpublishedCopy.heroDescription,
      availability: { open: p.availability_open, label: p.availability_label },
      location: p.location,
      email: p.email,
      socials: [
        { platform: "github", label: "GitHub", url: p.github_url },
        { platform: "linkedin", label: "LinkedIn", url: p.linkedin_url },
      ],
      footerStatement: s.footer_statement,
      signature: s.signature_muted.trim() || s.signature_strong.trim()
        ? { muted: s.signature_muted, strong: s.signature_strong }
        : unpublishedCopy.signature,
    },
    about: {
      heading: a.heading.trim() || unpublishedCopy.aboutHeading,
      paragraphs: [a.intro, ...a.paragraphs].filter((x) => x.trim()),
      interests: a.interests,
      philosophy: a.philosophy,
      currentFocus: a.current_focus,
      highlights: [
        ...asArray(a.highlights).map(asRecord).map((h) => ({ label: str(h["label"]), value: str(h["value"]) })),
        ...(careerObjectives.length ? [{ label: "Career objectives", value: careerObjectives.join(", ") }] : []),
        ...(personalInterests.length ? [{ label: "Personal interests", value: personalInterests.join(", ") }] : []),
        ...[...fieldsFor(rows, "profile", "profile", resolve), ...fieldsFor(rows, "about", "about", resolve)].map((f) => ({
          label: f.label,
          value: f.value,
        })),
      ],
    },
    aboutImage: p.photo_path
      ? { src: resolve(p.photo_path) || fallback.aboutImage.src, alt: `Portrait of ${p.full_name}` }
      : fallback.aboutImage,
    skillCategories: rows.skillCategories
      .sort(bySort)
      .map((c) => ({
        id: c.slug,
        label: c.label,
        code: c.code,
        description: c.description,
        items: rows.skills
          .filter((x) => x.category_id === c.id)
          .sort(bySort)
          .map((x) => ({ name: x.name, note: x.note })),
      }))
      .filter((c) => c.items.length > 0),
    projects: rows.projects.sort(bySort).map((proj, i) => mapProject(rows, proj, i, resolve)),
    codingTopics: asArray(s.coding_topics)
      .map(asRecord)
      .map((g) => ({ label: str(g["label"]), topics: asArray(g["topics"] as Json).map(str).filter(Boolean) })),
    codingProfiles: rows.codingProfiles.sort(bySort).map((c) => ({
      platform: c.display_name || c.platform,
      username: c.username,
      url: c.url,
      stats: asArray(c.stats)
        .map(asRecord)
        .map((x) => ({ label: str(x["label"]), value: str(x["value"]) }))
        .filter((x) => x.label && x.value),
    })),
    education: rows.education.sort(bySort).map((e) => ({
      institution: e.institution,
      degree: e.degree,
      department: e.department,
      academicYear: e.academic_year,
      startYear: e.start_year,
      graduationYear: e.end_year,
      cgpa: e.cgpa,
      coursework: e.coursework,
      achievements: e.achievements,
      certifications: e.certifications,
      isCurrent: e.is_current,
      description: e.description,
      extraFields: fieldsFor(rows, "education", e.id, resolve),
    })),
    experience: rows.experience.sort(bySort).map((x) => ({
      type: x.kind as PortfolioContent["experience"][number]["type"],
      organization: x.organization,
      position: x.position,
      duration: formatDuration(x.start_date, x.end_date, x.is_current),
      description: x.description,
      responsibilities: x.responsibilities,
      achievements: x.achievements,
      technologies: x.technologies,
      extraFields: fieldsFor(rows, "experience", x.id, resolve),
    })),
    experienceFallback: s.experience_fallback || fallback.experienceFallback,
    achievementCategories: mapAchievements(rows, resolve),
    exploring: {
      heading: a.exploring_heading.trim() || unpublishedCopy.exploringHeading,
      currentFocus: { topic: a.exploring_focus_topic, note: a.exploring_focus_note },
      topics: asArray(a.exploring_topics)
        .map(asRecord)
        .map((t) => ({ title: str(t["title"]), note: str(t["note"]) }))
        .filter((t) => t.title),
    },
    resume: active
      ? {
          fileUrl: resolve(active.file_path),
          lastUpdated: formatMonth(active.updated_at.slice(0, 10)),
          version: active.version,
          history: [],
        }
      : { fileUrl: "", lastUpdated: "", version: "", history: [] },
    navSections: nav,
    hiddenSections: hidden,
    heroGallery: fallback.heroGallery.map((def, i) => {
      const g = gallery[i];
      const src = g ? resolve(str(g["path"])) : "";
      return src ? { src, alt: str(g?.["alt"]), label: str(g?.["label"]) } : def;
    }),
    scenicBackground: resolve(s.scenic_bg_path) || fallback.scenicBackground,
    customSections,
  };
}
