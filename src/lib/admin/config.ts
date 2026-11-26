import { staticContent } from "@/content/static";
import { exploring } from "@/content/exploring";
import { CASE_SECTION_KINDS, PROJECT_STATUSES } from "@/content/types";
import type { AdminTable } from "./db";
import { CONTENT_STATUSES, CUSTOM_FIELD_TYPES, CUSTOM_TARGETS, NEW_ITEM_STATUS, type FieldDef, type Values } from "./forms";

export interface CollectionConfig {
  table: AdminTable;
  title: string;
  eyebrow: string;
  description: string;
  fields: FieldDef[];
  defaults?: Values;
  titleKey: string;
  secondaryKey?: string;
  hasStatus?: boolean;
  hasSort?: boolean;
  addLabel?: string;
}

export interface SingletonConfig {
  table: "portfolio_profile" | "portfolio_about" | "site_settings";
  title: string;
  eyebrow: string;
  description: string;
  fields: FieldDef[];
  defaults: Values;
}

const status: FieldDef = {
  name: "status",
  label: "Visibility",
  type: "select",
  required: true,
  options: CONTENT_STATUSES,
  help: "Only published items appear on the public portfolio.",
};
const sort: FieldDef = { name: "sort_order", label: "Position", type: "number", required: true };
const text = (name: string, label: string, required = false): FieldDef => ({ name, label, type: "text", required });
const area = (name: string, label: string, required = false): FieldDef => ({ name, label, type: "textarea", required });
const list = (name: string, label: string): FieldDef => ({ name, label, type: "list" });
const url = (name: string, label: string): FieldDef => ({ name, label, type: "url" });
const date = (name: string, label: string): FieldDef => ({ name, label, type: "date" });
const toggle = (name: string, label: string): FieldDef => ({ name, label, type: "switch" });
const media = (name: string, label: string, folder: string, kind: "image" | "pdf" = "image"): FieldDef => ({ name, label, type: "media", folder, kind });

export const profileConfig: SingletonConfig = {
  table: "portfolio_profile",
  title: "Profile",
  eyebrow: "Your identity",
  description: "Your name, introduction, contact details and public links.",
  fields: [
    text("full_name", "Full name", true),
    text("initials", "Initials", true),
    list("roles", "Roles"),
    text("institution", "Institution"),
    text("tagline", "Tagline"),
    area("short_intro", "Short introduction", true),
    media("photo_path", "Profile photo or About artwork", "profile"),
    media("logo_path", "Logo", "profile"),
    text("location", "Location"),
    { name: "email", label: "Public email", type: "email" },
    text("phone", "Phone"),
    url("linkedin_url", "LinkedIn URL"),
    url("github_url", "GitHub URL"),
    toggle("availability_open", "Open to opportunities"),
    text("availability_label", "Availability message"),
  ],
  defaults: {
    full_name: staticContent.profile.name,
    initials: staticContent.profile.initials,
    roles: staticContent.profile.roles,
    institution: staticContent.profile.institution,
    tagline: staticContent.profile.tagline,
    short_intro: staticContent.profile.shortIntro,
    photo_path: "asset:about-artwork",
    logo_path: null,
    location: staticContent.profile.location,
    email: staticContent.profile.email,
    phone: "",
    linkedin_url: "",
    github_url: "",
    availability_open: staticContent.profile.availability.open,
    availability_label: staticContent.profile.availability.label,
  },
};

