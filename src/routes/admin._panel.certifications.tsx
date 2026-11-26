import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { adminHead, certificationConfig } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/certifications")({ head: adminHead("Certifications"), component: () => <CollectionEditor config={certificationConfig} /> });
