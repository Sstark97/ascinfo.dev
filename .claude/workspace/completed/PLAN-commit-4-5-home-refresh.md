# Task: Commit 4.5 — Home visual refresh (A1 + B2)

## Resumen

Refresh visual de la fila superior de la home aplicando la combinación **A1 + B2** del documento `DESIGN-home-profile-and-featured.md`. Objetivo: matar los huecos del `ProfileBlock` (sustituir 3 párrafos de bio por 1 + skill rail, empujar el CTA al fondo con `mt-auto`, eliminar el dot "• HOME") y reducir la carga del `FeaturedPostsBlock` (eliminar excerpts y chips de tag naranja, dejar lista pura con numeración mono `01-04`, reading time y flecha, con divisores `divide-y` y footer "→ Ver todos los artículos"). Solo cambios de presentación + i18n; no se tocan use cases, dominio ni el call site del home (`posts.getFeaturedList.execute(l, 4)` se mantiene).

## Description

Tras el commit 4 el usuario reportó dos problemas visuales:

1. **ProfileBlock con huecos**: `min-h-[280px]` + márgenes `mt-6/mt-6/mt-4` hardcoded entre header → bios → CTA → indicador HOME. Tres párrafos de bio repetitivos crean una "pared" plana sin jerarquía.
2. **FeaturedPostsBlock demasiado cargante**: 4 cards iguales con título + excerpt 2 líneas + chip de tag naranja + icono Clock + reading time = 16 nodos visuales con 4 puntos calientes naranja saturando el acento.

Se aplica la solución más minimalista del documento de diseño:

- **A1 (ProfileBlock)**: header (foto + nombre + Software Crafter + LanguageSwitcher) → claim de impacto (texto existente) → **1 párrafo de bio condensada** → **skill rail** con 6 pills mono → CTA con `mt-auto pt-6` para empujarlo al fondo. Se elimina el dot "• HOME".
- **B2 (FeaturedPostsBlock)**: cabecera con label + contador `(04)` en mono muted → lista pura `divide-y divide-white/5`, cada item con número `01`, título `line-clamp-1`, reading time mono y `ArrowUpRight` (sin excerpt, sin chip de tag, sin Clock) → footer link "→ Ver todos los artículos" hacia `/blog`.

## Acceptance Criteria

- [ ] `components/bento/profile-block.tsx` ya no expone `bio1/bio2/bio3` en `ProfileBlockContentProps`; pasa a recibir `bio: React.ReactNode` (un solo párrafo) y `skills: string[]`.
- [ ] El JSX del `ProfileBlockContent` elimina el wrapper `min-h-[280px]`, los `mt-6`/`mt-4` redundantes y el bloque del dot "• HOME".
- [ ] El CTA del `ProfileBlockContent` está envuelto en un wrapper con clases `mt-auto pt-6`.
- [ ] Bajo la bio se renderiza un `<ul>` con 6 `<li>` (pills) mostrando los skills (`TypeScript`, `.NET`, `Java`, `Hexagonal`, `TDD`, `GenAI`) — el orden y los textos vienen de `profile.skills` en i18n.
- [ ] La foto sigue siendo cuadrada `h-20 w-20 sm:h-24 sm:w-24` con `rounded-xl` (sin cambiar de 96 a 112 px en este commit; A1 mantiene la foto a 80→96).
- [ ] El header row pasa de `sm:items-start` a `sm:items-center` para evitar el hueco a la derecha de la foto.
- [ ] `components/bento/featured-posts-block.tsx` no contiene los `<p excerpt>`, ni los `<span chip>` de tag naranja, ni el icono `Clock`.
- [ ] Cada item de la lista renderiza: número `01` en mono muted (w-6) + título `line-clamp-1 font-medium flex-1` + reading time mono + `ArrowUpRight`.
- [ ] La cabecera del bloque muestra el contador `(NN)` a la derecha del label, calculado dinámicamente con `posts.length` formateado con `.padStart(2, "0")`.
- [ ] La numeración de cada item es `(index + 1).toString().padStart(2, "0")` (no hardcoded).
- [ ] Hay un footer con `mt-auto pt-4` que contiene un `<Link>` (importado desde `@/src/i18n/navigation`) hacia `/blog`, con la copia "→ Ver todos los artículos" (`home.featuredPosts.viewAll`) en mono uppercase muted.
- [ ] Se añaden claves i18n: `profile.bio` (string), `profile.skills` (array), `home.featuredPosts.viewAll` (string). Las claves `profile.bio1`, `profile.bio2`, `profile.bio3` se **eliminan** en `messages/{es,en}.json` (verificado: solo se usan en `profile-block.tsx`).
- [ ] Los tests `tests/components/bento/profile-block.test.tsx` y `tests/components/bento/featured-posts-block.test.tsx` se actualizan a la nueva forma del JSX (sin `bio1/bio2/bio3`, sin excerpt, sin chip, con numeración, con footer link).
- [ ] El `ProfileBlock` async server component sigue consumiendo `getTranslations("profile")` y construye `bio` con `t.rich("bio", { strong, highlight })` y `skills` con `t.raw("skills")` validado a `string[]` mediante un type guard local (sin `as`).
- [ ] El call site en `app/[locale]/page.tsx` no cambia: sigue siendo `<ProfileBlock />` y `<FeaturedPostsBlock posts={...} sectionLabel={...} readingTimeAriaLabel={...} />`. **No se modifican use cases ni el `Container`.**
- [ ] `pnpm type-check` pasa con 0 errores.
- [ ] `pnpm test` pasa con todos los tests verdes.