export const aboutConfig: SingletonConfig = {
  table: "portfolio_about",
  title: "About & exploring",
  eyebrow: "Your story",
  description: "The longer introduction, interests, learning philosophy and current explorations.",
  fields: [
    text("heading", "Heading", true),
    area("intro", "Opening paragraph"),
    list("paragraphs", "More paragraphs"),
    list("interests", "Professional interests"),
    list("career_objectives", "Career objectives"),
    list("philosophy", "Learning philosophy"),
    list("personal_interests", "Personal interests"),
    area("current_focus", "Current focus"),
    { name: "highlights", label: "Highlight cards", type: "objects", keys: [
      { name: "label", label: "Label" }, { name: "value", label: "Value", type: "textarea" },
    ] },
    text("exploring_heading", "Exploring heading"),
    text("exploring_focus_topic", "Current topic"),
    area("exploring_focus_note", "Current topic note"),
    { name: "exploring_topics", label: "Exploring topics", type: "objects", keys: [
      { name: "title", label: "Topic" }, { name: "note", label: "Note", type: "textarea" },
    ] },
  ],
  defaults: {
    heading: staticContent.about.heading,
    intro: staticContent.about.paragraphs[0] ?? "",
    paragraphs: staticContent.about.paragraphs.slice(1),
    interests: staticContent.about.interests,
    career_objectives: ["Software engineering"],
    philosophy: staticContent.about.philosophy,
    personal_interests: [],
    current_focus: staticContent.about.currentFocus,
    highlights: staticContent.about.highlights,
    exploring_heading: exploring.heading,
    exploring_focus_topic: exploring.currentFocus.topic,
    exploring_focus_note: exploring.currentFocus.note,
    exploring_topics: exploring.topics,
  },
};

export const settingsConfig: SingletonConfig = {
  table: "site_settings",
  title: "Site settings",
  eyebrow: "Portfolio-wide content",
  description: "Search description, hero, navigation, section visibility, coding topics and imagery.",
  fields: [
    text("site_title", "Browser and search title", true),
    area("meta_description", "Search description", true),
    text("default_theme", "Default theme"),
    media("favicon_path", "Favicon", "site"),
    media("og_image_path", "Social sharing image", "site"),
    media("scenic_bg_path", "Scenic background", "site"),
    list("hero_pills", "Hero labels"),
    text("hero_headline_muted", "Hero first line", true),
    text("hero_headline_strong", "Hero second line", true),
    area("hero_description", "Hero introduction", true),
    area("footer_statement", "Footer statement"),
    text("signature_muted", "Footer signature first line"),
    text("signature_strong", "Footer signature second line"),
    area("experience_fallback", "Empty experience message"),
    { name: "sections", label: "Built-in sections", type: "objects", keys: [
      { name: "id", label: "Section ID", type: "readonly" },
      { name: "label", label: "Navigation label" },
      { name: "visible", label: "Visible", type: "switch" },
      { name: "inNav", label: "In navigation", type: "switch" },
    ] },
    { name: "coding_topics", label: "Coding topic groups", type: "objects", keys: [
      { name: "label", label: "Group" }, { name: "topics", label: "Topics", type: "list" },
    ] },
    { name: "hero_gallery", label: "Hero gallery", type: "objects", keys: [
      { name: "path", label: "Image", type: "media", kind: "image" },
      { name: "alt", label: "Image description" },
      { name: "label", label: "Caption" },
    ], folder: "hero" },
  ],
  defaults: {
    site_title: staticContent.siteTitle,
    meta_description: staticContent.metaDescription,
    default_theme: "light",
    favicon_path: null,
    og_image_path: null,
    scenic_bg_path: "asset:scenic-bg",
    hero_pills: staticContent.profile.heroPills,
    hero_headline_muted: staticContent.profile.heroHeadline.muted,
    hero_headline_strong: staticContent.profile.heroHeadline.strong,
    hero_description: staticContent.profile.heroDescription,
    footer_statement: staticContent.profile.footerStatement,
    signature_muted: staticContent.profile.signature.muted,
    signature_strong: staticContent.profile.signature.strong,
    experience_fallback: staticContent.experienceFallback,
    sections: [
      ...staticContent.navSections.map((s) => ({ ...s, visible: true, inNav: true })),
      { id: "exploring", label: "Exploring", visible: true, inNav: false },
      { id: "resume", label: "Resume", visible: true, inNav: false },
    ],
    coding_topics: staticContent.codingTopics,
    hero_gallery: [
      { path: "asset:collage-workspace", alt: "A programming workspace with a laptop showing a code editor", label: "01 — Workspace" },
      { path: "asset:collage-hardware", alt: "A microcontroller board wired to a servo motor and LCD display", label: "02 — Hardware" },
      { path: "asset:collage-monogram", alt: "Sculptural LS monogram with a lime light line", label: "Building • Learning • Creating" },
      { path: "asset:project-skillbridge", alt: "Concept dashboard for the SkillBridge project", label: "03 — SkillBridge · concept" },
      { path: "asset:collage-interface", alt: "Layered translucent software interface panels", label: "04 — Interfaces" },
    ],
  },
};

