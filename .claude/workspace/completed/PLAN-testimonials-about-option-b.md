# Task: Testimonials en About — Opción B (Pull-quote + lista editorial)

## Description

Sustituir el masonry de 4 cards que usa `app/[locale]/sobre-mi/page.tsx` por una sección "vista completa" donde se muestren los 11 testimonios siguiendo la **Opción B** del brief de UX (`.claude/workspace/planning/DESIGN-testimonials-about-page.md`): un testimonio "ancla" como pull-quote a sangre completa abre la sección, y los 10 restantes se listan debajo en una columna a ancho completo con tono editorial. La sección es el destino del anchor `#testimonios` que ya emite el CTA del masonry de la home.

**No se toca la home.** El masonry de 4 destacados sigue como está. Solo se modifica la presentación en `/sobre-mi`.

## Acceptance Criteria

- [ ] La página `/sobre-mi#testimonios` (y `/en/about#testimonios`) muestra los 11 testimonios: uno como pull-quote ancla y los 10 restantes como lista editorial a 1 columna a ancho completo.
- [ ] La sección tiene `id="testimonios"` y `scroll-mt-24` para que el anchor de la home aterrice sin quedar tapado por el header.
- [ ] El componente es Server Component puro (sin `"use client"`).
- [ ] El masonry de 4 testimonios de la home (`components/testimonials/testimonials-masonry.tsx` invocado desde la home) no cambia su comportamiento ni su layout.
- [ ] Las cards de la lista editorial siguen siendo enlaces a LinkedIn, `target="_blank"`, `rel="noopener noreferrer"`, con `aria-label` interpolado.
- [ ] El pull-quote ancla también enlaza al LinkedIn del autor con el mismo patrón.
- [ ] `pnpm type-check` sin nuevos errores.
- [ ] `pnpm test` 100% verde (incluyendo los nuevos tests del componente nuevo).
- [ ] Fixtures sintéticas en los tests; cero datos reales.

## Architecture Decisions

### Decisión 1 — Qué testimonio se elige como ancla

**Decisión: `testimonials[0]`** del orden natural devuelto por `testimonials.getAll.execute(locale)`.

Justificación: el orden ya está controlado en `InMemoryTestimonialRepository` (el primero es el más representativo según el ordering manual existente) y mantener "el primero" como ancla es predecible, testeable, y no introduce un nuevo campo en la entidad. Añadir `featured?: boolean` a `TestimonialFrontmatter` exigiría tocar entidad + ambos adaptadores + tipo + tests del repo, todo para un único bit de información que la posición ya codifica. Si en el futuro el usuario quiere otro ancla, basta con reordenar el array fuente.

Trade-off: el primero del array es implícitamente "el ancla". Se documenta con un comentario JSDoc en la propiedad de `TestimonialsAboutSection` (que no es código autoexplicativo — es semántica de negocio que el lector debe conocer).

### Decisión 2 — Card actual vs nuevo componente para la lista

**Decisión: crear `TestimonialRow`** como nueva variante editorial a ancho completo.

Justificación: `TestimonialCard` está diseñada para masonry de 1-3 columnas. Sus paddings (`p-6`), su layout vertical (quote arriba, footer abajo con autor en columna), y especialmente el quote en `text-base` se ven raquíticos cuando la card mide ~896px (max-w-4xl) de ancho. La opción B exige un layout más editorial: quote a la izquierda en bloque, metadatos del autor inline o a la derecha. Forzar `TestimonialCard` con overrides de className rompería el principio de cohesión del componente y produciría una variante "card a ancho completo que aparenta ser lo que no es".

`TestimonialRow` reutiliza la lógica `computeInitials` (extraída a un helper compartido) y mantiene la misma estética visual del proyecto (border, bg, hover naranja, focus ring), pero con un layout horizontal en `md+` y vertical en mobile.

### Decisión 3 — Nuevo componente `TestimonialPullQuote`

**Decisión: componente independiente nuevo**, no es una variante de Card ni de Row.