## Architecture Decisions

- **Capa**: este commit toca **únicamente la capa de UI** (`components/bento/` + `messages/*.json` + tests de componentes). El dominio, aplicación, infraestructura y `Container.ts` quedan intactos.
- **Server Components**: ambos componentes siguen siendo Server Components (sin `"use client"`). `LanguageSwitcher` ya es client component independiente y se sigue importando como hasta ahora.
- **i18n del skill rail**: las pills viven en `profile.skills` como **array de strings** (`["TypeScript", ".NET", "Java", "Hexagonal", "TDD", "GenAI"]`). Se obtiene con `t.raw("skills")` y se valida en runtime con un type guard `isStringArray(value: unknown): value is string[]` para evitar `as` y satisfacer `clean-code.md` (sin assertions sin validación). Si el guard falla, el componente recibe `[]` (no rompe el render).
- **Eliminación de `bio1/bio2/bio3`**: se ha verificado con `grep` que esas claves solo se usan en `components/bento/profile-block.tsx` y en su test. El módulo `about.bio1/about.bio2` que usa `app/[locale]/sobre-mi/page.tsx` es **independiente** (namespace `about`). Por tanto se eliminan las viejas claves `profile.bio1/bio2/bio3` directamente; no es necesario dejarlas deprecadas.
- **Renombrado de prop**: se cambia la firma de `ProfileBlockContentProps` para reflejar A1. Se mantiene `impactSubtitle` (no se renombra a `impactClaim`) porque la clave i18n `profile.impactSubtitle` ya está consolidada desde el commit 1 y renombrarla sumaría ruido al commit.
- **Numeración dinámica**: `posts.map((post, index) => ...)`. El número se calcula `(index + 1).toString().padStart(2, "0")`. El contador del header es `posts.length.toString().padStart(2, "0")`. Si `posts.length === 0`, el contador no se renderiza (se mantiene el fallback `—`).
- **Footer link a `/blog`**: se usa `Link` de `@/src/i18n/navigation` (no de `next/link`) para que next-intl resuelva el prefijo de locale automáticamente. Es el patrón ya usado en `components/bento/navigation-dock.tsx`.
- **Sin renombrar componentes**: `ProfileBlockContent`, `ProfileBlock`, `FeaturedPostsBlock` conservan sus nombres. Solo cambia el JSX interno y la firma de props del primero.
- **`readingTimeAriaLabel` se conserva**: B2 sigue mostrando reading time, así que la prop callback se mantiene tal cual.

## Files to Create/Modify

### MODIFY

