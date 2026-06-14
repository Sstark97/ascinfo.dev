# Task: Commit 4 — Featured posts on home with reading time

## Resumen

Reemplazar el bloque `LatestArticleBlock` (col-span-6 de la fila 1 del bento de la home) por un nuevo `FeaturedPostsBlock` que muestra hasta 4 artículos destacados (`featured: true` en Notion / frontmatter), ordenados por fecha desc. Si no hay suficientes destacados, completa con los siguientes posts no destacados por fecha desc (sin duplicados). Cada card mostrará título, excerpt (line-clamp-2), `readingTime` y la primera tag como chip. El campo `featured` ya existe en dominio, DTO y mapper de Notion, por lo que NO se modifica el mapper. Se añade el use case `GetFeaturedPosts` (plural), se cablea en `Container.ts` como `posts.getFeaturedList`, y se añaden claves i18n en `messages/{es,en}.json` bajo `home.featuredPosts.*`. `GetFeaturedPost` (singular) se conserva intacto para compatibilidad y `LatestArticleBlock` no se elimina.

## Description

La sección 6 del plan original consiste en que la home muestre los artículos destacados del blog, en vez del "último artículo + 2 enlaces a anteriores". Aprovechamos el flag `featured` que ya está modelado en el dominio y mapeado desde Notion. La home pasa de 1 artículo principal + 2 anteriores a 4 cards verticales en el mismo slot del bento (col-span-6 en md). Cada card muestra `readingTime` por primera vez en este bloque (ya estaba disponible en `PostDto`).

## Acceptance Criteria

- [ ] Se crea `GetFeaturedPosts` con firma `async execute(locale: Locale, limit: number): Promise<Post[]>`
- [ ] El use case devuelve hasta `limit` posts: primero los `featured: true` ordenados por fecha desc, luego completa con los no destacados ordenados por fecha desc; nunca duplica posts; nunca lanza
- [ ] Casos edge cubiertos por tests: sin posts, sin featured, todos featured, `limit=0`, `limit` mayor que total
- [ ] `Container.ts` expone `posts.getFeaturedList = new GetFeaturedPosts(contentRepository)` sin eliminar `posts.getFeatured`
- [ ] Existe `components/bento/featured-posts-block.tsx` como Server Component con props tipadas (sin `any`, return type `React.ReactElement`)
- [ ] El componente renderiza una `<section>` con label en mono uppercase + lista de cards; cada card es un `<Link>` a `/blog/{slug}` con título, excerpt (line-clamp-2), tag principal como chip y `readingTime`
- [ ] La home (`app/[locale]/page.tsx`) reemplaza `<LatestArticleBlock>` por `<FeaturedPostsBlock>` en el mismo slot (md:col-span-6) usando `posts.getFeaturedList.execute(locale, 4)`
- [ ] Se eliminan de la home el cálculo `recentPosts`, el `featuredPost`/`featuredPostDto` y la llamada a `posts.getFeatured.execute(l)` (ya no se usan en home; el use case singular sigue existiendo pero no se invoca desde aquí)
- [ ] Claves i18n añadidas en `messages/{es,en}.json` bajo `home.featuredPosts.*`
- [ ] Tests del use case: archivo `tests/lib/content/application/use-cases/posts/GetFeaturedPosts.test.ts` con ≥5 casos
- [ ] Test del componente: archivo `tests/components/bento/featured-posts-block.test.tsx` con ≥4 casos
- [ ] `pnpm type-check` pasa con 0 errores
- [ ] `pnpm test` pasa con todos los tests verdes (incluidos los existentes que pudieran tocar la home)

## Architecture Decisions

