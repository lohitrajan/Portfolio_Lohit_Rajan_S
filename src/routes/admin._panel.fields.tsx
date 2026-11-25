import { createFileRoute } from "@tanstack/react-router";
import { FieldsPage } from "@/components/admin/CollectionPages";
import { adminHead } from "@/lib/admin/config";
export const Route = createFileRoute("/admin/_panel/fields")({ head: adminHead("Custom fields"), component: FieldsPage });