- `components/bento/profile-block.tsx` — reescritura del JSX (sin huecos, sin dot HOME), nueva firma de `ProfileBlockContentProps` (`bio`, `skills` en vez de `bio1/bio2/bio3`), construcción de `bio` con `t.rich("bio", ...)` y `skills` con `t.raw("skills")` validado.
- `components/bento/featured-posts-block.tsx` — reescritura del JSX a lista pura (numeración + título + reading time + flecha + footer link), eliminación de excerpt/chip/Clock.
- `messages/es.json` — añadir `profile.bio`, `profile.skills`, `home.featuredPosts.viewAll`; eliminar `profile.bio1`, `profile.bio2`, `profile.bio3`.
- `messages/en.json` — equivalentes en inglés.
- `tests/components/bento/profile-block.test.tsx` — adaptar `defaultProps` y asserts a la nueva firma (sin `bio1/2/3`, con `bio` y `skills`); test del skill rail; test de que el dot HOME ya no se renderiza.
- `tests/components/bento/featured-posts-block.test.tsx` — adaptar asserts: no comprobar excerpt ni tag chip; comprobar numeración (`01`, `02`), reading time, footer link a `/blog`, contador `(NN)` en header.

### NOT TOUCHED (intencional)

- `app/[locale]/page.tsx` — el call site queda igual.
- `src/lib/content/**` — dominio/aplicación/infraestructura sin cambios.
- `src/lib/content/infrastructure/Container.ts` — sin cambios.
- `components/bento/cta-button.tsx` — se sigue usando tal cual.
- `components/ui/language-switcher.tsx` — sin cambios.
- `components/bento/latest-article-block.tsx` — sin cambios.
- `app/[locale]/sobre-mi/page.tsx` — usa `about.bio1/bio2` (namespace distinto), no afectado.

## JSX completo del nuevo `ProfileBlock`

### Firma de `ProfileBlockContentProps`

```tsx
type ProfileBlockContentProps = {
  impactSubtitle: string
  bio: React.ReactNode
  skills: string[]
  ctaLabel: string
  ctaAriaLabel: string
}
```

### `ProfileBlockContent` JSX

```tsx
export function ProfileBlockContent({
  impactSubtitle,
  bio,
  skills,
  ctaLabel,
  ctaAriaLabel,
}: ProfileBlockContentProps): React.ReactElement {
  return (
    <div className="group flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            src="/aitor_profile.webp"
            alt="Aitor Santana"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 rounded-xl ring-2 ring-[#FCA311]/20" />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Aitor Santana
          </h2>
          <p className="mt-1 font-mono text-sm text-[#FCA311]">Software Crafter</p>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
            {impactSubtitle}
          </p>
          <div className="-ml-3 mt-1">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        {bio}
      </p>

      {skills.length > 0 && (
        <ul aria-label="Stack" className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-6">
        <CtaButton
          href="mailto:aitorscinfo@gmail.com"
          label={ctaLabel}
          ariaLabel={ctaAriaLabel}
        />
      </div>
    </div>
  )
}
```

### `ProfileBlock` (server component)

```tsx
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { CtaButton } from "@/components/bento/cta-button"

// ... (props type arriba)

function toSkillsArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}

export async function ProfileBlock(): Promise<React.ReactElement> {
  const t = await getTranslations("profile")

  const bio = t.rich("bio", {
    strong: (chunks) => <span className="font-semibold text-gray-100">{chunks}</span>,
    highlight: (chunks) => <span className="font-semibold text-[#FCA311]">{chunks}</span>,
  })

  const skills = toSkillsArray(t.raw("skills"))

  return (
    <ProfileBlockContent
      impactSubtitle={t("impactSubtitle")}
      bio={bio}
      skills={skills}
      ctaLabel={t("ctaLabel")}
      ctaAriaLabel={t("ctaAriaLabel")}
    />
  )
}
```

Notas clave:
- `mt-auto pt-6` en el wrapper del CTA empuja el botón al fondo del flex column → elimina los `mt-6 + mt-4` redundantes.
- Se eliminan: el `min-h-[280px]`, el `mt-6 flex-1 space-y-3` con los 3 párrafos, el `mt-6` del wrapper CTA, y todo el bloque del dot "• HOME".
- `sm:items-center` (en vez de `sm:items-start`) alinea verticalmente foto y bloque de texto para evitar hueco a la derecha de la foto.
- `toSkillsArray` evita `as string[]` (compliance con `anti-patterns.md`).
- El `<ul aria-label="Stack">` da semántica accesible al rail; las pills son `<li>` no interactivos (no son links).

## JSX completo del nuevo `FeaturedPostsBlock`

### Firma de props (sin cambios)

