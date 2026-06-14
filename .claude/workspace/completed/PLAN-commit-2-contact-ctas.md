# Task: feat(home,about,seo): add contact CTAs and visible contact info

## Resumen

Commit 2 del roadmap de mejoras del portfolio. Aporta dos piezas visibles de contacto profesional:

1. Un **Footer global** con bloque de contacto **legible** (email mailto + LinkedIn + GitHub con texto, no solo iconos) y línea de copyright con año dinámico, montado en `app/[locale]/layout.tsx` para aparecer en todas las rutas.
2. Una **sección CTA "¿Hablamos? / Let's chat?"** al final de `/sobre-mi` (después de "Stack Técnico Actual"), reutilizando el `CtaButton` ya existente del commit 1.

Ambas piezas son Server Components; usan `getTranslations` directamente (más cohesionado y evita prop-drilling). Para mantenerlas testeables sin tocar el runtime de `next-intl/server`, cada Server Component se separa en una versión "Content" (puramente presentacional, recibe props ya traducidos) y un wrapper async que carga las traducciones — exactamente el patrón de `ProfileBlock` / `ProfileBlockContent` y `CareerTimeline` / `CareerTimelineContent` ya en uso.

Se extrae el SVG de LinkedIn (hoy inline en `navigation-dock.tsx`) a `components/icons/linkedin-icon.tsx` para reutilizarlo en el footer (DRY). Se mantiene la `NavigationDock` actual del home — el footer es complementario y queda al final del flujo natural.

No se instalan dependencias nuevas. Iconos: `Mail` de `lucide-react`, `GithubIconOutline` ya existente, `LinkedInIcon` extraído.

---

## Acceptance Criteria

- [ ] Existe `components/footer/site-footer.tsx` con `SiteFooterContent` (props) y `SiteFooter` (async wrapper).
- [ ] Existe `components/about/contact-cta-section.tsx` con `ContactCtaSectionContent` (props) y `ContactCtaSection` (async wrapper).
- [ ] Existe `components/icons/linkedin-icon.tsx` exportando `LinkedInIcon`.
- [ ] `app/[locale]/layout.tsx` renderiza `<SiteFooter />` después de `{children}` y antes de `<Analytics />` dentro del `NextIntlClientProvider`.
- [ ] El footer aparece en home, blog, sobre-mí y resto de páginas en ES y EN.
- [ ] El footer muestra el email `aitorscinfo@gmail.com` como texto visible y como `mailto:`.
- [ ] El footer muestra "@aitorscinfo" enlazando a `https://www.linkedin.com/in/aitorscinfo/`.
- [ ] El footer muestra "@Sstark97" enlazando a `https://github.com/Sstark97`.
- [ ] Los enlaces externos (LinkedIn, GitHub) tienen `target="_blank"` y `rel="noopener noreferrer"`.
- [ ] El año del copyright es `new Date().getFullYear()` (computado en el server component, no hard-coded).
- [ ] La página `/sobre-mi` muestra el CTA después de "Stack Técnico Actual" y antes del cierre del `<div className="mx-auto max-w-4xl">`.
- [ ] El CTA usa el `CtaButton` existente con `href="mailto:aitorscinfo@gmail.com"`.
- [ ] El home sigue navegable y el bento no se rompe; el footer queda debajo al hacer scroll.
- [ ] Claves i18n nuevas existen en `messages/es.json` y `messages/en.json` con paridad de claves.
- [ ] `pnpm type-check` pasa con 0 errores.
- [ ] `pnpm test` pasa con todos los tests verdes.
- [ ] Tests cubren `SiteFooterContent`, `ContactCtaSectionContent` y `LinkedInIcon`.

---

## Architecture Decisions

