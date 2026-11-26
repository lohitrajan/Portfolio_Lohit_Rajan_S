import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "@/components/admin/Inbox";
import { adminHead } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/inbox")({ head: adminHead("Inbox"), component: Inbox });