export const skillCategoryConfig: CollectionConfig = {
  table: "skill_categories", title: "Skill categories", eyebrow: "Skills", description: "Group skills into honest, easy-to-scan categories.",
  titleKey: "label", secondaryKey: "code", hasStatus: true, hasSort: true, addLabel: "Add category",
  fields: [
    { name: "slug", label: "URL name", type: "slug", from: "label", required: true },
    text("label", "Category name", true), text("code", "Short code", true), area("description", "Description"),
    text("icon", "Icon name"), status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0, icon: "Code2" },
};

export const skillConfig: CollectionConfig = {
  table: "skills", title: "Skills", eyebrow: "Skills", description: "Add each skill and a factual note about how you have used it.",
  titleKey: "name", secondaryKey: "note", hasStatus: true, hasSort: true, addLabel: "Add skill",
  fields: [
    { name: "category_id", label: "Category", type: "select", required: true, options: [] },
    text("name", "Skill name", true), area("note", "How you use it"), text("icon", "Icon name"), status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0, icon: "Code2", note: "" },
};

export const projectConfig: CollectionConfig = {
  table: "projects", title: "Projects", eyebrow: "Selected work", description: "Project cards and the main case-study details. Add sections and screenshots below.",
  titleKey: "title", secondaryKey: "category", hasStatus: true, hasSort: true, addLabel: "Add project",
  fields: [
    { name: "slug", label: "URL name", type: "slug", from: "title", required: true },
    text("title", "Project title", true), text("category", "Category"), text("year", "Year"),
    { name: "progress", label: "Project status", type: "select", required: true, options: PROJECT_STATUSES },
    area("summary", "Card summary", true), area("description", "Case-study overview"), list("tags", "Tags"), list("technologies", "Technologies"),
    media("cover_path", "Cover image", "projects"), text("cover_alt", "Cover image description"), toggle("cover_is_concept", "Cover is a concept visual"),
    url("github_url", "GitHub URL"), url("live_url", "Live project URL"), toggle("featured", "Feature on home"), status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0, progress: "Concept", tags: [], technologies: [], cover_is_concept: true, featured: false, github_url: "", live_url: "", cover_alt: "" },
};

export const projectSectionConfig: CollectionConfig = {
  table: "project_sections", title: "Case-study sections", eyebrow: "Projects", description: "Control each project's overview, features, architecture, challenges and custom sections.",
  titleKey: "title", secondaryKey: "kind", hasSort: true, addLabel: "Add case-study section",
  fields: [
    { name: "project_id", label: "Project", type: "select", required: true, options: [] },
    { name: "kind", label: "Section type", type: "select", required: true, options: [...CASE_SECTION_KINDS, "custom"] },
    text("title", "Custom heading"), area("body", "Body"), list("items", "List items"), toggle("visible", "Visible"), sort,
  ],
  defaults: { kind: "overview", title: "Overview", body: "", items: [], visible: true, sort_order: 0 },
};

export const projectImageConfig: CollectionConfig = {
  table: "project_images", title: "Project screenshots", eyebrow: "Projects", description: "Upload real screenshots or clearly labelled concept visuals for each project.",
  titleKey: "alt", secondaryKey: "path", hasSort: true, addLabel: "Add screenshot",
  fields: [
    { name: "project_id", label: "Project", type: "select", required: true, options: [] },
    media("path", "Screenshot", "projects"), text("alt", "Image description", true), toggle("is_concept", "This is a concept visual"), sort,
  ],
  defaults: { is_concept: false, sort_order: 0, alt: "" },
};

export const educationConfig: CollectionConfig = {
  table: "education", title: "Education", eyebrow: "Journey", description: "Your confirmed academic history, coursework and academic achievements.",
  titleKey: "institution", secondaryKey: "degree", hasStatus: true, hasSort: true, addLabel: "Add education",
  fields: [
    text("institution", "Institution", true), text("degree", "Degree"), text("department", "Department"), text("academic_year", "Academic year"),
    text("start_year", "Start year"), text("end_year", "Graduation year"), toggle("is_current", "Currently studying"), text("cgpa", "CGPA"),
    area("description", "Description"), list("coursework", "Coursework"), list("achievements", "Achievements"), list("certifications", "Certifications"), status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0, is_current: false, coursework: [], achievements: [], certifications: [] },
};