1. **Capa**: solo Next.js App Layer (`components/`). No hay lógica de dominio nueva; nada toca `src/lib/`.
2. **Server Components por defecto**. Ningún `"use client"`.
3. **Patrón Content + wrapper async** para todos los Server Components nuevos que usen `getTranslations`. El test renderiza el `Content` con props plain — el wrapper async no se testea (siguiendo el patrón ya establecido en `ProfileBlock`/`ProfileBlockContent`).
4. **Footer fuera del flujo del bento**: se monta en `<body>` después de `{children}`. Cada página actual ya define su propio `min-h-screen`, por lo que el footer fluye debajo sin alterar el viewport del home (no es un footer "sticky bottom" ni `fixed`). Decisión validada por el contexto de la tarea: NO modificamos `min-h-screen` en home.
5. **Año dinámico**: `new Date().getFullYear()` se calcula en el `SiteFooter` (async wrapper) y se pasa como prop number a `SiteFooterContent`. Esto mantiene el `Content` puro y testeable sin congelar la fecha.
6. **Email visible y `mailto:`**: el texto del enlace es el email completo (`aitorscinfo@gmail.com`), no un placeholder ("Contacto"). Cumple el requisito de "legible, no solo iconos".
7. **LinkedIn icon DRY**: se extrae el SVG inline de `navigation-dock.tsx` a `components/icons/linkedin-icon.tsx`. Se actualiza `navigation-dock.tsx` para importarlo desde la nueva ubicación. (No es estrictamente necesario para el commit 2, pero evita duplicación en cuanto el footer lo use; coste casi nulo).
8. **Mail icon**: se usa `Mail` de `lucide-react` directamente (igual que en `cta-button.tsx`). No se crea `mail-icon.tsx`.
9. **Sección CTA del About**: se extrae a su propio componente para que sea testeable y para mantener `sobre-mi/page.tsx` legible. Coherente con el resto de bloques que ya están extraídos (`CareerTimeline`, `CvDownloadButtonDynamic`).
10. **Tipografía / color**: el footer usa `bg-[#1a1a1a]` (fondo de página) para integrarse, y `border-t border-white/5` como separador sutil del contenido superior. La sección CTA del About usa `bg-[#222222]` (tarjeta) consistente con el resto de bloques del about.

---

## Files to Create

- `components/icons/linkedin-icon.tsx` (CREATE) — extrae el SVG de LinkedIn con la API `React.SVGProps<SVGSVGElement>` para alinear con `github-icon.tsx`.
- `components/footer/site-footer.tsx` (CREATE) — `SiteFooterContent` (presentational) + `SiteFooter` (async, lee i18n y calcula año). Server Component.
- `components/about/contact-cta-section.tsx` (CREATE) — `ContactCtaSectionContent` (presentational) + `ContactCtaSection` (async). Server Component.
- `tests/components/footer/site-footer.test.tsx` (CREATE) — tests del `SiteFooterContent`.
- `tests/components/about/contact-cta-section.test.tsx` (CREATE) — tests del `ContactCtaSectionContent`.
- `tests/components/icons/linkedin-icon.test.tsx` (CREATE) — test mínimo del SVG extraído.

## Files to Modify

- `app/[locale]/layout.tsx` (MODIFY) — importar y renderizar `<SiteFooter />` dentro del `NextIntlClientProvider`, justo después de `{children}` y antes de `<Analytics />`.
- `app/[locale]/sobre-mi/page.tsx` (MODIFY) — importar `ContactCtaSection` y renderizarlo al final del `<div className="mx-auto max-w-4xl">`, después de la sección "Stack Técnico Actual" (`<section>` que abre con `<h2>{t("stackTitle")}</h2>`).
- `components/bento/navigation-dock.tsx` (MODIFY) — eliminar el SVG inline `LinkedInIcon` local, importar `LinkedInIcon` desde `@/components/icons/linkedin-icon`. Mantener `XIcon` y `BlueskyIcon` inline (fuera del scope de este commit).
- `messages/es.json` (MODIFY) — añadir bloques `footer.*` y `about.contact.*`.
- `messages/en.json` (MODIFY) — paridad ES/EN.

---

## Claves i18n a añadir

### `messages/es.json`

Añadir en la raíz del JSON, después del bloque `notFound`:

```json
"footer": {
  "contactTitle": "Contacto",
  "emailLabel": "Email",
  "linkedinLabel": "LinkedIn",
  "linkedinHandle": "@aitorscinfo",
  "linkedinAriaLabel": "Perfil de LinkedIn de Aitor Santana (se abre en una pestaña nueva)",
  "githubLabel": "GitHub",
  "githubHandle": "@Sstark97",
  "githubAriaLabel": "Perfil de GitHub de Aitor Santana (se abre en una pestaña nueva)",
  "emailAriaLabel": "Enviar email a Aitor Santana",
  "copyright": "© {year} Aitor Santana. Hecho con cuidado en Canarias."
}
```

Y dentro del bloque `about` existente añadir un sub-objeto `contact` (sin tocar las claves ya presentes):