Justificación: el pull-quote ancla tiene jerarquía visual distinta (sin borde de card, comillas naranjas grandes decorativas, tipografía ~1.5×, autor a la derecha con un divisor sutil). Encapsularlo en su propio componente clarifica intención y permite ajustarlo sin afectar al resto.

### Decisión 4 — i18n keys nuevas

**Decisión: añadir `testimonials.aboutTitle`, `testimonials.aboutSubtitle` y `testimonials.aboutLabel`** como claves específicas de About.

Justificación: el subtítulo de home ("Recomendaciones de compañeros con los que he trabajado.") está pensado para "asomarse"; en About necesita un copy más editorial ("Estas son las voces de las personas con las que he trabajado…"). Reutilizar la misma key obligaría a un compromiso textual entre los dos contextos. Las claves existentes (`title`, `subtitle`, `label`) se mantienen intactas para la home.

`testimonials.viewLinkedinAriaLabel` SÍ se reutiliza (es semántica universal).

### Decisión 5 — Wiring en `app/[locale]/sobre-mi/page.tsx`

**Decisión: reemplazar el `<TestimonialsSection>` actual** (línea 177) por el nuevo `<TestimonialsAboutSection>`, manteniendo la misma posición (antes del Contact CTA).

Justificación: la posición en About ya está validada (final de página, antes del CTA de contacto). La única diferencia es que el componente cambia.

### Decisión 6 — `id="testimonios"` no colisiona

Verificado: solo aparece como destino del `href` en `testimonials-masonry.tsx` (línea 45). Ningún elemento existente en About usa ese id. Lo añadimos en `<section>` de `TestimonialsAboutSection`.

### Decisión 7 — `computeInitials` compartida

**Decisión: extraer `computeInitials`** de `testimonial-card.tsx` a un módulo compartido `components/testimonials/initials.ts` (named export) para que `TestimonialCard`, `TestimonialRow` y `TestimonialPullQuote` lo consuman sin duplicar lógica.

Justificación: la función es trivial pero idéntica en los tres consumidores. Extraerla evita el anti-patrón de duplicación y permite testearla una vez.

## Files to Create/Modify

### CREATE

- `components/testimonials/initials.ts` (CREATE) — helper `computeInitials(author: string): string` extraído de `testimonial-card.tsx`. Named export.
- `components/testimonials/testimonial-pull-quote.tsx` (CREATE) — Server Component del pull-quote ancla.
- `components/testimonials/testimonial-row.tsx` (CREATE) — Server Component de la card editorial a ancho completo.
- `components/testimonials/testimonials-about-section.tsx` (CREATE) — Server Component contenedor (async, lee i18n) que orquesta pull-quote + lista de rows. Análogo a `testimonials-section.tsx` pero para About.
- `tests/components/testimonials/initials.test.ts` (CREATE) — tests unitarios del helper.
- `tests/components/testimonials/testimonial-pull-quote.test.tsx` (CREATE) — tests del pull-quote.
- `tests/components/testimonials/testimonial-row.test.tsx` (CREATE) — tests del row.
- `tests/components/testimonials/testimonials-about-section.test.tsx` (CREATE) — tests de integración del contenedor (versión content, igual que `testimonials-masonry.test.tsx` testea `TestimonialsMasonry`).

### MODIFY

- `components/testimonials/testimonial-card.tsx` (MODIFY) — eliminar `computeInitials` local e importarlo desde `./initials`. Sin cambios funcionales.
- `app/[locale]/sobre-mi/page.tsx` (MODIFY) — reemplazar `<TestimonialsSection testimonials={testimonialDtos} />` por `<TestimonialsAboutSection testimonials={testimonialDtos} />`. El array completo (11) sigue pasándose tal cual; el corte ya no aplica porque About muestra todos. Actualizar el import.
- `messages/es.json` (MODIFY) — añadir `testimonials.aboutLabel`, `testimonials.aboutTitle`, `testimonials.aboutSubtitle`.
- `messages/en.json` (MODIFY) — mismas claves en inglés.

## Implementation Steps

1. **Crear `components/testimonials/initials.ts`** con la función `computeInitials(author: string): string` copiada literal de la actual en `testimonial-card.tsx`. Named export. Tipo de retorno explícito.

