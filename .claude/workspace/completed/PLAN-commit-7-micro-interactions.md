# Task: Commit 7 — Reading progress + micro-interactions (section 9)

## Description

Implementar las micro-interacciones de la sección 9 del plan original del portfolio: barra de progreso de lectura en blog posts, transiciones de página con el componente `<ViewTransition>` de React integrado en Next.js 16.2, armonizar hover-states en las cards que aún no lo tienen, validar el count-up del hero (ya implementado) y añadir un scroll-to-top selectivo en páginas largas.

Todo se construye con primitivas nativas (CSS, View Transitions API mediante el componente React, `IntersectionObserver`, `requestAnimationFrame`) y respetando `prefers-reduced-motion`. La única dependencia tocada es **el bump de `next` de `16.0.10` a `16.2.6`**, que es prerequisito para `experimental.viewTransition`.

## Pre-requisito: bump de Next a 16.2.6 (commit separado)

**Recomendación:** hacer un commit aparte antes de los commits del scope 7 con mensaje `chore(deps): bump next to 16.2.6 for ViewTransition support`. Razones:

- El soporte oficial para `<ViewTransition>` desde React vía Next.js está documentado en la guía oficial de Next 16.2 (`https://nextjs.org/docs/app/guides/view-transitions`, `version: 16.2.6`).
- 16.0 → 16.2 no introduce breakings dolorosos para este repo: las release notes destacan (1) rendering RSC 25–60% más rápido, (2) per-segment prefetch tuning, (3) reworked scroll/focus management con React Fragment refs en App Router, (4) Server Function logging en dev, (5) más de 200 fixes de Turbopack. Ninguno toca contratos de App Router, RSC, `next/image`, `next-intl` o React Compiler que ya usamos.
- `next-intl@4.9.1` lista `next` peer como `^12 || ^13 || ^14 || ^15 || ^16`, así que es compatible con `16.2.6`.
- El rework de scroll/focus management podría afectar al comportamiento sutil del enfoque tras navegación. **Smoke test requerido tras el bump:** abrir `/`, navegar `/blog → post → atrás`, comprobar que el foco no salta a lugares raros y que el scroll restoration sigue funcionando.

**Pinning style:** el `package.json` actual fija `next: "16.0.10"` sin `^` (al contrario que el resto de deps). Mantener el patrón → `next: "16.2.6"`. No cambiar React (`19.2.0` sigue siendo compatible; el `ViewTransition` viene de React canary que Next ya empaqueta internamente; no hace falta `react@canary` manualmente).

**Acción para el implementador del bump (commit previo):**

1. `pnpm add next@16.2.6` (sólo `next`, no React).
2. Ejecutar `pnpm type-check && pnpm test && pnpm build` en local. Si todo verde, commit.
3. Si aparece un breaking inesperado: revertir y reportar antes de continuar con el scope 7.

## Diagnóstico inicial

### Estado actual relevante (verificado en código)

| Subtarea | Estado | Evidencia |
|----------|--------|-----------|
| 9a | NO existe | No hay componente `ReadingProgressBar` ni hook `useScrollProgress` en `components/` ni `hooks/`. El header del post (`components/detail/blog-header.tsx`) no es sticky. |
| 9b | NO existe | `next.config.mjs` solo activa `reactCompiler: true`; sin flags experimentales de View Transitions. `app/[locale]/layout.tsx` no envuelve `children` en ninguna ViewTransition. `next@16.0.10` (necesita bump a 16.2.6, ver pre-requisito). |
| 9c | PARCIAL | `BlogCard`, `ProjectCard` y `TalkCard` ya tienen `hover:border-[#fca311]/30` + `hover:shadow-[0_0_30px_rgba(252,163,17,0.05~0.1)]`. Pero las cards del **bento del home** (`FeaturedPostsBlock`, `NavigationDock`, `HeroStatsBlock`, `RecentTalkBlock`, `LatestArticleBlock`) y la `FeaturedProjectBlock` no las tienen homogeneizadas (algunas usan solo `hover:border-white/10`, otras `hover:border-[#FCA311]/50`). |
| 9d | **YA HECHO** | `hooks/use-count-up.ts` ya implementa `IntersectionObserver` + `requestAnimationFrame` + easing `easeOutCubic`, con guards de `prefers-reduced-motion` y SSR. `HeroStatsList` lo consume y `tests/hooks/use-count-up.test.tsx` cubre el comportamiento. **EXCLUIDO del scope.** |
| 9e | NO existe | No hay `ScrollToTopButton` en `components/`. |

