import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, LoaderCircle, Send, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePortfolio } from "@/hooks/use-portfolio";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { submitContactMessage } from "@/lib/contact.functions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import { SocialIcon } from "./SocialIcon";
import { Reveal } from "./motion";

type Status = { state: "idle" } | { state: "sent" } | { state: "error"; message: string };

const fieldClass =
  "peer w-full rounded-none border-0 border-b border-border bg-transparent px-0 pb-3 pt-6 text-lg text-foreground outline-none transition-colors placeholder:text-transparent focus:border-foreground focus-visible:outline-none aria-[invalid=true]:border-destructive";

function FloatingField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-6 origin-left text-lg text-muted-foreground transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Contact() {
  const c = usePortfolio();
  const { profile } = c;
  const send = useServerFn(submitContactMessage);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ state: "idle" });
    try {
      const result = await send({ data: values });
      if (result.ok) {
        setStatus({ state: "sent" });
        reset();
      } else {
        setStatus({ state: "error", message: result.error });
      }
    } catch {
      setStatus({ state: "error", message: "Your message couldn't be sent. Please check your connection and try again." });
    }
  });

  const channels = [
    ...(profile.email
      ? [{ platform: "email" as const, label: "Email", value: profile.email, url: `mailto:${profile.email}` }]
      : [{ platform: "email" as const, label: "Email", value: "Use the form — address coming soon", url: "" }]),
    ...profile.socials.map((s) => ({
      platform: s.platform,
      label: s.label,
      value: s.url ? s.url.replace(/^https?:\/\/(www\.)?/, "") : "Link coming soon",
      url: s.url,
    })),
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading index="11" eyebrow="Contact" title="Have an Idea? Let's Build It." />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
              I'm always interested in connecting with people, exploring opportunities and building meaningful technology projects.
            </p>
          </Reveal>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {channels.map((c) => (
              <li key={c.label}>
                {c.url ? (
                  <a
                    href={c.url}
                    target={c.platform === "email" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group flex items-center gap-4 py-5"
                  >
                    <SocialIcon platform={c.platform} className="size-5" />
                    <span className="w-24 text-sm text-muted-foreground">{c.label}</span>
                    <span className="flex-1 truncate text-foreground">{c.value}</span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </a>
                ) : (
                  <div className="flex items-center gap-4 py-5 text-muted-foreground">
                    <SocialIcon platform={c.platform} className="size-5" />
                    <span className="w-24 text-sm">{c.label}</span>
                    <span className="flex-1 truncate text-sm">{c.value}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            noValidate
            className="relative rounded-[1.75rem] border border-border bg-card p-6 sm:p-10"
            aria-describedby="contact-status"
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <FloatingField id="name" label="Your name" error={errors.name?.message}>
                <input
                  id="name"
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name")}
                />
              </FloatingField>
              <FloatingField id="email" label="Email address" error={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className={fieldClass}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
              </FloatingField>
            </div>
            <div className="mt-8">
              <FloatingField id="subject" label="Subject" error={errors.subject?.message}>
                <input
                  id="subject"
                  placeholder="Subject"
                  className={fieldClass}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  {...register("subject")}
                />
              </FloatingField>
            </div>
            <div className="mt-8">
              <FloatingField id="message" label="Tell me about your idea" error={errors.message?.message}>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about your idea"
                  className={cn(fieldClass, "resize-none")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  {...register("message")}
                />
              </FloatingField>
            </div>

            {/* Honeypot: hidden from people, tempting for bots */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <label htmlFor="website">Website</label>
              <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div id="contact-status" aria-live="polite" className="min-h-6 text-sm">
                <AnimatePresence mode="wait">
                  {status.state === "sent" ? (
                    <motion.p
                      key="sent"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-foreground"
                    >
                      <span className="flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Check className="size-3" aria-hidden />
                      </span>
                      Message delivered — thank you! I'll get back to you soon.
                    </motion.p>
                  ) : status.state === "error" ? (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-destructive"
                    >
                      <TriangleAlert className="size-4" aria-hidden />
                      {status.message}
                    </motion.p>
                  ) : isSubmitting ? (
                    <motion.p key="sending" className="text-muted-foreground">
                      Sending your message…
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
              <Button type="submit" variant="ink" size="xl" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    Sending <LoaderCircle className="animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message <Send />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
