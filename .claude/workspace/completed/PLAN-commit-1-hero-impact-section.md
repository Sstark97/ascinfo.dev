# Task: Hero impact section with stats and CTA (Commit 1)

## Description

Implementar la sección hero "recruiter-friendly" en la home de ascinfo.dev. Esto cubre las secciones 1 y 9d del plan original e incluye:

1. Reformatear el bloque de bio del `ProfileBlock` para que tenga un subtítulo de impacto de UNA línea debajo de "Software Crafter".
2. Añadir un botón CTA "Hablemos / Let's talk" con `mailto:aitorscinfo@gmail.com` dentro del `ProfileBlock`, antes del "Home anchor indicator".
3. Crear un nuevo bento card a ancho completo (`md:col-span-12`) entre la fila 1 (Profile + LatestArticle) y la fila 2 (FeaturedProject + RecentTalk + NavigationDock) con cuatro estadísticas:
   - `3+` años de experiencia (hardcoded en i18n)
   - `N` artículos técnicos (dinámico, desde `posts.getAll.execute(locale).length`)
   - `N` charlas (dinámico, desde `talks.getAll.execute(locale).length`)
   - `11` recomendaciones LinkedIn (hardcoded en i18n)
4. Animación count-up al entrar el strip en viewport (Intersection Observer + requestAnimationFrame, sin Framer Motion). Respetar `prefers-reduced-motion`.
5. i18n ES/EN completa.
6. Tests unitarios (hook de animación) y de componente (StatsStrip, CtaButton, ProfileBlock subtitle).

## Acceptance Criteria

- [ ] El `ProfileBlock` muestra debajo de "Software Crafter" un subtítulo de UNA línea con texto de impacto recruiter-friendly, traducido a ES y EN.
- [ ] El `ProfileBlock` mantiene los párrafos de bio actuales debajo del subtítulo (no se borran, solo se añade el subtítulo).
- [ ] El `ProfileBlock` incluye un botón CTA "Hablemos" / "Let's talk" como `<a href="mailto:aitorscinfo@gmail.com">` justo antes del "Home anchor indicator", con foco visible y aria-label adecuado.
- [ ] El nuevo `HeroStatsBlock` aparece a ancho completo (`md:col-span-12`) en la home, entre la fila 1 y la fila 2.
- [ ] El `HeroStatsBlock` muestra 4 stats: 2x2 en mobile (`grid-cols-2`), 4 columnas en desktop (`md:grid-cols-4`).
- [ ] Los valores de `posts` y `talks` son dinámicos (cuentan los items devueltos por `posts.getAll.execute(locale)` y `talks.getAll.execute(locale)`).
- [ ] Los valores de "años de experiencia" y "recomendaciones LinkedIn" son hardcoded en `messages/{es,en}.json`.
- [ ] La animación count-up se dispara cuando el strip entra en viewport (al menos 30% visible) y dura ~1.2s con easing ease-out. Sólo se anima una vez por sesión de página.
- [ ] Si el usuario tiene `prefers-reduced-motion: reduce`, los números aparecen ya con su valor final (sin animar).
- [ ] La numeración respeta el sufijo: `3+` mantiene el `+`, los demás muestran sólo el entero (sin sufijo).
- [ ] `pnpm type-check` pasa con 0 errores.
- [ ] `pnpm test` pasa todos los tests verdes.
- [ ] `pnpm build` builda sin errores.

## Architecture Decisions

- **NO crear `GetSiteStats` use case.** Reutilizar los use cases existentes `posts.getAll` y `talks.getAll`. La home (server component) ya invoca `posts.getAll.execute(l)` (variable `allPosts`); sólo falta añadir `talks.getAll.execute(l)` al `Promise.all`. Crear un use case nuevo sería sobre-ingeniería para 2 lengths.
- **Server Component para datos, Client Component para animación.** El `HeroStatsBlock` se compone de:
  - `HeroStatsBlock` (server component) — recibe los counts ya calculados desde `app/[locale]/page.tsx` y los labels traducidos. Hace de wrapper estructural y pasa props al child cliente.
  - `HeroStatsList` (client component, `"use client"`) — encapsula la animación count-up con un hook `useCountUp`. Recibe los items ya traducidos como props.
  - Patrón ya establecido en el proyecto (ej. `LatestArticleBlock`, `FeaturedProjectBlock`): el server component padre pasa labels al client child, no hay `useTranslations` en el cliente.