### Versión Next.js y View Transitions (post-bump 16.2.6)

- Tras el bump, Next.js 16.2.6 soporta `<ViewTransition>` de React detrás del flag `experimental.viewTransition: true` en `next.config.mjs` (singular, no `viewTransitions`).
- Import oficial: `import { ViewTransition } from "react"` — **sin** prefijo `unstable_`. Next App Router empaqueta internamente React canary, que expone `ViewTransition` como export estable; **no hace falta instalar `react@canary`** ni cambiar `react: "19.2.0"`.
- Activación: cuando la flag está activa, Next dispara automáticamente el browser View Transition en cada navegación del App Router (porque las navegaciones del router son React transitions). No requiere `document.startViewTransition()` manual ni hooks de pathname.
- Server Component: la doc oficial usa `<ViewTransition>` en Server Components (ej. `app/photo/[id]/page.tsx`). **No requiere `"use client"`** ni en el wrapper ni en el layout.
- Fallback automático: la doc lo dice literal — "Without browser support, your application works normally, the transitions simply do not animate." → **no hace falta feature-detect manual**.

### Cards a homogeneizar (9c)

Ya armonizadas (no tocar): `components/listings/blog-card.tsx`, `components/listings/project-card.tsx`, `components/listings/talk-card.tsx`.

Aplicar el patrón unificado a:
- `components/bento/featured-posts-block.tsx`
- `components/bento/featured-project-block.tsx`
- `components/bento/hero-stats-block.tsx`
- `components/bento/latest-article-block.tsx`
- `components/bento/recent-talk-block.tsx`
- `components/bento/navigation-dock.tsx`
- `components/bento/profile-block.tsx`

Patrón objetivo (token único): `hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]`. Mantener `transition-all duration-300`.

## Acceptance Criteria

- [ ] `next` actualizado a `16.2.6` en commit previo separado; `pnpm type-check`, `pnpm test`, `pnpm build` verdes.
- [ ] `next.config.mjs` con `experimental: { viewTransition: true }` (fusionado si ya hubiera `experimental`).
- [ ] `ReadingProgressBar` visible (sticky top, altura 2px, fill `#FCA311`) en `app/[locale]/blog/[slug]/page.tsx`. Avanza con scroll del artículo y llega a 100% al final.
- [ ] Page transitions: fade + slide-up de 200–300ms en cambios de pathname dentro del layout localizado, vía `<ViewTransition>` de React. Sin animación en navegadores sin `document.startViewTransition` (la navegación sigue funcionando) y sin animación si `prefers-reduced-motion: reduce`.
- [ ] Las cards del bento (`featured-posts-block`, `featured-project-block`, `hero-stats-block`, `latest-article-block`, `recent-talk-block`, `navigation-dock`, `profile-block`) usan el mismo patrón de hover que las listings: `hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]`.
- [ ] 9d marcada como YA hecha en este plan (sin cambios de código).
- [ ] `ScrollToTopButton` aparece tras 600px de scroll en blog detail y sobre-mí. Click → `window.scrollTo({ top: 0, behavior: "smooth" })`. Respeta `prefers-reduced-motion` (sin smooth scroll en ese caso).
- [ ] `pnpm type-check` pasa con 0 errores.
- [ ] `pnpm test` pasa todos los tests, incluyendo nuevos.
- [ ] Sin nuevas dependencias en `package.json` además del bump de `next`.

## Architecture Decisions

1. **Reading progress bar (9a):** componente `"use client"` que vive en `components/detail/reading-progress-bar.tsx`. Internamente usa un hook `useScrollProgress(targetRef)` que escucha `scroll` (passive) en `window` y recalcula porcentaje basado en `targetRef.current.getBoundingClientRect()` + `window.innerHeight`. Se monta dentro de `BlogHeader` o como hermano superior dentro del page, recibiendo un selector/ref del artículo. **Decisión:** lo montamos como hermano del `<header>` en `app/[locale]/blog/[slug]/page.tsx`, apuntando a un `id="article-content"` añadido al `<article>`. Esto evita prop drilling y mantiene el header existente intacto.

