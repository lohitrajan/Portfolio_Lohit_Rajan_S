import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Copy, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteRows, duplicateValues as duplicateRow, insertRow, listQuery, moveRows, updateRow, updateRows } from "@/lib/admin/editor-db";
import type { CollectionConfig } from "@/lib/admin/config";
import { cleanValues, NEW_ITEM_STATUS, validateValues, type FieldDef, type Values } from "@/lib/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormMessage } from "./AuthFrame";
import { supabase } from "@/integrations/supabase/client";
import { dynamicErrors, dynamicInput, dynamicPayload, dynamicTargets, type DynamicDefinition } from "@/lib/admin/dynamic-fields";
import { FormFields, PageHeader, Panel, StatusPill } from "./fields";

export type FieldOptions = Record<string, readonly (string | { value: string; label: string })[]>;

export function CollectionEditor({ config, fieldOptions = {}, heading }: {
  config: CollectionConfig;
  fieldOptions?: FieldOptions;
  heading?: boolean;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const order = config.hasSort === false ? "created_at" : "sort_order";
  const { data: rows = [], isLoading, error } = useQuery(listQuery(config.table, order));
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Values>({});
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");
  const [customLoading, setCustomLoading] = useState(false);
  const [customLoadError, setCustomLoadError] = useState("");

  const target = dynamicTargets[config.table];
  const { data: allDefs = [], isLoading: definitionsLoading, error: definitionsError } = useQuery({
    queryKey: ["admin", "custom_field_definitions", "for", target],
    enabled: !!target,
    queryFn: async () => {
      if (!target) return [];
      const { data, error } = await supabase.from("custom_field_definitions").select("*").eq("target", target).neq("status", "archived").order("sort_order");
      if (error) throw error;
      return data as DynamicDefinition[];
    },
  });
  const defs = useMemo(() => allDefs.filter((d) => !d.section_id || d.section_id === draft["section_id"]), [allDefs, draft]);
  const customFields = useMemo(() => defs.map(dynamicInput), [defs]);

  async function loadCustomValues(entityId: string | null) {
    if (!target || !entityId) return {};
    const { data, error } = await supabase.from("custom_field_values").select("*").eq("entity_id", entityId);
    if (error) throw error;
    return Object.fromEntries((data ?? []).flatMap((v) => [[`custom_${v.field_id}`, v.value], [`visibility_${v.field_id}`, v.status === "draft" ? "draft" : "published"]]));
  }

  const fields = useMemo(() => config.fields.map((field) => {
    const options = fieldOptions[field.name];
    return options ? { ...field, options } : field;
  }), [config.fields, fieldOptions]);

  const visibleRows = useMemo(() => rows.filter((row) => {
    if (visibility !== "all" && row["status"] !== visibility) return false;
    const haystack = [row[config.titleKey], config.secondaryKey ? row[config.secondaryKey] : ""].join(" ").toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  }), [rows, visibility, query, config.titleKey, config.secondaryKey]);

  useEffect(() => {
    if (!selectedId) return;
    const row = rows.find((item) => item.id === selectedId);
    if (row && !open) setDraft(row);
  }, [rows, selectedId, open]);

  function startAdd() {
    setCustomLoading(false);
    setCustomLoadError("");
    setSelectedId(null);
    setDraft({
      ...config.defaults,
      ...(config.hasStatus ? { status: NEW_ITEM_STATUS } : {}),
      ...(config.hasSort === false ? {} : { sort_order: rows.length }),
    });
    setErrors({});
    setSaveError("");
    setOpen(true);
  }

  async function startEdit(row: Values) {
    setCustomLoading(true);
    setCustomLoadError("");
    setSelectedId(String(row["id"]));
    setDraft(row);
    setErrors({});
    setSaveError("");
    setOpen(true);
    try {
      const extra = await loadCustomValues(String(row["id"]));
      setDraft((d) => d["id"] === row["id"] ? { ...d, ...extra } : d);
    } catch {
      setCustomLoadError("Custom field values couldn't be loaded. Reopen this item to try again.");
    } finally {
      setCustomLoading(false);
    }
  }

  async function refresh(message: string) {
    await queryClient.invalidateQueries({ queryKey: ["admin"] });
    await queryClient.invalidateQueries({ queryKey: ["portfolio-preview"] });
    await router.invalidate();
    toast.success(message);
  }

  async function save() {
    if (customLoading || definitionsLoading || definitionsError || customLoadError) return;
    setSaveError("");
    const nextErrors = { ...validateValues(fields, draft), ...dynamicErrors(defs, draft, draft["status"] === "published") };
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      const cleaned = cleanValues(fields, draft);
      const saved = selectedId
        ? await updateRow(config.table, selectedId, cleaned)
        : await insertRow(config.table, cleaned);
      // Keep the new ID even if a later field save fails, so retry updates rather than duplicates.
      setSelectedId(String(saved.id));
      setDraft((current) => ({ ...current, ...saved }));
      if (defs.length) {
        const entityId = String(saved.id);
        const payload = dynamicPayload(defs, draft);
        const keep = payload.filter((p) => p.value !== null).map((p) => ({ ...p, entity_id: entityId }));
        const drop = payload.filter((p) => p.value === null).map((p) => p.field_id);
        if (keep.length) {
          const { error } = await supabase.from("custom_field_values").upsert(keep as never, { onConflict: "field_id,entity_id" });
          if (error) throw error;
        }
        if (drop.length) {
          const { error } = await supabase.from("custom_field_values").delete().eq("entity_id", entityId).in("field_id", drop);
          if (error) throw error;
        }
      }
      setSelectedId(String(saved.id));
      setDraft(saved);
      await refresh(selectedId ? "Changes saved." : "Item created as a draft.");
      setOpen(false);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "The item couldn't be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: Values) {
    const label = String(row[config.titleKey] || "this item");
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteRows(config.table, [String(row["id"])]);
      if (selectedId === row["id"]) setOpen(false);
      await refresh("Item deleted.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  async function duplicate(row: Values) {
    setBusy(true);
    try {
      const copy = duplicateRow(row, { titleKey: config.titleKey, hasStatus: !!config.hasStatus, sortOrder: rows.length });
      await insertRow(config.table, copy);
      await refresh("Copy created as a draft.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Copy failed.");
    } finally {
      setBusy(false);
    }
  }

  async function reorder(row: Values, direction: -1 | 1) {
    const index = rows.findIndex((item) => item.id === row["id"]);
    const changes = moveRows(rows, index, direction);
    if (!changes.length) return;
    setBusy(true);
    try {
      await updateRows(config.table, changes);
      await queryClient.invalidateQueries({ queryKey: ["admin", config.table] });
      toast.success("Order updated.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Couldn't change the order.");
    } finally {
      setBusy(false);
    }
  }

  const list = (
    <Panel>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search {config.title}</span>
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${config.title.toLowerCase()}…`} className="pl-9" />
        </label>
        {config.hasStatus ? (
          <select aria-label="Filter by visibility" className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="all">All visibility</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
          </select>
        ) : null}
      </div>
      {isLoading ? <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading…</div> : null}
      {error ? <FormMessage tone="error">{error.message}</FormMessage> : null}
      {!isLoading && !error && visibleRows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
          <p className="text-sm font-medium">{rows.length ? "No matching items" : "Nothing added yet"}</p>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length ? "Try another search or visibility filter." : `Use “${config.addLabel ?? "Add item"}” to get started.`}</p>
        </div>
      ) : null}
      <ul className="divide-y divide-border">
        {visibleRows.map((row) => (
          <li key={String(row["id"])} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
            <button type="button" onClick={() => startEdit(row)} className="min-w-0 flex-1 text-left">
              <span className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-medium">{String(row[config.titleKey] || "Untitled")}</span>
                {typeof row.status === "string" ? <StatusPill status={row.status} /> : null}
                {row.is_active === true ? <StatusPill status="active" /> : null}
              </span>
              {config.secondaryKey ? <span className="mt-1 block truncate text-xs text-muted-foreground">{String(row[config.secondaryKey] || "No additional detail")}</span> : null}
            </button>
            <div className="flex shrink-0 items-center gap-1">
              {config.hasSort !== false ? <>
                <Button type="button" size="icon" variant="ghost" disabled={busy || rows[0]?.id === row["id"]} onClick={() => void reorder(row, -1)} aria-label={`Move ${String(row[config.titleKey])} up`}><ArrowUp /></Button>
                <Button type="button" size="icon" variant="ghost" disabled={busy || rows.at(-1)?.id === row["id"]} onClick={() => void reorder(row, 1)} aria-label={`Move ${String(row[config.titleKey])} down`}><ArrowDown /></Button>
              </> : null}
              <Button type="button" size="icon" variant="ghost" onClick={() => startEdit(row)} aria-label={`Edit ${String(row[config.titleKey])}`}><Pencil /></Button>
              <Button type="button" size="icon" variant="ghost" disabled={busy} onClick={() => void duplicate(row)} aria-label={`Duplicate ${String(row[config.titleKey])}`}><Copy /></Button>
              <Button type="button" size="icon" variant="ghost" disabled={busy} onClick={() => void remove(row)} aria-label={`Delete ${String(row[config.titleKey])}`}><Trash2 /></Button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );

  return (
    <div>
      {heading !== false ? <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} actions={<Button variant="ink" onClick={startAdd}><Plus />{config.addLabel ?? "Add item"}</Button>} /> : (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-medium">{config.title}</h2><p className="mt-1 text-sm text-muted-foreground">{config.description}</p></div><Button variant="line" onClick={startAdd}><Plus />{config.addLabel ?? "Add item"}</Button></div>
      )}
      {list}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto p-5 sm:p-7">
          <DialogHeader>
            <DialogTitle>{selectedId ? `Edit ${String(draft[config.titleKey] || config.title)}` : (config.addLabel ?? "Add item")}</DialogTitle>
            <DialogDescription>{config.hasStatus ? "New content stays hidden until you choose Published." : "Complete the fields and save your changes."}</DialogDescription>
          </DialogHeader>
          {saveError ? <FormMessage tone="error">{saveError}</FormMessage> : null}
          {definitionsError || customLoadError ? <FormMessage tone="error">{customLoadError || "Custom fields couldn't be loaded. Reopen this item to try again."}</FormMessage> : null}
          <FormFields fields={fields as FieldDef[]} values={draft} errors={errors} onChange={(name, value) => setDraft((current) => ({ ...current, [name]: value }))} />
          {customLoading || definitionsLoading ? <p role="status" className="mt-4 text-sm text-muted-foreground">Loading custom fields…</p> : null}
          {customFields.length ? (
            <section className="mt-6 border-t border-border pt-5" aria-labelledby="custom-fields-heading">
              <h3 id="custom-fields-heading" className="text-sm font-medium">Custom fields</h3>
              <p className="mt-1 text-xs text-muted-foreground">Shown on the site using its existing styles. Empty fields stay hidden.</p>
              <div className="mt-4 space-y-5">
                {defs.map((d) => (
                  <div key={d.id} className="rounded-xl border border-border p-4">
                    <FormFields fields={[dynamicInput(d)]} values={draft} errors={errors} onChange={(name, value) => setDraft((current) => ({ ...current, [name]: value }))} />
                    <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">Value visibility
                      <select aria-label={`${d.label} visibility`} className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground" value={String(draft[`visibility_${d.id}`] ?? "published")} onChange={(e) => setDraft((c) => ({ ...c, [`visibility_${d.id}`]: e.target.value }))}>
                        <option value="published">Published</option><option value="draft">Draft</option>
                      </select>
                      {d.status === "draft" ? <span>(field itself is a draft)</span> : null}
                    </label>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          <div className="sticky bottom-0 -mx-1 flex justify-end gap-2 bg-background px-1 pb-1 pt-5">
            <Button type="button" variant="line" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
            <Button type="button" variant="ink" onClick={() => void save()} disabled={busy || customLoading || definitionsLoading || !!definitionsError || !!customLoadError}>{busy ? <Loader2 className="animate-spin" /> : null}{selectedId ? "Save changes" : "Create item"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
