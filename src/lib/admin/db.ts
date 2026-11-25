import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { bundledAsset } from "@/content/assets";

/**
 * Admin data access. Runs in the browser as the signed-in user, so every read and write is
 * checked by the database's row-level security (only an account with the admin role passes).
 */
export type AdminTable = keyof Database["public"]["Tables"];
export interface Row {
  [key: string]: unknown;
  id?: string | boolean;
  status?: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  created_at?: string;
  is_active?: boolean;
  version?: string;
  file_name?: string;
  summary?: string;
  action?: string;
  entity_type?: string;
  label?: string;
  title?: string;
  target?: string;
}

export const MEDIA_BUCKET = "portfolio-media";

/** Untyped table handle for the generic editors; rows are validated by the forms and the database. */
export function table(name: AdminTable) {
  return supabase.from(name as "projects") as unknown as {
    select: (cols?: string) => any;
    insert: (values: Row | Row[]) => any;
    update: (values: Row) => any;
    upsert: (values: Row | Row[], opts?: { onConflict?: string }) => any;
    delete: () => any;
  };
}

export class AdminError extends Error {}

function unwrap<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new AdminError(friendlyError(res.error.message));
  return res.data;
}

/** Translates database messages into something readable in the dashboard. */
export function friendlyError(message: string): string {
  if (/duplicate key.*slug/i.test(message)) return "That URL name (slug) is already used by another item.";
  if (/duplicate key/i.test(message)) return "An item with the same unique value already exists.";
  if (/violates check constraint.*url/i.test(message)) return "Links must start with https://";
  if (/violates check constraint.*email/i.test(message)) return "Please enter a valid email address.";
  if (/violates check constraint.*slug/i.test(message)) return "URL names may only use lowercase letters, numbers and single dashes.";
  if (/violates check constraint.*key/i.test(message)) return "Field keys must start with a letter and use lowercase letters, numbers or underscores.";
  if (/violates check constraint/i.test(message)) return "One of the values isn't allowed. Check required fields and formats.";
  if (/row-level security|permission denied|not authori[sz]ed/i.test(message)) return "Your session doesn't have admin access. Sign in again.";
  if (/JWT|session/i.test(message)) return "Your session expired. Sign in again.";
  return message;
}

export const listQuery = (name: AdminTable, order = "sort_order") =>
  queryOptions({
    queryKey: ["admin", name],
    queryFn: async () => {
      const q = table(name).select("*");
      const res = order ? await q.order(order, { ascending: order === "sort_order" }) : await q;
      return (unwrap(res) ?? []) as Row[];
    },
  });

export const singletonQuery = (name: AdminTable) =>
  queryOptions({
    queryKey: ["admin", name],
    queryFn: async () => {
      const res = await table(name).select("*").limit(1);
      return ((unwrap(res) as Row[] | null)?.[0] ?? null) as Row | null;
    },
  });

export async function insertRow(name: AdminTable, values: Row): Promise<Row> {
  const res = await table(name).insert(values).select("*").single();
  return unwrap(res) as Row;
}

export async function updateRow(name: AdminTable, id: string | boolean, values: Row): Promise<Row> {
  const res = await table(name).update(values).eq("id", id).select("*").single();
  return unwrap(res) as Row;
}

export async function upsertSingleton(name: AdminTable, values: Row): Promise<Row> {
  const res = await table(name).upsert({ ...values, id: true }).select("*").single();
  return unwrap(res) as Row;
}

export async function deleteRows(name: AdminTable, ids: string[]): Promise<void> {
  if (!ids.length) return;
  unwrap(await table(name).delete().in("id", ids));
}

export async function updateRows(name: AdminTable, ids: string[], values: Row): Promise<void> {
  if (!ids.length) return;
  unwrap(await table(name).update(values).in("id", ids));
}

/* ---------- Media ---------- */

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const PDF_TYPES = ["application/pdf"];
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

import type { MediaKind } from "./forms";
export type { MediaKind };

export function validateUpload(file: File, kind: MediaKind): string | null {
  if (file.size > MAX_UPLOAD_BYTES) return "Files must be 20 MB or smaller.";
  if (kind === "image" && !IMAGE_TYPES.includes(file.type)) return "Please choose a JPG, PNG, WebP, GIF or AVIF image.";
  if (kind === "pdf" && !PDF_TYPES.includes(file.type)) return "Please choose a PDF file.";
  if (kind === "file" && ![...IMAGE_TYPES, ...PDF_TYPES].includes(file.type)) return "Please choose an image or a PDF.";
  return null;
}

export async function uploadMedia(file: File, folder: string, kind: MediaKind): Promise<string> {
  const problem = validateUpload(file, kind);
  if (problem) throw new AdminError(problem);
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-").slice(-80);
  const path = `${folder}/${crypto.randomUUID()}-${safe}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
    cacheControl: "3600",
  });
  if (error) throw new AdminError(friendlyError(error.message));
  return path;
}

export async function removeMedia(paths: (string | null | undefined)[]): Promise<void> {
  const real = paths.filter((p): p is string => !!p && !p.startsWith("asset:") && !/^https?:\/\//.test(p));
  if (real.length) await supabase.storage.from(MEDIA_BUCKET).remove(real);
}

export const mediaUrlQuery = (path: string | null | undefined) =>
  queryOptions({
    queryKey: ["admin-media", path ?? ""],
    staleTime: 30 * 60_000,
    queryFn: async () => {
      if (!path) return "";
      const bundled = bundledAsset(path);
      if (bundled) return bundled;
      if (/^https?:\/\//.test(path)) return path;
      const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(path, 60 * 60);
      if (error) return "";
      return data.signedUrl;
    },
  });

export { slugify } from "./forms";
