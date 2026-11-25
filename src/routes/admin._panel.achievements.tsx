import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { adminHead, achievementConfig } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/achievements")({ head: adminHead("Achievements"), component: () => <CollectionEditor config={achievementConfig} /> });