2. **Refactorizar `components/testimonials/testimonial-card.tsx`** para importar `computeInitials` desde `./initials` y eliminar la copia local. No tocar nada más; los tests existentes deben seguir pasando sin cambios.

3. **Crear `components/testimonials/testimonial-pull-quote.tsx`** (Server Component). Recibe `testimonial: TestimonialDto` y `viewLinkedinAriaLabel: string` (ya interpolado). Renderiza:
   - Comillas grandes naranjas decorativas (`aria-hidden`) como elemento SVG de apertura.
   - `<blockquote>` con la cita en tipografía editorial (~1.5×).
   - Pie con autor / rol / company alineado a la derecha en desktop, debajo en mobile.
   - Todo envuelto en `<a>` clickable al `linkedinUrl` con `target="_blank"`, `rel="noopener noreferrer"`, `aria-label={viewLinkedinAriaLabel}`.
   - Sin borde de card; la jerarquía es tipográfica.

4. **Crear `components/testimonials/testimonial-row.tsx`** (Server Component). Recibe `testimonial: TestimonialDto` y `viewLinkedinAriaLabel: string`. Renderiza la misma información que `TestimonialCard` pero en layout horizontal en `md+` (quote ocupa la mayor parte, autor/avatar a la derecha) y vertical en mobile. Mantiene el estilo card visual (border, bg, hover naranja, focus ring), pero a ancho completo. Reutiliza `computeInitials` del módulo compartido.

5. **Crear `components/testimonials/testimonials-about-section.tsx`** con dos exports siguiendo el patrón de `testimonials-section.tsx`:
   - `TestimonialsAboutSectionContent` (síncrono, recibe strings de i18n ya resueltos y los testimonios).
   - `TestimonialsAboutSection` (async, llama a `getTranslations("testimonials")` y delega en Content).
   El contenedor `<section>` lleva `id="testimonios"` y `scroll-mt-24`. Internamente: si `testimonials.length === 0` retorna `null`. Si `length >= 1`, el primero va a `TestimonialPullQuote` y el resto a `TestimonialRow`. Si solo hay 1, no se renderiza lista debajo. Interpolación de `aria-label` reutilizando la función `buildLinkedinAriaLabel` (puede inlinearse o exportarse desde `testimonials-masonry.tsx`; **decisión: inlinearla como helper local** porque no es justificable un módulo aparte por una línea).

6. **Modificar `app/[locale]/sobre-mi/page.tsx`**: cambiar el import a `TestimonialsAboutSection` y reemplazar el componente en JSX. Mantener el wrapper `<section className="mt-12">` o eliminarlo (la nueva sección ya es semántica `<section>` con sus propios márgenes — **decisión: eliminar el `<section className="mt-12">` envoltorio y dejar que `TestimonialsAboutSection` aplique su propio `mt-12 scroll-mt-24`**).

7. **Actualizar `messages/es.json`** añadiendo dentro de `"testimonials"`:
   ```
   "aboutLabel": "TESTIMONIOS · 11",
   "aboutTitle": "Lo que dicen de mí",
   "aboutSubtitle": "Voces de las personas con las que he trabajado a lo largo de estos años."
   ```
   El `· 11` es un placeholder textual; alternativa: usar `aboutLabelTemplate` con `{count}` interpolable. **Decisión: usar template con `{count}`** para no acoplar la traducción al número exacto. Clave final:
   ```
   "aboutLabel": "TESTIMONIOS · {count}"
   ```
   El componente interpola con `total = testimonials.length`.

8. **Actualizar `messages/en.json`** con las equivalencias:
   ```
   "aboutLabel": "TESTIMONIALS · {count}",
   "aboutTitle": "What others say",
   "aboutSubtitle": "Voices of the people I've worked with over the years."
   ```

9. **Verificar manualmente** según la sección "Verificación".

## Tailwind classes concretas

### `TestimonialsAboutSection` contenedor

