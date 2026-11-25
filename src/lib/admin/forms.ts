import type { Json } from "@/integrations/supabase/types";

/**
 * Pure form rules for the admin dashboard: field definitions, validation that mirrors the
 * database constraints, and cleaning before save. Kept free of React so it can be tested.
 */
export type MediaKind = "image" | "pdf" | "file";

export type ObjectKey = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "list" | "switch" | "media" | "readonly";
  kind?: MediaKind;
};

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "number"
  | "date"
  | "list"
  | "switch"
  | "select"
  | "slug"
  | "key"
  | "media"
  | "objects"
  | "json" | "attachment" | "date_range" | "icon_label" | "multiselect";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  maxLength?: number;
  options?: readonly (string | { value: string; label: string })[];
  /** media */
  kind?: MediaKind;
  folder?: string;
  /** objects */
  keys?: ObjectKey[];
  /** objects: fixed number of rows (no add/remove) */
  fixed?: boolean;
  /** slug / key: field the value is generated from */
  from?: string;
  wide?: boolean;
  rows?: number;
}

export type Values = Record<string, unknown>;

export const HTTPS_URL = /^https:\/\/[^\s]+$/;
export const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const FIELD_KEY = /^[a-z][a-z0-9_]{0,48}$/;

export const CONTENT_STATUSES = ["draft", "published", "archived"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

/** New items start as drafts so nothing appears publicly until it is deliberately published. */
export const NEW_ITEM_STATUS: ContentStatus = "draft";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function fieldKeyFrom(label: string): string {
  const base = label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const key = /^[a-z]/.test(base) ? base : `f_${base}`;
  return key.slice(0, 49).replace(/_+$/g, "") || "field";
}

const isBlank = (v: unknown) =>
  v === null || v === undefined || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0);

export function validateField(field: FieldDef, value: unknown): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  if (field.type === "list") {
    const items = Array.isArray(value) ? value.filter((x) => typeof x === "string" && x.trim()) : [];
    if (field.required && !items.length) return `${field.label} needs at least one item.`;
    return null;
  }
  if (field.required && (field.type === "switch" ? false : isBlank(value))) return `${field.label} is required.`;
  if (field.maxLength && text.length > field.maxLength) return `${field.label} must be ${field.maxLength} characters or fewer.`;
  switch (field.type) {
    case "url":
      return text && !HTTPS_URL.test(text) ? "Links must start with https://" : null;
    case "email":
      return text && !EMAIL.test(text) ? "Please enter a valid email address." : null;
    case "slug":
      return text && !SLUG.test(text) ? "Use lowercase letters, numbers and single dashes only." : null;
    case "key":
      return text && !FIELD_KEY.test(text)
        ? "Start with a letter; use lowercase letters, numbers or underscores (max 49)."
        : null;
    case "number":
      return value !== "" && value !== null && value !== undefined && !Number.isFinite(Number(value))
        ? `${field.label} must be a number.`
        : null;
    case "json":
      if (isBlank(value)) return null;
      if (typeof value !== "string") return null;
      try {
        JSON.parse(value);
        return null;
      } catch {
        return `${field.label} must be valid JSON.`;
      }
    default:
      return null;
  }
}

export function validateValues(fields: FieldDef[], values: Values): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const problem = validateField(f, values[f.name]);
    if (problem) errors[f.name] = problem;
  }
  return errors;
}

const cleanList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x.trim() : "")).filter(Boolean) : [];

