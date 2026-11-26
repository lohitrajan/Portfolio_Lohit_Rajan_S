import { createFileRoute } from "@tanstack/react-router";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { adminHead, aboutConfig } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/about")({ head: adminHead("About"), component: () => <SingletonEditor config={aboutConfig} /> });