```json
"about": {
  "...claves existentes...",
  "contact": {
    "title": "¿Hablamos?",
    "description": "Si tienes un proyecto entre manos, una idea que validar o quieres charlar sobre Clean Code, TDD o arquitectura, escríbeme. Respondo en menos de 24 horas.",
    "primaryLabel": "Enviar email",
    "primaryAriaLabel": "Enviar email a Aitor Santana",
    "secondaryLabel": "Conectar en LinkedIn",
    "secondaryAriaLabel": "Conectar con Aitor Santana en LinkedIn (se abre en una pestaña nueva)"
  }
}
```

### `messages/en.json`

```json
"footer": {
  "contactTitle": "Contact",
  "emailLabel": "Email",
  "linkedinLabel": "LinkedIn",
  "linkedinHandle": "@aitorscinfo",
  "linkedinAriaLabel": "Aitor Santana's LinkedIn profile (opens in a new tab)",
  "githubLabel": "GitHub",
  "githubHandle": "@Sstark97",
  "githubAriaLabel": "Aitor Santana's GitHub profile (opens in a new tab)",
  "emailAriaLabel": "Send an email to Aitor Santana",
  "copyright": "© {year} Aitor Santana. Crafted with care in the Canary Islands."
}
```

```json
"about": {
  "...existing keys...",
  "contact": {
    "title": "Let's chat?",
    "description": "If you have a project in mind, an idea to validate, or want to talk about Clean Code, TDD or architecture, drop me a line. I reply within 24 hours.",
    "primaryLabel": "Send email",
    "primaryAriaLabel": "Send an email to Aitor Santana",
    "secondaryLabel": "Connect on LinkedIn",
    "secondaryAriaLabel": "Connect with Aitor Santana on LinkedIn (opens in a new tab)"
  }
}
```

> Nota para el implementador: respeta la sintaxis ICU `{year}` y NO escapes la `©` (es UTF-8 válido en JSON).

---

## Componentes — diseño detallado

### 1. `components/icons/linkedin-icon.tsx` (Server-safe, no `"use client"`)

API alineada con `github-icon.tsx` (acepta `className` y resto de SVG props). Marcado `aria-hidden="true"` por defecto pueden hacerlo los consumidores; el componente NO lo añade para no condicionar el rol semántico.

```tsx
export function LinkedInIcon({ className, ...props }: React.SVGProps<SVGSVGElement>): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
```

> Notas:
> - Sin `width="20"`/`height="20"` hard-coded en el SVG: el tamaño se controla con `className` (e.g. `h-4 w-4`) por el consumidor, igual que `GithubIconOutline`.
> - Tipo de retorno explícito (`React.ReactElement`).
> - Tras crear este icono, **modificar `components/bento/navigation-dock.tsx`**: eliminar la const `LinkedInIcon` inline y reemplazar el import con `import { LinkedInIcon } from "@/components/icons/linkedin-icon"`. El uso en `SOCIAL_LINKS` permanece igual (se invoca el componente en el `IconComponent` JSX). Verificar que el SVG inline original tenía `width="20" height="20"`; la versión nueva no — pero `navigation-dock.tsx` ya envuelve el icono con `<div className="h-5 w-5 ...">`, por lo que el tamaño visual no cambia (los hijos heredan el tamaño del wrapper sin clases propias). Si el SVG no escala correctamente sin `width`/`height`, añadir `className="h-full w-full"` al uso del icono dentro de `navigation-dock.tsx`.

### 2. `components/footer/site-footer.tsx`

Server Component. Dos exports:

- `SiteFooterContent(props)` — pure presentational, todos los textos/aria-labels/year vienen por props.
- `SiteFooter()` — async, hace `getTranslations("footer")`, calcula `currentYear`, renderiza `<SiteFooterContent ... />`.

#### Tipos de props

```tsx
type SiteFooterContentProps = {
  contactTitle: string
  emailLabel: string
  emailAddress: string                    // "aitorscinfo@gmail.com" — constante, pero la pasamos como prop para testabilidad
  emailAriaLabel: string
  linkedinLabel: string
  linkedinHandle: string                  // "@aitorscinfo"
  linkedinUrl: string                     // "https://www.linkedin.com/in/aitorscinfo/"
  linkedinAriaLabel: string
  githubLabel: string
  githubHandle: string                    // "@Sstark97"
  githubUrl: string                       // "https://github.com/Sstark97"
  githubAriaLabel: string
  copyrightText: string                   // ya con el año interpolado por next-intl
}
```

