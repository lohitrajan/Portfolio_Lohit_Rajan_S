import { createFileRoute } from "@tanstack/react-router";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { adminHead, settingsConfig } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/settings")({ head: adminHead("Site settings"), component: () => <SingletonEditor config={settingsConfig} /> });
