import { useRef, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, FileText, ImageIcon, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mediaUrlQuery, uploadMedia } from "@/lib/admin/db";
import { fieldKeyFrom, slugify, type FieldDef, type MediaKind, type ObjectKey, type Values } from "@/lib/admin/forms";

export const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const optionPairs = (options: FieldDef["options"]) =>
  (options ?? []).map((o) => (typeof o === "string" ? { value: o, label: o } : o));

export function FieldShell({
  id,
  label,
  help,
  error,
  required,
  children,
  wide,
}: {
  id: string;
  label: string;
  help?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
  wide?: boolean | undefined;
}) {
  return (
    <div className={cn("space-y-1.5", wide && "sm:col-span-2")}>
      <Label htmlFor={id} className="text-[13px]">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : help ? (
        <p className="text-xs text-muted-foreground">{help}</p>
      ) : null}
    </div>
  );
}

/** One line per item, so lists stay fast to edit and paste. */
export function ListInput({
  id,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  id: string;
  value: unknown;
  onChange: (v: string[]) => void;
  rows?: number;
  placeholder?: string | undefined;
}) {
  const items = Array.isArray(value) ? (value as string[]) : [];
  return (
    <Textarea
      id={id}
      rows={rows}
      value={items.join("\n")}
      placeholder={placeholder ?? "One item per line"}
      onChange={(e) => onChange(e.target.value.split("\n"))}
    />
  );
}