> El `copyrightText` lo calcula el wrapper async con `t("copyright", { year: currentYear })` — esto delega la interpolación a `next-intl` y deja el `Content` libre de cualquier `Date`.

#### Constantes del wrapper

Dentro de `SiteFooter` (no exportadas) — constantes locales, NO `process.env`:

```tsx
const EMAIL_ADDRESS = "aitorscinfo@gmail.com"
const LINKEDIN_URL = "https://www.linkedin.com/in/aitorscinfo/"
const GITHUB_URL = "https://github.com/Sstark97"
```

#### Markup del `SiteFooterContent`

```tsx
export function SiteFooterContent({
  contactTitle,
  emailLabel,
  emailAddress,
  emailAriaLabel,
  linkedinLabel,
  linkedinHandle,
  linkedinUrl,
  linkedinAriaLabel,
  githubLabel,
  githubHandle,
  githubUrl,
  githubAriaLabel,
  copyrightText,
}: SiteFooterContentProps): React.ReactElement {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/5 bg-[#1a1a1a] px-4 py-8 sm:px-6 md:py-10 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {contactTitle}
            </h2>
            <ul className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
              <li>
                <a
                  href={`mailto:${emailAddress}`}
                  aria-label={emailAriaLabel}
                  className="group inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-[#FCA311] focus-visible:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-4"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
                  <span className="sr-only">{emailLabel}: </span>
                  <span className="break-all">{emailAddress}</span>
                </a>
              </li>
              <li>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={linkedinAriaLabel}
                  className="group inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-[#FCA311] focus-visible:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-4"
                >
                  <LinkedInIcon aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
                  <span className="sr-only">{linkedinLabel}: </span>
                  <span>{linkedinHandle}</span>
                </a>
              </li>
              <li>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={githubAriaLabel}
                  className="group inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-[#FCA311] focus-visible:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-4"
                >
                  <GithubIconOutline aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
                  <span className="sr-only">{githubLabel}: </span>
                  <span>{githubHandle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6">
          <p className="text-xs text-muted-foreground">{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
```

#### Wrapper async

```tsx
export async function SiteFooter(): Promise<React.ReactElement> {
  const t = await getTranslations("footer")
  const currentYear = new Date().getFullYear()

  return (
    <SiteFooterContent
      contactTitle={t("contactTitle")}
      emailLabel={t("emailLabel")}
      emailAddress={EMAIL_ADDRESS}
      emailAriaLabel={t("emailAriaLabel")}
      linkedinLabel={t("linkedinLabel")}
      linkedinHandle={t("linkedinHandle")}
      linkedinUrl={LINKEDIN_URL}
      linkedinAriaLabel={t("linkedinAriaLabel")}
      githubLabel={t("githubLabel")}
      githubHandle={t("githubHandle")}
      githubUrl={GITHUB_URL}
      githubAriaLabel={t("githubAriaLabel")}
      copyrightText={t("copyright", { year: currentYear })}
    />
  )
}
```

#### Imports necesarios

```tsx
import { Mail } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { GithubIconOutline } from "@/components/icons/github-icon"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"
```

### 3. `components/about/contact-cta-section.tsx`

Server Component. Dos exports: `ContactCtaSectionContent` (presentational) + `ContactCtaSection` (async wrapper).

#### Tipo de props

```tsx
type ContactCtaSectionContentProps = {
  title: string
  description: string
  primaryLabel: string
  primaryAriaLabel: string
  secondaryLabel: string
  secondaryAriaLabel: string
}
```

#### Markup

```tsx
export function ContactCtaSectionContent({
  title,
  description,
  primaryLabel,
  primaryAriaLabel,
  secondaryLabel,
  secondaryAriaLabel,
}: ContactCtaSectionContentProps): React.ReactElement {
  return (
    <section
      aria-labelledby="about-contact-title"
      className="mt-12 rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10 md:p-8"
    >
      <h2 id="about-contact-title" className="text-2xl font-bold text-gray-100">
        {title}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <CtaButton
          href="mailto:aitorscinfo@gmail.com"
          label={primaryLabel}
          ariaLabel={primaryAriaLabel}
        />
        <a
          href="https://www.linkedin.com/in/aitorscinfo/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={secondaryAriaLabel}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-gray-100 transition-all duration-300 hover:border-[#FCA311]/40 hover:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
        >
          <LinkedInIcon aria-hidden="true" className="h-4 w-4" />
          <span>{secondaryLabel}</span>
        </a>
      </div>
    </section>
  )
}
```

