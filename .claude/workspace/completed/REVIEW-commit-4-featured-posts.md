# Code Review: Commit 4 — Featured posts on home with reading time

## VERDICT: PASS

## Files Reviewed

### Production
- `src/lib/content/application/use-cases/posts/GetFeaturedPosts.ts` (new)
- `components/bento/featured-posts-block.tsx` (new)
- `app/[locale]/page.tsx` (modified)
- `src/lib/content/infrastructure/Container.ts` (modified)
- `messages/es.json` (modified)
- `messages/en.json` (modified)

### Tests
- `tests/lib/content/application/use-cases/posts/GetFeaturedPosts.test.ts` (new, 8 cases)
- `tests/components/bento/featured-posts-block.test.tsx` (new, 6 cases)

## Verification

- `pnpm test` → **322 passed (322 total)**. 308 prior + 14 new (8 use case + 6 component).
- `pnpm type-check` → 27 errors, **all pre-existing** (verified with `git stash` baseline = 27). **0 new errors** introduced by commit 4.
- Use case logic matches the corrected semantics from the plan **exactly**:
  ```ts
  if (limit <= 0) return []
  const posts = await this.getAllPosts.execute(locale)
  return posts.filter((post) => post.featured === true).slice(0, limit)
  ```
  No `concat`, no `nonFeatured` fallback, no re-sort. Honest semantics: only featured.

## Issues Found

### Critical (MUST fix)
None.

### Important (SHOULD fix)
None.

### Suggestions (COULD improve)
- `components/bento/featured-posts-block.tsx:3` and `tests/components/bento/featured-posts-block.test.tsx:4` import `PostDto` via `@/src/lib/content/application/dto/PostDto` instead of the dedicated alias `@/content/application/dto/PostDto` already configured in `tsconfig.json`. Both forms resolve correctly (via `@/*` → `./*`), and the existing `featured-project-block.tsx` uses the same `@/src/lib/...` style, so this is not a regression — but a future cleanup commit could unify the imports across `components/bento/*` to use the `@/content/...` alias and shorten the paths.
- `app/[locale]/page.tsx:39-42`: the `parseStatValue` helper is declared inline inside the component. Not introduced in this commit, but if a future refactor extracts the hero-stats block, this could be hoisted to a `src/lib/` utility with explicit return type (already has one).
- `messages/{es,en}.json` still contain `home.latestArticle` and `home.previous` keys that are no longer referenced from any production code in this commit (the old `LatestArticleBlock` is no longer mounted on the home). The plan explicitly defers this cleanup; no action required here, but a follow-up `chore(i18n)` commit could remove them along with `components/bento/latest-article-block.tsx` if it is no longer used elsewhere.
- `tests/components/bento/featured-posts-block.test.tsx:100` uses `screen.queryByRole("listitem")` with `toBeInTheDocument()`. `getByRole("listitem")` would be more idiomatic when the element is expected to be present (queryBy is intended for "may or may not be in the DOM"). Pure style nit.

## Checklist Compliance

### TypeScript Quality
- [x] No `any` types in any of the new files (grep confirmed)
- [x] All functions have explicit return types (`Promise<Post[]>`, `React.ReactElement`, `string`)
- [x] `??` used (no new `||` for nullish; existing `??` preserved in Container and page)
- [x] Named exports across `src/lib/` (no default exports introduced)
- [x] `undefined` used semantically (e.g. `primaryTag !== undefined` for tag check)

### Architecture
- [x] Domain layer untouched
- [x] Use case `GetFeaturedPosts` depends only on `ContentRepository` interface (via composition of `GetAllPosts`)
- [x] No framework imports leaked into application layer
- [x] `Container.ts` is the only wiring point — adds `getFeaturedList` while preserving `getFeatured` singular intact (no regression on existing consumers)

### React / Next.js
- [x] `FeaturedPostsBlock` is a **Server Component** — no `"use client"` directive (grep confirmed)
- [x] Explicit `FeaturedPostsBlockProps` type with `posts`, `sectionLabel`, `readingTimeAriaLabel`
- [x] No `useEffect`, no `useState`, no client hooks (grep confirmed)
- [x] Tailwind only, no inline styles
- [x] Empty-state fallback (`<p>—</p>`) is rendered conditionally during render — no derived-state effect

### Testing
- [x] Use case test covers the 7 edge cases from the plan plus an additional explicit "preserve date desc order" case (8 total)
- [x] Critical edge cases covered:
  - No posts → `[]` (line 28)
  - No featured → `[]` (line 52, no fallback assertion)
  - Few featured + many non-featured → only featured (line 138, asserts unique slugs)
  - `limit=0` → `[]` (line 40)
  - `limit > total featured` → all featured only (line 105)
  - Featured > limit → most recent `limit` featured (line 64)
  - Order preserved by date desc (line 119)
