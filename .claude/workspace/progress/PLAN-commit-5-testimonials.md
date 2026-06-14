# Task: feat(home,about) — add testimonials section (commit 5)

## Description

Add a "Testimonials" section to the home page and the "Sobre mí" page that surfaces social proof
captured from Aitor's LinkedIn recommendations. The implementation must follow the project's
hexagonal architecture: a new domain entity (`Testimonial`), a dedicated repository interface
(`TestimonialRepository`), a use case (`GetAllTestimonials`), and two infrastructure adapters
(MDX local files and Notion). UI is composed of two Server Components living in
`components/testimonials/` and rendered through next-intl translations. All Testimonial cards are
themselves links to the author's LinkedIn profile (no internal author page) with full accessibility
support (semantic `<blockquote>`, `aria-label`, `target="_blank" rel="noopener noreferrer"`).

This is **commit 5** in the home/about revamp track. It only ships placeholder author data
(`Nombre Apellido`, `Rol`, `Empresa`, `https://www.linkedin.com/in/placeholder/`); the user will
edit those values in the MDX files after the commit lands. Photos are intentionally optional and
will be added later by dropping JPG/WebP files in `/public/testimonials/` and editing
`avatarUrl` in the MDX frontmatter.

## Acceptance Criteria

- [ ] New entity `Testimonial` exists in `src/lib/content/domain/entities/Testimonial.ts` with a
      `Testimonial.create(slug, frontmatter)` static factory, public/typed getters, and
      a `toDto(): TestimonialDto` method.
- [ ] New dedicated repository interface `TestimonialRepository` lives in
      `src/lib/content/domain/repositories/TestimonialRepository.ts`. It is **not** merged
      into the generic `ContentRepository<F>` contract (rationale below).
- [ ] New DTO `TestimonialDto` exists in `src/lib/content/application/dto/TestimonialDto.ts`.
- [ ] New use case `GetAllTestimonials` exists in
      `src/lib/content/application/use-cases/testimonials/GetAllTestimonials.ts` with
      `execute(locale: Locale): Promise<Testimonial[]>` and orders results by `order` ascending,
      placing testimonials without an `order` at the end (preserving discovery order among ties).
- [ ] Two adapters implement `TestimonialRepository`:
        `MDXTestimonialRepository` (reads `src/content/testimonials/*.mdx`, filters by locale via
        a required `locale` frontmatter field) and `NotionTestimonialRepository` (queries a
        dedicated Notion database via `data_sources/<id>/query`).
- [ ] `TestimonialPropertyMapper` exists in
      `src/lib/content/infrastructure/notion/mappers/TestimonialPropertyMapper.ts` and maps the
      Notion properties documented below into `TestimonialFrontmatter`.
- [ ] `Container.ts` wires `testimonials.getAll` (`GetAllTestimonials`). When
      `CMS_PROVIDER=notion` but Notion env vars are incomplete, it falls back to
      `MDXTestimonialRepository` with a `console.warn`, mirroring the existing content
      repository's fallback strategy.
- [ ] Two MDX placeholder files exist:
        `src/content/testimonials/jose-perez.mdx` (Spanish locale, `order: 1`) and
        `src/content/testimonials/maria-garcia.mdx` (Spanish locale, `order: 2`),
        plus the English translations `jose-perez.en.mdx` and `maria-garcia.en.mdx`.
- [ ] Two Server Components exist:
        `components/testimonials/testimonial-card.tsx` (renders a single testimonial as an
        accessible anchor to LinkedIn) and
        `components/testimonials/testimonials-section.tsx` (h2 title + grid layout).
- [ ] Home page (`app/[locale]/page.tsx`) renders `<TestimonialsSection>` as a new row
      `md:col-span-12` **between** the `HeroStatsBlock` row and the
      `FeaturedProjectBlock + RecentTalkBlock + NavigationDock` row.
- [ ] About page (`app/[locale]/sobre-mi/page.tsx`) renders `<TestimonialsSection>` after
      the "Stack Técnico" section and **before** `<ContactCtaSection>`.
- [ ] i18n strings exist in both `messages/es.json` and `messages/en.json` under a new
      top-level `testimonials` namespace.
- [ ] `.env.example` documents a new `NOTION_TESTIMONIALS_DATABASE_ID` variable.
- [ ] All new code is covered by tests under `tests/lib/content/...` and
      `tests/components/testimonials/...`.
- [ ] `pnpm type-check` is green (0 errors) and `pnpm test` is green.
- [ ] No `any` types; all functions have explicit return types; uses `??` for nullish fallbacks;
      named exports in `src/lib/`.

## Architecture Decisions

### D1 — Dedicated repository, not generic `ContentRepository`

The project already exposes a generic `ContentRepository` with the signature
`readAll<F>(directory, locale): Promise<RawContent<F>[]>`. We deliberately do **not** add
testimonials to it. Reasons:

1. **Different schema**: testimonials have no MDX body content (`content` is unused / empty), no
   reading time, no SEO metadata. Forcing them through `RawContent<F>` would mean every adapter
   silently ignores body parsing for one specific frontmatter type.
2. **Different Notion shape**: the Notion DB uses different properties (no Status, no Slug as
   rich_text — Author is the title) and a different filter (no Published flag is required because
   the user gates publication by deleting rows). Adding a fourth case to
   `NotionContentRepository.getPropertyMapper` couples the existing adapter to a non-content
   concept.
3. **Locale handling**: testimonials are stored with one MDX per locale (e.g.
   `jose-perez.mdx` for ES + `jose-perez.en.mdx` for EN, matching the existing
   `MDXContentRepository.readAll` heuristic of filtering by locale via filename suffix would not
   fit because the SAME testimonial may have BOTH locales — they are not the same content with a
   translation, they are different records). We treat each MDX file as a distinct testimonial and
   filter by the required `locale` frontmatter field.