#### Wrapper async

```tsx
export async function ContactCtaSection(): Promise<React.ReactElement> {
  const t = await getTranslations("about.contact")

  return (
    <ContactCtaSectionContent
      title={t("title")}
      description={t("description")}
      primaryLabel={t("primaryLabel")}
      primaryAriaLabel={t("primaryAriaLabel")}
      secondaryLabel={t("secondaryLabel")}
      secondaryAriaLabel={t("secondaryAriaLabel")}
    />
  )
}
```

#### Imports

```tsx
import { getTranslations } from "next-intl/server"
import { CtaButton } from "@/components/bento/cta-button"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"
```

---

## Ediciones detalladas

### `app/[locale]/layout.tsx`

**Cambios** (línea por línea):

1. **Añadir import** (junto al resto de imports al principio del archivo):
   ```tsx
   import { SiteFooter } from "@/components/footer/site-footer"
   ```

2. **Insertar `<SiteFooter />`** dentro del `NextIntlClientProvider`, después de `{children}` y antes de `<Analytics />`. El bloque actual:
   ```tsx
   {children}
   <Analytics />
   ```
   pasa a:
   ```tsx
   {children}
   <SiteFooter />
   <Analytics />
   ```

> NO modificar el `<body className="font-sans antialiased">`. El layout body queda igual; el footer fluye debajo del contenido de cada página gracias a que cada página define su propio `min-h-screen`. Esta es la solución más simple, ya documentada en el contexto.

### `app/[locale]/sobre-mi/page.tsx`

**Cambios**:

1. **Añadir import** después de los imports actuales:
   ```tsx
   import { ContactCtaSection } from "@/components/about/contact-cta-section"
   ```

2. **Insertar `<ContactCtaSection />`** dentro del `<div className="mx-auto max-w-4xl">`, justo después del cierre de la `<section>` que contiene `t("stackTitle")` (línea ~165) y antes del cierre del `</div>` (línea ~166):

   Estructura antes (esquemático):
   ```tsx
         <section>
           <h2 className="mb-6 text-2xl font-bold text-gray-100">{t("stackTitle")}</h2>
           ...
         </section>
       </div>  {/* ← cierre del max-w-4xl */}
   ```

   Estructura después:
   ```tsx
         <section>
           <h2 className="mb-6 text-2xl font-bold text-gray-100">{t("stackTitle")}</h2>
           ...
         </section>

         <ContactCtaSection />
       </div>
   ```

> No tocar el resto de la página. No tocar `generateMetadata`. No añadir nuevas claves a `meta.about.*` (la sección no es un nuevo SEO target, solo un CTA dentro de la página).

### `components/bento/navigation-dock.tsx`

**Cambios**:

1. **Eliminar** la const local `LinkedInIcon` (líneas 8–14 actuales — el SVG inline).

2. **Añadir import** junto a los imports existentes:
   ```tsx
   import { LinkedInIcon } from "@/components/icons/linkedin-icon"
   ```

3. **Verificar visualmente** que el SVG sigue rellenando el wrapper `<div className="h-5 w-5 ...">` (línea 80–82 actuales). Si el icono se ve más pequeño que antes (porque el SVG inline original tenía `width="20" height="20"`), aplicar el siguiente patch al uso dentro del map de `SOCIAL_LINKS`:
   ```tsx
   <IconComponent className="h-full w-full" />
   ```
   (En vez del actual `<IconComponent />`.) Esto **debe verificarse en dev**; si los otros iconos ya escalan correctamente sin `className`, entonces el cambio no es necesario y se queda como está. La verificación es del implementador.

### `messages/es.json` y `messages/en.json`

Aplicar las claves descritas en la sección "Claves i18n" arriba. **No modificar** ninguna clave existente.

---

## Tests

### Test 1: `tests/components/icons/linkedin-icon.test.tsx`

Cobertura mínima — solo verifica que el SVG renderiza con la `className` aplicada y que es un `<svg>`.

