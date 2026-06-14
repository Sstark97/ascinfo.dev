# Code Review: Commit 4.5 — Home visual refresh (A1 + Op.2)

## VERDICT: PASS

## Files Reviewed

Production:
- `/Users/aitorsantana/Documents/dev/projects/ascinfo.dev/app/[locale]/page.tsx`
- `/Users/aitorsantana/Documents/dev/projects/ascinfo.dev/components/bento/profile-block.tsx`
- `/Users/aitorsantana/Documents/dev/projects/ascinfo.dev/components/bento/featured-posts-block.tsx`
- `/Users/aitorsantana/Documents/dev/projects/ascinfo.dev/messages/es.json`
- `/Users/aitorsantana/Documents/dev/projects/ascinfo.dev/messages/en.json`

Tests:
- `/Users/aitorsantana/Documents/dev/projects/ascinfo.dev/tests/components/bento/profile-block.test.tsx`
- `/Users/aitorsantana/Documents/dev/projects/ascinfo.dev/tests/components/bento/featured-posts-block.test.tsx`

## Build verification

- `pnpm type-check` (con cambios) → **27 errores**, los mismos 27 errores **pre-existentes** del baseline (`git stash` → 27 errores idénticos sobre tests de `talks/*.test.ts` y `projects/Get(Featured|...)?Project.test.ts` por arity de constructor desalineada con el commit 4.5). **0 errores nuevos introducidos por commit 4.5.**
- `pnpm test -- --run` → **333/333 verdes**, 43 test files.
- Sin `any`, sin `||` para nullish, sin `as`, sin `"use client"`, sin imports de framework en domain (no se ha tocado capa domain).

## Issues Found

### Critical (MUST fix)
Ninguno.

### Important (SHOULD fix)
Ninguno.

### Suggestions (COULD improve)

- `components/bento/featured-posts-block.tsx:96` — `Link href={{ pathname: "/blog", query: { tag } }}` se basa en `next-intl/navigation`, que codifica los query params automáticamente. El requirement de `encodeURIComponent` se cumple delegando a la librería (verificado en los tests: `URLSearchParams(href.query).toString()` produce `?tag=typescript` correctamente). No es defecto; mencionado solo para constancia.
- `components/bento/featured-posts-block.tsx:73` — el `firstTag` se muestra como `#{firstTag}` sin transformar mayúsculas/minúsculas; el bloque "Explora por tema" lo aplica vía CSS (`uppercase`). Coherencia visual ya gestionada por Tailwind, ok.
- `tests/components/bento/featured-posts-block.test.tsx:7-26` — el mock manual de `Link` con resolución de `href` objeto a string es un buen patrón. Como nota: se podría extraer a un helper compartido si más bloques empiezan a usar el mismo patrón, pero no aplica todavía.

## Compliance con checklist

### TypeScript Quality
- [x] No `any` types — `toSkillsArray(value: unknown): string[]` con type guard filtrando strings (`profile-block.tsx:15-18`).
- [x] Todos los componentes y helpers tienen return types explícitos (`React.ReactElement`, `Promise<React.ReactElement>`, `string[]`, `number`).
- [x] `??` usado en `app/[locale]/page.tsx:42` (`tagCounts.get(tag) ?? 0`). No hay `||` en archivos modificados.
- [x] Named exports en `components/bento/` y `src/lib/` (no se modifica nada en `src/lib/`).
- [x] No se introduce `null`; sin cambios respecto a este eje.

### Architecture
- [x] Domain layer intacto — el commit solo toca capa de UI (`components/bento/*`), call site (`app/[locale]/page.tsx`) e i18n.
- [x] Container.ts no se modifica.
- [x] No se introducen dependencias nuevas.

### React / Next.js
- [x] Server Components: ambos componentes siguen sin `"use client"` (verificado por grep).
- [x] Props interfaces explícitas (`ProfileBlockContentProps`, `FeaturedPostsBlockProps`).
- [x] No hay `useEffect` ni state cliente nuevo.
- [x] `Link` viene de `@/src/i18n/navigation` (verificado en `featured-posts-block.tsx:2`) — no `next/link`.