/** Trims text, drops empty list items and empty object rows, turns empty dates into null. */
export function cleanValues(fields: FieldDef[], values: Values): Values {
  const out: Values = {};
  for (const f of fields) {
    const v = values[f.name];
    switch (f.type) {
      case "list":
        out[f.name] = cleanList(v);
        break;
      case "switch":
        out[f.name] = v === true;
        break;
      case "date":
        out[f.name] = typeof v === "string" && v.trim() ? v.trim() : null;
        break;
      case "number":
        out[f.name] = v === "" || v === null || v === undefined ? null : Number(v);
        break;
      case "select":
        out[f.name] = typeof v === "string" && v.trim() ? v.trim() : null;
        break;
      case "media":
        out[f.name] = typeof v === "string" && v ? v : null;
        break;
      case "json": {
        if (Array.isArray(v)) out[f.name] = v as Json;
        else if (isBlank(v)) out[f.name] = null;
        else if (typeof v === "string") out[f.name] = JSON.parse(v) as Json;
        else out[f.name] = (v ?? null) as Json;
        break;
      }
      case "objects": {
        const rows = Array.isArray(v) ? v : [];
        out[f.name] = rows
          .map((row) => {
            const r: Record<string, unknown> = {};
            for (const k of f.keys ?? []) {
              const x = (row as Record<string, unknown>)?.[k.name];
              if (k.type === "list") r[k.name] = cleanList(x);
              else if (k.type === "switch") r[k.name] = x !== false;
              else r[k.name] = typeof x === "string" ? x.trim() : "";
            }
            return r;
          })
          .filter(
            (r) =>
              f.fixed ||
              (f.keys ?? []).some((k) => k.type !== "switch" && !isBlank(r[k.name])),
          );
        break;
      }
      default:
        out[f.name] = typeof v === "string" ? v.trim() : (v ?? "");
    }
  }
  return out;
}

/** Reorders by moving one item and returns only the rows whose position changed. */
export function moveItem<T extends { id: string; sort_order: number }>(
  rows: T[],
  index: number,
  direction: -1 | 1,
): { id: string; sort_order: number }[] {
  const target = index + direction;
  if (target < 0 || target >= rows.length) return [];
  const next = [...rows];
  const [item] = next.splice(index, 1);
  if (!item) return [];
  next.splice(target, 0, item);
  return next
    .map((r, i) => ({ id: r.id, sort_order: i, changed: r.sort_order !== i }))
    .filter((r) => r.changed)
    .map(({ id, sort_order }) => ({ id, sort_order }));
}

/** Copy of a row ready to insert: new id, marked as a copy, unique slug, saved as draft. */
export function duplicateValues(row: Values, opts: { titleKey: string; hasStatus: boolean; sortOrder: number }): Values {
  const { id: _id, created_at: _c, updated_at: _u, ...rest } = row;
  const copy: Values = { ...rest, sort_order: opts.sortOrder };
  const title = typeof row[opts.titleKey] === "string" ? (row[opts.titleKey] as string) : "";
  if (title) copy[opts.titleKey] = `${title} (copy)`.slice(0, 160);
  if (typeof row["slug"] === "string") copy["slug"] = `${row["slug"]}-copy-${Math.random().toString(36).slice(2, 6)}`.slice(0, 80);
  if (typeof row["key"] === "string") copy["key"] = `${row["key"]}_copy`.slice(0, 49);
  if (opts.hasStatus) copy["status"] = NEW_ITEM_STATUS;
  if ("is_active" in row) copy["is_active"] = false;
  return copy;
}

/** Only same-site admin paths are allowed as a post-login destination. */
export function safeAdminRedirect(target: unknown): string {
  if (typeof target !== "string") return "/admin/dashboard";
  let path = target;
  try {
    if (/^https?:\/\//i.test(target)) {
      const url = new URL(target);
      if (typeof window === "undefined" || url.origin !== window.location.origin) return "/admin/dashboard";
      path = url.pathname + url.search;
    }
  } catch {
    return "/admin/dashboard";
  }
  if (!path.startsWith("/admin/") || path.startsWith("//") || path.includes("\\")) return "/admin/dashboard";
  if (/^\/admin\/(login|setup|forgot-password|reset-password)/.test(path)) return "/admin/dashboard";
  return path;
}

/* ---------- Custom field values ---------- */

export const CUSTOM_FIELD_TYPES = [
  "text",
  "textarea",
  "richtext",
  "number",
  "email",
  "phone",
  "url",
  "date",
  "date_range",
  "boolean",
  "select",
  "multiselect",
  "image",
  "pdf",
  "file",
  "repeater",
  "video", "profile_link", "icon_label", "reference",
] as const;
export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number];