2. **Page transitions (9b) — `<ViewTransition>` de React vía Next 16.2:**
   - **Mecanismo:** activar `experimental.viewTransition: true` en `next.config.mjs`. Importar `ViewTransition` de `react` y envolver el área animable. Next dispara `document.startViewTransition()` automáticamente en cada navegación del App Router, sin código de detección de pathname.
   - **Alcance — Opción A vs Opción B:**
     - **A (global, recomendada):** envolver `{children}` en `app/[locale]/layout.tsx` con `<ViewTransition><main>{children}</main></ViewTransition>` (o sin `<main>` si ya existe en cada página). Pro: una única envoltura, todas las rutas internas del locale animan. Contra: incluye potencialmente al header del layout si en el futuro se monta dentro del wrapper; en nuestro caso `SiteFooter` está fuera y el skip-link también, así que el alcance ya queda limpio.
     - **B (sólo el área de contenido):** crear un `<ViewTransition name="page-content">` que envuelva sólo el contenido principal de cada page. Pro: control fino, posibilidad futura de "shared elements" con `name`. Contra: requiere repetir el wrapper en cada page o crear un layout intermedio.
   - **Recomendación: A.** Justificación: para una primera iteración queremos transiciones globales de "fade + slide-up" entre rutas sin morphing de elementos compartidos. La doc oficial confirma que `<ViewTransition>` puede usarse en Server Components (ej. `app/photo/[id]/page.tsx` de la guía). El layout localizado ya es Server Component y se mantiene así. Cuando en el futuro queramos shared elements (ej. cover de un post que morfee desde la card del listing), añadiremos `<ViewTransition name={...}>` adicionales en los componentes específicos sin tocar la envoltura global.
   - **Server vs Client:** `<ViewTransition>` **NO requiere `"use client"`**. Lo usamos directamente en `app/[locale]/layout.tsx` que sigue siendo Server Component. No creamos `RouteTransitionLayout` cliente — eliminado del plan.
   - **Fallback navegadores sin soporte:** Next se encarga; si `document.startViewTransition` no existe, la navegación sucede sin animación. **No añadir feature-detect manual.**
   - **`prefers-reduced-motion`:** la regla CSS estándar de View Transitions (`@media (prefers-reduced-motion: reduce) { ::view-transition-old(*), ::view-transition-new(*), ::view-transition-group(*) { animation-duration: 0s !important; animation-delay: 0s !important; } }`) cancela todas las animaciones de transición sin interferir con el resto del sitio. La regla global existente en `globals.css` que reduce todas las `animation/transition duration` a `0.01ms` también ayuda como segunda red de seguridad.

3. **Hover states (9c):** edición directa de classNames en los 7 componentes del bento. No introducir nuevas abstracciones. Mantener `transition-all duration-300` ya presente.

4. **Count-up (9d):** ya implementado. Documentar y excluir.

5. **Scroll-to-top (9e):** componente global `"use client"` `ScrollToTopButton` en `components/ui/scroll-to-top-button.tsx`. **Montaje selectivo, no global**, porque solo tiene sentido en páginas largas. Lo importamos solo en `app/[locale]/blog/[slug]/page.tsx` y `app/[locale]/sobre-mi/page.tsx`. Threshold por defecto 600px; recibe prop opcional `threshold` por si en el futuro se quiere ajustar. Listener `scroll` passive con `rAF` throttle para no thrashear.

6. **Reduced motion:** combinamos (a) la regla global existente de `globals.css`, (b) la regla específica de view-transition pseudo-elements (paso 6), y (c) detección JS en `ScrollToTopButton` para `behavior: "auto"`.

7. **Performance:** todos los `addEventListener("scroll")` con `{ passive: true }`. Hook de progreso usa `requestAnimationFrame` para coalescer updates.

## Files to Create/Modify

### Crear

- `hooks/use-scroll-progress.ts` (CREATE) — hook reutilizable que calcula % scroll relativo a un ref.
- `components/detail/reading-progress-bar.tsx` (CREATE) — barra sticky top que consume `useScrollProgress`.
- `components/ui/scroll-to-top-button.tsx` (CREATE) — botón fixed bottom-right con threshold configurable.
- `tests/hooks/use-scroll-progress.test.tsx` (CREATE) — tests del hook.
- `tests/components/detail/reading-progress-bar.test.tsx` (CREATE) — render + ARIA.
- `tests/components/ui/scroll-to-top-button.test.tsx` (CREATE) — visibilidad por threshold, click → scrollTo.

### Modificar