- **Hook `useCountUp`** (client-only) en `hooks/use-count-up.ts` (crear el directorio `hooks/`):
  - Acepta `targetValue: number` y `options?: { durationMs?: number; enabled?: boolean }`.
  - Gestiona internamente `IntersectionObserver` con un `ref` retornado.
  - Usa `requestAnimationFrame` para interpolar de 0 al `targetValue` con ease-out cubic.
  - Respeta `prefers-reduced-motion: reduce` devolviendo el valor final inmediatamente.
  - Sólo anima una vez (después del primer trigger se desconecta el observer).
- **Subtítulo de impacto** se añade como una nueva clave i18n `profile.impactSubtitle` en cada idioma (no se reemplazan `bio1/bio2/bio3`, los párrafos largos se mantienen). Es una decisión segura para no romper SEO ni perder texto. Si el usuario decide más adelante eliminar los párrafos largos, será un commit aparte.
- **CTA con `mailto:`** es un `<a>` semántico (no `<button>`), porque produce navegación. Estilizado como botón con clases Tailwind (acento `#FCA311`).
- **Layout tweak en `app/[locale]/page.tsx`**: cambiar las filas del grid. Antes había `md:grid-rows-[auto_auto_auto]` (3 filas implícitas). Ahora será `md:grid-rows-[auto_auto_auto_auto]` (4 filas) y se intercala el `HeroStatsBlock` en la fila 2.

## Files to Create/Modify

### Create

- `hooks/use-count-up.ts` (CREATE) — Custom React hook que encapsula la lógica IntersectionObserver + requestAnimationFrame + reduced-motion. Devuelve `{ value: number, ref: RefObject<HTMLElement> }`.
- `components/bento/hero-stats-block.tsx` (CREATE) — Server component que recibe `stats: HeroStat[]` y los renderiza en un grid 2x2 / 4-col. Delega la animación al child cliente `HeroStatsList`.
- `components/bento/hero-stats-list.tsx` (CREATE) — Client component (`"use client"`) que itera sobre `stats` y por cada uno muestra un `HeroStatItem` con el hook `useCountUp`. Encapsula el observer y la animación.
- `components/bento/cta-button.tsx` (CREATE) — Server component (no necesita interactividad). Recibe `href`, `label`, `ariaLabel`. Renderiza un `<a>` con estilos del design system.
- `tests/components/bento/hero-stats-block.test.tsx` (CREATE) — Tests de renderizado de stats.
- `tests/components/bento/hero-stats-list.test.tsx` (CREATE) — Tests de animación + reduced-motion + observer mock.
- `tests/components/bento/cta-button.test.tsx` (CREATE) — Tests de href y aria-label.
- `tests/components/bento/profile-block.test.tsx` (CREATE) — Tests de subtitle visible y CTA presente. (Server component → testear su salida JSX renderizada con un mock de `getTranslations`.)
- `tests/hooks/use-count-up.test.tsx` (CREATE) — Tests unitarios del hook con `IntersectionObserver` mockeado y `prefers-reduced-motion` mockeado.

### Modify

- `app/[locale]/page.tsx` (MODIFY)
  - Añadir `talks.getAll.execute(l)` al `Promise.all` para obtener `allTalks`.
  - Añadir `tProfile` (translations namespace `profile`) y `tHero` no es necesario porque las claves van bajo `home.heroStats.*` — usar `tHome` ya existente y leer sus subkeys.
  - Importar `HeroStatsBlock`.
  - Insertar el `HeroStatsBlock` entre la fila 1 y la fila 2 con `md:col-span-12` y construir el array `stats` con 4 entradas (años, posts.length, talks.length, recomendaciones).
  - Actualizar el `grid-rows` para acomodar la nueva fila si fuera necesario (Tailwind/CSS grid acepta filas implícitas, así que probablemente no haga falta cambiarlo, pero verificar).