export const CUSTOM_TARGETS = [
  { value: "profile", label: "Profile" },
  { value: "about", label: "About" },
  { value: "project", label: "Projects" },
  { value: "education", label: "Education" },
  { value: "experience", label: "Experience" },
  { value: "achievement", label: "Achievements" },
  { value: "certification", label: "Certifications" },
] as const;
export type CustomTarget = (typeof CUSTOM_TARGETS)[number]["value"] | "section";

/** Converts what the admin typed into the stored value; null means "nothing to store". */
export function toFieldValue(type: string, raw: unknown): Json | null {
  switch (type) {
    case "boolean":
      return typeof raw === "boolean" ? raw : null;
    case "number": {
      if (raw === "" || raw === null || raw === undefined) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    }
    case "repeater": {
      if (!Array.isArray(raw)) return null;
      const items = raw.map(r => typeof r === 'string' ? r.trim() : r && typeof r === 'object' ? { label: String(r.label ?? '').trim(), value: String(r.value ?? '').trim() } : '').filter(r => typeof r === 'string' ? r : r.label || r.value);
      return items.length ? items : null;
    }
    case "date_range": case "icon_label": {
      if (!raw || typeof raw !== 'object') return null;
      const r = raw as Record<string, unknown>;
      const keys = type === 'date_range' ? ['start', 'end'] : ['icon', 'label'];
      const result = Object.fromEntries(keys.map(k => [k, String(r[k] ?? '').trim()]));
      return Object.values(result).some(Boolean) ? result : null;
    }
    case "multiselect": {
      const items = cleanList(raw);
      return items.length ? items : null;
    }
    case "image":
    case "pdf":
    case "file": {
      const r = raw as { path?: unknown; name?: unknown } | null;
      return r && typeof r.path === "string" && r.path
        ? { path: r.path, name: typeof r.name === "string" ? r.name : "" }
        : null;
    }
    default:
      return typeof raw === "string" && raw.trim() ? raw.trim() : null;
  }
}

export function validateFieldValue(
  def: { label: string; field_type: string; required: boolean; validation?: unknown; options?: unknown },
  raw: unknown,
): string | null {
  const value = toFieldValue(def.field_type, raw);
  if (value === null) {
    if (def.field_type === "number" && raw !== "" && raw !== null && raw !== undefined) return `${def.label} must be a number.`;
    return def.required ? `${def.label} is required.` : null;
  }
  if (["url", "video", "reference", "profile_link"].includes(def.field_type) && typeof value === "string" && !HTTPS_URL.test(value)) return "Links must start with https://";
  if (def.field_type === "email" && typeof value === "string" && !EMAIL.test(value)) return "Please enter a valid email address.";
  if (def.field_type === 'phone' && typeof value === 'string' && !/^\+?[0-9 ()-]{5,30}$/.test(value)) return 'Please enter a valid phone number.';
  if (def.field_type === 'date' && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)))) return 'Please enter a valid date.';
  if (def.field_type === 'date_range') {
    const r = value as Record<string, string>;
    if (!r["start"] || !r["end"] || !Number.isFinite(Date.parse(r["start"])) || !Number.isFinite(Date.parse(r["end"])) || r["start"] > r["end"]) return 'Choose a start date and an end date in chronological order.';
  }
  const rules = def.validation && typeof def.validation === 'object' ? def.validation as Record<string, number> : {};
  if (typeof value === 'string' && rules["maxLength"] !== undefined && value.length > rules["maxLength"]) return `${def.label} is too long.`;
  if (typeof value === 'string' && rules["minLength"] !== undefined && value.length < rules["minLength"]) return `${def.label} is too short.`;
  if (typeof value === 'number' && rules["min"] !== undefined && value < rules["min"]) return `${def.label} is below the minimum.`;
  if (typeof value === 'number' && rules["max"] !== undefined && value > rules["max"]) return `${def.label} exceeds the maximum.`;
  if (['select', 'multiselect'].includes(def.field_type) && Array.isArray(def.options)) {
    const allowed = def.options.map(o => typeof o === 'string' ? o : o?.value);
    if ((Array.isArray(value) ? value : [value]).some(v => !allowed.includes(v))) return 'Choose a configured option.';
  }
  return null;
}
