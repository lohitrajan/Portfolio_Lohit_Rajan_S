import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { staticContent } from "@/content/static";
import type { PortfolioContent } from "@/content/types";
import { getPreviewContent } from "@/lib/portfolio.functions";

const KEY = "portfolio-preview-drafts";
const listeners = new Set<() => void>();
export function setDraftPreview(on: boolean) {
  if (on) sessionStorage.setItem(KEY, "1"); else sessionStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}
/** Whether an admin turned on draft preview in this tab (always false during SSR). */
export function useDraftPreview(): boolean {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => sessionStorage.getItem(KEY) === "1",
    () => false,
  );
}

/** Published portfolio content from the root loader; draft custom fields too while an admin previews. */
export function usePortfolio(): PortfolioContent {
  const data = useRouterState({ select: (s) => s.matches[0]?.loaderData }) as PortfolioContent | undefined;
  const preview = useDraftPreview();
  const { data: draft } = useQuery({ queryKey: ["portfolio-preview"], queryFn: () => getPreviewContent(), enabled: preview, retry: false });
  return (preview && draft) || data || staticContent;
}