### Testing
- [x] Tests añadidos para todos los aspectos nuevos:
  - ProfileBlock: bio1, bio2, ambos párrafos, skill pills, ausencia de skill rail con `skills=[]`, ausencia del indicador HOME.
  - FeaturedPostsBlock: render label, fallback con posts vacíos, links a `/blog/{slug}`, sin excerpts, numeración `01/02/03`, contador `(NN)`, footer `/blog`, screen reader reading time, bloque explore-by-topic (label, hrefs `/blog?tag=`, render condicional con `topTags=[]`, prefijo `#`).
- [x] Test names siguen patrón `describe("ClassName", () => { it("should ...") })`.
- [x] Sub-`describe("explore by topic section")` agrupa correctamente los tests del nuevo bloque.
- [x] Sin `any` en tests.
- [x] Mocks declarados con `vi.mock(...)` para `next/image`, `LanguageSwitcher` y `@/src/i18n/navigation`.

### Code Quality
- [x] Sin comentarios explicando QUÉ hace el código.
- [x] El cálculo de `topTags` en `page.tsx:39-48` es lineal: dos `for...of` (O(N×T) donde T = tags por post) + un `sort` final sobre las entradas únicas + `slice(5)`. Sin operaciones cuadráticas.
- [x] No hay TODOs en producción.

## Acceptance Criteria — verificación

### A1 — ProfileBlock (con iteración 2-párrafos)
- [x] Bio en **dos** párrafos vía `t.rich("bio1", richOptions)` y `t.rich("bio2", richOptions)` (`profile-block.tsx:93-94`).
- [x] `richOptions` define `strong` y `highlight` reutilizado para ambos — buena factorización, sin duplicación.
- [x] Skill rail con 6 pills desde `profile.skills` validado por `toSkillsArray` (`profile-block.tsx:61-72`).
- [x] `aria-label="Stack"` en el `<ul>` para accesibilidad.
- [x] Pills no renderizadas cuando `skills.length === 0` (test cubre este caso).
- [x] CTA con `mt-auto pt-6` empujado al fondo (`profile-block.tsx:74`).
- [x] Sin dot "• HOME" (test `"should not render the HOME indicator anymore"` lo verifica).
- [x] Header con `sm:items-center` (no `sm:items-start`) — `profile-block.tsx:30`.

### Op.2 — FeaturedPostsBlock (Explora por tema)
- [x] 4 posts numerados con `(index + 1).toString().padStart(2, "0")` → `01-04`.
- [x] Cada post muestra `#{firstTag}` + reading time en mono `text-[11px] uppercase`.
- [x] Bloque "Explora por tema" renderiza solo si `topTags.length > 0` (`featured-posts-block.tsx:87`).
- [x] Pills enlazan a `/blog?tag={tag}` vía `Link` de `@/src/i18n/navigation` con objeto `{ pathname: "/blog", query: { tag } }`.
- [x] Pills usan **exactamente las mismas clases** que el skill rail de ProfileBlock (`rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground`) más estados hover/focus.
- [x] Separador `border-t border-white/5` con `pt-6 mt-6` entre lista y bloque temas.
- [x] Footer "→ Ver todos los artículos" con `mt-auto pt-4` al fondo.

### page.tsx — cálculo topTags
- [x] `Map<string, number>` agregando frecuencias con `??` para nullish (`page.tsx:42`).
- [x] `.sort([, a], [, b]) => b - a` desc por frecuencia.
- [x] `.slice(0, 5)` top 5.
- [x] Props `topTags` y `exploreByTopicLabel` pasadas al `<FeaturedPostsBlock>`.

### i18n paridad
- [x] `messages/es.json` y `messages/en.json` contienen `profile.bio1`, `profile.bio2`, `profile.skills`, `home.featuredPosts.viewAll`, `home.featuredPosts.exploreByTopic`.
- [x] Clave `profile.bio3` **eliminada** en ambos locales (verificado por grep, 0 ocurrencias).
- [x] Estructura simétrica ES/EN.
- [x] `profile.skills` es un array `["TypeScript", ".NET", "Java", "Hexagonal", "TDD", "GenAI"]` idéntico en ambos locales.