- `package.json` (MODIFY, **commit previo separado**) — bump `next` de `16.0.10` a `16.2.6`. Sin cambios en el resto.
- `next.config.mjs` (MODIFY) — añadir `experimental: { viewTransition: true }` (objeto experimental nuevo, no había antes).
- `app/[locale]/layout.tsx` (MODIFY) — importar `ViewTransition` de `react` y envolver `{children}` con `<ViewTransition>{children}</ViewTransition>`. Mantener el resto del Server Component intacto. `SiteFooter`, skip link y `Analytics` quedan FUERA de la envoltura para no animarse en cada navegación.
- `app/[locale]/blog/[slug]/page.tsx` (MODIFY) — añadir `<ReadingProgressBar targetId="article-content" />` antes del `<BlogHeader>`, añadir `id="article-content"` al `<article>` existente y montar `<ScrollToTopButton />` al final del wrapper.
- `app/[locale]/sobre-mi/page.tsx` (MODIFY) — montar `<ScrollToTopButton />` al final del wrapper.
- `app/globals.css` (MODIFY) — añadir keyframes `ascinfo-fade-out` / `ascinfo-fade-in-up` y reglas `::view-transition-old(root)` / `::view-transition-new(root)` con duraciones 200/280ms y easing `cubic-bezier(0.4, 0, 0.2, 1)`. Añadir además el bloque de `@media (prefers-reduced-motion: reduce)` específico para los pseudo-elementos de view transitions.
- `components/bento/featured-posts-block.tsx` (MODIFY) — reemplazar `hover:border-white/10` por `hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]`.
- `components/bento/featured-project-block.tsx` (MODIFY) — homogeneizar a `hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]` (actualmente usa `/50` + `/5`; alinear con el resto).
- `components/bento/hero-stats-block.tsx` (MODIFY) — añadir glow.
- `components/bento/latest-article-block.tsx` (MODIFY) — añadir glow.
- `components/bento/recent-talk-block.tsx` (MODIFY) — añadir glow.
- `components/bento/navigation-dock.tsx` (MODIFY) — añadir glow.
- `components/bento/profile-block.tsx` (MODIFY) — añadir glow.

### Eliminados del plan original

- ~~`components/ui/route-transition-layout.tsx`~~ — ya no se crea: la envoltura `<ViewTransition>` de React va directa en el layout y no requiere lógica cliente.
- ~~`tests/components/ui/route-transition-layout.test.tsx`~~ — ya no se crea.

## Implementation Steps

### Paso 0 — Bump de Next.js (commit separado previo)

**No incluir en el commit del scope 7. Hacer y verificar primero.**

1. `pnpm add next@16.2.6`.
2. Ejecutar `pnpm type-check`, `pnpm test`, `pnpm build`.
3. Smoke test manual: `pnpm dev` → navegar `/ → /blog → primer post → atrás`, comprobar que el foco/scroll se comportan como antes (rework de focus/scroll management en 16.2).
4. Commit: `chore(deps): bump next to 16.2.6 for ViewTransition support`.

### Paso 1 — Activar `experimental.viewTransition`

`next.config.mjs`:

```js
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  trailingSlash: false,
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/posts/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
```

(No había `experimental` antes; se añade como bloque nuevo. Si en futuras tareas se añaden más flags experimentales, se fusionarán aquí.)

### Paso 2 — Hook `useScrollProgress`

Archivo: `hooks/use-scroll-progress.ts`.

Firma:

```ts
type UseScrollProgressOptions = {
  targetRef?: React.RefObject<HTMLElement | null>
}

type UseScrollProgressResult = {
  progress: number // 0..1
}

export function useScrollProgress(options?: UseScrollProgressOptions): UseScrollProgressResult
```

Comportamiento:
- Si `targetRef.current === null`, calcula sobre `document.documentElement` (full page).
- Calcula: `scrolled = max(0, viewportTop - elementTop)`, `total = max(1, elementHeight - viewportHeight)`, `progress = clamp(scrolled / total, 0, 1)`.
- Listener `window.addEventListener("scroll", handler, { passive: true })` y `window.addEventListener("resize", handler, { passive: true })`.
- Throttling con `requestAnimationFrame`: el handler solo schedula 1 update por frame; cancela frame pendiente en cleanup.
- SSR-safe: si `typeof window === "undefined"` retorna `{ progress: 0 }`.
- Cleanup en `useEffect` retorna función que remueve listeners y cancela frame.

### Paso 3 — Componente `ReadingProgressBar`

