import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./contact-schema";

export type ContactResult = { ok: true } | { ok: false; error: string };

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }): Promise<ContactResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Light abuse protection: max 3 messages per email address every 10 minutes.
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", since);
    if (countError) {
      console.error("contact rate check failed", countError.message);
      return { ok: false, error: "The message service is unavailable right now. Please try again shortly." };
    }
    if ((count ?? 0) >= 3) {
      return { ok: false, error: "You've sent several messages recently. Please wait a few minutes and try again." };
    }

    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
    if (error) {
      console.error("contact insert failed", error.message);
      return { ok: false, error: "Your message couldn't be delivered. Please try again." };
    }
    return { ok: true };
  });