- **Capa**: el nuevo use case vive en `application/use-cases/posts/` (mismo nivel que `GetFeaturedPost`). Reutiliza `GetAllPosts` internamente (como ya hace `GetFeaturedPost`) para mantener la ordenación por fecha en un único sitio.
- **Reutilización**: NO duplicar lógica de orden. `GetFeaturedPosts.execute` invoca `this.getAllPosts.execute(locale)` y filtra solo `featured === true`, luego corta a `limit`. **Sin fallback**: si hay menos featured que `limit`, devuelve menos. Si hay cero, devuelve `[]`. El nombre del use case debe ser honesto — no rellenar con no-featured.
- **Orden**: `filter()` preserva el orden por fecha desc que ya devuelve `GetAllPosts`. No hace falta re-ordenar.
- **Server Component**: `FeaturedPostsBlock` no necesita estado ni interactividad cliente. No lleva `"use client"`. `next/link` funciona en server components.
- **Props del componente**: recibe `PostDto[]` ya mapeado en el server (la home llama `.toDto()` antes de pasar). Esto sigue el patrón del resto de bento blocks (`LatestArticleBlock`, `FeaturedProjectBlock`).
- **i18n**: se inyectan los strings como props (mismo patrón que el resto de bento blocks). El componente NO usa `getTranslations` internamente.
- **No re-usar `LatestArticleBlock`**: aunque visualmente comparte estilo, su contrato (1 artículo + N anteriores) es muy distinto. Crear componente nuevo y dejar el existente intacto.
- **Limit en call site**: el limit (`4`) se pasa explícitamente desde la home como literal numérico, no como constante exportada. Si en el futuro se cambia el slot, sólo se toca la home.
- **`Locale` tipado**: se importa el tipo de `@/content/domain/types/Locale` ('es' | 'en') igual que en el resto de use cases.

## Files to Create/Modify

### CREATE

- `src/lib/content/application/use-cases/posts/GetFeaturedPosts.ts` — nuevo use case plural
- `components/bento/featured-posts-block.tsx` — nuevo Server Component
- `tests/lib/content/application/use-cases/posts/GetFeaturedPosts.test.ts` — tests unitarios del use case
- `tests/components/bento/featured-posts-block.test.tsx` — tests del componente con React Testing Library

### MODIFY

- `src/lib/content/infrastructure/Container.ts` — añadir import de `GetFeaturedPosts` y `getFeaturedList: new GetFeaturedPosts(contentRepository)` dentro de `posts`
- `app/[locale]/page.tsx` — sustituir `LatestArticleBlock` por `FeaturedPostsBlock`, eliminar cálculo de `recentPosts`, dejar de invocar `posts.getFeatured` y `posts.getAll` para featuredPostDto, mantener `posts.getAll` sólo para `heroStats` (allPosts.length); usar `posts.getFeaturedList.execute(l, 4)`
- `messages/es.json` — añadir `home.featuredPosts.label` y `home.featuredPosts.readingTimeAria`
- `messages/en.json` — mismos keys en inglés

### NOT TOUCHED (intencional)

- `components/bento/latest-article-block.tsx` — se conserva por si tiene tests u otros usos; reviewer puede sugerir borrarlo en commit posterior
- `src/lib/content/application/use-cases/posts/GetFeaturedPost.ts` — singular intacto para retrocompat
- Páginas `/blog`, `/blog/[slug]` y listados (siguen usando `GetAllPosts`)
- Mapper de Notion (`PostPropertyMapper`) — ya extrae `featured` correctamente

## Use Case: `GetFeaturedPosts`

### Firma exacta

```ts
import { Post } from "@/content/domain/entities/Post"
import { GetAllPosts } from "./GetAllPosts"
import type { ContentRepository } from "@/content/domain/repositories/ContentRepository"
import type { Locale } from "@/content/domain/types/Locale"

export class GetFeaturedPosts {
  private readonly getAllPosts: GetAllPosts

  constructor(contentRepository: ContentRepository) {
    this.getAllPosts = new GetAllPosts(contentRepository)
  }

  async execute(locale: Locale, limit: number): Promise<Post[]> {
    if (limit <= 0) return []
    const posts = await this.getAllPosts.execute(locale)
    return posts.filter((post) => post.featured === true).slice(0, limit)
  }
}
```

### Casos edge

| Escenario | Entrada | Resultado esperado |
|---|---|---|
| Sin posts | `readAll → []`, `limit=4` | `[]` |
| Sin featured | 3 posts todos `featured=false`, `limit=4` | `[]` (no fallback) |
| Todos featured | 3 posts todos `featured=true`, `limit=4` | 3 posts ordenados por fecha desc |
| Mezcla con suficientes featured | 5 featured + 3 no, `limit=4` | 4 featured más recientes (los no-featured se descartan) |
| Mezcla con pocos featured | 2 featured + 5 no, `limit=4` | 2 featured (no se rellena con no-featured) |
| `limit=0` | cualquier | `[]` |
| `limit` > total featured | 2 featured + 5 no, `limit=10` | 2 featured |