- `components/bento/profile-block.tsx` (MODIFY)
  - Inyectar nuevo `<p>` con clase del design system para el `impactSubtitle` justo después de `<p className="mt-1 font-mono text-sm text-[#FCA311]">Software Crafter</p>`.
  - Añadir el `CtaButton` justo antes del "Home anchor indicator".
  - El subtítulo: `text-sm leading-snug text-muted-foreground mt-1.5` (UNA línea, no `<strong>`/`<highlight>` markup, plain text).
  - Pasar a `CtaButton` los labels `tProfile("ctaLabel")` y `tProfile("ctaAriaLabel")`.

- `messages/es.json` (MODIFY) — añadir nuevas claves bajo `profile.*` y `home.heroStats.*`.
- `messages/en.json` (MODIFY) — añadir nuevas claves bajo `profile.*` y `home.heroStats.*`.

## i18n Keys to Add

### `messages/es.json`

```json
{
  "home": {
    "heroStats": {
      "label": "Métricas",
      "yearsExperience": {
        "value": "3",
        "suffix": "+",
        "label": "Años de experiencia"
      },
      "articlesPublished": {
        "label": "Artículos técnicos"
      },
      "talksDelivered": {
        "label": "Charlas en conferencias"
      },
      "linkedinRecommendations": {
        "value": "11",
        "label": "Recomendaciones en LinkedIn"
      }
    }
  },
  "profile": {
    "impactSubtitle": "Especializado en arquitecturas limpias y TDD. Entregando producto en Fintech, Streaming y EdTech.",
    "ctaLabel": "Hablemos",
    "ctaAriaLabel": "Enviar email a Aitor Santana"
  }
}
```

### `messages/en.json`

```json
{
  "home": {
    "heroStats": {
      "label": "Metrics",
      "yearsExperience": {
        "value": "3",
        "suffix": "+",
        "label": "Years of experience"
      },
      "articlesPublished": {
        "label": "Technical articles"
      },
      "talksDelivered": {
        "label": "Conference talks"
      },
      "linkedinRecommendations": {
        "value": "11",
        "label": "LinkedIn recommendations"
      }
    }
  },
  "profile": {
    "impactSubtitle": "Specialized in clean architectures and TDD. Shipping product in Fintech, Streaming, and EdTech.",
    "ctaLabel": "Let's talk",
    "ctaAriaLabel": "Send email to Aitor Santana"
  }
}
```

> Las claves anteriores (`profile.bio1/bio2/bio3`, `home.latestArticle`, etc.) se conservan intactas. Sólo se AÑADEN claves nuevas. Esto evita romper componentes existentes.

## Components — Detailed Spec

### 1. `hooks/use-count-up.ts` (NEW)

**Tipo:** Client-only hook (no incluye `"use client"` directamente; lo ponen los componentes que lo importan).

**Firma:**

```typescript
type UseCountUpOptions = {
  durationMs?: number      // default: 1200
  thresholdRatio?: number  // default: 0.3
}

type UseCountUpResult<T extends HTMLElement = HTMLElement> = {
  value: number
  ref: React.RefObject<T | null>
}

export function useCountUp<T extends HTMLElement = HTMLElement>(
  targetValue: number,
  options?: UseCountUpOptions
): UseCountUpResult<T>
```

**Comportamiento:**
1. `useState<number>(0)` para el valor displayed (inicio en `0`).
2. `useRef<T | null>(null)` para el observer.
3. `useEffect` con dependencia `[targetValue]`:
   - Si `window.matchMedia("(prefers-reduced-motion: reduce)").matches` → `setValue(targetValue)` y return.
   - Si `IntersectionObserver` no existe en `window` (SSR safety) → `setValue(targetValue)` y return.
   - Crear `IntersectionObserver` con `threshold: thresholdRatio ?? 0.3`.
   - Cuando el ref entra en viewport (`entry.isIntersecting`), arrancar `requestAnimationFrame` que interpola con ease-out cubic: `easeOut = 1 - Math.pow(1 - t, 3)` donde `t = elapsed / duration`. Calcular `Math.round(targetValue * easeOut)`.
   - Una vez `t >= 1` → `setValue(targetValue)` y desconectar observer.
   - Cleanup: cancelar `cancelAnimationFrame` y `observer.disconnect()`.

