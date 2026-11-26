import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(255) });

/** The same answer whatever happened, so the page never reveals which addresses are approved. */
const GENERIC = {
  ok: true as const,
  message: "If this address is approved for admin access, an email with a secure link is on its way.",
};

function siteOrigin(): string {
  const request = getRequest();
  // The request URL is same-site; never trust a caller-supplied Origin for an auth redirect.
  return request ? new URL(request.url).origin : "";
}

/**
 * Sends the approved administrator a link to set (or reset) their password.
 * First time: an invitation that creates the account. Afterwards: a password-reset link.
 * Only addresses on the admin allowlist are ever emailed.
 */
export const requestAdminSetup = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const redirectTo = `${siteOrigin()}/admin/reset-password`;

    const { data: allowed, error: allowError } = await supabaseAdmin
      .from("admin_allowlist")
      .select("email")
      .eq("email", data.email)
      .maybeSingle();
    if (allowError) {
      console.error("admin setup: allowlist check failed", allowError.message);
      return { ok: false as const, message: "The setup service is unavailable right now. Please try again shortly." };
    }
    if (!allowed) return GENERIC;

    const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) {
      console.error("admin setup: user lookup failed", listError.message);
      return { ok: false as const, message: "The setup service is unavailable right now. Please try again shortly." };
    }
    const existing = list.users.find((u) => (u.email ?? "").toLowerCase() === data.email);

    const result =
      existing && existing.email_confirmed_at
        ? await supabaseAdmin.auth.resetPasswordForEmail(data.email, { redirectTo })
        : await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, { redirectTo });

    if (result.error) {
      console.error("admin setup: email failed", result.error.message);
      if (/rate limit|too many/i.test(result.error.message)) {
        return { ok: false as const, message: "Too many emails were requested. Please wait a few minutes and try again." };
      }
      return { ok: false as const, message: "The email couldn't be sent right now. Please try again shortly." };
    }
    return GENERIC;
  });