```
<section
  id="testimonios"
  aria-labelledby="testimonials-about-title"
  className="mt-12 scroll-mt-24"
>
  <header className="mb-10">
    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
      {sectionLabel}
    </span>
    <h2
      id="testimonials-about-title"
      className="mt-2 text-2xl font-bold text-gray-100"
    >
      {title}
    </h2>
    {subtitle.length > 0 && (
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    )}
  </header>

  {/* PullQuote ancla */}
  <TestimonialPullQuote ... />

  {/* Separador editorial */}
  <hr className="my-10 border-t border-white/5" />

  {/* Lista editorial */}
  <div className="flex flex-col gap-4">
    {rest.map((t) => <TestimonialRow ... />)}
  </div>
</section>
```

### `TestimonialPullQuote`

```
<a
  href={linkedinUrl}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={viewLinkedinAriaLabel}
  className="group block rounded-xl px-4 py-6 transition-colors duration-300 hover:bg-white/[0.02] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 md:px-8 md:py-8"
>
  <svg
    aria-hidden="true"
    viewBox="0 0 32 32"
    className="h-12 w-12 text-[#FCA311]"
    fill="currentColor"
  >
    {/* mismo path que TestimonialCard */}
  </svg>

  <blockquote className="mt-6 text-xl italic leading-relaxed text-gray-100 md:text-2xl md:leading-[1.6]">
    {quote}
  </blockquote>

  <footer className="mt-8 flex items-center justify-end gap-3">
    {avatarUrl !== undefined ? (
      <Image src={avatarUrl} alt="" width={48} height={48}
        className="h-12 w-12 rounded-full object-cover" />
    ) : (
      <span aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCA311] font-mono text-base font-bold uppercase text-[#1a1a1a]">
        {initials}
      </span>
    )}
    <div className="min-w-0 text-right">
      <p className="truncate text-sm font-semibold text-gray-100">— {author}</p>
      <p className="truncate font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {role}{company !== "" && <> · {company}</>}
      </p>
    </div>
  </footer>
</a>
```

### `TestimonialRow`

```
<a
  href={linkedinUrl}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={viewLinkedinAriaLabel}
  className="group flex flex-col gap-4 rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-[#FCA311]/30 hover:shadow-lg hover:shadow-[#FCA311]/10 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 md:flex-row md:items-center md:gap-6 md:p-7"
>
  <div className="min-w-0 flex-1">
    <svg aria-hidden="true" viewBox="0 0 32 32"
      className="h-6 w-6 text-[#FCA311]/40" fill="currentColor">
      {/* mismo path */}
    </svg>
    <blockquote className="mt-3 text-base italic leading-relaxed text-gray-100">
      {quote}
    </blockquote>
  </div>

  <div className="flex items-center gap-3 border-t border-white/5 pt-4 md:w-56 md:shrink-0 md:flex-col md:items-start md:border-l md:border-t-0 md:pl-6 md:pt-0">
    {avatarUrl !== undefined ? (
      <Image src={avatarUrl} alt="" width={40} height={40}
        className="h-10 w-10 rounded-full object-cover" />
    ) : (
      <span aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCA311] font-mono text-sm font-bold uppercase text-[#1a1a1a]">
        {initials}
      </span>
    )}
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-100">{author}</p>
      <p className="truncate font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {role}{company !== "" && <> · {company}</>}
      </p>
    </div>
  </div>
</a>
```

## Props / Interfaces

### `components/testimonials/initials.ts`

```ts
export function computeInitials(author: string): string
```

### `components/testimonials/testimonial-pull-quote.tsx`

```ts
type TestimonialPullQuoteProps = {
  testimonial: TestimonialDto
  viewLinkedinAriaLabel: string  // ya interpolado
}

export function TestimonialPullQuote(props: TestimonialPullQuoteProps): React.ReactElement
```

### `components/testimonials/testimonial-row.tsx`

```ts
type TestimonialRowProps = {
  testimonial: TestimonialDto
  viewLinkedinAriaLabel: string  // ya interpolado
}

export function TestimonialRow(props: TestimonialRowProps): React.ReactElement
```

### `components/testimonials/testimonials-about-section.tsx`

