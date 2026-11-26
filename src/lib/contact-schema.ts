import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be under 255 characters"),
  subject: z.string().trim().min(1, "Please add a subject").max(150, "Subject must be under 150 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  /** Honeypot — real visitors never see or fill this. */
  website: z.string().max(0),
});

export type ContactInput = z.input<typeof contactSchema>;
