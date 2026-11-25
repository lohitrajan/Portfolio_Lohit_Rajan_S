import { createFileRoute } from "@tanstack/react-router";
import { CodingProfilesPage } from "@/components/admin/CollectionPages";
import { adminHead } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/coding-profiles")({ head: adminHead("Coding profiles"), component: CodingProfilesPage });