### Notas de implementación

- `Post.featured` es `boolean \| undefined`. Comparar con `=== true` para tratar `undefined` como no destacado (evita ambigüedades con `!!`).
- NO modificar el orden interno de los subsets — `GetAllPosts` ya ordena por fecha desc, `filter` preserva orden.
- NO usar `||`; el use case no necesita defaults nulables.

## Component: `FeaturedPostsBlock`

### Localización

`components/bento/featured-posts-block.tsx`

### Tipo

Server Component (sin `"use client"`).

### Props

```ts
import type { PostDto } from "@/content/application/dto/PostDto"

type FeaturedPostsBlockProps = {
  posts: PostDto[]
  sectionLabel: string
  readingTimeAriaLabel: (minutes: string) => string
}
```

Notas:
- `sectionLabel`: ej. "Artículos destacados" / "Featured articles".
- `readingTimeAriaLabel`: callback que recibe el `readingTime` ya formateado (string) y devuelve un texto a11y, ej. `(time) => \`Tiempo de lectura: \${time}\``. Permite localizar el aria-label sin acoplar el componente a `next-intl`. La home la construye con `tHome("featuredPosts.readingTimeAria", { time })` envuelto en arrow function — ver call site abajo.

  Alternativa más sencilla si no queremos callbacks como prop: aceptar `readingTimeAriaTemplate: string` con `"{time}"` como placeholder y hacer reemplazo dentro. **Decisión: usar callback** para ser consistente con cómo se inyectan strings i18n en otros bento blocks (passing pre-rendered strings) y porque keeps the component framework-agnostic.

### Comportamiento