Archivo: `components/detail/reading-progress-bar.tsx`. `"use client"`.

Props:

```ts
interface ReadingProgressBarProps {
  targetId: string
  label?: string  // aria-label, default "Reading progress"
}
```

Comportamiento:
- En `useEffect`, busca el elemento por `document.getElementById(targetId)` y guarda en un ref.
- Llama a `useScrollProgress({ targetRef })`.
- Render: `<div role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Reading progress"} className="fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent pointer-events-none"><div style={{ transform: \`scaleX(${progress})\`, transformOrigin: "left" }} className="h-full w-full bg-[#FCA311] transition-transform duration-75" /></div>`.

### Paso 4 — Integrar en blog detail (9a)

`app/[locale]/blog/[slug]/page.tsx`:
- Importar `ReadingProgressBar` desde `@/components/detail/reading-progress-bar`.
- Añadir `<ReadingProgressBar targetId="article-content" label={...} />` justo dentro del `<div className="min-h-screen ...">`, antes de `<BlogHeader>`. Label viene de `getTranslations("blog")` con clave `readingProgress` (se añadirá a `messages/es.json` y `messages/en.json` con "Progreso de lectura" / "Reading progress"; si el coordinador prefiere evitar mensajes nuevos, se puede inline el string en español como default).
- Añadir `id="article-content"` al `<article>` existente.

### Paso 5 — Envolver layout localizado con `<ViewTransition>` (9b)

`app/[locale]/layout.tsx`:

1. Añadir import al principio: `import { ViewTransition } from "react"`.
2. Envolver `{children}` así dentro del `<NextIntlClientProvider>`:

```tsx
<NextIntlClientProvider messages={messages}>
  <JsonLd data={WebSiteSchemaBuilder.build()} />
  <a href="#main-content" className="...">...</a>
  <ViewTransition>{children}</ViewTransition>
  <SiteFooter />
  <Analytics />
</NextIntlClientProvider>
```

3. **No** marcar el layout como `"use client"`. Permanece Server Component.
4. **No** crear `RouteTransitionLayout`. La envoltura es directa.

Si el implementador detecta que TypeScript no encuentra el export `ViewTransition` en `react` (porque los tipos publicados en `@types/react@19` pueden no incluirlo aún hasta una versión posterior), aplicar **fallback de tipo** sin cambiar la implementación:

```tsx
// Top of layout.tsx, only if needed for typecheck
import { ViewTransition as ViewTransitionUntyped } from "react"
const ViewTransition = ViewTransitionUntyped as unknown as React.FC<{
  children: React.ReactNode
  name?: string
}>
```

**REGLA VINCULANTE:** usar **exactamente** `import { ViewTransition } from "react"` — confirmado por el usuario y por la doc oficial de Next 16.2.6 (`https://nextjs.org/docs/app/guides/view-transitions`). **PROHIBIDO** usar el alias `unstable_ViewTransition`. Si TypeScript se queja del export directo, **STOP**: reportar al usuario, no cambiar el import bajo ningún concepto.

### Paso 6 — Reglas CSS para View Transitions (9b)

`app/globals.css` — añadir al final, antes (o después, indiferente) del bloque `@media (prefers-reduced-motion: reduce)` existente:

```css
@keyframes ascinfo-fade-out {
  to { opacity: 0; transform: translateY(-4px); }
}

@keyframes ascinfo-fade-in-up {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

::view-transition-old(root) {
  animation: ascinfo-fade-out 200ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
  animation: ascinfo-fade-in-up 280ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*),
  ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
```

(El último bloque es el patrón recomendado por la propia doc oficial de Next; se añade aunque ya exista un `@media (prefers-reduced-motion: reduce)` global porque éste apunta a pseudo-elementos específicos.)

### Paso 7 — Homogeneizar hover en cards bento (9c)

Para cada uno de estos archivos, sustituir el `className` del contenedor exterior (el `<section>` o `<div>` con `rounded-xl border border-white/5 bg-[#222222]`):

- `components/bento/featured-posts-block.tsx`: línea 27 — `hover:border-white/10` → `hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]`.
- `components/bento/featured-project-block.tsx`: línea 35 — `hover:border-[#FCA311]/50 hover:shadow-lg hover:shadow-[#FCA311]/5` → `hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]` (mantener `hover:-translate-y-1`).
- `components/bento/hero-stats-block.tsx`: línea 12 — añadir glow tras `hover:border-white/10` (sustituir por el patrón unificado).
- `components/bento/navigation-dock.tsx`: línea 27 — idem.
- `components/bento/latest-article-block.tsx`: revisar y aplicar mismo patrón al contenedor.
- `components/bento/recent-talk-block.tsx`: idem.
- `components/bento/profile-block.tsx`: idem.