```tsx
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"

describe("LinkedInIcon", () => {
  describe("render()", () => {
    it("should render an svg element", () => {
      const { container } = render(<LinkedInIcon />)

      expect(container.querySelector("svg")).not.toBeNull()
    })

    it("should forward the className prop to the svg", () => {
      const { container } = render(<LinkedInIcon className="h-4 w-4" />)

      const svg = container.querySelector("svg")
      expect(svg?.getAttribute("class")).toContain("h-4 w-4")
    })

    it("should forward arbitrary svg props such as aria-hidden", () => {
      const { container } = render(<LinkedInIcon aria-hidden="true" />)

      const svg = container.querySelector("svg")
      expect(svg?.getAttribute("aria-hidden")).toBe("true")
    })
  })
})
```

### Test 2: `tests/components/footer/site-footer.test.tsx`

Renderiza `SiteFooterContent` (no el wrapper async) — patrón idéntico a `profile-block.test.tsx`. NO mockea `next-intl/server` porque el componente bajo test no lo usa.

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SiteFooterContent } from "@/components/footer/site-footer"

describe("SiteFooterContent", () => {
  const defaultProps = {
    contactTitle: "Contacto",
    emailLabel: "Email",
    emailAddress: "aitorscinfo@gmail.com",
    emailAriaLabel: "Enviar email a Aitor Santana",
    linkedinLabel: "LinkedIn",
    linkedinHandle: "@aitorscinfo",
    linkedinUrl: "https://www.linkedin.com/in/aitorscinfo/",
    linkedinAriaLabel: "Perfil de LinkedIn de Aitor Santana (se abre en una pestaña nueva)",
    githubLabel: "GitHub",
    githubHandle: "@Sstark97",
    githubUrl: "https://github.com/Sstark97",
    githubAriaLabel: "Perfil de GitHub de Aitor Santana (se abre en una pestaña nueva)",
    copyrightText: "© 2026 Aitor Santana. Hecho con cuidado en Canarias.",
  }

  describe("contact section", () => {
    it("should render the contact section with role contentinfo", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    })

    it("should display the visible email address", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByText("aitorscinfo@gmail.com")).toBeInTheDocument()
    })

    it("should render the email link with mailto href and aria-label", () => {
      render(<SiteFooterContent {...defaultProps} />)

      const emailLink = screen.getByRole("link", { name: "Enviar email a Aitor Santana" })
      expect(emailLink).toHaveAttribute("href", "mailto:aitorscinfo@gmail.com")
    })

    it("should render the LinkedIn link with the provided url, target blank and rel noopener", () => {
      render(<SiteFooterContent {...defaultProps} />)

      const linkedinLink = screen.getByRole("link", {
        name: "Perfil de LinkedIn de Aitor Santana (se abre en una pestaña nueva)",
      })
      expect(linkedinLink).toHaveAttribute("href", "https://www.linkedin.com/in/aitorscinfo/")
      expect(linkedinLink).toHaveAttribute("target", "_blank")
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should display the LinkedIn handle as visible text", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByText("@aitorscinfo")).toBeInTheDocument()
    })

    it("should render the GitHub link with the provided url, target blank and rel noopener", () => {
      render(<SiteFooterContent {...defaultProps} />)

      const githubLink = screen.getByRole("link", {
        name: "Perfil de GitHub de Aitor Santana (se abre en una pestaña nueva)",
      })
      expect(githubLink).toHaveAttribute("href", "https://github.com/Sstark97")
      expect(githubLink).toHaveAttribute("target", "_blank")
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should display the GitHub handle as visible text", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByText("@Sstark97")).toBeInTheDocument()
    })
  })

  describe("copyright section", () => {
    it("should display the copyright text passed via prop", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(
        screen.getByText("© 2026 Aitor Santana. Hecho con cuidado en Canarias."),
      ).toBeInTheDocument()
    })
  })
})
```

> Patrón seguido: solo se testea `SiteFooterContent`. El wrapper async `SiteFooter` queda cubierto implícitamente por el `pnpm build` y por los tests E2E existentes (que renderizan páginas completas).

### Test 3: `tests/components/about/contact-cta-section.test.tsx`

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ContactCtaSectionContent } from "@/components/about/contact-cta-section"

describe("ContactCtaSectionContent", () => {
  const defaultProps = {
    title: "¿Hablamos?",
    description: "Si tienes un proyecto entre manos, escríbeme.",
    primaryLabel: "Enviar email",
    primaryAriaLabel: "Enviar email a Aitor Santana",
    secondaryLabel: "Conectar en LinkedIn",
    secondaryAriaLabel: "Conectar con Aitor Santana en LinkedIn (se abre en una pestaña nueva)",
  }

  describe("title and description", () => {
    it("should render the section title as a heading", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      expect(screen.getByRole("heading", { name: "¿Hablamos?" })).toBeInTheDocument()
    })

    it("should render the description paragraph", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      expect(
        screen.getByText("Si tienes un proyecto entre manos, escríbeme."),
      ).toBeInTheDocument()
    })
  })

  describe("primary CTA", () => {
    it("should render a mailto link with the primary aria-label", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      const primary = screen.getByRole("link", { name: "Enviar email a Aitor Santana" })
      expect(primary).toHaveAttribute("href", "mailto:aitorscinfo@gmail.com")
    })

    it("should display the primary label text", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      expect(screen.getByText("Enviar email")).toBeInTheDocument()
    })
  })

  describe("secondary CTA", () => {
    it("should render the LinkedIn link with target blank and rel noopener", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      const secondary = screen.getByRole("link", {
        name: "Conectar con Aitor Santana en LinkedIn (se abre en una pestaña nueva)",
      })
      expect(secondary).toHaveAttribute("href", "https://www.linkedin.com/in/aitorscinfo/")
      expect(secondary).toHaveAttribute("target", "_blank")
      expect(secondary).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should display the secondary label text", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      expect(screen.getByText("Conectar en LinkedIn")).toBeInTheDocument()
    })
  })

  describe("section landmark", () => {
    it("should expose a region with the title as accessible name", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      const section = screen.getByRole("region", { name: "¿Hablamos?" })
      expect(section).toBeInTheDocument()
    })
  })
})
```