export function MediaInput({
  id,
  value,
  onChange,
  kind,
  folder,
  label,
}: {
  id: string;
  value: string | null | undefined;
  onChange: (path: string | null, fileName?: string) => void;
  kind: MediaKind;
  folder: string;
  label: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { data: url } = useQuery(mediaUrlQuery(value));
  const isPdf = kind === "pdf" || (value ?? "").toLowerCase().endsWith(".pdf");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const path = await uploadMedia(file, folder, kind);
      onChange(path, file.name);
      toast.success("Uploaded. Save to keep the change.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5">
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        {value && url && !isPdf ? (
          <img src={url} alt="" className="size-full object-cover" />
        ) : value && isPdf ? (
          <FileText className="size-6 text-muted-foreground" aria-hidden />
        ) : (
          <ImageIcon className="size-6 text-muted-foreground" aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">
          {value ? (value.startsWith("asset:") ? "Built-in image" : (value.split("/").pop() ?? value)) : "Nothing uploaded"}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <input
            ref={ref}
            id={id}
            type="file"
            className="sr-only"
            aria-label={`Upload ${label}`}
            accept={kind === "image" ? "image/*" : kind === "pdf" ? "application/pdf" : "image/*,application/pdf"}
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => ref.current?.click()}>
            {busy ? <Loader2 className="animate-spin" /> : <Upload />}
            {value ? "Replace" : "Upload"}
          </Button>
          {value && url ? (
            <Button type="button" size="sm" variant="ghost" asChild>
              <a href={url} target="_blank" rel="noreferrer">
                Open
              </a>
            </Button>
          ) : null}
          {value ? (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
              <X /> Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ObjectKeyInput({
  k,
  id,
  value,
  onChange,
  folder,
}: {
  k: ObjectKey;
  id: string;
  value: unknown;
  onChange: (v: unknown) => void;
  folder: string;
}) {
  switch (k.type) {
    case "readonly":
      return <p className="py-2 font-mono text-xs text-muted-foreground">{String(value ?? "")}</p>;
    case "switch":
      return <Switch id={id} checked={value !== false} onCheckedChange={onChange} />;
    case "textarea":
      return <Textarea id={id} rows={2} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
    case "list":
      return <ListInput id={id} rows={3} value={value} onChange={onChange} />;
    case "media":
      return (
        <MediaInput id={id} label={k.label} kind={k.kind ?? "image"} folder={folder} value={value as string} onChange={(p) => onChange(p ?? "")} />
      );
    default:
      return <Input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  }
}

export function ObjectListInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown[]) => void }) {
  const rows = (Array.isArray(value) ? value : []) as Record<string, unknown>[];
  const keys = field.keys ?? [];
  const update = (i: number, name: string, v: unknown) => onChange(rows.map((r, j) => (j === i ? { ...r, [name]: v } : r)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...rows];
    const [item] = next.splice(i, 1);
    if (!item) return;
    next.splice(i + d, 0, item);
    onChange(next);
  };
  const inline = keys.every((k) => !k.type || k.type === "text" || k.type === "switch" || k.type === "readonly");

  return (
    <div className="space-y-2">
      {rows.length === 0 ? <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">Nothing added yet.</p> : null}
      {rows.map((row, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-3">
          <div className={cn("grid gap-3", inline ? "sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]" : "")}>
            {keys.map((k) => (
              <div key={k.name} className="space-y-1">
                <Label htmlFor={`${field.name}-${i}-${k.name}`} className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {k.label}
                </Label>
                <ObjectKeyInput
                  k={k}
                  id={`${field.name}-${i}-${k.name}`}
                  value={row[k.name]}
                  folder={field.folder ?? "misc"}
                  onChange={(v) => update(i, k.name, v)}
                />
              </div>
            ))}
          </div>
          {!field.fixed || rows.length > 1 ? (
            <div className="mt-2 flex justify-end gap-1">
              <Button type="button" size="icon" variant="ghost" className="size-7" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                <ArrowUp />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="size-7" disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                <ArrowDown />
              </Button>
              {!field.fixed ? (
                <Button type="button" size="icon" variant="ghost" className="size-7" onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label="Remove row">
                  <Trash2 />
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
      {!field.fixed ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...rows, Object.fromEntries(keys.map((k) => [k.name, k.type === "list" ? [] : k.type === "switch" ? true : ""]))])}
        >
          <Plus /> Add
        </Button>
      ) : null}
    </div>
  );
}

export function FieldInput({
  field,
  values,
  onChange,
  error,
  idPrefix = "f",
}: {
  field: FieldDef;
  values: Values;
  onChange: (name: string, value: unknown) => void;
  error?: string | undefined;
  idPrefix?: string;
}) {
  const id = `${idPrefix}-${field.name}`;
  const value = values[field.name];
  const set = (v: unknown) => onChange(field.name, v);
  const wide = field.wide ?? ["textarea", "list", "objects", "media"].includes(field.type);

  let input: ReactNode;
  switch (field.type) {
    case 'attachment': {
      const attachment = value && typeof value === 'object' ? value as { path?: string; name?: string } : {};
      input = <MediaInput id={id} label={field.label} kind={field.kind ?? 'file'} folder={field.folder ?? 'custom'} value={attachment.path} onChange={(path, name) => set(path ? { path, name: name ?? attachment.name ?? field.label } : null)} />;
      break;
    }
    case 'date_range': case 'icon_label': {
      const record = value && typeof value === 'object' ? value as Record<string, string> : {};
      const keys = field.type === 'date_range' ? ['start', 'end'] : ['icon', 'label'];
      input = <div className="flex gap-2">{keys.map(k => <Input key={k} aria-label={`${field.label} ${k}`} type={field.type === 'date_range' ? 'date' : 'text'} placeholder={k} value={record[k] ?? ''} onChange={e => set({ ...record, [k]: e.target.value })} />)}</div>;
      break;
    }
    case 'multiselect': {
      const selected = Array.isArray(value) ? value : [];
      input = <div className="space-y-2">{optionPairs(field.options).map(o => <label key={o.value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(o.value)} onChange={e => set(e.target.checked ? [...selected, o.value] : selected.filter(v => v !== o.value))} />{o.label}</label>)}</div>;
      break;
    }
    case "textarea":
      input = <Textarea id={id} rows={field.rows ?? 4} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => set(e.target.value)} />;
      break;
    case "json":
      input = (
        <Textarea
          id={id}
          rows={field.rows ?? 4}
          className="font-mono text-xs"
          value={typeof value === "string" ? value : JSON.stringify(value ?? null, null, 2)}
          placeholder={field.placeholder ?? "null"}
          onChange={(e) => set(e.target.value)}
        />
      );
      break;
    case "list":
      input = <ListInput id={id} rows={field.rows ?? 4} value={value} placeholder={field.placeholder} onChange={set} />;
      break;
    case "switch":
      input = (
        <div className="flex h-9 items-center">
          <Switch id={id} checked={value === true} onCheckedChange={set} />
        </div>
      );
      break;
    case "select":
      input = (
        <select id={id} className={selectClass} value={String(value ?? "")} onChange={(e) => set(e.target.value)}>
          {optionPairs(field.options).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "media":
      input = <MediaInput id={id} label={field.label} kind={field.kind ?? "image"} folder={field.folder ?? "misc"} value={value as string | null} onChange={(p) => set(p)} />;
      break;
    case "objects":
      input = <ObjectListInput field={field} value={value} onChange={set} />;
      break;
    case "slug":
    case "key": {
      const source = field.from ? String(values[field.from] ?? "") : "";
      input = (
        <div className="flex gap-2">
          <Input id={id} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => set(e.target.value)} className="font-mono text-xs" />
          {field.from ? (
            <Button type="button" variant="outline" size="sm" className="h-9" disabled={!source} onClick={() => set(field.type === "slug" ? slugify(source) : fieldKeyFrom(source))}>
              Generate
            </Button>
          ) : null}
        </div>
      );
      break;
    }
    default:
      input = (
        <Input
          id={id}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          value={value === null || value === undefined ? "" : String(value)}
          placeholder={field.placeholder ?? (field.type === "url" ? "https://" : undefined)}
          maxLength={field.maxLength}
          onChange={(e) => set(e.target.value)}
        />
      );
  }

  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} required={field.required} wide={wide}>
      {input}
    </FieldShell>
  );
}

export function FormFields({
  fields,
  values,
  onChange,
  errors,
  idPrefix,
}: {
  fields: FieldDef[];
  values: Values;
  onChange: (name: string, value: unknown) => void;
  errors: Record<string, string>;
  idPrefix?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} values={values} onChange={onChange} error={errors[f.name]} {...(idPrefix ? { idPrefix } : {})} />
      ))}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "published"
      ? "bg-accent text-accent-foreground"
      : status === "archived"
        ? "bg-secondary text-muted-foreground line-through decoration-1"
        : "border border-border bg-background text-muted-foreground";
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", tone)}>{status}</span>;
}

export function Panel({ title, description, children, actions }: { title?: string; description?: ReactNode; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      {title || actions ? (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-base font-medium">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