Importante: NO tocar `hero-stats-list.tsx` (no es un card) y NO tocar las cards de listings (ya están).

### Paso 8 — Componente `ScrollToTopButton` (9e)

Archivo: `components/ui/scroll-to-top-button.tsx`. `"use client"`.

Props:

```ts
interface ScrollToTopButtonProps {
  threshold?: number   // px; default 600
  label?: string       // aria-label; default "Scroll to top"
}
```

Comportamiento:
- `useState<boolean>(false)` para visibilidad.
- `useEffect`: listener `scroll` passive con throttle `rAF`. Setea visible si `window.scrollY > (threshold ?? 600)`.
- `onClick`: detecta `prefers-reduced-motion`; si no está activo, `window.scrollTo({ top: 0, behavior: "smooth" })`; si sí, `window.scrollTo({ top: 0, behavior: "auto" })`.
- Render: `<button type="button" aria-label={label ?? "Scroll to top"} onClick={...} className={cn("fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#222222] text-[#999999] shadow-lg transition-all duration-300 hover:border-[#FCA311]/30 hover:text-[#FCA311] hover:shadow-[0_0_20px_rgba(252,163,17,0.15)] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2", visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none")}>` con icono `ArrowUp` de `lucide-react` y `<span className="sr-only">{label}</span>`.
- Cleanup remueve listener y cancela frame.

### Paso 9 — Integrar `ScrollToTopButton` en páginas largas

- `app/[locale]/blog/[slug]/page.tsx`: importar y montar como último hijo del `<div className="min-h-screen ...">`. Pasar `label` traducido (`t("scrollToTop")` del namespace `common` o `nav`; si no existe se añade en mensajes).
- `app/[locale]/sobre-mi/page.tsx`: idem, dentro del wrapper exterior.

### Paso 10 — Mensajes i18n (opcional, solo si labels nuevos)

`messages/es.json` y `messages/en.json`: añadir bajo `common` (o `nav`) las claves `scrollToTop` y `readingProgress`. Confirmar la estructura de los archivos antes de tocarlos. Si el implementador prefiere no introducir labels nuevos en este commit, puede usar defaults inline en español (es el locale principal del sitio).

## Props/Interfaces de componentes nuevos

```ts
// hooks/use-scroll-progress.ts
type UseScrollProgressOptions = {
  targetRef?: React.RefObject<HTMLElement | null>
}
type UseScrollProgressResult = { progress: number }

// components/detail/reading-progress-bar.tsx
interface ReadingProgressBarProps {
  targetId: string
  label?: string
}

// components/ui/scroll-to-top-button.tsx
interface ScrollToTopButtonProps {
  threshold?: number
  label?: string
}
```

(No hay interface para un `RouteTransitionLayout` porque ya no se crea ese componente.)

## Reglas CSS clave

- View Transitions (en `app/globals.css`): keyframes `ascinfo-fade-out` y `ascinfo-fade-in-up`, reglas `::view-transition-old(root)` (200ms) y `::view-transition-new(root)` (280ms). Easing `cubic-bezier(0.4, 0, 0.2, 1)`. Bloque adicional `@media (prefers-reduced-motion: reduce)` que pone `animation-duration: 0s !important` y `animation-delay: 0s !important` en `::view-transition-old(*) | ::view-transition-new(*) | ::view-transition-group(*)`.
- Reading bar: `fixed left-0 top-0 z-50 h-0.5 w-full pointer-events-none` + inner `bg-[#FCA311]` con `transform: scaleX(progress)`.
- Cards bento (Tailwind): patrón unificado `hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]` con `transition-all duration-300`.
- Scroll-to-top: `fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full bg-[#222222] border-white/10`, hover glow naranja, transición opacity + translate-y de 300ms.

## Testing Requirements

### Unit / Component (Vitest + RTL)

- [ ] `tests/hooks/use-scroll-progress.test.tsx`
  - "should return 0 progress when window is undefined" (SSR-safe path).
  - "should return 0 progress when ref points to element fully below viewport".
  - "should return 1 progress when element is fully scrolled past viewport".
  - "should clamp progress between 0 and 1".
  - "should remove scroll listener on unmount".
  - Mocks: `window.scrollY`, `Element.prototype.getBoundingClientRect` con `vi.spyOn`, `window.requestAnimationFrame` con `vi.useFakeTimers()` o `vi.stubGlobal`. Datos sintéticos (no usar nombres/contenidos reales).

