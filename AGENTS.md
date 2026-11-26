## Project rules

- All portfolio content lives in `src/content/*` typed by `src/content/types.ts`; components only render it. Why: content must stay editable and later move behind an admin dashboard without touching UI.
- Empty strings/arrays in content mean "not confirmed": UI hides the field or shows a neutral "coming soon" state, never invented values. Why: the portfolio must never display fabricated facts.
- Home page is one route with section anchors (`#about`, `#projects`, …) navigated via `SectionLink`; each project case study is its own route at `/projects/$slug`. Why: smooth single-page browsing plus shareable, indexable project pages.
- Contact form posts through the `submitContactMessage` server function into the `contact_messages` table (RLS on, no public policies, service role only). Why: real delivery status without exposing messages publicly.
- Shared shell (scenic backdrop, canvas, nav, footer, terminal, loader) is rendered in `src/routes/__root.tsx`. Why: identical frame on every page.
- Draft field previews use the verified admin client for both field reads and media signing; preview cache is refreshed after edits and cleared on sign-out. Why: drafts must render privately without stale values or broken attachments.
- Empty public headings use neutral copy from typed content, independently of unpublished personal facts and collection entries. Why: incomplete admin setup must not leave the introduction blank or invent accomplishments.
- Shared text reveals must render readable text before hydration; animate movement without hiding text behind opacity or masks. Why: delayed or unavailable animation must not make portfolio content invisible.