```ts
type TestimonialsAboutSectionContentProps = {
  testimonials: TestimonialDto[]
  title: string
  subtitle: string
  sectionLabelTemplate: string  // contiene "{count}"
  viewLinkedinAriaLabelTemplate: string  // contiene "{author}"
}

export function TestimonialsAboutSectionContent(
  props: TestimonialsAboutSectionContentProps
): React.ReactElement | null

type TestimonialsAboutSectionProps = {
  testimonials: TestimonialDto[]
}

export async function TestimonialsAboutSection(
  props: TestimonialsAboutSectionProps
): Promise<React.ReactElement | null>
```

El componente async lee `getTranslations("testimonials")` y mapea:
- `title` ← `t("aboutTitle")`
- `subtitle` ← `t("aboutSubtitle")`
- `sectionLabelTemplate` ← `t.raw("aboutLabel")` con narrowing (igual que el patrón existente en `testimonials-section.tsx` con `readString`).
- `viewLinkedinAriaLabelTemplate` ← `t.raw("viewLinkedinAriaLabel")` con el mismo narrowing.

## i18n keys exactas a añadir

**`messages/es.json` (dentro del objeto `"testimonials"`):**
```json
"aboutLabel": "TESTIMONIOS · {count}",
"aboutTitle": "Lo que dicen de mí",
"aboutSubtitle": "Voces de las personas con las que he trabajado a lo largo de estos años."
```

**`messages/en.json` (dentro del objeto `"testimonials"`):**
```json
"aboutLabel": "TESTIMONIALS · {count}",
"aboutTitle": "What others say",
"aboutSubtitle": "Voices of the people I've worked with over the years."
```

Las claves `label`, `title`, `subtitle`, `viewLinkedinAriaLabel`, `viewAllLabel`, `viewAllCount` se mantienen sin cambios (son las que usa la home).

## Testing Requirements

### `tests/components/testimonials/initials.test.ts`

- [ ] `should return empty placeholder "?" when author is empty string`
- [ ] `should return first two letters uppercased for a single-word author`
- [ ] `should return first and last initials for a two-word author`
- [ ] `should return first and last initials for an author with middle names`
- [ ] `should trim whitespace before computing initials`

Sin renderizar nada; tests puramente funcionales sobre el helper.

### `tests/components/testimonials/testimonial-pull-quote.test.tsx`

Mockear `next/image` exactamente igual que en `testimonial-card.test.tsx`. Fixtures sintéticas locales (factory `makeTestimonialDto`).

- [ ] `content rendering > should render the quote text`
- [ ] `content rendering > should render the author, role and company`
- [ ] `content rendering > should render the decorative quote SVG with aria-hidden`
- [ ] `avatar rendering > should render an img element when avatarUrl is provided`
- [ ] `avatar rendering > should render initials when avatarUrl is undefined`
- [ ] `link behavior > should expose linkedinUrl as href with target=_blank and rel="noopener noreferrer"`
- [ ] `link behavior > should expose the supplied viewLinkedinAriaLabel as accessible name`

### `tests/components/testimonials/testimonial-row.test.tsx`

Mockear `next/image` igual. Fixtures sintéticas locales.

- [ ] `content rendering > should render quote, author, role and company`
- [ ] `content rendering > should not render the " · company" segment when company is empty`
- [ ] `avatar rendering > should render initials when avatarUrl is undefined`
- [ ] `avatar rendering > should render an img element when avatarUrl is provided`
- [ ] `link behavior > should expose linkedinUrl as href with target=_blank and rel="noopener noreferrer"`
- [ ] `link behavior > should expose the supplied viewLinkedinAriaLabel as accessible name`

### `tests/components/testimonials/testimonials-about-section.test.tsx`

Testear **únicamente `TestimonialsAboutSectionContent`** (la versión síncrona, que recibe strings ya resueltos). El wrapper async se considera trivial. Mockear `next/image` y, si fuera necesario, no se necesita mock de `next-intl` porque no se usa en la versión content.