- [ ] `tests/components/detail/reading-progress-bar.test.tsx`
  - "should render progressbar with aria attributes".
  - "should set aria-valuenow according to scroll progress" (mock hook con `vi.mock("@/hooks/use-scroll-progress")`).
  - "should not block pointer events".

- [ ] `tests/components/ui/scroll-to-top-button.test.tsx`
  - "should be hidden initially".
  - "should become visible when scroll exceeds threshold".
  - "should call window.scrollTo with smooth behavior on click".
  - "should call window.scrollTo with auto behavior when prefers-reduced-motion is reduce".
  - "should expose accessible name via aria-label".

### Tests NO incluidos para `<ViewTransition>` (decisión)

No se añaden tests unitarios/componente para la envoltura `<ViewTransition>` del layout. Razones:
- Es un componente nativo de React (canary integrada por Next), no nuestro código. No tiene sentido testear el componente de React; testearíamos el rendering, no la animación.
- La animación sólo ocurre en un browser real con `document.startViewTransition` activo. JSDom/happy-dom no lo implementan.
- Risk-reward bajo: cualquier regresión se detecta en el smoke test manual o en el E2E (paso siguiente).

Si en el futuro se añade un wrapper propio con lógica (ej. `transitionTypes` direccionales) sí se testeará.

### E2E (Playwright)

- [ ] Ampliar `tests/app/blog.e2e.test.ts`:
  - "should display a reading progress bar on a blog post" — `page.goto("/blog")`, click en el primer artículo, esperar la página de detalle, `await expect(page.getByRole("progressbar")).toBeVisible()`.
  - "should show scroll-to-top button after scrolling on a long post" — scroll a 800px, esperar a que el botón con `aria-label` `/scroll to top|volver arriba/i` esté visible.

- [ ] Ampliar `tests/app/about.e2e.test.ts` (si existe) con un test análogo para sobre-mi.

- [ ] (Opcional, baja prioridad) Smoke E2E de page transitions: navegar de `/` a `/blog` y verificar que no hay errores en consola. No se asertan animaciones (Playwright no expone bien el ciclo de view transition); basta con que la navegación funcione.

### Convenciones de tests

- [ ] `describe/it` con "should …"
- [ ] Mocks con `vi.fn()`, fixtures sintéticas (sin nombres reales tipo "Aitor", quotes reales, emails reales).
- [ ] No `any`.
- [ ] Import de Vitest: `import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"`.

## Code Standards Checklist

- [ ] No `any` types. Si se necesita el cast de fallback en el import de `ViewTransition` (paso 5), usar `as unknown as React.FC<{ children: React.ReactNode; name?: string }>` (no `as any`).
- [ ] Todas las funciones tienen tipo de retorno explícito (`(): void`, `: JSX.Element`, etc.).
- [ ] `??` para defaults de props (`threshold ?? 600`, `label ?? "Scroll to top"`).
- [ ] Named exports en `src/lib/` (los componentes nuevos viven en `components/`, donde Next admite exports nombrados; usar `export function` no `export default`).
- [ ] Server Components por defecto; los nuevos componentes con interacción cliente declaran `"use client"` explícitamente. **`app/[locale]/layout.tsx` permanece Server Component** tras envolver con `<ViewTransition>`.
- [ ] Sin `useEffect` para derivación de datos (solo para listeners/observers que es el caso legítimo aquí).
- [ ] Sin nuevas dependencias en `package.json` aparte del bump de `next` (commit separado).
- [ ] Hooks viven en `hooks/`, no en `src/lib/`.
- [ ] Sin tocar la capa `domain/application/infrastructure` (esto es 100% capa de presentación).

## Decisiones clave (resumen 1-2 líneas)

