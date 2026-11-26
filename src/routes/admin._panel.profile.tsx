import { createFileRoute } from "@tanstack/react-router";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { adminHead, profileConfig } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/profile")({ head: adminHead("Profile"), component: () => <SingletonEditor config={profileConfig} /> });
