import { useEffect } from "react";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { setDraftPreview, useDraftPreview } from "@/hooks/use-portfolio";
import { Button } from "@/components/ui/button";

/** Shown only while an admin previews draft custom fields; `?preview=drafts` turns it on. */
export function DraftPreviewBar() {
  const on = useDraftPreview();
  const queryClient = useQueryClient();
  const loading = useIsFetching({ queryKey: ["portfolio-preview"] }) > 0;
  const error = useSyncExternalStore(
    (listener) => queryClient.getQueryCache().subscribe(listener),
    () => queryClient.getQueryState(["portfolio-preview"])?.error ?? null,
    () => null,
  );
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "drafts") {
      setDraftPreview(true);
      params.delete("preview");
      const q = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (q ? `?${q}` : "") + window.location.hash);
    }
  }, []);
  if (!on) return null;
  return (
    <div role="status" className="fixed bottom-4 left-1/2 z-[120] flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-xl border border-border bg-background px-4 py-2 text-sm shadow-lg">
      <span className="min-w-0">{error ? "Draft preview unavailable. Check your admin sign-in." : loading ? "Loading draft preview…" : "Previewing draft fields"}</span>
      <Button size="sm" variant="line" className="shrink-0" onClick={() => { setDraftPreview(false); queryClient.removeQueries({ queryKey: ["portfolio-preview"] }); }}>Exit preview</Button>
    </div>
  );
}