```tsx
type FeaturedPostsBlockProps = {
  posts: PostDto[]
  sectionLabel: string
  readingTimeAriaLabel: (minutes: string) => string
  viewAllLabel: string
}
```

Nota: se añade `viewAllLabel` como prop nueva (string ya localizado, mismo patrón que `sectionLabel`).

### JSX completo

```tsx
import { ArrowUpRight } from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import type { PostDto } from "@/src/lib/content/application/dto/PostDto"

export function FeaturedPostsBlock({
  posts,
  sectionLabel,
  readingTimeAriaLabel,
  viewAllLabel,
}: FeaturedPostsBlockProps): React.ReactElement {
  const formattedCount = posts.length.toString().padStart(2, "0")

  return (
    <section
      aria-label={sectionLabel}
      className="flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {sectionLabel}
        </span>
        {posts.length > 0 && (
          <span
            aria-hidden="true"
            className="font-mono text-xs text-muted-foreground/60"
          >
            ({formattedCount})
          </span>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">—</p>
      ) : (
        <ul className="mt-6 flex flex-1 flex-col divide-y divide-white/5">
          {posts.map((post, index) => {
            const itemNumber = (index + 1).toString().padStart(2, "0")
            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0 rounded focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="w-6 shrink-0 font-mono text-xs text-muted-foreground/60 transition-colors group-hover:text-[#FCA311]"
                  >
                    {itemNumber}
                  </span>
                  <h3 className="flex-1 text-base font-medium leading-snug text-foreground line-clamp-1 transition-colors group-hover:text-[#FCA311]">
                    {post.title}
                  </h3>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span className="sr-only">{readingTimeAriaLabel(post.readingTime)}</span>
                    <span aria-hidden="true">{post.readingTime}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FCA311]"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {posts.length > 0 && (
        <div className="mt-auto pt-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 rounded"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </section>
  )
}
```

Notas clave:
- `import { Link } from "@/src/i18n/navigation"` (no `next/link`). Asegura prefijo de locale automático.
- Contador `(NN)` solo se renderiza si hay posts (`posts.length > 0`).
- Numeración: `(index + 1).padStart(2, "0")` → `01`, `02`, `03`, `04`. Si hay menos de 10 posts se muestra con cero a la izquierda; si hay más, sigue funcionando sin cambios.
- `mt-6` antes de la `<ul>` (no `mt-4` como en el actual) para dar más respiro al header.
- `divide-y divide-white/5` da los separadores horizontales sutiles.
- Cada item es un único `<Link>` con `flex items-center` — todo el contenido se alinea verticalmente en una sola fila.
- `line-clamp-1` en el título asegura que ningún título largo rompa la fila.
- El footer link se omite cuando no hay posts (no tiene sentido linkar a `/blog` desde un bloque vacío en este context — opcional; si se prefiere mostrar siempre, mover el condicional).
- Se elimina por completo el `import { Clock } from "lucide-react"` (ya no se usa).
- Texto sugerido del footer: ES `"→ Ver todos los artículos"`, EN `"→ View all articles"`. La flecha va incluida en el string (no como icono separado) para mantener el componente lo más simple posible y respetar la estética editorial.

## Cambios en `app/[locale]/page.tsx`

Único cambio: pasar la nueva prop `viewAllLabel` al `FeaturedPostsBlock`.

```tsx
<FeaturedPostsBlock
  posts={featuredPostsDtos}
  sectionLabel={tHome("featuredPosts.label")}
  readingTimeAriaLabel={(time) => tHome("featuredPosts.readingTimeAria", { time })}
  viewAllLabel={tHome("featuredPosts.viewAll")}
/>
```

No se toca nada más del archivo.

## Claves i18n — texto exacto

### `messages/es.json`

**Eliminar** del bloque `profile`:
- `profile.bio1`
- `profile.bio2`
- `profile.bio3`

**Añadir** al bloque `profile`:

```jsonc
"bio": "Hola, soy Aitor. Como <strong>Software Crafter</strong> ayudo a equipos a construir <highlight>código sostenible</highlight> desde Canarias para el mundo.",
"skills": ["TypeScript", ".NET", "Java", "Hexagonal", "TDD", "GenAI"]
```

**Añadir** dentro de `home.featuredPosts`:

```jsonc
"viewAll": "→ Ver todos los artículos"
```

