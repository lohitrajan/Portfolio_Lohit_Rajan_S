import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { singletonQuery, upsertSingleton } from "@/lib/admin/db";
import type { SingletonConfig } from "@/lib/admin/config";
import { cleanValues, validateValues, type Values } from "@/lib/admin/forms";
import { Button } from "@/components/ui/button";
import { FormMessage } from "./AuthFrame";
import { FormFields, PageHeader, Panel } from "./fields";

export function SingletonEditor({ config }: { config: SingletonConfig }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading, error } = useQuery(singletonQuery(config.table));
  const [values, setValues] = useState<Values>(config.defaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!isLoading) setValues({ ...config.defaults, ...(data ?? {}) });
  }, [data, isLoading, config.defaults]);

  async function save() {
    const nextErrors = validateValues(config.fields, values);
    setErrors(nextErrors);
    setSaveError("");
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      const saved = await upsertSingleton(config.table, cleanValues(config.fields, values));
      setValues(saved);
      setDirty(false);
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      await queryClient.invalidateQueries({ queryKey: ["portfolio-preview"] });
      await router.invalidate();
      toast.success("Changes saved. The public portfolio has been refreshed.");
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Changes couldn't be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} actions={
        <Button variant="ink" onClick={() => void save()} disabled={busy || isLoading || (!dirty && !!data)}>{busy ? <Loader2 className="animate-spin" /> : <Save />}Save changes</Button>
      } />
      {error ? <FormMessage tone="error">{error.message}</FormMessage> : null}
      {saveError ? <div className="mb-4"><FormMessage tone="error">{saveError}</FormMessage></div> : null}
      <Panel>
        {isLoading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading current content…</div> : (
          <FormFields fields={config.fields} values={values} errors={errors} onChange={(name, value) => { setValues((current) => ({ ...current, [name]: value })); setDirty(true); }} />
        )}
      </Panel>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">{dirty ? "You have unsaved changes." : data ? "Everything is saved." : "Save to initialize this section with the current portfolio content."}</p>
        <Button variant="ink" onClick={() => void save()} disabled={busy || isLoading || (!dirty && !!data)}>{busy ? <Loader2 className="animate-spin" /> : <Save />}Save changes</Button>
      </div>
    </div>
  );
}