- **Scroll-to-top global vs. por página:** montaje **selectivo** en blog detail y sobre-mi. En home, listings y páginas cortas el botón sería ruido visual.
- **`prefers-reduced-motion`:** combinación de (a) regla global existente, (b) bloque específico para `::view-transition-*`, (c) detección JS en `ScrollToTopButton`.
- **Page transitions con `<ViewTransition>` de React (no API nativa directa):** seguimos la guía oficial de Next 16.2.6. Ventajas: (1) sin código de detección de pathname ni `useLayoutEffect`, (2) Server Component, (3) Next gestiona el ciclo de transition en cada navegación, (4) fallback silencioso ya incluido en la API, (5) sin features-detects manuales. Trade-off: requiere bumpeo a `next@16.2.6` y la flag está marcada `experimental` (la doc oficial lo dice).
- **Server Component preservado:** `<ViewTransition>` no necesita `"use client"`. El layout sigue Server.
- **Reading progress bar fuera del `BlogHeader`:** se monta como hermano superior en la page. Mantiene el header limpio y reutilizable, y permite que el bar sea `fixed` sin acoplarse al layout del header.

## ASUMPTIONS pendientes de verificar manualmente por el usuario

1. **Typings de `ViewTransition`:** se usa **exclusivamente** `import { ViewTransition } from 'react'`. Si TS falla, NO cambiar el import — reportar al usuario.
2. **Comportamiento del rework de scroll/focus management de Next 16.2:** smoke test manual tras el bump. Si rompe la navegación con el skip link o el scroll restoration en blog, evaluar si rollback parcial o tocar.

## Verificación manual

Tras la implementación, probar en el navegador (Chromium + Firefox para validar fallback):

1. **9a Reading progress bar:**
   - Abrir un post largo (`/blog/<slug>` con scroll real). Comprobar barra naranja en top que progresa con scroll y llega al 100% al final del `<article>`.
   - Abrir un post corto. La barra no debe parpadear; debe quedar en 0 o llegar a 100 rápido sin glitches.
   - DevTools → emulate `prefers-reduced-motion: reduce`. La barra debe seguir actualizándose (es UI funcional, no animación decorativa) pero sin transición CSS notable.

2. **9b Page transitions:**
   - Home → click en navegación dock → /blog. Debe verse un fade-out/in-up suave (200/280ms) sin bloquear.
   - En Firefox/Safari antiguo: la navegación debe ocurrir igual, sin animación, sin errores en consola.
   - Con `prefers-reduced-motion: reduce`: navegación instantánea, sin animación (las reglas CSS `animation-duration: 0s !important` lo cancelan).
   - First load del home: NO debe animar en el render inicial (sólo en transitions entre rutas).
   - DevTools → Console: confirmar que NO aparece warning de "viewTransition is experimental" más allá del primer arranque dev (Next lo loggea una vez).

3. **9c Hover cards bento:**
   - Hover sobre cada card del home (`featured-posts`, `featured-project`, `hero-stats`, `navigation-dock`, `latest-article`, `recent-talk`, `profile`). Border debe pasar a naranja translúcido + glow tenue.
   - Cards de listings (/blog, /proyectos, /charlas) deben seguir igual que antes (no se han tocado).

4. **9d Count-up hero stats (sin cambios):**
   - Refrescar home. Las cifras del hero deben animarse de 0 a su valor target una sola vez al entrar en viewport.
   - Con `prefers-reduced-motion: reduce`: aparecen ya con el valor final.

5. **9e Scroll-to-top:**
   - Blog detail largo + sobre-mi: scroll > 600px → aparece el botón abajo-derecha con fade-in. Click → vuelve al top en smooth scroll. Con `prefers-reduced-motion: reduce` → vuelta instantánea.
   - En home, blog listing y otras páginas: el botón NO debe aparecer (no está montado allí).

## Subtareas YA hechas

- **9d Count-up animado en hero stats:** YA IMPLEMENTADO en `hooks/use-count-up.ts` + `components/bento/hero-stats-list.tsx`. Incluye `IntersectionObserver`, `requestAnimationFrame`, easing `easeOutCubic`, guard de `prefers-reduced-motion`, SSR-safe, y tests en `tests/hooks/use-count-up.test.tsx` (5 casos cubiertos). **EXCLUIDA del scope del commit 7.**

## Complexity Estimate

**M (Medium, ~3-4h)** — bump previo de Next (10–20 min de verificación), una sola línea de envoltura `<ViewTransition>` en el layout (sin componente cliente), 3 componentes/hooks nuevos pequeños (reading bar + hook + scroll-to-top), 7 ediciones cosméticas en cards, 2 modificaciones en pages, reglas CSS y ~3 archivos de test. La integración de View Transitions se simplifica drásticamente respecto al plan original al delegar en `experimental.viewTransition` de Next 16.2.