### Bloque `profile` resultante en `messages/es.json`

```jsonc
"profile": {
  "bio": "Hola, soy Aitor. Como <strong>Software Crafter</strong> ayudo a equipos a construir <highlight>código sostenible</highlight> desde Canarias para el mundo.",
  "skills": ["TypeScript", ".NET", "Java", "Hexagonal", "TDD", "GenAI"],
  "impactSubtitle": "Especializado en arquitecturas limpias y TDD. Entregando producto en Fintech, Streaming y EdTech.",
  "ctaLabel": "Hablemos",
  "ctaAriaLabel": "Enviar email a Aitor Santana"
}
```

### Bloque `home.featuredPosts` resultante en `messages/es.json`

```jsonc
"featuredPosts": {
  "label": "Artículos destacados",
  "readingTimeAria": "Tiempo de lectura: {time}",
  "viewAll": "→ Ver todos los artículos"
}
```

### `messages/en.json`

**Eliminar** del bloque `profile`:
- `profile.bio1`
- `profile.bio2`
- `profile.bio3`

**Añadir** al bloque `profile`:

```jsonc
"bio": "Hi, I'm Aitor. As a <strong>Software Crafter</strong>, I help teams build <highlight>sustainable code</highlight> from the Canary Islands to the world.",
"skills": ["TypeScript", ".NET", "Java", "Hexagonal", "TDD", "GenAI"]
```

**Añadir** dentro de `home.featuredPosts`:

```jsonc
"viewAll": "→ View all articles"
```

### Bloque `profile` resultante en `messages/en.json`

```jsonc
"profile": {
  "bio": "Hi, I'm Aitor. As a <strong>Software Crafter</strong>, I help teams build <highlight>sustainable code</highlight> from the Canary Islands to the world.",
  "skills": ["TypeScript", ".NET", "Java", "Hexagonal", "TDD", "GenAI"],
  "impactSubtitle": "Specialized in clean architectures and TDD. Shipping product in Fintech, Streaming, and EdTech.",
  "ctaLabel": "Let's talk",
  "ctaAriaLabel": "Send email to Aitor Santana"
}
```

### Bloque `home.featuredPosts` resultante en `messages/en.json`

```jsonc
"featuredPosts": {
  "label": "Featured articles",
  "readingTimeAria": "Reading time: {time}",
  "viewAll": "→ View all articles"
}
```

## Tests existentes a actualizar

### `tests/components/bento/profile-block.test.tsx`

Cambios:

1. **`defaultProps`** ya no incluye `bio1/bio2/bio3`. Pasa a:

```tsx
const defaultProps = {
  impactSubtitle: "Especializado en arquitecturas limpias y TDD.",
  bio: <span>Bio condensada en un párrafo.</span>,
  skills: ["TypeScript", ".NET", "TDD"],
  ctaLabel: "Hablemos",
  ctaAriaLabel: "Enviar email a Aitor Santana",
}
```

2. **Borrar** el test `"should keep the existing bio paragraphs"` (ya no aplica — solo hay una bio).

3. **Reemplazar** por:

```tsx
it("should display the single bio paragraph", () => {
  render(<ProfileBlockContent {...defaultProps} />)
  expect(screen.getByText("Bio condensada en un párrafo.")).toBeInTheDocument()
})

it("should render a skill pill for each skill in the rail", () => {
  render(<ProfileBlockContent {...defaultProps} />)
  expect(screen.getByText("TypeScript")).toBeInTheDocument()
  expect(screen.getByText(".NET")).toBeInTheDocument()
  expect(screen.getByText("TDD")).toBeInTheDocument()
})

it("should not render the skill rail when skills array is empty", () => {
  render(<ProfileBlockContent {...defaultProps} skills={[]} />)
  expect(screen.queryByLabelText("Stack")).not.toBeInTheDocument()
})

it("should not render the HOME indicator anymore", () => {
  render(<ProfileBlockContent {...defaultProps} />)
  expect(screen.queryByText("Home")).not.toBeInTheDocument()
})
```

4. **Mantener** los tests `"should display the impact subtitle below the Software Crafter line"` y `"should display the CTA button with the correct mailto href"` sin cambios.

### `tests/components/bento/featured-posts-block.test.tsx`

Cambios:

