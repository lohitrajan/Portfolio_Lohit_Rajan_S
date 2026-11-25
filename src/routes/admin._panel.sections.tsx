import { createFileRoute } from "@tanstack/react-router";
import { SectionsPage } from "@/components/admin/CollectionPages";
import { adminHead } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/sections")({ head: adminHead("Your sections"), component: SectionsPage });