**Tipado clave (sin `any`):**

```typescript
let frameId: number | undefined
let startTimestamp: number | undefined
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)
```

### 2. `components/bento/hero-stats-block.tsx` (NEW)

**Tipo:** Server component (sin `"use client"`).

**Props:**

```typescript
type HeroStat = {
  id: string                  // "years-experience" | "articles" | "talks" | "linkedin"
  value: number               // valor target del count-up
  suffix?: string             // "+" o undefined
  label: string               // ya traducido por el padre
}

type HeroStatsBlockProps = {
  sectionLabel: string         // "Métricas" / "Metrics"
  stats: readonly HeroStat[]   // exactamente 4 entradas
}

export function HeroStatsBlock({ sectionLabel, stats }: HeroStatsBlockProps): React.ReactElement
```

**JSX (server-rendered):**

```tsx
<section
  aria-label={sectionLabel}
  className="flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10"
>
  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
    {sectionLabel}
  </span>
  <HeroStatsList stats={stats} />
</section>
```

### 3. `components/bento/hero-stats-list.tsx` (NEW, "use client")

**Tipo:** Client component.

**Props:**

```typescript
type HeroStatsListProps = {
  stats: readonly HeroStat[]
}

export function HeroStatsList({ stats }: HeroStatsListProps): React.ReactElement
```

**Comportamiento y JSX:**

```tsx
"use client"

export function HeroStatsList({ stats }: HeroStatsListProps): React.ReactElement {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {stats.map((stat) => (
        <HeroStatItem key={stat.id} stat={stat} />
      ))}
    </ul>
  )
}

function HeroStatItem({ stat }: { stat: HeroStat }): React.ReactElement {
  const { value, ref } = useCountUp<HTMLLIElement>(stat.value)
  return (
    <li
      ref={ref}
      className="flex flex-col items-start gap-1"
    >
      <span className="text-3xl font-bold text-foreground md:text-4xl">
        {value}
        {stat.suffix !== undefined && (
          <span className="text-[#FCA311]">{stat.suffix}</span>
        )}
      </span>
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {stat.label}
      </span>
    </li>
  )
}
```

> Importante: el `ref` se monta en **cada `<li>`** (no en el `<ul>`) para que cada número arranque al entrar individualmente. Como están todos en el mismo bloque, en la práctica empezarán a la vez, pero el patrón es más limpio y permite testear cada item por separado.

### 4. `components/bento/cta-button.tsx` (NEW)

**Tipo:** Server component (no necesita interactividad cliente).

**Props:**

```typescript
type CtaButtonProps = {
  href: string             // "mailto:..." o cualquier URL
  label: string            // ya traducido
  ariaLabel: string        // ya traducido
}

export function CtaButton({ href, label, ariaLabel }: CtaButtonProps): React.ReactElement
```

**JSX:**

```tsx
<a
  href={href}
  aria-label={ariaLabel}
  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-all duration-300 hover:bg-[#FCA311]/90 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
>
  <Mail aria-hidden="true" className="h-4 w-4" />
  <span>{label}</span>
  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
</a>
```

(Iconos `Mail` y `ArrowUpRight` ya están en `lucide-react`, ya se usa en otros bentos).

### 5. `components/bento/profile-block.tsx` (MODIFY)

Cambios concretos sobre el archivo actual:

1. Añadir `import { CtaButton } from "@/components/bento/cta-button"`.
2. Después del `<p className="mt-1 font-mono text-sm text-[#FCA311]">Software Crafter</p>`, añadir:

```tsx
<p className="mt-1.5 text-sm leading-snug text-muted-foreground">
  {t("impactSubtitle")}
</p>
```

3. Antes del bloque "Home anchor indicator" (`<div aria-hidden="true" className="mt-4 flex items-center gap-2">`), añadir:

```tsx
<div className="mt-6">
  <CtaButton
    href="mailto:aitorscinfo@gmail.com"
    label={t("ctaLabel")}
    ariaLabel={t("ctaAriaLabel")}
  />
</div>
```

> Nota: el `min-h-[280px]` actual del wrapper podría quedarse corto al añadir contenido. Si visualmente queda apretado, eliminarlo (Tailwind `h-full` ya basta porque el grid hace stretching). Decisión del implementador en review visual; **no es bloqueante**.