1. **El test** `"should render section label"` se mantiene tal cual (con la nueva prop `viewAllLabel`).

2. **El test** `"should render fallback when posts array is empty"` se mantiene; añadir verificación de que NO se renderiza el footer link cuando no hay posts:

```tsx
it("should render fallback and hide footer link when posts array is empty", () => {
  render(
    <FeaturedPostsBlock
      posts={[]}
      sectionLabel="Featured articles"
      readingTimeAriaLabel={readingTimeAriaLabel}
      viewAllLabel="View all articles"
    />
  )
  expect(screen.getByText("—")).toBeInTheDocument()
  expect(screen.queryByText("View all articles")).not.toBeInTheDocument()
})
```

3. **El test** `"should render a link to /blog/{slug} for each post with title, excerpt and reading time"` se renombra a `"should render a link to /blog/{slug} for each post with title and reading time"` y se actualiza:

```tsx
it("should render a link to /blog/{slug} for each post with title and reading time", () => {
  const postDtos = [
    createPostDto({ slug: "first-post", title: "First Post" }),
    createPostDto({ slug: "second-post", title: "Second Post" }),
  ]

  render(
    <FeaturedPostsBlock
      posts={postDtos}
      sectionLabel="Featured articles"
      readingTimeAriaLabel={readingTimeAriaLabel}
      viewAllLabel="View all articles"
    />
  )

  // 2 post links + 1 footer link = 3
  const links = screen.getAllByRole("link")
  expect(links).toHaveLength(3)
  expect(links[0]).toHaveAttribute("href", "/blog/first-post")
  expect(links[1]).toHaveAttribute("href", "/blog/second-post")
  expect(links[2]).toHaveAttribute("href", "/blog")
  expect(screen.getByText("First Post")).toBeInTheDocument()
  expect(screen.getByText("Second Post")).toBeInTheDocument()
  expect(screen.getAllByText("5 min")).toHaveLength(2)
})
```

4. **Borrar** los tests `"should render primary tag chip when post has tags"` y `"should not render tag chip when post has no tags"` (ya no hay chips).

5. **Sustituirlos por** tests nuevos:

```tsx
it("should not render excerpts in list items", () => {
  const postDto = createPostDto({ excerpt: "This excerpt should NOT appear" })
  render(
    <FeaturedPostsBlock
      posts={[postDto]}
      sectionLabel="Featured articles"
      readingTimeAriaLabel={readingTimeAriaLabel}
      viewAllLabel="View all articles"
    />
  )
  expect(screen.queryByText("This excerpt should NOT appear")).not.toBeInTheDocument()
})

it("should render a zero-padded ordinal number for each post", () => {
  const postDtos = [
    createPostDto({ slug: "a", title: "A" }),
    createPostDto({ slug: "b", title: "B" }),
    createPostDto({ slug: "c", title: "C" }),
  ]
  render(
    <FeaturedPostsBlock
      posts={postDtos}
      sectionLabel="Featured articles"
      readingTimeAriaLabel={readingTimeAriaLabel}
      viewAllLabel="View all articles"
    />
  )
  expect(screen.getByText("01")).toBeInTheDocument()
  expect(screen.getByText("02")).toBeInTheDocument()
  expect(screen.getByText("03")).toBeInTheDocument()
})

it("should render a zero-padded total count in the header", () => {
  const postDtos = [createPostDto({ slug: "a" }), createPostDto({ slug: "b" })]
  render(
    <FeaturedPostsBlock
      posts={postDtos}
      sectionLabel="Featured articles"
      readingTimeAriaLabel={readingTimeAriaLabel}
      viewAllLabel="View all articles"
    />
  )
  expect(screen.getByText("(02)")).toBeInTheDocument()
})

it("should render a footer link to /blog with the viewAll label", () => {
  const postDto = createPostDto()
  render(
    <FeaturedPostsBlock
      posts={[postDto]}
      sectionLabel="Featured articles"
      readingTimeAriaLabel={readingTimeAriaLabel}
      viewAllLabel="→ View all articles"
    />
  )
  const footerLink = screen.getByRole("link", { name: "→ View all articles" })
  expect(footerLink).toHaveAttribute("href", "/blog")
})
```

6. **Mantener** el test `"should expose accessible reading time label via screen reader text"` actualizando solo la firma:

