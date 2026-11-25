<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- All portfolio content lives in `src/content/*` typed by `src/content/types.ts`; components only render it. Why: content must stay editable and later move behind an admin dashboard without touching UI.
- Empty strings/arrays in content mean "not confirmed": UI hides the field or shows a neutral "coming soon" state, never invented values. Why: the portfolio must never display fabricated facts.
- Home page is one route with section anchors (`#about`, `#projects`, …) navigated via `SectionLink`; each project case study is its own route at `/projects/$slug`. Why: smooth single-page browsing plus shareable, indexable project pages.
- Contact form posts through the `submitContactMessage` server function into the `contact_messages` table (RLS on, no public policies, service role only). Why: real delivery status without exposing messages publicly.
- Shared shell (scenic backdrop, canvas, nav, footer, terminal, loader) is rendered in `src/routes/__root.tsx`. Why: identical frame on every page.
- Draft field previews use the verified admin client for both field reads and media signing; preview cache is refreshed after edits and cleared on sign-out. Why: drafts must render privately without stale values or broken attachments.
- Empty public headings use neutral copy from typed content, independently of unpublished personal facts and collection entries. Why: incomplete admin setup must not leave the introduction blank or invent accomplishments.
- Shared text reveals must render readable text before hydration; animate movement without hiding text behind opacity or masks. Why: delayed or unavailable animation must not make portfolio content invisible.
