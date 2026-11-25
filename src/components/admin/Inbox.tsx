import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteRows, listQuery, updateRow } from "@/lib/admin/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormMessage } from "./AuthFrame";
import { PageHeader, Panel, StatusPill } from "./fields";

export function Inbox() {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading, error } = useQuery(listQuery("contact_messages", "created_at"));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const selected = messages.find((m) => m.id === selectedId) ?? null;
  const filtered = useMemo(() => messages.filter((m) => {
    if (filter !== "all" && m.status !== filter) return false;
    return [m.name, m.email, m.subject, m.message].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [messages, filter, query]);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin", "contact_messages"] });
  }

  async function open(id: string) {
    setSelectedId(id);
    const message = messages.find((m) => m.id === id);
    if (message?.status === "unread") {
      await updateRow("contact_messages", id, { status: "read" });
      await refresh();
    }
  }

  async function setStatus(status: string) {
    if (!selectedId) return;
    setBusy(true);
    try {
      await updateRow("contact_messages", selectedId, { status });
      await refresh();
      toast.success(status === "archived" ? "Message archived." : "Message marked as read.");
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Couldn't update the message."); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!selectedId || !window.confirm("Delete this message permanently?")) return;
    setBusy(true);
    try {
      await deleteRows("contact_messages", [selectedId]);
      setSelectedId(null);
      await refresh();
      toast.success("Message deleted.");
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Couldn't delete the message."); }
    finally { setBusy(false); }
  }

  return <div>
    <PageHeader eyebrow="Contact" title="Inbox" description="Messages sent through the portfolio contact form. Opening an unread message marks it as read." />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]">
      <Panel>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <Input aria-label="Search messages" placeholder="Search messages…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select aria-label="Filter messages" className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All messages</option><option value="unread">Unread</option><option value="read">Read</option><option value="archived">Archived</option>
          </select>
        </div>
        {isLoading ? <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading messages…</p> : null}
        {error ? <FormMessage tone="error">{error.message}</FormMessage> : null}
        {!isLoading && filtered.length === 0 ? <div className="rounded-xl border border-dashed border-border py-12 text-center"><Mail className="mx-auto size-6 text-muted-foreground" /><p className="mt-3 text-sm font-medium">No messages here</p><p className="mt-1 text-sm text-muted-foreground">New contact-form submissions will appear here.</p></div> : null}
        <ul className="divide-y divide-border">
          {filtered.map((m) => <li key={String(m.id)}>
            <button type="button" onClick={() => void open(String(m.id))} className="flex w-full items-start gap-3 py-4 text-left">
              <span className="mt-0.5 text-muted-foreground">{m.status === "unread" ? <Mail className="size-4" /> : <MailOpen className="size-4" />}</span>
              <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className={m.status === "unread" ? "text-sm font-semibold" : "text-sm font-medium"}>{String(m.name)}</span>{typeof m.status === "string" ? <StatusPill status={m.status} /> : null}</span><span className="mt-1 block truncate text-sm">{String(m.subject)}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{String(m.email)} · {m.created_at ? new Date(String(m.created_at)).toLocaleString() : ""}</span></span>
            </button>
          </li>)}
        </ul>
      </Panel>
      <Panel title={selected ? String(selected.subject) : "Message details"} description={selected ? `${String(selected.name)} · ${String(selected.email)}` : "Choose a message to read it."}>
        {selected ? <div>
          <p className="whitespace-pre-wrap text-sm leading-7">{String(selected.message)}</p>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
            <Button asChild variant="ink" size="sm"><a href={`mailto:${String(selected.email)}?subject=Re: ${String(selected.subject)}`}>Reply by email</a></Button>
            <Button variant="line" size="sm" disabled={busy} onClick={() => void setStatus("read")}><MailOpen />Mark read</Button>
            <Button variant="line" size="sm" disabled={busy} onClick={() => void setStatus("archived")}><Archive />Archive</Button>
            <Button variant="ghost" size="sm" disabled={busy} onClick={() => void remove()}><Trash2 />Delete</Button>
          </div>
        </div> : <p className="py-16 text-center text-sm text-muted-foreground">No message selected.</p>}
      </Panel>
    </div>
  </div>;
}