```tsx
it("should expose accessible reading time label via screen reader text", () => {
  const postDto = createPostDto({ readingTime: "5 min" })
  render(
    <FeaturedPostsBlock
      posts={[postDto]}
      sectionLabel="Featured articles"
      readingTimeAriaLabel={readingTimeAriaLabel}
      viewAllLabel="View all articles"
    />
  )
  expect(screen.getByText("Reading time: 5 min")).toBeInTheDocument()
})
```

7. **Nota sobre `next-intl` Link**: el `Link` de `@/src/i18n/navigation` puede necesitar mock similar al de `next/link` si los tests fallan por providers. Si esto ocurre, añadir al inicio del archivo:

```tsx
vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))
```

(Comprobar primero si los tests pasan sin mock; el dock de navegación lo hace de la misma manera y no parece requerir mock explícito según `navigation-dock.tsx`. Si falla, aplicar el mock anterior.)

## Implementation Steps

1. **Actualizar `messages/es.json`**:
   - Eliminar `profile.bio1`, `profile.bio2`, `profile.bio3`.
   - Añadir `profile.bio` y `profile.skills` (array).
   - Añadir `home.featuredPosts.viewAll`.
2. **Actualizar `messages/en.json`** con los equivalentes en inglés.
3. **Reescribir `components/bento/profile-block.tsx`**:
   - Nueva firma de `ProfileBlockContentProps` (`bio`, `skills`).
   - Helper `toSkillsArray(value: unknown): string[]` con type guard.
   - JSX según sección "JSX completo del nuevo ProfileBlock".
   - Server component construye `bio` con `t.rich("bio", { strong, highlight })` y `skills` con `toSkillsArray(t.raw("skills"))`.
4. **Reescribir `components/bento/featured-posts-block.tsx`**:
   - Reemplazar import de `next/link` por `import { Link } from "@/src/i18n/navigation"`.
   - Quitar import de `Clock` de lucide-react.
   - Añadir prop `viewAllLabel: string` a `FeaturedPostsBlockProps`.
   - JSX según sección "JSX completo del nuevo FeaturedPostsBlock".
5. **Actualizar `app/[locale]/page.tsx`** añadiendo la prop `viewAllLabel={tHome("featuredPosts.viewAll")}` al `<FeaturedPostsBlock>`.
6. **Actualizar `tests/components/bento/profile-block.test.tsx`** con la nueva `defaultProps` y los nuevos tests.
7. **Actualizar `tests/components/bento/featured-posts-block.test.tsx`** con la nueva `viewAllLabel` y los nuevos tests (numeración, contador, footer, no-excerpt). Añadir mock de `@/src/i18n/navigation` si los tests fallan al ejecutar.
8. **Ejecutar `pnpm type-check`** — debe pasar con 0 errores.
9. **Ejecutar `pnpm test`** — todos verdes.
10. **Verificar manualmente** (`pnpm dev`) que la home renderiza:
    - ProfileBlock sin huecos, con skill rail visible y CTA al fondo.
    - FeaturedPostsBlock como lista pura con numeración y footer "→ Ver todos los artículos" clicable.
    - Cambio de idioma (LanguageSwitcher) actualiza bio, skills y `viewAll`.

## Testing Requirements

- [ ] `tests/components/bento/profile-block.test.tsx` actualizado con la nueva `defaultProps`.
- [ ] Test `"should display the single bio paragraph"` añadido.
- [ ] Test `"should render a skill pill for each skill in the rail"` añadido.
- [ ] Test `"should not render the skill rail when skills array is empty"` añadido.
- [ ] Test `"should not render the HOME indicator anymore"` añadido.
- [ ] `tests/components/bento/featured-posts-block.test.tsx` actualizado con la nueva `viewAllLabel`.
- [ ] Test del footer link `"should render a footer link to /blog with the viewAll label"` añadido.
- [ ] Test de numeración `"should render a zero-padded ordinal number for each post"` añadido.
- [ ] Test del contador `"should render a zero-padded total count in the header"` añadido.
- [ ] Test de ausencia de excerpts `"should not render excerpts in list items"` añadido.
- [ ] Tests existentes de chip/tag eliminados.
- [ ] Todos los tests siguen `describe/it/should`.
- [ ] `pnpm test` pasa con todos verdes.

