import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Lohit Rajan S" },
      { name: "description", content: "Private content dashboard for Lohit Rajan S's portfolio." },
      { property: "og:title", content: "Admin — Lohit Rajan S" },
      { property: "og:description", content: "Private content dashboard for Lohit Rajan S's portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Outlet,
});