### 6. `app/[locale]/page.tsx` (MODIFY)

Cambios concretos:

1. En el `Promise.all`, añadir `talks.getAll.execute(l)`:

```ts
const [tHome, tProject, featuredPost, featuredProject, featuredTalk, allPosts, allTalks] = await Promise.all([
  getTranslations("home"),
  getTranslations("project"),
  posts.getFeatured.execute(l),
  projects.getFeatured.execute(l),
  talks.getFeatured.execute(l),
  posts.getAll.execute(l),
  talks.getAll.execute(l),
])
```

2. Construir el array `heroStats` después de calcular DTOs:

```ts
const heroStats = [
  {
    id: "years-experience",
    value: Number(tHome("heroStats.yearsExperience.value")),
    suffix: tHome("heroStats.yearsExperience.suffix"),
    label: tHome("heroStats.yearsExperience.label"),
  },
  {
    id: "articles",
    value: allPosts.length,
    label: tHome("heroStats.articlesPublished.label"),
  },
  {
    id: "talks",
    value: allTalks.length,
    label: tHome("heroStats.talksDelivered.label"),
  },
  {
    id: "linkedin",
    value: Number(tHome("heroStats.linkedinRecommendations.value")),
    label: tHome("heroStats.linkedinRecommendations.label"),
  },
] as const
```

3. Importar `HeroStatsBlock` desde `@/components/bento/hero-stats-block`.

4. Insertar entre la fila 1 (LatestArticle wrapper) y la fila 2 (FeaturedProject wrapper):

```tsx
<div className="md:col-span-12">
  <HeroStatsBlock
    sectionLabel={tHome("heroStats.label")}
    stats={heroStats}
  />
</div>
```

> Nota crítica de tipos: `Number(tHome("heroStats.yearsExperience.value"))` requiere que el resultado sea válido. Como el JSON contiene `"3"` y `"11"` como strings, `Number()` devuelve `3` y `11`. Si el implementador prefiere strict typing, definir un helper local con explicit return type:
>
> ```ts
> const parseStatValue = (raw: string): number => {
>   const parsed = Number(raw)
>   return Number.isFinite(parsed) ? parsed : 0
> }
> ```

## Animation Spec — Count-Up

**Trigger:** Intersection Observer con `threshold: 0.3` (30% del elemento visible).

**Easing:** Ease-out cubic — `1 - Math.pow(1 - t, 3)`.

**Duration:** 1200ms por defecto, configurable vía `options.durationMs`.

**Reduced motion:** Si `window.matchMedia("(prefers-reduced-motion: reduce)").matches`, asignar el valor final inmediatamente (sin animar).

**SSR safety:** El hook hace early return si `typeof window === "undefined"` o si `IntersectionObserver` no existe; el valor inicial es `0` y el padre Server Component muestra `0` brevemente. Aceptable porque el efecto corre cliente-side al hidratarse y, si no hay observer, salta directo al valor final.

**One-shot:** Una vez completada la animación, `observer.disconnect()` evita re-disparar si el usuario hace scroll fuera y vuelve.

**Cleanup:** El `useEffect` cleanup llama `cancelAnimationFrame(frameId)` y `observer?.disconnect()` para prevenir leaks al desmontar.

## Testing Requirements

### Hook unit test — `tests/hooks/use-count-up.test.tsx`

```typescript
describe("useCountUp", () => {
  describe("when prefers-reduced-motion is reduce", () => {
    it("should return target value immediately without animation")
  })

  describe("when IntersectionObserver triggers", () => {
    it("should start at 0 before observer fires")
    it("should reach target value after animation completes")
    it("should disconnect the observer once animation completes")
  })

  describe("when component unmounts mid-animation", () => {
    it("should cancel the animation frame")
  })
})
```

**Setup:**

```typescript
// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  trigger(isIntersecting: boolean): void {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

// Mock matchMedia
const mockMatchMedia = (matches: boolean): void => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}
```

**Render-test pattern:** usar `renderHook` de `@testing-library/react`, hacer `act` y avanzar timers fake con `vi.useFakeTimers()` + `vi.advanceTimersByTime(1200)` o usar `requestAnimationFrame` mock.