- [ ] `should return null when testimonials is empty`
- [ ] `should render only the pull-quote when exactly one testimonial is provided`
- [ ] `should render the first testimonial as pull-quote and the rest as rows when multiple are provided`
- [ ] `should expose id="testimonios" on the section element`
- [ ] `should interpolate the total into sectionLabelTemplate replacing {count}`
- [ ] `should interpolate each author into viewLinkedinAriaLabelTemplate replacing {author}`
- [ ] `should render the subtitle paragraph only when subtitle has length > 0`

Fixtures sintéticas locales (no se importan datos reales de `tests/lib/content/fixtures/testimonials.fixtures.ts` para mantener el component test autocontenido; alternativa válida es importar `mockTestimonialsEs` ya que son sintéticos, pero el componente DTO espera `TestimonialDto`, no `Testimonial`, así que un `makeTestimonialDto` local es más limpio — **decisión: factory local**).

### Test existente a verificar (sin tocar)

- `tests/components/testimonials/testimonial-card.test.tsx` debe seguir pasando tras extraer `computeInitials` a `./initials`. No se modifica.
- `tests/components/testimonials/testimonials-masonry.test.tsx` no se toca.

## Code Standards Checklist

- [ ] No `any` types — todas las props con tipos explícitos.
- [ ] Todas las funciones con return type explícito (`: React.ReactElement`, `: React.ReactElement | null`, `: Promise<React.ReactElement | null>`, `: string`).
- [ ] `??` no `||` para nullish (no se anticipan defaults, pero respetar regla).
- [ ] Named exports en todos los componentes nuevos (no `export default`).
- [ ] Sin `useEffect`, sin `"use client"` — todo Server Component.
- [ ] Comprobaciones de existencia explícitas: `avatarUrl !== undefined`, `subtitle.length > 0`, `company !== ""` (siguen el patrón existente).
- [ ] Tests con `describe / describe / it` y nombres "should ...".
- [ ] Sin datos reales en fixtures de tests.
- [ ] El helper `computeInitials` queda extraído (no duplicado).

## Verificación

Cuando esté implementado, comprobar manualmente:

1. **Type-check**: `pnpm type-check` sin nuevos errores (los 27 preexistentes de use-case-test son known).
2. **Tests**: `pnpm test` 100% verde incluyendo los nuevos.
3. **Navegación del anchor**:
   - Ir a `/` (home), scroll al masonry de testimonios, click en "Ver todos los testimonios (11) →".
   - Debe llevar a `/sobre-mi#testimonios` y aterrizar en la sección con su título "Lo que dicen de mí" visible (no tapada por el header gracias a `scroll-mt-24`).
4. **Pull-quote ancla**:
   - El primer testimonio aparece en grande, sin borde de card, con comillas naranjas grandes arriba y el autor a la derecha del footer.
   - Click en cualquier parte abre el LinkedIn del autor en pestaña nueva.
5. **Lista editorial**:
   - 10 cards a ancho completo debajo del pull-quote, una por fila.
   - En desktop: layout horizontal (quote izquierda + autor derecha con divisor vertical).
   - En mobile (`<768px`): layout vertical (quote arriba, autor abajo con divisor horizontal).
   - Hover: borde naranja `#FCA311/30` + sombra naranja sutil.
6. **i18n**:
   - En `/sobre-mi` (es): label "TESTIMONIOS · 11", título "Lo que dicen de mí".
   - En `/en/about`: label "TESTIMONIALS · 11", título "What others say".
7. **Home intacta**: el masonry de 4 testimonios + CTA en la home sigue idéntico.
8. **Accesibilidad**:
   - Focus ring naranja visible al tabular tanto en pull-quote como en cada row.
   - El `aria-label` de cada link contiene el nombre del autor.
   - El SVG de comillas en `aria-hidden="true"`.

## Complejidad Estimate

**M (Medium, 2-4h)**.

Desglose:
- Refactor `computeInitials` + tests del helper: 15 min.
- `TestimonialPullQuote` + tests: 45 min.
- `TestimonialRow` + tests: 45 min.
- `TestimonialsAboutSection` (content + async) + tests: 45 min.
- Wiring en `sobre-mi/page.tsx` + i18n en ambos json: 15 min.
- Verificación manual + ajustes visuales: 30 min.

Total estimado: ~3h.
