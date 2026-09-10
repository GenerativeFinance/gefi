# Jekyll deprecated for product development

As of the platform migration (`platform/`), **do not add new Jekyll pages, Liquid layouts, or Ruby build steps for GeFi product surfaces**.

| Surface | Old | New |
|---------|-----|-----|
| Marketing / catalogue | Root Jekyll | `platform/apps/web` (Next.js) |
| App dashboards | `/app/` Jekyll previews | `platform/apps/web` routes |
| Control API | Mock + D1 Workers (transitional) | `platform/apps/api` → Workers deploy path |
| FL / privacy | TS stubs in `infrastructure/cloudflare/packages/federation` | `platform/services/*` |

The root Jekyll site may remain temporarily for Cloudflare Pages continuity until DNS cutover. Treat `_models/*.md` as a **content source to port**, not as the live catalogue implementation.