### Component test — `tests/components/bento/hero-stats-list.test.tsx`

```typescript
describe("HeroStatsList", () => {
  it("should render all stats provided")
  it("should render the suffix when provided")
  it("should render without suffix when undefined")
  it("should render labels in uppercase mono font (visual check via class)")
  it("should reach target values after animation when in viewport (with mocked IO)")
})
```

> Tip: Mockear `IntersectionObserver` y disparar `isIntersecting: true` en el test; verificar que tras `act` el texto final aparece.

### Component test — `tests/components/bento/hero-stats-block.test.tsx`

```typescript
describe("HeroStatsBlock", () => {
  it("should render the section label")
  it("should render the stats list with provided data")
  it("should expose section role with aria-label")
})
```

### Component test — `tests/components/bento/cta-button.test.tsx`

```typescript
describe("CtaButton", () => {
  it("should render an anchor with the provided href")
  it("should render the visible label")
  it("should expose the aria-label")
  it("should not render as a button element")
})
```

### Component test — `tests/components/bento/profile-block.test.tsx`

> El `ProfileBlock` actual es un `async` Server Component que llama `getTranslations`. Para testearlo:
> - Opción A (recomendada): mockear `next-intl/server` con `vi.mock`. Devolver una función `t` que mapea claves a strings test, y `rich` que devuelve el chunk crudo.
> - Renderizarlo con `await ProfileBlock()` (es async) y pasar el resultado a `render`.
> - Esto sigue el patrón del proyecto (no testear el async server component directamente con JSX `<ProfileBlock />`, sino invocar y renderizar el resultado).

```typescript
describe("ProfileBlock", () => {
  it("should display the impact subtitle below the Software Crafter line")
  it("should display the CTA button with the correct mailto href")
  it("should keep the existing bio paragraphs")
})
```

**Snippet de mock:**

```typescript
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue(
    Object.assign(
      (key: string) => `[${key}]`,
      { rich: (key: string) => `[rich:${key}]` }
    )
  ),
}))
```

> Importante: si este mock se vuelve frágil, el implementador puede optar por extraer un sub-componente puro `ProfileBlockContent` (igual que se hizo en `CareerTimelineContent` según el commit reciente del git log) y testear ese. **Esa decisión queda abierta al implementador**, y es preferible si el mock de `getTranslations` da problemas.

### Test count summary

| Archivo | Test cases mínimos |
|---|---|
| `tests/hooks/use-count-up.test.tsx` | 4-5 |
| `tests/components/bento/hero-stats-list.test.tsx` | 5 |
| `tests/components/bento/hero-stats-block.test.tsx` | 3 |
| `tests/components/bento/cta-button.test.tsx` | 4 |
| `tests/components/bento/profile-block.test.tsx` | 3 |

**No se requieren tests E2E** para este commit; la cobertura unitaria + componente es suficiente. Si en el futuro se quiere validar la animación end-to-end, se puede añadir un test Playwright en `tests/app/home.spec.ts` posteriormente.

## Code Standards Checklist

- [ ] No `any` types — usar `unknown`, `IntersectionObserverEntry`, `HTMLElement`, etc.
- [ ] Todas las funciones exportadas tienen explicit return types (`React.ReactElement`, `void`, etc.)
- [ ] `??` no `||` para defaults (`options?.durationMs ?? 1200`)
- [ ] Named exports en todos los archivos nuevos (`export function`, `export class`, `export type`)
- [ ] Componentes en `components/bento/` con kebab-case en filenames y PascalCase en exports
- [ ] Server Component por defecto (`HeroStatsBlock`, `CtaButton`); `"use client"` SOLO en `HeroStatsList` (necesita el hook).
- [ ] Hook tipado con generics: `useCountUp<T extends HTMLElement = HTMLElement>`
- [ ] Tests siguen patrón `describe("ClassName", () => { describe("method()", () => { it("should ...") }) })`
- [ ] No `any` en test files (mockear `IntersectionObserver` con un tipo concreto, no `any`)
- [ ] Imports de Vitest: `import { describe, it, expect, vi } from "vitest"`
- [ ] No comentarios que describan QUÉ hace el código — renombrar funciones si hace falta.
- [ ] No `useEffect` para data derivation. (El hook `useCountUp` SÍ necesita `useEffect` porque maneja side effects: observer, RAF, timers — esto es legítimo.)
- [ ] El `ProfileBlock` sigue siendo Server Component (no hace falta cambiarlo a client; el `CtaButton` es server también).

