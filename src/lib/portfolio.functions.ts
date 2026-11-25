import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { staticContent } from "@/content/static";
import type { PortfolioContent } from "@/content/types";
import { collectMediaPaths, makeResolver, mapPortfolio, type PortfolioRows } from "./portfolio-mapper";

const MEDIA_BUCKET = "portfolio-media";
const SIGNED_URL_SECONDS = 60 * 60 * 24;

/**
 * Public read of everything the portfolio shows. Uses the publishable key, so the database's
 * row-level security only returns published content. Falls back to the built-in content on failure.
 */
export const getPortfolioContent = createServerFn({ method: "GET" }).handler(() => loadPortfolio(null));

/** Admin-only: the published site plus draft custom fields, for previewing before publishing. */
export const getPreviewContent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortfolioContent> => {
    const { data: admin } = await context.supabase.rpc("is_admin");
    if (!admin) throw new Error("Only admins can preview drafts.");
    return loadPortfolio(context.supabase);
  });

type Db = ReturnType<typeof createClient<Database>>;

async function loadPortfolio(adminDb: Db | null): Promise<PortfolioContent> {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return staticContent;

  const db = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  try {
    const q = <T,>(p: PromiseLike<{ data: T[] | null; error: { message: string } | null }>) =>
      Promise.resolve(p).then((r) => {
        if (r.error) throw new Error(r.error.message);
        return r.data ?? [];
      });

    const [
      profile, about, settings, skillCategories, skills, projects, projectSections, projectImages,
      education, experience, achievements, certifications, codingProfiles, resume,
      customSections, customEntries, fieldDefinitions, fieldValues,
    ] = await Promise.all([
      q(db.from("portfolio_profile").select("*")),
      q(db.from("portfolio_about").select("*")),
      q(db.from("site_settings").select("*")),
      q(db.from("skill_categories").select("*")),
      q(db.from("skills").select("*")),
      q(db.from("projects").select("*")),
      q(db.from("project_sections").select("*")),
      q(db.from("project_images").select("*")),
      q(db.from("education").select("*")),
      q(db.from("experience").select("*")),
      q(db.from("achievements").select("*")),
      q(db.from("certifications").select("*")),
      q(db.from("coding_profiles").select("*")),
      q(db.from("resume_versions").select("*")),
      q(db.from("custom_sections").select("*")),
      q(db.from("custom_section_entries").select("*")),
      q((adminDb ?? db).from("custom_field_definitions").select("*")),
      q((adminDb ?? db).from("custom_field_values").select("*")),
    ]);

    const rows: PortfolioRows = {
      profile: profile[0] ?? null,
      about: about[0] ?? null,
      settings: settings[0] ?? null,
      skillCategories, skills, projects, projectSections, projectImages, education, experience,
      achievements, certifications, codingProfiles, resume, customSections, customEntries,
      fieldDefinitions, fieldValues, previewDrafts: !!adminDb,
    };

    const paths = [...collectMediaPaths(rows)];
    const signed: Record<string, string> = {};
    if (paths.length) {
      const { data } = await (adminDb ?? db).storage.from(MEDIA_BUCKET).createSignedUrls(paths, SIGNED_URL_SECONDS);
      // Signed URLs must point at the browser-facing address of the backend.
      const browserBase = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) ?? url;
      for (const item of data ?? []) {
        if (item.path && item.signedUrl) signed[item.path] = item.signedUrl.replace(url, browserBase);
      }
    }

    return mapPortfolio(rows, makeResolver(signed));
  } catch (error) {
    if (adminDb) throw new Error("Draft preview couldn't be loaded. Please try again.");
    console.error("[portfolio] falling back to built-in content:", error);
    return staticContent;
  }
}
