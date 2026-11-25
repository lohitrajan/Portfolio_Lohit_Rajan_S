import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/admin/CollectionPages";
import { adminHead } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/projects")({ head: adminHead("Projects"), component: ProjectsPage });