- [x] Component test covers section label, empty fallback, link rendering, tag chip behavior (with/without), and screen-reader text — 6 cases
- [x] Test naming follows `describe("Class", () => { describe("method()", () => { it("should ...") }) })`
- [x] Mocks at `ContentRepository` interface level with `vi.fn().mockResolvedValue(...)`
- [x] No `any` in test files
- [x] Reuse of `mockMultiplePosts` / `mockFeaturedPost` fixtures + local `createRawPost` factory helper
- [x] Component test uses local `createPostDto` factory and `readingTimeAriaLabel` helper

### Code Quality
- [x] No comments explaining "what" the code does
- [x] No TODOs left in production code
- [x] No `as` assertions introduced (existing `locale as Locale` cast in the home page predates this commit)
- [x] No `process.env` access in component or use case

### Home Page Integration
- [x] `posts.getFeaturedList.execute(l, 4)` is called with literal `4` (matches plan)
- [x] `featuredPost`, `featuredPostDto`, `recentPosts` removed (no orphan variables)
- [x] `allPosts` retained only for `heroStats` (articles count) and `NavigationDock` (postsCount) — consistent with plan
- [x] `posts.getFeatured` singular is **not** invoked anymore from the home, but it still exists in `Container.ts` for retro-compat (matches plan decision)
- [x] `<FeaturedPostsBlock>` mounted in the same slot (`md:col-span-6`) where `<LatestArticleBlock>` previously lived

### i18n Parity
- [x] `home.featuredPosts.label` present in both `es.json` and `en.json`
- [x] `home.featuredPosts.readingTimeAria` present in both, with `{time}` ICU placeholder in both languages
- [x] No keys diverge between locales

### Container Wiring
- [x] Added `import { GetFeaturedPosts }` next to the existing `GetFeaturedPost` import
- [x] Added `getFeaturedList: new GetFeaturedPosts(contentRepository)` to the `posts` object
- [x] `getFeatured: new GetFeaturedPost(contentRepository)` preserved unchanged
- [x] `projects` and `talks` containers untouched

## What Went Well

- **Honest semantics**: the use case is named after what it actually does. `filter(featured === true).slice(0, limit)` — no hidden fallback, no surprise behavior. The earlier rejected "fill with non-featured" semantics has been completely scrubbed from the code, tests, and intent.
- **Defensive comparison**: `post.featured === true` correctly treats `undefined` as not-featured, avoiding `!!`/truthiness ambiguity. Matches the plan's note verbatim.
- **Order preservation**: by delegating sort to `GetAllPosts` and relying on `Array.prototype.filter`'s order-preserving behavior, the use case stays trivial. A dedicated test (line 119) locks this in.
- **Edge-case coverage above the bar**: the plan requested ≥5 cases; the implementation delivers 8 well-targeted cases including the explicit non-duplication assertion via `new Set(slugs).size`.
- **Component is genuinely a Server Component**: no client hooks, no `"use client"`. The callback-based `readingTimeAriaLabel` is invoked at render time on the server, which avoids coupling the component to `next-intl` while still allowing per-locale formatting.
- **Accessibility**: `aria-label` on the section, `sr-only` text wrapping the reading-time label, `aria-hidden` on decorative icons, `focus-visible` ring with the orange accent token. The plan-described a11y story is preserved end-to-end.
- **Conditional tag chip**: `{primaryTag !== undefined && ...}` is semantically more honest than the more common `tags[0] && ...`, since it avoids accidentally falsy-empty strings being treated as "no tag".
- **Empty state**: graceful "—" fallback covers both the "no featured posts in CMS yet" scenario and any future Notion outage.
- **Plan adherence**: the JSX classes, the `react.ReactElement` return type, the props shape (`posts`, `sectionLabel`, `readingTimeAriaLabel`), and the home wiring are pixel-precise vs. the plan.
- **Test isolation**: every test creates a fresh `mockRepo`; no shared state between cases.

## Recommendation

Code meets all standards. Production code matches the corrected "only-featured, no fallback" semantics exactly, all 322 tests are green, and the 27 type-check errors are pre-existing (verified by stashing the working tree). The PASS verdict is unconditional.

Optional follow-ups for a future cleanup commit (not blocking):

1. Unify the `@/src/lib/...` imports in `components/bento/*` to use the `@/content/...` alias defined in `tsconfig.json`.
2. Remove `home.latestArticle` and `home.previous` from `messages/{es,en}.json` and delete `components/bento/latest-article-block.tsx` once it is confirmed unused.
3. Replace `screen.queryByRole("listitem")` with `screen.getByRole("listitem")` in the "no tags" component test for idiomatic clarity.

These are suggestions, not corrections. Ready to commit.
