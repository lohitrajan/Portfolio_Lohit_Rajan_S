import { createFileRoute } from "@tanstack/react-router";
import { SkillsPage } from "@/components/admin/CollectionPages";
import { adminHead } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/skills")({ head: adminHead("Skills"), component: SkillsPage });
