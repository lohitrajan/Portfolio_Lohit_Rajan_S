import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { adminHead, experienceConfig } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/experience")({ head: adminHead("Experience"), component: () => <CollectionEditor config={experienceConfig} /> });
