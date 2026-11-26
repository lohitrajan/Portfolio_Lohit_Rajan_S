import { Github, Linkedin, Mail } from "lucide-react";
import type { SocialPlatform } from "@/content";

export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  if (platform === "github") return <Github className={className} aria-hidden />;
  if (platform === "linkedin") return <Linkedin className={className} aria-hidden />;
  return <Mail className={className} aria-hidden />;
}