### Mocks necesarios

Ninguno. Los tests usan únicamente `SiteFooterContent` y `ContactCtaSectionContent`, que son puros componentes presentacionales con props plain. No tocan `next-intl/server`, `next/image`, `next/link`, ni el routing de `next-intl`. Esto sigue el patrón validado por `cta-button.test.tsx` y `profile-block.test.tsx`.

> Si en el futuro se quiere testear el wrapper async (`SiteFooter`/`ContactCtaSection`) — fuera del scope de este commit — habría que mockear `next-intl/server` con `vi.mock("next-intl/server", () => ({ getTranslations: async () => (k: string, vars?: Record<string, string | number>) => ... }))`.

### Carpetas nuevas en `tests/components/`

- `tests/components/footer/` — crear directorio
- `tests/components/about/` — crear directorio
- `tests/components/icons/` — crear directorio

(Vitest los recoge automáticamente con el glob `tests/**/*.{test,spec}.{js,ts,tsx}` ya configurado en `vitest.config.ts`.)

---

## Code Standards Checklist

- [ ] Sin `any` ni `as unknown as` en producción ni en tests.
- [ ] Todas las funciones tienen tipo de retorno explícito (`React.ReactElement`, `Promise<React.ReactElement>`).
- [ ] Named exports — NO default exports en `components/`.
- [ ] `??` para fallbacks de nullish (no aplica en este commit, pero respetar si surge).
- [ ] No `useEffect`, no `useState` (Server Components puros).
- [ ] No `process.env` en componentes — las URLs/email son constantes locales del módulo.
- [ ] No comentarios que expliquen QUÉ hace el código — los nombres ya lo describen.
- [ ] `undefined` antes que `null` (no aplica en este commit).
- [ ] Tests siguen patrón `describe("ComponentName", () => { describe("..", () => { it("should ...") }) })`.
- [ ] Tests usan `vi`, no `jest`.
- [ ] Tests sin `any`.

---

## Riesgos y consideraciones

1. **Overflow móvil del footer**: el email es largo (`aitorscinfo@gmail.com`). El markup ya usa `break-all` en el `<span>` del email para evitar overflow horizontal en mobile (≤375px). En el listado horizontal `sm:flex-wrap` deja que los items bajen de fila si no caben. **Verificar en dev** en 320px y 375px.

2. **Footer en home (bento)**: el home actual usa `flex items-center justify-center min-h-screen`. Como el footer se monta como sibling después de `{children}`, fluye debajo y NO afecta el bento. El usuario tiene que hacer scroll para verlo en home — comportamiento intencionado y validado en el contexto de la tarea. Si visualmente se solapa, NO se modifica el home (decisión cerrada en el brief).