export const experienceConfig: CollectionConfig = {
  table: "experience", title: "Experience", eyebrow: "Journey", description: "Work, internships, volunteering, leadership and technical events.",
  titleKey: "position", secondaryKey: "organization", hasStatus: true, hasSort: true, addLabel: "Add experience",
  fields: [
    { name: "kind", label: "Experience type", type: "select", required: true, options: ["Internship", "Work", "Freelance", "Leadership", "Volunteering", "Workshop", "Technical Event", "Responsibility"] },
    text("organization", "Organization", true), text("position", "Position", true), date("start_date", "Start date"), date("end_date", "End date"),
    toggle("is_current", "Current role"), area("description", "Description"), list("responsibilities", "Responsibilities"), list("achievements", "Achievements"), list("technologies", "Technologies"), status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0, kind: "Work", is_current: false, responsibilities: [], achievements: [], technologies: [] },
};

export const codingProfileConfig: CollectionConfig = {
  table: "coding_profiles", title: "Coding profiles", eyebrow: "Problem solving", description: "Profile links and manually verified statistics only.",
  titleKey: "platform", secondaryKey: "username", hasStatus: true, hasSort: true, addLabel: "Add coding profile",
  fields: [
    text("platform", "Platform", true), text("display_name", "Display name"), text("username", "Username"), url("url", "Profile URL"),
    { name: "stats", label: "Verified statistics", type: "objects", keys: [{ name: "label", label: "Statistic" }, { name: "value", label: "Verified value" }] }, status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0, stats: [], display_name: "", username: "", url: "" },
};

export const achievementConfig: CollectionConfig = {
  table: "achievements", title: "Achievements", eyebrow: "Milestones", description: "Competitions, hackathons and accomplishments with optional evidence.",
  titleKey: "title", secondaryKey: "organization", hasStatus: true, hasSort: true, addLabel: "Add achievement",
  fields: [
    { name: "category", label: "Category", type: "select", required: true, options: ["Academic Achievements", "Coding Achievements", "Hackathons", "Workshops", "Online Courses", "Technical Competitions", "Project Accomplishments"] },
    text("title", "Achievement", true), text("organization", "Organization"), area("description", "Description"), date("achieved_on", "Date achieved"),
    media("image_path", "Certificate image", "achievements"), url("credential_url", "Credential URL"), status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0, category: "Academic Achievements", organization: "", description: "", credential_url: "" },
};

export const certificationConfig: CollectionConfig = {
  table: "certifications", title: "Certifications", eyebrow: "Milestones", description: "Technical certificates, issuer details, credential links and PDFs.",
  titleKey: "name", secondaryKey: "issuer", hasStatus: true, hasSort: true, addLabel: "Add certification",
  fields: [
    text("name", "Certification", true), text("issuer", "Issuer"), date("issue_date", "Issue date"), date("expiry_date", "Expiry date"),
    media("image_path", "Certificate image", "certifications"), media("pdf_path", "Certificate PDF", "certifications", "pdf"), url("credential_url", "Credential URL"), status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0, issuer: "", credential_url: "" },
};

export const resumeConfig: CollectionConfig = {
  table: "resume_versions", title: "Resume versions", eyebrow: "Documents", description: "Upload PDFs and keep one version active for the public download button.",
  titleKey: "version", secondaryKey: "file_name", addLabel: "Add resume version",
  fields: [
    media("file_path", "Resume PDF", "resume", "pdf"), text("file_name", "Download file name", true), text("version", "Version", true),
    area("note", "Version note"), { name: "size_bytes", label: "File size in bytes", type: "number" }, toggle("is_active", "Active public resume"),
  ],
  defaults: { is_active: false, note: "", size_bytes: 0 },
};

