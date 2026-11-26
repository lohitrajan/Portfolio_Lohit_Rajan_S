import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { adminHead, educationConfig } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/education")({ head: adminHead("Education"), component: () => <CollectionEditor config={educationConfig} /> });
