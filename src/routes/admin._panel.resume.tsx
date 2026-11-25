import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { adminHead, resumeConfig } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/resume")({ head: adminHead("Resume"), component: () => <CollectionEditor config={resumeConfig} /> });