export const customSectionConfig: CollectionConfig = {
  table: "custom_sections", title: "Your own sections", eyebrow: "Custom content", description: "Create additional published sections and choose whether they appear in navigation.",
  titleKey: "title", secondaryKey: "slug", hasStatus: true, hasSort: true, addLabel: "Add section",
  fields: [
    { name: "slug", label: "Section ID", type: "slug", from: "title", required: true }, text("title", "Section title", true),
    text("name", "Section name"), text("eyebrow", "Eyebrow"), area("description", "Description"), text("icon", "Section icon"), text("category", "Section category"),
    { name: 'layout', label: 'Display layout', type: 'select', options: ['cards','editorial','timeline','gallery','grid'] }, media('image_path', 'Section image', 'sections'), toggle("show_in_nav", "Show in navigation"), status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0, show_in_nav: false, eyebrow: "", description: "", name: '', icon: '', category: '', layout: 'cards' },
};

export const customEntryConfig: CollectionConfig = {
  table: "custom_section_entries", title: "Section entries", eyebrow: "Custom content", description: "Entries inside your own sections. Attach your custom fields to each entry below.",
  titleKey: "title", secondaryKey: "section_id", hasStatus: true, hasSort: true, addLabel: "Add entry",
  fields: [
    { name: "section_id", label: "Section", type: "select", required: true, options: [] }, text("title", "Entry title", true), status, sort,
  ],
  defaults: { status: NEW_ITEM_STATUS, sort_order: 0 },
};

export const fieldDefinitionConfig: CollectionConfig = {
  table: "custom_field_definitions", title: "Field definitions", eyebrow: "Custom content", description: "Define extra fields for portfolio content or entries in your own sections.",
  titleKey: "label", secondaryKey: "key", hasStatus: true, hasSort: true, addLabel: "Add field",
  fields: [
    { name: "target", label: "Attach to", type: "select", required: true, options: [...CUSTOM_TARGETS, { value: "section", label: "Custom section entry" }] },
    { name: "section_id", label: "Custom section (only for section fields)", type: "select", options: [] },
    { name: "label", label: "Field label", type: "text", required: true }, { name: "key", label: "Field key", type: "key", from: "label", required: true },
    text('name', 'Field name'), { name: "field_type", label: "Field type", type: "select", required: true, options: CUSTOM_FIELD_TYPES },
    { name: 'display_style', label: 'Public display style', type: 'select', options: [{value:'label',label:'Label and value'},{value:'paragraph',label:'Paragraph'},{value:'link',label:'Link'},{value:'badge',label:'Badge'},{value:'image',label:'Image'},{value:'document',label:'Downloadable document'}] },
    { name: 'display_location', label: 'Display location', type: 'select', options: [{value:'both',label:'Card and detail page'},{value:'card',label:'Inside existing card'},{value:'detail',label:'Detail page only'}] }, status,
    text("placeholder", "Placeholder"), area("description", "Help text"), toggle("required", "Required"), toggle("is_public", "Show publicly"),
    { name: "default_value", label: "Default value (JSON)", type: "json", help: 'Examples: "Text", true, 42, or ["One", "Two"].' },
    { name: "validation", label: "Validation rules (JSON object)", type: "json" },
    { name: "options", label: "Select options (JSON array)", type: "json", help: 'Example: [{"value":"one","label":"One"}].' }, sort,
  ],
  defaults: { target: "project", section_id: null, field_type: "text", required: false, is_public: true, validation: {}, options: [], sort_order: 0, placeholder: "", description: "", name: '', status: 'draft', display_style: 'label', display_location: 'both' },
};

export const fieldValueConfig: CollectionConfig = {
  table: "custom_field_values", title: "Field values", eyebrow: "Custom content", description: "Advanced JSON editor for custom field values. Entity IDs must match the content item being described.",
  titleKey: "entity_id", secondaryKey: "field_id", hasStatus: true, hasSort: false, addLabel: "Add field value",
  fields: [
    { name: "field_id", label: "Field", type: "select", required: true, options: [] }, text("entity_id", "Entity ID", true),
    { name: "value", label: "Value (JSON)", type: "json", required: true }, status,
  ],
  defaults: { entity_id: "", value: "" },
};

export const adminHead = (title: string) => () => ({
  meta: [
    { title: `${title} — Admin · Lohit Rajan S` },
    { name: "description", content: `Private portfolio admin: ${title}.` },
    { property: "og:title", content: `${title} — Admin · Lohit Rajan S` },
    { property: "og:description", content: `Private portfolio admin: ${title}.` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ],
});