- Si `posts.length === 0`, el componente renderiza únicamente la `<section>` con el label y un fallback discreto: `<p className="mt-4 text-sm text-muted-foreground">—</p>`. (No tirar errores, no romper layout.)
- Cada card es un `<Link href={\`/blog/\${post.slug}\`}>` con:
  - Título (`h3` semántico, text-base font-semibold, hover:text-[#FCA311])
  - Excerpt en `<p>` con `line-clamp-2 text-sm text-muted-foreground`
  - Footer de card en una fila flex:
    - Tag principal (`post.tags[0]`) como chip naranja si existe (no renderizar nada si `tags.length === 0`)
    - `readingTime` con icono `Clock` de lucide-react opcionalmente, prefijado por un `<span className="sr-only">` con `readingTimeAriaLabel(post.readingTime)`

### JSX completo (referencia)

```tsx
import Link from "next/link"
import { ArrowUpRight, Clock } from "lucide-react"
import type { PostDto } from "@/content/application/dto/PostDto"

type FeaturedPostsBlockProps = {
  posts: PostDto[]
  sectionLabel: string
  readingTimeAriaLabel: (minutes: string) => string
}

export function FeaturedPostsBlock({
  posts,
  sectionLabel,
  readingTimeAriaLabel,
}: FeaturedPostsBlockProps): React.ReactElement {
  return (
    <section
      aria-label={sectionLabel}
      className="flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {sectionLabel}
        </span>
      </div>

      {posts.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">—</p>
      ) : (
        <ul className="mt-4 flex flex-1 flex-col divide-y divide-white/5">
          {posts.map((post) => {
            const primaryTag = post.tags[0]
            return (
              <li key={post.slug} className="first:pt-0 last:pb-0 py-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 rounded"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-[#FCA311]">
                      {post.title}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FCA311]"
                    />
                  </div>

                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    {primaryTag !== undefined && (
                      <span className="inline-block rounded-full bg-[#FCA311]/10 px-2 py-0.5 font-mono text-[11px] font-medium text-[#FCA311]">
                        {primaryTag}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      <Clock aria-hidden="true" className="h-3 w-3" />
                      <span className="sr-only">{readingTimeAriaLabel(post.readingTime)}</span>
                      <span aria-hidden="true">{post.readingTime}</span>
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
```

### Layout responsive

- **Mobile (default)**: `flex-col` con cards en stack vertical, separadas por `divide-y`. Padding compacto (`py-3`).
- **Desktop (md+)**: igual. El bento ocupa `md:col-span-6` (6 columnas de 12), así que no hay grid horizontal interno. La altura sigue al hermano (`ProfileBlock`) mediante `h-full`.
- **Saturación**: con 4 cards y `line-clamp-2` en excerpt, la altura aprox debería casar con `ProfileBlock`. Si en revisión visual se ve excesivo, el reviewer podrá reducir `limit` a 3 sin cambios de código (solo el literal en la home).

## Home: `app/[locale]/page.tsx`

### Cambios concretos

1. Eliminar imports:
   - `import { LatestArticleBlock } from "@/components/bento/latest-article-block"`
2. Añadir import:
   - `import { FeaturedPostsBlock } from "@/components/bento/featured-posts-block"`
3. En `Promise.all`:
   - Eliminar `posts.getFeatured.execute(l)`
   - Sustituir por `posts.getFeaturedList.execute(l, 4)` (devuelve `Post[]`)
4. Eliminar `featuredPost`, `featuredPostDto`, `recentPosts` (variables ya no usadas).
5. Mapear los featured a DTOs: `const featuredPostsDtos = featuredPosts.map((post) => post.toDto())`
6. Reemplazar el JSX del slot col-span-6 fila 1:

```tsx
<div className="md:col-span-6 flex">
  <FeaturedPostsBlock
    posts={featuredPostsDtos}
    sectionLabel={tHome("featuredPosts.label")}
    readingTimeAriaLabel={(time) => tHome("featuredPosts.readingTimeAria", { time })}
  />
</div>
```

7. Mantener intactos los demás bloques (`ProfileBlock`, `HeroStatsBlock`, `FeaturedProjectBlock`, `RecentTalkBlock`, `NavigationDock`).
8. Mantener `posts.getAll.execute(l)` para `allPosts.length` (heroStats `articles`).

### Resultado del `Promise.all`

```ts
const [tHome, tProject, featuredPosts, featuredProject, featuredTalk, allPosts, allTalks, allProjects] = await Promise.all([
  getTranslations("home"),
  getTranslations("project"),
  posts.getFeaturedList.execute(l, 4),
  projects.getFeatured.execute(l),
  talks.getFeatured.execute(l),
  posts.getAll.execute(l),
  talks.getAll.execute(l),
  projects.getAll.execute(l),
])
```

## Container.ts

### Cambios

```ts
// añadir import
import { GetFeaturedPosts } from "@/content/application/use-cases/posts/GetFeaturedPosts"

// dentro de `export const posts = { ... }`:
export const posts = {
  getAll: new GetAllPosts(contentRepository),
  getBySlug: new GetPostBySlug(contentRepository),
  getAllTags: new GetAllPostTags(contentRepository),
  getFeatured: new GetFeaturedPost(contentRepository),
  getFeaturedList: new GetFeaturedPosts(contentRepository),
}
```

NO renombrar `getFeatured`. NO tocar `projects` ni `talks`.

## Claves i18n

### `messages/es.json` — añadir bajo `home`

```json
"featuredPosts": {
  "label": "Artículos destacados",
  "readingTimeAria": "Tiempo de lectura: {time}"
}
```

### `messages/en.json` — añadir bajo `home`

```json
"featuredPosts": {
  "label": "Featured articles",
  "readingTimeAria": "Reading time: {time}"
}
```

Notas:
- `{time}` es el placeholder ICU. `tHome("featuredPosts.readingTimeAria", { time })` retorna el string final.
- NO eliminar `latestArticle` ni `previous` de los mensajes en este commit (todavía referenciados por `LatestArticleBlock` aunque ya no se monte; cleanup en commit posterior si se decide).

## Implementation Steps

1. **Crear `GetFeaturedPosts.ts`** con la firma exacta y lógica de combinación featured + fallback. Importar `Post`, `GetAllPosts`, `ContentRepository`, `Locale`.
2. **Crear test del use case** `tests/lib/content/application/use-cases/posts/GetFeaturedPosts.test.ts` siguiendo patrón de `GetFeaturedPost.test.ts`. Usar `mockMultiplePosts` y `mockFeaturedPost` de `@fixtures/posts.fixtures`. Pasar `locale: "es"` y `limit` explícito en cada `execute`.
3. **Cablear en `Container.ts`**: añadir import + propiedad `getFeaturedList`.
4. **Crear `FeaturedPostsBlock`** Server Component con el JSX y clases Tailwind definidos arriba.
5. **Crear test del componente** `tests/components/bento/featured-posts-block.test.tsx` con React Testing Library.
6. **Modificar `app/[locale]/page.tsx`**: ajustar imports, Promise.all, mapeo a DTOs y JSX del slot col-span-6.
7. **Añadir claves i18n** en `messages/es.json` y `messages/en.json` bajo `home.featuredPosts`.
8. **Ejecutar `pnpm type-check`** — debe pasar con 0 errores.
9. **Ejecutar `pnpm test`** — todos verdes. Si existe un test que renderice la home y dependa de `LatestArticleBlock`, ajustarlo (probablemente no existe; verificar `tests/app/` y `tests/components/`).
10. **Verificar manualmente** que la home renderiza el nuevo bloque con 4 cards (o menos si no hay contenido suficiente).

## Testing Requirements

### Unit tests — `tests/lib/content/application/use-cases/posts/GetFeaturedPosts.test.ts`

Estructura: `describe("GetFeaturedPosts", () => { describe("execute()", () => { it("should ...") }) })`

Casos a cubrir (mínimo 6):

- [ ] `should return featured posts first sorted by date desc, then fill with non-featured sorted by date desc up to limit`
  - Arrange: `mockMultiplePosts` (3 no-featured) + `mockFeaturedPost` (1 featured) → 4 total
  - Act: `execute("es", 4)`
  - Assert: posts[0].slug === "featured-post", siguientes 3 en orden post-3, post-1, post-2

- [ ] `should return only featured posts when there are enough featured to fill the limit`
  - Arrange: 3 posts con `featured=true` fechas distintas, limit=2
  - Assert: 2 posts featured ordenados por fecha desc, ninguno no-featured

- [ ] `should fall back to non-featured posts when there are no featured posts`
  - Arrange: `mockMultiplePosts` (todos no-featured), limit=2
  - Assert: 2 posts ordenados por fecha desc (post-3, post-1)

- [ ] `should return empty array when no posts exist`
  - Arrange: `readAll → []`, limit=4
  - Assert: `[]`

- [ ] `should return empty array when limit is 0`
  - Arrange: cualquier dataset, limit=0
  - Assert: `[]`

- [ ] `should return all posts when limit exceeds total count`
  - Arrange: 2 posts, limit=10
  - Assert: array de longitud 2, sin error

- [ ] (opcional, séptimo caso) `should not duplicate posts in the result`
  - Arrange: dataset con featured y no-featured, limit alto
  - Assert: lista de slugs es única (`new Set(slugs).size === slugs.length`)

Mock pattern:
```ts
const mockRepo: ContentRepository = {
  readAll: vi.fn().mockResolvedValue(dataset),
  readBySlug: vi.fn(),
}
const useCase = new GetFeaturedPosts(mockRepo)
const result = await useCase.execute("es", 4)
```

### Component tests — `tests/components/bento/featured-posts-block.test.tsx`

Estructura: `describe("FeaturedPostsBlock", () => { it("should ...") })`

Casos a cubrir (mínimo 4):

- [ ] `should render section label`
  - Render con `posts=[]`, `sectionLabel="Featured articles"`
  - `expect(screen.getByText("Featured articles")).toBeInTheDocument()`

- [ ] `should render fallback when posts array is empty`
  - Render con `posts=[]`
  - `expect(screen.getByText("—")).toBeInTheDocument()`

- [ ] `should render a link to /blog/{slug} for each post with title, excerpt and reading time`
  - Render con 2 PostDto fake (factory local)
  - `screen.getAllByRole("link")` length === 2
  - Cada link tiene `href` correcto
  - Títulos y excerpts visibles

- [ ] `should render primary tag chip when post has tags`
  - Post con `tags: ["typescript", "testing"]` — sólo se muestra "typescript"
  - `expect(screen.getByText("typescript")).toBeInTheDocument()`
  - `expect(screen.queryByText("testing")).not.toBeInTheDocument()`

- [ ] `should not render tag chip when post has no tags`
  - Post con `tags: []`
  - el contenedor sigue mostrando readingTime pero no hay chip

- [ ] (opcional) `should expose accessible reading time label via screen reader text`
  - Verificar que el callback `readingTimeAriaLabel` se invoca y el string aparece con `screen.getByText("Reading time: 5 min")`

Helper local recomendado:
```ts
const createPostDto = (overrides?: Partial<PostDto>): PostDto => ({
  slug: "test-post",
  title: "Test post",
  excerpt: "Excerpt of the test post",
  date: "2024-01-15",
  lastModified: "2024-01-15",
  readingTime: "5 min",
  tags: ["typescript"],
  featured: true,
  content: "...",
  plainTextContent: "...",
  metaTitle: "Test post",
  metaDescription: "Excerpt of the test post",
  ...overrides,
})
```

Mock de `next/link` no es estrictamente necesario (RTL lo soporta), pero si surgen problemas:
```ts
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))
```

### E2E tests

No se añade nuevo E2E en este commit. Si existe ya un E2E que valida la home, ejecutarlo y confirmar que sigue verde tras el cambio. (No editar a menos que un selector apunte a clase específica del antiguo `LatestArticleBlock` — improbable según convención del proyecto.)

## Code Standards Checklist

- [ ] No `any` types en código nuevo ni en tests
- [ ] Todas las funciones declaran return type explícito (`Promise<Post[]>`, `React.ReactElement`)
- [ ] `??` en vez de `||` para nullish checks
- [ ] Named exports en `src/lib/` y en `components/bento/featured-posts-block.tsx`
- [ ] Use case usa método `execute()`
- [ ] Domain layer no se toca (la `entity Post` ya tiene `featured`)
- [ ] No `useEffect` (es Server Component)
- [ ] Server Component por defecto (sin `"use client"`)
- [ ] Props interface explícita
- [ ] Tailwind, sin estilos inline
- [ ] Tests siguen `describe("ClassName", () => { describe("method()", () => { it("should ...") }) })`
- [ ] Mocks con `vi.fn()`, no `jest.fn()`
- [ ] Sin `null` (excepto donde lo requiera la API existente; aquí no aplica)
- [ ] Sin `as` sin validación
- [ ] Sin `process.env` en componente ni use case

## Riesgos

- **Layout overflow**: con 4 cards y excerpts largos, la altura del bloque podría exceder la del `ProfileBlock` adyacente. Mitigación: `line-clamp-2` en excerpt y `divide-y` con `py-3` (sin gap excesivo). Reviewer puede ajustar a 3 cards si visualmente queda apretado.
- **Render del `Link` en Server Component**: `next/link` es seguro en server components en Next.js 16. No requiere `"use client"`. Validar al ejecutar `pnpm dev` que no aparecen warnings de hydration.
- **Fallback sin datos**: el componente renderiza "—" si `posts` está vacío. La home llamará `execute(l, 4)` que NUNCA lanza, así que el flujo es robusto.
- **Tests rotos**: ningún test conocido depende de `LatestArticleBlock` (no hay archivo `latest-article-block.test.tsx` en `tests/components/bento/`). Aun así, ejecutar `pnpm test` completo es obligatorio.
- **Snapshots de la home E2E**: si existe un snapshot/screenshot de la home, deberá regenerarse. `tests/app/` con Playwright suele validar selectores semánticos, no snapshots — bajo riesgo.
- **Claves i18n no eliminadas**: `home.latestArticle` y `home.previous` siguen en `messages/{es,en}.json` aunque ya no se usen. Esto es intencional (cleanup en commit posterior). No causa errores ni warnings de next-intl.
- **Mapper de Notion**: confirmado que `PostPropertyMapper` extrae `featured` con `extractCheckbox`. Si en producción ningún post tiene Notion property "Featured" marcada, el use case devolverá `[]` y la home mostrará la card con el fallback "—". El usuario debe marcar al menos 3-4 posts como featured en Notion antes de desplegar.

## Complexity Estimate

**S (Small, <2h)**

- 1 use case nuevo + 1 componente nuevo + edits puntuales en home, Container e i18n
- Patrones ya existentes en el repo (referencia directa a `GetFeaturedPost`, `HeroStatsBlock`, `LatestArticleBlock`)
- Tests siguen el mismo patrón de los existentes