## Risks / Considerations

1. **i18n key collision** — Las claves `home.heroStats.*` y `profile.impactSubtitle/ctaLabel/ctaAriaLabel` no existen actualmente, así que no hay choque. Verificar en `messages/{es,en}.json` antes de añadir.

2. **Layout overflow móvil** — Con 4 stats en `grid-cols-2`, los labels largos como "Recomendaciones en LinkedIn" pueden hacer wrap a 2 líneas. Es aceptable pero el implementador debe revisar visualmente. Si se desborda, considerar `text-[10px]` en mobile o `truncate` con tooltip.

3. **Min-height del ProfileBlock** — El `min-h-[280px]` actual puede ser insuficiente al añadir subtítulo + CTA. El grid hace `flex` con `h-full`, así que probablemente se ajustará. Revisar visualmente: si el ProfileBlock queda más alto que el LatestArticleBlock vecino, ambos se igualan por el `flex` del wrapper en `page.tsx` (`<div className="md:col-span-6 flex">`). OK.

4. **SSR / hidratación** — Como `HeroStatsList` es client, el server renderiza `0` en cada número y el cliente lo anima al hidratar. Hay un flash de 0→target. Mitigaciones:
   - Aceptable, el flash dura <50ms (hidratación rápida).
   - Si molesta, mostrar el valor final como fallback inicial (`useState(targetValue)` y resetear a 0 sólo cuando el observer dispare). Trade-off: usuarios sin JS verán el número correcto, pero hay un brief reset al hidratar.
   - **Decisión:** empezar en 0 (más simple, más limpio, semánticamente correcto al animar). Si en QA se ve feo, cambiar a la opción 2.

5. **`Number(tHome(...))` en el server component** — Si el JSON tiene un typo (`"3a"`), `Number()` devuelve `NaN`. El componente render `NaN` como texto. Mitigar con el helper `parseStatValue` propuesto arriba. **No bloqueante** pero recomendado.

6. **Test del hook con IntersectionObserver** — `happy-dom` y `jsdom` no implementan `IntersectionObserver` nativamente. El test DEBE mockearlo en `beforeEach` o vía `vi.stubGlobal`. Misma situación con `matchMedia`. Ambos mocks van en el propio archivo de test (no en `tests/setup.ts` — son específicos a este hook).

7. **Pérdida de la bio actual** — La decisión es **NO BORRAR** los párrafos `bio1/bio2/bio3` actuales. El subtítulo se AÑADE encima. Si el usuario decide más adelante reemplazar la bio larga por sólo el subtítulo, será un commit separado de "content".

8. **No usar Framer Motion** — Confirmado: no está en `dependencies` (verificado en package.json). Implementación con `requestAnimationFrame` puro.

9. **CTA fuera del bloque ProfileBlock** — Considerado y descartado. El CTA va dentro del `ProfileBlock` por consistencia visual con el resto del bento (el bento ProfileBlock es la "tarjeta de presentación"; meter el CTA dentro mantiene la cohesión).

10. **Mockear `next-intl/server`** — Si el mock de `getTranslations` complica el test del `ProfileBlock`, extraer un componente puro `ProfileBlockContent({ subtitle, ctaLabel, ctaAriaLabel, bio1Rich, bio2Rich, bio3Rich })` y testear ese. Patrón establecido en `career-timeline` (ver commit 4281073). **Decisión queda abierta al implementador.**

## Complexity Estimate

**Medium (M)** — 2-4 horas.

Desglose aproximado:
- 30 min: i18n + page.tsx tweaks
- 30 min: `CtaButton` + modificación de `ProfileBlock`
- 60 min: `useCountUp` hook + `HeroStatsList` + `HeroStatsBlock`
- 60 min: tests (5 archivos)
- 30 min: pulido visual + `pnpm type-check` + `pnpm test` + `pnpm build`