3. **`navigation-dock.tsx`**: extraer el icono LinkedIn cambia ligeramente la API (sin `width="20"`/`height="20"` hard-coded). Documentado el contingency plan: si se ve más pequeño, añadir `className="h-full w-full"` en el sitio de uso. Verificación visual obligatoria por el implementador.

4. **`mailto:` accesibilidad**: el icono `<Mail>` tiene `aria-hidden="true"`; el texto visible es el email completo, y el `aria-label` del `<a>` da contexto adicional. Cumple WCAG (no se duplica info entre icono y aria-label porque el icono está oculto).

5. **`target="_blank"` accesibilidad**: el aria-label de los links externos incluye explícitamente "(se abre en una pestaña nueva)" / "(opens in a new tab)" para cumplir WCAG 3.2.5.

6. **Año dinámico en SSG**: como el portfolio se construye estáticamente (`generateStaticParams` en el layout), el año se "congela" en el build. Esto es aceptable y comportamiento estándar en sitios estáticos. Si se quisiera el año siempre actual sería necesario `dynamic = "force-dynamic"` o un Edge handler — fuera del scope.

7. **i18n: paridad de claves**: cualquier clave añadida a `es.json` debe existir en `en.json` y viceversa. El implementador debe revisar ambos archivos antes de commitear.

8. **Tests con jsdom**: `jsdom` no carga imágenes ni hace navegación real; `target="_blank"` y `href` se verifican como atributos del DOM, no se sigue el link. Comportamiento esperado.

9. **Sección CTA del About y `aria-labelledby`**: se le asigna un `id="about-contact-title"` al `<h2>`. Si en el futuro se añade otra sección con el mismo patrón, usar IDs únicos por sección.

10. **`copyright` con interpolación ICU**: `t("copyright", { year: currentYear })` — confirmar en runtime que `next-intl` interpola correctamente; el patrón ya se usa en `home.heroStats` (`{count}`) y en `search.filtered`, así que es seguro.

---

## Implementation Steps (orden recomendado)

1. **i18n primero** — añadir claves a `messages/es.json` y `messages/en.json`. Verificar paridad y JSON válido (sin coma colgante).
2. **Crear `components/icons/linkedin-icon.tsx`**.
3. **Crear test del icono** (`tests/components/icons/linkedin-icon.test.tsx`) y correr `pnpm test linkedin-icon` en verde.
4. **Refactorizar `components/bento/navigation-dock.tsx`** para usar el icono extraído. Verificar visualmente en `pnpm dev`.
5. **Crear `components/footer/site-footer.tsx`** con `SiteFooterContent` + `SiteFooter`.
6. **Crear test del footer** (`tests/components/footer/site-footer.test.tsx`) y correr en verde.
7. **Modificar `app/[locale]/layout.tsx`** — montar `<SiteFooter />`.
8. **Verificar visualmente** en home, blog, sobre-mí, en ES y EN.
9. **Crear `components/about/contact-cta-section.tsx`** con `ContactCtaSectionContent` + `ContactCtaSection`.
10. **Crear test del CTA section** y correr en verde.
11. **Modificar `app/[locale]/sobre-mi/page.tsx`** — montar `<ContactCtaSection />` después de la sección Stack.
12. **Verificar visualmente** en `/sobre-mi` y `/en/about`.
13. **Correr `pnpm type-check`** — debe dar 0 errores.
14. **Correr `pnpm test`** — debe pasar todo.
15. **Correr `pnpm build`** — debe construir sin errores ni warnings nuevos.
16. **Verificación visual final**: 320px, 768px, 1280px en home, blog, sobre-mí, en ambos idiomas.

---

## Complexity Estimate

**M (Medium, ~2.5h)**

Desglose:
- i18n claves + paridad: 15 min
- Extracción de `LinkedInIcon` + refactor `navigation-dock`: 15 min
- Footer (Content + wrapper + test + integración en layout): 60 min
- ContactCtaSection (Content + wrapper + test + integración en about): 30 min
- Verificación visual cross-locale + responsive: 20 min
- Type-check + tests + build: 10 min

Sin lógica de dominio, sin nuevas deps, sin cambios en `src/lib/`. La complejidad real está en el cuidado de mantener el patrón Content/wrapper testeable, la accesibilidad (aria-labels para target=_blank), y la verificación visual en mobile.