Therefore the testimonial vertical owns its repository:

```ts
// src/lib/content/domain/repositories/TestimonialRepository.ts
import type { Testimonial } from "@/content/domain/entities/Testimonial"
import type { Locale } from "@/content/domain/types/Locale"

export type TestimonialRepository = {
  readAll(locale: Locale): Promise<Testimonial[]>
}
```

The use case depends on this interface only. Implementations live in
`src/lib/content/infrastructure/`.

### D2 — Repository returns domain `Testimonial[]`, not raw frontmatter

Unlike `ContentRepository` (which deliberately returns `RawContent<F>` because MDX body has to
be compiled later by the use case via `Post.create`), testimonials have no body to compile. The
adapter is free to instantiate `Testimonial` directly via `Testimonial.create(slug, frontmatter)`,
which keeps the use case trivial (it just sorts).

### D3 — Page composition

Home page (`app/[locale]/page.tsx`): insert a new row **between** the HeroStats row
(`md:col-span-12`) and the row containing `FeaturedProjectBlock + RecentTalkBlock + NavigationDock`.
Semantic narrative becomes: **Presentation → Featured Posts → Metrics → Social Proof → Projects/Talks/Nav**.
This is option B in the brief.

About page (`app/[locale]/sobre-mi/page.tsx`): append the section directly after the "Stack
Técnico" section and before `<ContactCtaSection>`. The card-style border treatment mirrors
`<ContactCtaSection>` (rounded-xl, border-white/5, bg-#222222) so the page composes consistently.

### D4 — `TestimonialCard` is an accessible anchor

The whole card is wrapped in a single `<a>` with `aria-label="Ver perfil de LinkedIn de {author}"`
(ES) / `View {author}'s LinkedIn profile` (EN). The author's name inside the card is a plain
`<span>` (never a nested link — that would create accessibility violations and HTML parsing issues).

### D5 — Avatar fallback

When `avatarUrl === undefined`, render a 40x40 round div with `bg-[#FCA311]` and the author's
initials (first letter of first word + first letter of last word, e.g. "Aitor Santana" → `AS`).
The initials computation lives inside `TestimonialCard` (pure function `computeInitials`).

When `avatarUrl !== undefined`, render `next/image` (40x40, `rounded-full`) — the brief explicitly
allows `next/image` for local files placed under `/public/testimonials/`. Add `images.remotePatterns`
config? **No.** We only support locally-hosted images. No external avatar URLs.

### D6 — i18n placement

`messages/{es,en}.json` get a new top-level namespace `testimonials` with `title`, `subtitle`,
and `viewLinkedinAriaLabel` (a parametrized string `Ver perfil de LinkedIn de {author}` /
`View {author}'s LinkedIn profile`). The home and about pages each fetch this namespace
in their async Server Component.

### D7 — Notion adapter is independent

`NotionTestimonialRepository` is a brand-new class that uses the Notion client directly. It does
**not** reuse `NotionContentRepository`. This avoids inflating the existing class and isolates
the different filter (`Locale` only) and the different property mapper.

The Notion database is expected to have the following properties:

| Property         | Notion type    | Required | Description                                           |
| ---------------- | -------------- | -------- | ----------------------------------------------------- |
| `Author`         | title          | yes      | Full name of the recommender (DB title column)        |
| `Slug`           | rich_text      | yes      | Stable kebab-case slug used as React key              |
| `Role`           | rich_text      | yes      | Author's role/title                                   |
| `Company`        | rich_text      | yes      | Author's company                                      |
| `Quote`          | rich_text      | yes      | Testimonial text                                      |
| `Locale`         | select         | yes      | `es` or `en`                                          |
| `LinkedIn URL`   | url            | yes      | Full LinkedIn profile URL                             |
| `Avatar Path`    | rich_text      | no       | Local path like `/testimonials/jose-perez.jpg`        |
| `Order`          | number         | no       | Manual ordering; ascending; testimonials w/o order go last |

## Files to Create/Modify

### CREATE — Domain

- `src/lib/content/domain/entities/Testimonial.ts` — entity + `TestimonialFrontmatter` type
- `src/lib/content/domain/repositories/TestimonialRepository.ts` — interface

### MODIFY — Domain barrels

- `src/lib/content/domain/entities/index.ts` — re-export `Testimonial`
- `src/lib/content/domain/repositories/index.ts` — re-export `TestimonialRepository`

### CREATE — Application

- `src/lib/content/application/dto/TestimonialDto.ts` — DTO type
- `src/lib/content/application/use-cases/testimonials/GetAllTestimonials.ts` — use case

### CREATE — Infrastructure

- `src/lib/content/infrastructure/MDXTestimonialRepository.ts` — MDX adapter
- `src/lib/content/infrastructure/notion/NotionTestimonialRepository.ts` — Notion adapter
- `src/lib/content/infrastructure/notion/mappers/TestimonialPropertyMapper.ts` — property mapper

### MODIFY — Infrastructure wiring

- `src/lib/content/infrastructure/Container.ts` — add `createTestimonialRepository()` factory and
  export `export const testimonials = { getAll: new GetAllTestimonials(testimonialRepository) }`
- `src/lib/content/index.ts` — re-export `testimonials` from Container
- `.env.example` — add `NOTION_TESTIMONIALS_DATABASE_ID=`

### CREATE — Content (MDX placeholders)

- `src/content/testimonials/jose-perez.mdx` — ES, order 1
- `src/content/testimonials/maria-garcia.mdx` — ES, order 2
- `src/content/testimonials/jose-perez.en.mdx` — EN, order 1
- `src/content/testimonials/maria-garcia.en.mdx` — EN, order 2

### CREATE — Components

- `components/testimonials/testimonial-card.tsx` — single card (Server Component)
- `components/testimonials/testimonials-section.tsx` — wrapper section (Server Component)

### MODIFY — Pages and i18n

- `app/[locale]/page.tsx` — fetch testimonials and render `<TestimonialsSection>` row
- `app/[locale]/sobre-mi/page.tsx` — fetch testimonials and render `<TestimonialsSection>`
  before `<ContactCtaSection>`
- `messages/es.json` — add `testimonials` namespace
- `messages/en.json` — add `testimonials` namespace

### CREATE — Tests

- `tests/lib/content/fixtures/testimonials.fixtures.ts`
- `tests/lib/content/domain/entities/Testimonial.test.ts`
- `tests/lib/content/application/use-cases/testimonials/GetAllTestimonials.test.ts`
- `tests/lib/content/infrastructure/MDXTestimonialRepository.test.ts`
- `tests/lib/content/infrastructure/notion/NotionTestimonialRepository.test.ts`
- `tests/lib/content/infrastructure/notion/mappers/TestimonialPropertyMapper.test.ts`
- `tests/components/testimonials/testimonial-card.test.tsx`
- `tests/components/testimonials/testimonials-section.test.tsx`

## Implementation Steps

### 1. Domain layer

**1.1.** Create `src/lib/content/domain/entities/Testimonial.ts`. It must NOT import from
Next.js or the Notion SDK. It exposes:

```ts
import type { TestimonialDto } from "@/content/application/dto/TestimonialDto"
import type { Locale } from "@/content/domain/types/Locale"

export type TestimonialFrontmatter = {
  author: string
  role: string
  company: string
  quote: string
  locale: Locale
  linkedinUrl: string
  avatarUrl?: string
  order?: number
}

export class Testimonial {
  constructor(
    public readonly slug: string,
    public readonly author: string,
    public readonly role: string,
    public readonly company: string,
    public readonly quote: string,
    public readonly locale: Locale,
    public readonly linkedinUrl: string,
    public readonly avatarUrl: string | undefined,
    public readonly order: number | undefined
  ) {}

  static create(slug: string, frontmatter: TestimonialFrontmatter): Testimonial {
    return new Testimonial(
      slug,
      frontmatter.author,
      frontmatter.role,
      frontmatter.company,
      frontmatter.quote,
      frontmatter.locale,
      frontmatter.linkedinUrl,
      frontmatter.avatarUrl,
      frontmatter.order
    )
  }

  toDto(): TestimonialDto {
    return {
      slug: this.slug,
      author: this.author,
      role: this.role,
      company: this.company,
      quote: this.quote,
      locale: this.locale,
      linkedinUrl: this.linkedinUrl,
      avatarUrl: this.avatarUrl,
      order: this.order,
    }
  }
}
```

**1.2.** Create `src/lib/content/domain/repositories/TestimonialRepository.ts`:

```ts
import type { Testimonial } from "@/content/domain/entities/Testimonial"
import type { Locale } from "@/content/domain/types/Locale"

export type TestimonialRepository = {
  readAll(locale: Locale): Promise<Testimonial[]>
}
```

**1.3.** Update the barrels:

```ts
// src/lib/content/domain/entities/index.ts
export type { Post } from "./Post"
export type { Project, ProjectStatus } from "./Project"
export type { Talk } from "./Talk"
export type { Testimonial } from "./Testimonial"
```

```ts
// src/lib/content/domain/repositories/index.ts
export type { ContentRepository, RawContent } from "./ContentRepository"
export type { TestimonialRepository } from "./TestimonialRepository"
```

### 2. Application layer

**2.1.** Create `src/lib/content/application/dto/TestimonialDto.ts`:

```ts
import type { Locale } from "@/content/domain/types/Locale"

export type TestimonialDto = {
  slug: string
  author: string
  role: string
  company: string
  quote: string
  locale: Locale
  linkedinUrl: string
  avatarUrl?: string
  order?: number
}
```

**2.2.** Create
`src/lib/content/application/use-cases/testimonials/GetAllTestimonials.ts`:

```ts
import type { Testimonial } from "@/content/domain/entities/Testimonial"
import type { TestimonialRepository } from "@/content/domain/repositories/TestimonialRepository"
import type { Locale } from "@/content/domain/types/Locale"

export class GetAllTestimonials {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async execute(locale: Locale): Promise<Testimonial[]> {
    const testimonials = await this.testimonialRepository.readAll(locale)
    return [...testimonials].sort(this.byOrderAscendingUndefinedLast)
  }

  private byOrderAscendingUndefinedLast = (a: Testimonial, b: Testimonial): number => {
    if (a.order === undefined && b.order === undefined) return 0
    if (a.order === undefined) return 1
    if (b.order === undefined) return -1
    return a.order - b.order
  }
}
```

Notes:
- Use `??` is **not** the right operator here because `0` is a valid order. Use explicit
  `=== undefined` checks (already required by the project's anti-pattern rules).
- The sort returns `0` for the `both undefined` case, which keeps original order for ties
  (V8's sort is stable).

### 3. Infrastructure layer

**3.1.** Create `src/lib/content/infrastructure/MDXTestimonialRepository.ts`:

```ts
import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { Testimonial, type TestimonialFrontmatter } from "@/content/domain/entities/Testimonial"
import type { TestimonialRepository } from "@/content/domain/repositories/TestimonialRepository"
import type { Locale } from "@/content/domain/types/Locale"

const TESTIMONIALS_DIR = path.join(process.cwd(), "src/content/testimonials")

export class MDXTestimonialRepository implements TestimonialRepository {
  async readAll(locale: Locale): Promise<Testimonial[]> {
    try {
      const files = await fs.readdir(TESTIMONIALS_DIR)
      const mdxFiles = files.filter((file) => file.endsWith(".mdx"))
      const parsed = await Promise.all(
        mdxFiles.map((file) => this.parseFile(path.join(TESTIMONIALS_DIR, file)))
      )
      return parsed
        .filter((testimonial): testimonial is Testimonial => testimonial !== undefined)
        .filter((testimonial) => testimonial.locale === locale)
    } catch {
      return []
    }
  }

  private async parseFile(filePath: string): Promise<Testimonial | undefined> {
    try {
      const fileContent = await fs.readFile(filePath, "utf-8")
      const { data } = matter(fileContent)
      const frontmatter = data as TestimonialFrontmatter
      const baseName = path.basename(filePath, ".mdx")
      const slug = baseName.replace(/\.en$/, "")
      return Testimonial.create(slug, frontmatter)
    } catch {
      return undefined
    }
  }
}
```

Notes:
- Files MAY use a `.en.mdx` suffix to indicate English locale; the slug strips the `.en` suffix
  so both locale variants share the same React key when displayed. The runtime filter is the
  `locale` frontmatter field (the suffix is just a filename convention).
- Returns `[]` on missing directory or any read error, mirroring `MDXContentRepository`.

**3.2.** Create `src/lib/content/infrastructure/notion/NotionTestimonialRepository.ts`:

```ts
import { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { Testimonial } from "@/content/domain/entities/Testimonial"
import type { TestimonialRepository } from "@/content/domain/repositories/TestimonialRepository"
import type { Locale } from "@/content/domain/types/Locale"
import { TestimonialPropertyMapper } from "./mappers/TestimonialPropertyMapper"
import type { NotionProperties } from "./types"
import { isFullPage } from "./types"

export class NotionTestimonialRepository implements TestimonialRepository {
  private readonly mapper: TestimonialPropertyMapper

  constructor(
    private readonly client: Client,
    private readonly dataSourceId: string
  ) {
    this.mapper = new TestimonialPropertyMapper()
  }

  async readAll(locale: Locale): Promise<Testimonial[]> {
    try {
      const response = (await this.client.request({
        path: `data_sources/${this.dataSourceId}/query`,
        method: "post",
        body: {
          filter: { property: "Locale", select: { equals: locale } },
        },
      })) as { results: Array<PageObjectResponse | Record<string, unknown>> }

      const testimonials: Testimonial[] = []
      for (const page of response.results) {
        const mapped = this.mapPageToTestimonial(page)
        if (mapped !== undefined) testimonials.push(mapped)
      }
      return testimonials
    } catch (error) {
      console.error("Error reading testimonials from Notion:", error)
      return []
    }
  }

  private mapPageToTestimonial(
    page: PageObjectResponse | Record<string, unknown>
  ): Testimonial | undefined {
    if (!isFullPage(page as PageObjectResponse)) return undefined
    const fullPage = page as PageObjectResponse
    const properties = fullPage.properties as NotionProperties
    const slug = this.mapper.extractSlug(properties)
    if (slug === undefined) return undefined
    const frontmatter = this.mapper.mapToFrontmatter(properties)
    return Testimonial.create(slug, frontmatter)
  }
}
```

Notes:
- No `Status` filter (no draft/published workflow for testimonials; deletion is the gate).
- No block fetching (testimonials have no body content).

**3.3.** Create `src/lib/content/infrastructure/notion/mappers/TestimonialPropertyMapper.ts`:

```ts
import type { TestimonialFrontmatter } from "@/content/domain/entities/Testimonial"
import type { Locale } from "@/content/domain/types/Locale"
import type { NotionProperties } from "../types"

export class TestimonialPropertyMapper {
  mapToFrontmatter(properties: NotionProperties): TestimonialFrontmatter {
    return {
      author: this.extractTitle(properties),
      role: this.extractRichText(properties, "Role"),
      company: this.extractRichText(properties, "Company"),
      quote: this.extractRichText(properties, "Quote"),
      locale: this.extractLocale(properties),
      linkedinUrl: this.extractUrl(properties, "LinkedIn URL"),
      avatarUrl: this.extractOptionalRichText(properties, "Avatar Path"),
      order: this.extractOptionalNumber(properties, "Order"),
    }
  }

  extractSlug(properties: NotionProperties): string | undefined {
    const property = properties["Slug"] ?? properties["slug"]
    if (property?.type === "rich_text" && property.rich_text.length > 0) {
      return property.rich_text[0].plain_text
    }
    return undefined
  }

  private extractTitle(properties: NotionProperties): string {
    const property = properties["Author"] ?? properties["author"] ?? properties["Name"]
    if (property?.type === "title" && property.title.length > 0) {
      return property.title[0].plain_text
    }
    return ""
  }

  private extractRichText(properties: NotionProperties, name: string): string {
    const property = properties[name]
    if (property?.type === "rich_text" && property.rich_text.length > 0) {
      return property.rich_text[0].plain_text
    }
    return ""
  }

  private extractOptionalRichText(properties: NotionProperties, name: string): string | undefined {
    const value = this.extractRichText(properties, name)
    return value.length > 0 ? value : undefined
  }

  private extractUrl(properties: NotionProperties, name: string): string {
    const property = properties[name]
    if (property?.type === "url" && property.url !== null && property.url !== undefined) {
      return property.url
    }
    return ""
  }

  private extractLocale(properties: NotionProperties): Locale {
    const property = properties["Locale"]
    if (property?.type === "select" && property.select?.name === "en") return "en"
    return "es"
  }

  private extractOptionalNumber(properties: NotionProperties, name: string): number | undefined {
    const property = properties[name]
    if (property?.type === "number" && property.number !== null) {
      return property.number
    }
    return undefined
  }
}
```

**3.4.** Update `src/lib/content/infrastructure/Container.ts`:

Add the following AFTER the existing `createContentRepository()` factory and re-use the existing
`Client` import:

```ts
import { MDXTestimonialRepository } from "./MDXTestimonialRepository"
import { NotionTestimonialRepository } from "./notion/NotionTestimonialRepository"
import type { TestimonialRepository } from "@/content/domain/repositories/TestimonialRepository"
import { GetAllTestimonials } from "@/content/application/use-cases/testimonials/GetAllTestimonials"

function createTestimonialRepository(): TestimonialRepository {
  const provider = process.env.CMS_PROVIDER ?? "mdx"
  if (provider !== "notion") return new MDXTestimonialRepository()

  const apiKey = process.env.NOTION_API_KEY
  const testimonialsDbId = process.env.NOTION_TESTIMONIALS_DATABASE_ID

  if (!apiKey || !testimonialsDbId) {
    console.warn(
      "Notion testimonials configuration incomplete, falling back to MDX repository. " +
      "Required: NOTION_API_KEY, NOTION_TESTIMONIALS_DATABASE_ID"
    )
    return new MDXTestimonialRepository()
  }

  const notion = new Client({ auth: apiKey })
  return new NotionTestimonialRepository(notion, testimonialsDbId)
}

const testimonialRepository = createTestimonialRepository()

export const testimonials = {
  getAll: new GetAllTestimonials(testimonialRepository),
}
```

**3.5.** Update `src/lib/content/index.ts` to add `testimonials` to the re-export:

```ts
export { posts, projects, talks, testimonials } from "./infrastructure/Container"
```

**3.6.** Update `.env.example`:

```bash
# Notion Database IDs (only required if CMS_PROVIDER=notion)
NOTION_POSTS_DATABASE_ID=
NOTION_PROJECTS_DATABASE_ID=
NOTION_TALKS_DATABASE_ID=
NOTION_TESTIMONIALS_DATABASE_ID=
```

### 4. MDX placeholders

**4.1.** Create `src/content/testimonials/jose-perez.mdx`:

```mdx
---
author: "Nombre Apellido"
role: "Rol"
company: "Empresa"
locale: "es"
linkedinUrl: "https://www.linkedin.com/in/placeholder/"
order: 1
quote: "Aitor, desde el primer día, empezó a aportar valor al equipo incluso sin conocer en profundidad el producto. Llegó con un conjunto sólido de buenas prácticas que elevó nuestro nivel, impulsando el código limpio, mantenible y fomentando esa cultura dentro del equipo. En lo personal, Aitor destaca por su calidad humana ya que recibe muy bien las críticas constructivas, siempre está dispuesto a aprender, ayudar y ofrecer feedback. Trabajar con él ha sido realmente enriquecedor."
---
```

**4.2.** Create `src/content/testimonials/maria-garcia.mdx`:

```mdx
---
author: "Nombre Apellido"
role: "Rol"
company: "Empresa"
locale: "es"
linkedinUrl: "https://www.linkedin.com/in/placeholder/"
order: 2
quote: "Tuve el placer de trabajar recientemente con Aitor en un proyecto. Desde el primer día, destacó por su increíble capacidad para trabajar en equipo, su escucha activa y su compromiso con la mejora continua. Aitor no solo aplicó de manera ejemplar las prácticas de Xtreme Programming, sino que también se aseguró de que todos en el equipo crecieran con él."
---
```

**4.3.** Create `src/content/testimonials/jose-perez.en.mdx`:

```mdx
---
author: "First Last"
role: "Role"
company: "Company"
locale: "en"
linkedinUrl: "https://www.linkedin.com/in/placeholder/"
order: 1
quote: "From day one, Aitor started adding value to the team even without deep product knowledge. He brought a solid set of best practices that raised our bar, pushing for clean, maintainable code and fostering that culture inside the team. On a personal level, Aitor stands out for his human qualities: he takes constructive criticism extremely well, is always willing to learn, help, and offer feedback. Working with him has been genuinely rewarding."
---
```

**4.4.** Create `src/content/testimonials/maria-garcia.en.mdx`:

```mdx
---
author: "First Last"
role: "Role"
company: "Company"
locale: "en"
linkedinUrl: "https://www.linkedin.com/in/placeholder/"
order: 2
quote: "I recently had the pleasure of working with Aitor on a project. From day one, he stood out for his incredible teamwork skills, active listening, and commitment to continuous improvement. Aitor not only applied Extreme Programming practices in an exemplary way, he also made sure everyone on the team grew alongside him."
---
```

Note: the MDX files intentionally have no body (only frontmatter). `gray-matter` handles that fine
and the entity ignores body content.

### 5. UI Components

**5.1.** Create `components/testimonials/testimonial-card.tsx`:

```tsx
import Image from "next/image"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"

type TestimonialCardProps = {
  testimonial: TestimonialDto
  viewLinkedinAriaLabel: string
}

function computeInitials(author: string): string {
  const parts = author.trim().split(/\s+/).filter((part) => part.length > 0)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  const first = parts[0][0] ?? ""
  const last = parts[parts.length - 1][0] ?? ""
  return `${first}${last}`.toUpperCase()
}

export function TestimonialCard({
  testimonial,
  viewLinkedinAriaLabel,
}: TestimonialCardProps): React.ReactElement {
  const { author, role, company, quote, linkedinUrl, avatarUrl } = testimonial
  const initials = computeInitials(author)

  return (
    <a
      href={linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={viewLinkedinAriaLabel}
      className="group flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-[#FCA311]/30 hover:shadow-lg hover:shadow-[#FCA311]/10 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-8 w-8 text-[#FCA311]/40"
        fill="currentColor"
      >
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36 1 24.832 4.32 28 8.32 28c3.776 0 6.4-3.04 6.4-6.624 0-3.584-2.496-6.176-5.76-6.176-.64 0-1.504.128-1.728.256.576-3.84 4.224-8.32 7.872-10.56L9.352 4zm16 0c-4.864 3.456-8.32 9.12-8.32 15.36 0 5.472 3.328 8.64 7.36 8.64 3.744 0 6.4-3.04 6.4-6.624 0-3.584-2.528-6.176-5.792-6.176-.64 0-1.472.128-1.696.256.576-3.84 4.192-8.32 7.84-10.56L25.352 4z" />
      </svg>

      <blockquote className="mt-4 flex-1 text-base italic leading-relaxed text-gray-100">
        {quote}
      </blockquote>

      <footer className="mt-6 flex items-center gap-3">
        {avatarUrl !== undefined ? (
          <Image
            src={avatarUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCA311] font-mono text-sm font-bold uppercase text-[#1a1a1a]"
          >
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-100">{author}</p>
          <p className="truncate font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {role} · {company}
          </p>
        </div>
      </footer>
    </a>
  )
}
```

Accessibility decisions:
- Card is a single `<a>` (no nested links).
- `aria-label` provides the full action description.
- Avatar `<Image>` has `alt=""` because the author's name appears as visible text — the alt would
  duplicate that text for assistive technology.
- The decorative SVG quote mark is `aria-hidden="true"`.
- `<blockquote>` carries the actual quote (no inner `<p>`; the brief allows italic text directly).

**5.2.** Create `components/testimonials/testimonials-section.tsx`:

```tsx
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"
import { TestimonialCard } from "./testimonial-card"

type TestimonialsSectionContentProps = {
  testimonials: TestimonialDto[]
  title: string
  subtitle?: string
  sectionLabel: string
  buildAriaLabel: (author: string) => string
}

export function TestimonialsSectionContent({
  testimonials,
  title,
  subtitle,
  sectionLabel,
  buildAriaLabel,
}: TestimonialsSectionContentProps): React.ReactElement | null {
  if (testimonials.length === 0) return null

  return (
    <section
      aria-labelledby="testimonials-title"
      className="rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10 md:p-8"
    >
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {sectionLabel}
      </span>
      <h2 id="testimonials-title" className="mt-2 text-2xl font-bold text-gray-100">
        {title}
      </h2>
      {subtitle !== undefined && subtitle.length > 0 && (
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <li key={testimonial.slug} className="flex">
            <TestimonialCard
              testimonial={testimonial}
              viewLinkedinAriaLabel={buildAriaLabel(testimonial.author)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
```

Notes:
- The component returns `null` when there are no testimonials so the section disappears cleanly.
- The async server wrapper (`TestimonialsSection`) reads next-intl translations and forwards the
  DTO list. We split content/server like `ContactCtaSection` does so the inner component is
  testable with React Testing Library.

```tsx
import { getTranslations } from "next-intl/server"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"
import { TestimonialsSectionContent } from "./testimonials-section-content"

type TestimonialsSectionProps = {
  testimonials: TestimonialDto[]
}

export async function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps): Promise<React.ReactElement | null> {
  const t = await getTranslations("testimonials")
  return (
    <TestimonialsSectionContent
      testimonials={testimonials}
      title={t("title")}
      subtitle={t("subtitle")}
      sectionLabel={t("label")}
      buildAriaLabel={(author) => t("viewLinkedinAriaLabel", { author })}
    />
  )
}
```

Implementation detail: split the file into two named exports inside the same
`testimonials-section.tsx` file (`TestimonialsSectionContent` + async `TestimonialsSection`),
mirroring the dual export pattern in `contact-cta-section.tsx`. **Do not** create a second
file — keep them colocated.

### 6. Page wiring

**6.1.** `app/[locale]/page.tsx` — fetch the testimonials in the existing `Promise.all` and add
the row between HeroStats and the FeaturedProject/RecentTalk/NavigationDock row:

```tsx
import { TestimonialsSection } from "@/components/testimonials/testimonials-section"
import { posts, projects, talks, testimonials } from "@/src/lib/content"

const [
  tHome, tProject,
  featuredPosts, featuredProject, featuredTalk,
  allPosts, allTalks, allProjects,
  allTestimonials,
] = await Promise.all([
  getTranslations("home"),
  getTranslations("project"),
  posts.getFeaturedList.execute(l, 4),
  projects.getFeatured.execute(l),
  talks.getFeatured.execute(l),
  posts.getAll.execute(l),
  talks.getAll.execute(l),
  projects.getAll.execute(l),
  testimonials.getAll.execute(l),
])

const testimonialDtos = allTestimonials.map((testimonial) => testimonial.toDto())
```

Then in the JSX, between the HeroStats row and the FeaturedProject row:

```tsx
<div className="md:col-span-12">
  <HeroStatsBlock ... />
</div>

<div className="md:col-span-12">
  <TestimonialsSection testimonials={testimonialDtos} />
</div>

<div className="md:col-span-4">
  {featuredProjectDto && <FeaturedProjectBlock ... />}
</div>
```

The grid rows template should be widened (currently
`md:grid-rows-[auto_auto_auto]`) to accommodate the new row. Either change to
`md:grid-rows-[auto_auto_auto_auto]` or simply remove the explicit `md:grid-rows-*` template
since rows can autoflow. **Recommended**: remove the explicit `md:grid-rows-*` value
(auto is the default and is what's already working visually now that we're adding a 4th row).

**6.2.** `app/[locale]/sobre-mi/page.tsx` — fetch testimonials and render the section before
`<ContactCtaSection>`:

```tsx
import { TestimonialsSection } from "@/components/testimonials/testimonials-section"
import { testimonials } from "@/src/lib/content"
import type { Locale } from "@/src/lib/content/domain/types/Locale"

// inside the page function:
const l = locale as Locale
const allTestimonials = await testimonials.getAll.execute(l)
const testimonialDtos = allTestimonials.map((testimonial) => testimonial.toDto())

// ...in JSX, after the stack section and before ContactCtaSection:
<section className="mt-12">
  <TestimonialsSection testimonials={testimonialDtos} />
</section>

<ContactCtaSection />
```

The wrapper `<section className="mt-12">` is just for vertical rhythm matching the other
about page sections. The inner `<TestimonialsSection>` provides its own `<section>` landmark
with `aria-labelledby`.

### 7. i18n strings

**7.1.** `messages/es.json` — add at the same level as `about` / `home`:

```json
"testimonials": {
  "label": "Testimonios",
  "title": "Lo que dicen de mí",
  "subtitle": "Recomendaciones de compañeros con los que he trabajado.",
  "viewLinkedinAriaLabel": "Ver perfil de LinkedIn de {author} (se abre en una pestaña nueva)"
}
```

**7.2.** `messages/en.json` — same shape:

```json
"testimonials": {
  "label": "Testimonials",
  "title": "What others say",
  "subtitle": "Recommendations from teammates I've worked with.",
  "viewLinkedinAriaLabel": "View {author}'s LinkedIn profile (opens in a new tab)"
}
```

Place the namespace right after `about` (alphabetical order is already broken in the existing
files, so just place it near related sections).

## Testing Requirements

### 8.1. `tests/lib/content/fixtures/testimonials.fixtures.ts`

```ts
import { Testimonial, type TestimonialFrontmatter } from "@/content/domain/entities/Testimonial"

export const mockTestimonialFrontmatter: TestimonialFrontmatter = {
  author: "Aitor Santana",
  role: "Software Crafter",
  company: "Lean Mind",
  quote: "Una recomendación de prueba.",
  locale: "es",
  linkedinUrl: "https://www.linkedin.com/in/aitorscinfo/",
  order: 1,
}

export const mockTestimonialsEs: Testimonial[] = [
  Testimonial.create("first", {
    ...mockTestimonialFrontmatter,
    author: "Alice",
    quote: "First quote.",
    order: 2,
  }),
  Testimonial.create("second", {
    ...mockTestimonialFrontmatter,
    author: "Bob",
    quote: "Second quote.",
    order: 1,
  }),
  Testimonial.create("third", {
    ...mockTestimonialFrontmatter,
    author: "Charlie",
    quote: "Third quote.",
    order: undefined,
  }),
]
```

### 8.2. `tests/lib/content/domain/entities/Testimonial.test.ts`

Cases to cover (each as a `should ...` `it`):
- `Testimonial.create()` constructs an instance with all required fields.
- `Testimonial.create()` carries `avatarUrl` through when provided and leaves it `undefined`
  when omitted.
- `Testimonial.create()` carries `order` through when provided and leaves it `undefined`
  when omitted.
- `toDto()` returns a plain object with all fields preserved.
- Direct read of `linkedinUrl`, `author`, `role`, `company`, `quote`, `locale`.

Use a local `createTestimonialFrontmatter(overrides?: Partial<TestimonialFrontmatter>)` helper.

### 8.3. `tests/lib/content/application/use-cases/testimonials/GetAllTestimonials.test.ts`

Cases:
- should sort testimonials by `order` ascending (1, 2, 3).
- should place testimonials with `order === undefined` at the end.
- should preserve original order among multiple testimonials all without `order` (stable sort).
- should preserve original order among testimonials with the same `order` value.
- should return an empty array when the repository returns `[]`.
- should pass the requested locale to the repository (verify with `vi.fn()`).

Use a `mockRepo: TestimonialRepository = { readAll: vi.fn().mockResolvedValue(...) }`.

### 8.4. `tests/lib/content/infrastructure/MDXTestimonialRepository.test.ts`

Integration test pattern mirroring `MDXContentRepository.test.ts`. Use `beforeAll` to create a
temporary `tests/lib/content/__testimonials-content__/` directory with handcrafted MDX files.
Cases:
- should read all `.mdx` files from the directory.
- should filter testimonials by the `locale` frontmatter field.
- should strip the `.en` suffix from filenames when computing the slug.
- should return `[]` when the directory does not exist.
- should skip files with malformed YAML (i.e. `parseFile` returns `undefined` and is filtered out).

Note: since `MDXTestimonialRepository` hard-codes `TESTIMONIALS_DIR = path.join(process.cwd(),
"src/content/testimonials")`, the test must either (a) use the real production directory (fragile
— content evolves) or (b) refactor the adapter to accept the directory path via the constructor.
**Recommendation (b)**: make the directory injectable via constructor (`new MDXTestimonialRepository(directory?)`) with a default. This is the same trade-off the existing `MDXContentRepository`
accepts via the `directory` parameter on `readAll`. Document the chosen approach in the adapter
file.

**Decided approach**: pass the directory via constructor with a default. The `Container.ts`
factory uses the default; tests pass a temp directory.

### 8.5. `tests/lib/content/infrastructure/notion/NotionTestimonialRepository.test.ts`

Mock the Notion client the same way `NotionContentRepository.test.ts` does (`mockNotionClient` with
`request: vi.fn()`). Cases:
- should query `data_sources/<id>/query` with a `Locale` select filter for the given locale.
- should return testimonials mapped from Notion properties (full happy path).
- should filter out pages without a `Slug` rich_text.
- should filter out partial page objects (`isFullPage` returns false).
- should return `[]` on Notion API error.

### 8.6. `tests/lib/content/infrastructure/notion/mappers/TestimonialPropertyMapper.test.ts`

Cases:
- should map all required properties correctly.
- should set `avatarUrl` to `undefined` when `Avatar Path` is missing or empty.
- should set `order` to `undefined` when `Order` is missing or null.
- should resolve `locale` to `"en"` when the `Locale` select is `en`.
- should default `locale` to `"es"` when the select is missing or empty.
- should fall back to `""` for the `LinkedIn URL` when the URL is null.
- `extractSlug` should return `undefined` when the property is missing or empty rich_text.

### 8.7. `tests/components/testimonials/testimonial-card.test.tsx`

Cases:
- should render the quote, author, role, and company.
- should expose the LinkedIn URL via the anchor's `href` attribute with
  `target="_blank"` and `rel="noopener noreferrer"`.
- should expose the supplied `viewLinkedinAriaLabel` as the anchor's accessible name.
- should render initials computed from author name when `avatarUrl` is undefined.
- should render initials for a single-word author by slicing the first two letters.
- should render an `<img>` (next/image) when `avatarUrl` is provided.
- should render the decorative quote SVG with `aria-hidden="true"`.

Note: `next/image` must be mocked for jsdom — see `tests/setup.ts`. Confirm there is a global
mock; if not, add a local `vi.mock("next/image", ...)` returning a plain `<img>`.

### 8.8. `tests/components/testimonials/testimonials-section.test.tsx`

Test the **content** component (`TestimonialsSectionContent`), not the async server one.
Cases:
- should render the title as an `<h2>` heading with the provided `title`.
- should render the section label and subtitle when provided.
- should not render the subtitle paragraph when subtitle is undefined or empty.
- should render one card per testimonial.
- should return `null` (no DOM nodes) when the testimonials array is empty.
- should pass the per-author aria label string (via `buildAriaLabel`) down to each card.

## Code Standards Checklist

- [ ] No `any` types. All type guards use `unknown` then narrow.
- [ ] All functions have explicit return types (entities, use case, repos, mappers, components).
- [ ] `??` for nullish defaults (e.g. `process.env.CMS_PROVIDER ?? "mdx"`). **Exception**: ordering
      logic uses `=== undefined` because `0` is a valid order value.
- [ ] Named exports in `src/lib/`.
- [ ] `Testimonial.create(slug, frontmatter)` is the only way to construct a `Testimonial`.
- [ ] Repository interface in domain, implementations in infrastructure.
- [ ] Use case method is `execute()`.
- [ ] `Container.ts` is the only place wiring dependencies.
- [ ] Domain layer (entity, repo interface) imports nothing from Next.js or Notion SDK.
- [ ] Server Components only — no `"use client"`.
- [ ] Components have explicit props interfaces and `: React.ReactElement` (or `| null`)
      return types.
- [ ] No inline comments restating the code. SVG path is the only inline literal.
- [ ] `undefined` over `null` everywhere except the Notion SDK boundary
      (Notion returns `null` for missing dates/urls — we narrow to `undefined` immediately).

## Risks

1. **Stale `process.cwd()` in MDX adapter.** `process.cwd()` evaluated at module load may be wrong
   in some test runners or build environments. Mitigation: pass the directory via the adapter
   constructor (decided in section 8.4) so tests stay deterministic and production keeps the
   default `path.join(process.cwd(), "src/content/testimonials")`.

2. **Placeholder author names look like real names.** `jose-perez.mdx` and `maria-garcia.mdx`
   are filename placeholders — the `author` field is `"Nombre Apellido"`. Reviewers and the
   user must understand the filenames are non-canonical and will be renamed once real authors
   approve. The PR description should call this out.

3. **`next/image` requires width/height for non-`fill` mode.** We use `width={40} height={40}`
   on a fixed-size avatar. No image domain config is needed because all paths are local.

4. **Anchor as card may break if user clicks an inner element on iOS Safari.** Mitigation: the
   anchor wraps the entire card and no child element captures clicks via `onClick`. All children
   are `<svg>`, `<blockquote>`, `<footer>`, `<span>`, `<p>`, `<Image>` — none of which capture
   pointer events by default.

5. **i18n locale fallback.** If the user adds an ES testimonial but no EN translation, the EN
   home page will simply hide the section (empty list -> `null`). Document this as expected.

6. **`reactCompiler: true` in next.config.** The React compiler treats all hooks in Server
   Components as expressions — no special handling is needed because none of the new components
   use hooks.

7. **Notion property name drift.** The mapper uses literal property names (`"Locale"`,
   `"LinkedIn URL"`, `"Avatar Path"`, `"Order"`). Document them in
   `NotionTestimonialRepository.ts` JSDoc so the user can mirror them when creating the Notion
   database.

8. **Old test `GetAllPosts.test.ts` calls `useCase.execute()` without a locale.** This is a
   **pre-existing** test that already fails to typecheck against the current signature. We do
   **not** fix it in this commit. Flag it as a follow-up.

9. **Notion testimonial filter does not include `Status`.** Decision: the testimonial DB has no
   publish workflow. If the user later wants a draft flag, add a `Status` select with a
   `Published` filter to the Notion adapter.

10. **`MDXTestimonialRepository` returns `Testimonial[]` directly while `MDXContentRepository`
    returns `RawContent<F>[]`.** This is intentional (see D2). The use case is correspondingly
    simpler. Reviewer should not "harmonize" the two patterns.

## Complexity Estimate

**L (Large = 4–8h).** Three new layers (domain/application/infrastructure) plus two adapters,
a mapper, two pages to wire, two MDX placeholders × 2 locales, 8 test files, and 2 i18n updates.

