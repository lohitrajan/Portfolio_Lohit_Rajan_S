import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, FileText, FolderKanban, Inbox, Loader2 } from "lucide-react";
import { listQuery } from "@/lib/admin/db";
import { adminHead } from "@/lib/admin/config";
import { PageHeader, Panel, StatusPill } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/_panel/dashboard")({
  head: adminHead("Dashboard"),
  component: DashboardPage,
});

function DashboardPage() {
  const { adminEmail } = Route.useRouteContext();
  const projects = useQuery(listQuery("projects"));
  const messages = useQuery(listQuery("contact_messages", "created_at"));
  const activity = useQuery(listQuery("activity_log", "created_at"));
  const resume = useQuery(listQuery("resume_versions", "created_at"));
  const unread = (messages.data ?? []).filter((m) => m.status === "unread").length;
  const published = (projects.data ?? []).filter((p) => p.status === "published").length;
  const activeResume = (resume.data ?? []).find((r) => r.is_active === true);
  const cards = [
    { label: "Published projects", value: projects.data ? String(published) : "—", note: `${projects.data?.length ?? 0} total`, to: "/admin/projects", icon: FolderKanban },
    { label: "Unread messages", value: messages.data ? String(unread) : "—", note: `${messages.data?.length ?? 0} total`, to: "/admin/inbox", icon: Inbox },
    { label: "Active resume", value: activeResume ? String(activeResume.version) : "None", note: activeResume ? String(activeResume.file_name) : "Upload a PDF", to: "/admin/resume", icon: FileText },
  ];
  return <div>
    <PageHeader eyebrow="Overview" title="Good to see you, Lohit." description={`Signed in as ${adminEmail}. Manage every public portfolio section from here.`} actions={<Button asChild variant="line"><Link to="/">View portfolio<ArrowUpRight /></Link></Button>} />
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ label, value, note, to, icon: Icon }) => <Link key={to} to={to} className="rounded-2xl border border-border bg-background p-5 shadow-soft transition-transform hover:-translate-y-0.5"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><Icon className="size-4 text-muted-foreground" /></div><p className="mt-5 truncate text-3xl font-medium tracking-tight">{value}</p><p className="mt-1 truncate text-xs text-muted-foreground">{note}</p></Link>)}
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <Panel title="Recent activity" description="Latest content changes recorded by the database.">
        {activity.isLoading ? <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading activity…</p> : null}
        {!activity.isLoading && !(activity.data ?? []).length ? <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">Your edits will appear here.</p> : null}
        <ul className="divide-y divide-border">{(activity.data ?? []).slice(0, 8).map((item) => <li key={String(item.id)} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"><div><p className="text-sm">{String(item.summary || `${item.action} ${item.entity_type}`)}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{String(item.action)} · {String(item.entity_type)}</p></div><time className="shrink-0 text-xs text-muted-foreground">{item.created_at ? new Date(String(item.created_at)).toLocaleDateString() : ""}</time></li>)}</ul>
      </Panel>
      <Panel title="Latest messages" description={unread ? `${unread} unread ${unread === 1 ? "message" : "messages"}.` : "Your inbox is up to date."} actions={<Button asChild size="sm" variant="ghost"><Link to="/admin/inbox">Open inbox</Link></Button>}>
        {messages.isLoading ? <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading…</p> : null}
        {!messages.isLoading && !(messages.data ?? []).length ? <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">No contact messages yet.</p> : null}
        <ul className="divide-y divide-border">{(messages.data ?? []).slice(0, 5).map((m) => <li key={String(m.id)} className="py-3 first:pt-0 last:pb-0"><div className="flex items-center gap-2"><p className="truncate text-sm font-medium">{String(m.name)}</p>{typeof m.status === "string" ? <StatusPill status={m.status} /> : null}</div><p className="mt-1 truncate text-sm">{String(m.subject)}</p><p className="mt-1 truncate text-xs text-muted-foreground">{String(m.email)}</p></li>)}</ul>
      </Panel>
    </div>
  </div>;
}
