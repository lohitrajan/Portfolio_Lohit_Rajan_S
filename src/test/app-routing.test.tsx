import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each([
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/admin/setup",
    "/admin/dashboard",
    "/admin/profile",
    "/admin/about",
    "/admin/settings",
    "/admin/skills",
    "/admin/projects",
    "/admin/education",
    "/admin/experience",
    "/admin/coding-profiles",
    "/admin/achievements",
    "/admin/certifications",
    "/admin/resume",
    "/admin/inbox",
    "/admin/sections",
    "/admin/fields",
  ])("matches the admin page %s", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.pathname).toBe(path);
  });
});