### Type guard de `skills`
- [x] `toSkillsArray(value: unknown): string[]` (`profile-block.tsx:15-18`):
  - `if (!Array.isArray(value)) return []` — guard de array.
  - `value.filter((item): item is string => typeof item === "string")` — type predicate, sin `as`.
- [x] El plan exige "sin `as`". Verificado con grep: ninguna assertion `as` en `profile-block.tsx` ni en `featured-posts-block.tsx`.

### Patrón Content + wrapper async
- [x] `ProfileBlockContent` es síncrono, recibe `bio1` y `bio2` como `React.ReactNode` por props (`ProfileBlockContentProps`, líneas 6-13). No llama a `getTranslations`.
- [x] `ProfileBlock` async server component invoca `getTranslations("profile")` y compone el resultado de `t.rich(...)` para pasar `React.ReactNode` al hijo.

## What Went Well

- **Refactor mínimo y disciplinado**: solo capa UI + i18n + tests. Domain, application, infraestructura y `Container.ts` intactos.
- **Type guard `toSkillsArray`** elegante: filtra strings preservando type-safety, sin `as`, con fallback `[]` si la clave i18n viene mal formada.
- **`richOptions` factorizado** para reutilizar en `bio1` y `bio2` (`profile-block.tsx:88-91`) — evita duplicación de los renderers `strong`/`highlight`.
- **Cálculo de `topTags` lineal** en `page.tsx`: `Map` + dos `for...of` (O(N×T) lineal), `sort` sobre entradas únicas y `slice(5)`. Eficiente y legible.
- **Mock manual de `@/src/i18n/navigation`** en el test con `resolveHref` que soporta `string | { pathname, params, query }`. Cubre los tres patrones de `href` que usa el componente (`/blog`, `/blog/[slug]` con params, `/blog?tag=` con query). Esto evita filtraciones de testing en producción.
- **Filtrado de blog post links** en el test (`href?.startsWith("/blog/")`) para separar los enlaces de posts de los del bloque "Explora por tema" y del footer — robusto frente a cambios futuros en cantidad de enlaces.
- **Tests cubren render condicional** del bloque "Explora por tema" (`topTags=[]` → no se renderiza), del footer (`posts=[]` → no se renderiza) y del skill rail (`skills=[]` → no se renderiza). Cobertura completa de paths.
- **Acessibilidad mantenida**: `aria-hidden` en números/iconos decorativos, `<span class="sr-only">` para reading time, `aria-label` en `<section>` y `<ul>` del stack, `focus-visible:outline-*` en todos los links.
- **Coherencia visual**: pills del skill rail y del bloque "Explora por tema" comparten clases exactas, reforzando el lenguaje visual de la fila superior tal como exigía el design Op.2.

## Recommendation

Implementación lista para commit. Todos los criterios de aceptación de A1 (con la iteración a 2-párrafos) y Op.2 (bloque "Explora por tema") están cumplidos, los 333 tests pasan, no se introducen errores nuevos de type-check, y el código respeta `clean-code.md`, `naming.md`, `testing.md` y `anti-patterns.md`.

Sugerencia de mensaje de commit (Conventional Commits, scope `home`/`ui`):

```
refactor(home): condense profile bio, remove HOME dot, simplify featured posts and add explore-by-topic block

- ProfileBlock: 2-paragraph bio with strong/highlight rich text, skill rail with 6 mono pills, CTA pushed to bottom with mt-auto, removed legacy HOME indicator
- FeaturedPostsBlock: pure ordinal list 01-04 with title + #tag + reading time, top-5 tag pills linking to /blog?tag=, footer link to /blog
- Tag aggregation in app/[locale]/page.tsx using Map for linear top-5 derivation
- i18n: add profile.skills array, home.featuredPosts.viewAll and exploreByTopic; remove obsolete profile.bio3
- Component tests cover skill rail conditional render, two bio paragraphs, ordinal numbering, total count badge, explore-by-topic render conditions and tag hrefs
```