## Code Standards Checklist

- [ ] No `any` types — usar `unknown` en `toSkillsArray` y type guard.
- [ ] All functions have explicit return types (`React.ReactElement`, `Promise<React.ReactElement>`, `string[]`).
- [ ] `??` not `||` for nullish checks.
- [ ] Named exports en `components/bento/` (ya es el caso).
- [ ] Server Component por defecto — no añadir `"use client"`.
- [ ] No usar `as` para validar `t.raw("skills")` — usar type guard.
- [ ] No `null` — usar `undefined` o ausencia.
- [ ] Tailwind classes, sin estilos inline.
- [ ] Tests siguen patrón `describe("ClassName", () => { it("should ...") })`.
- [ ] Mocks con `vi.fn()` (en este plan no es necesario, solo si tests requieren mock de `@/src/i18n/navigation`).
- [ ] Sin `any` en tests.
- [ ] Sin abreviaciones — variables semánticas (`formattedCount`, `itemNumber`, `toSkillsArray`).

## Riesgos

1. **`t.raw("skills")` puede devolver cualquier tipo**: el i18n no garantiza el tipo. **Mitigación**: type guard `toSkillsArray(value: unknown): string[]` que valida `Array.isArray` y filtra strings. Si la clave está mal escrita o falta, el rail simplemente no se renderiza (el JSX hace `skills.length > 0`).

2. **Eliminar `profile.bio1/bio2/bio3` puede romper si algún sitio externo las usa**: verificado con `grep` que solo se usan en `components/bento/profile-block.tsx` y su test. El módulo `about.bio1/bio2` que usa `app/[locale]/sobre-mi/page.tsx` está en namespace distinto (`about`). **Riesgo: bajo**. Si el reviewer detecta algún uso adicional no listado, restaurar las claves como `bio1Deprecated` o mantenerlas hasta el commit de cleanup.

3. **El skill rail puede romper en mobile (wrap)**: con 6 pills cortas y `flex flex-wrap gap-2`, debería wrappear a 2 líneas en mobile sin problemas. Cada pill mide ≈ 70-90 px de ancho × 6 ≈ 480 px, lo que cabe en una sola línea ≥ 480 px. En mobile < 480 px wrappea a 2 líneas. Verificación manual al ejecutar `pnpm dev`.

4. **Footer link de `/blog` con i18n routing**: usar `Link` de `@/src/i18n/navigation` resuelve `/es/blog` o `/en/blog` automáticamente. Si en algún momento el routing cambia, el componente sigue funcionando porque next-intl gestiona el prefijo. **Verificar manualmente** que al cambiar de ES a EN, el link apunta al `/blog` del locale correcto.

5. **Tests del componente con `Link` de `@/src/i18n/navigation`**: si React Testing Library no monta el provider, el `Link` puede dar error. **Mitigación**: mock manual si los tests fallan (ver paso 7 en testing requirements).

6. **`mt-auto pt-6` en CTA del ProfileBlock requiere `flex-col` en el contenedor**: ya está garantizado por la clase `flex h-full flex-col` del wrapper exterior. Verificar que el orden hijo es: header → bio → skills → CTA con `mt-auto`. **Si el CTA queda en medio del card (no al fondo)**, el `flex-col` del padre se ha perdido — revisar.

7. **Contraste de pills**: `text-muted-foreground` sobre `bg-white/[0.03]` puede ser tenue. Verificar contraste ≥ 4.5:1 (WCAG AA). Si falla, subir a `bg-white/[0.05]`. No bloqueante para el commit; ajuste menor.

8. **Title `line-clamp-1` puede ocultar títulos largos en mobile**: si un título es muy largo y queda truncado a "...", el visitante no ve la idea completa. Trade-off aceptado por la spec B2 (jerarquía editorial limpia). El alt aria viene del título completo dentro del `<Link>`, así que para screen readers no se pierde.

## Complexity Estimate

**S (Small, <2h)**

- Solo capa UI: 2 componentes editados + 2 archivos JSON + 2 archivos de tests.
- Sin cambios en dominio/aplicación/infraestructura.
- Patrones ya existentes en el repo (skill rail = lista de pills, footer link = `Link` de i18n routing).
- Type guard `toSkillsArray` añade ~5 líneas; el resto es JSX y JSON.
