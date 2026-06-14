# Design: Testimonios — Iteración 2 (eliminar hueco vacío)

## Objetivo

Eliminar el hueco vertical que aparece bajo las cards cuando los quotes son cortos. El slider de la iteración 1 corrige la altura por card, pero deja el contenedor reservando espacio y separa flechas/dots/contador del contenido. Queremos densidad visual, progreso claro y eliminar el contador "9 / 11".

## Contexto

Componente afectado: `components/testimonials/testimonials-slider.tsx` (`"use client"`).
Sección: `components/testimonials/testimonials-section.tsx`, montada en la bento `md:col-span-12`.
Total: 11 testimonios, longitud variable (3–12 líneas).

El hueco no viene de `min-h` en las cards (eso ya se quitó). Viene de tres factores combinados:

1. `mt-6` del wrapper del slider + `mt-6` del bloque de controles = mucho aire vertical.
2. Bloque inferior con tres elementos (`flex-row md:justify-between`) que estira los controles a lo ancho y los empuja al fondo de la fila bento.
3. La sección está en una fila bento generosa: si los hermanos son altos, esta sección sigue su altura (la card section es `rounded-xl ... bg-[#222222]`, expande para llenar). El track sólo ocupa lo que necesita y el footer queda anclado abajo.

---

## Recomendación principal — Opción A: Masonry 2 columnas + "Ver todos"

**Eliminar el slider en home.** Mostrar 4 testimonios destacados en masonry de 2 columnas (CSS `columns-2`) con altura natural por card. Debajo, un único CTA "Ver todos los testimonios" (link a `/sobre-mi#testimonios` o `/testimonios`). Sin flechas, sin dots, sin contador.

Justificación: el slider obliga a reservar altura para 2 cards + controles; cualquier altura fija reaparece como hueco cuando los quotes son cortos. Un masonry estático con altura natural elimina el problema por construcción, densifica la sección, respeta el tono editorial calmo (cero animación, cero estado), y deja la exploración completa para una vista dedicada donde sí tiene sentido leer los 11. Es la única opción que rompe la dependencia de "altura fija del contenedor".

---

## Wireframe

### Desktop (≥ 768px)

```
+----------------------------------------------------------+
| LO QUE DICEN DE MI                                       |
| Testimonios                                              |
| Personas con las que he trabajado                        |
|                                                          |
| +-------------------+   +-------------------+            |
| | "                 |   | "                 |            |
| | Quote corto       |   | Quote largo que   |            |
| | de 3 líneas.      |   | ocupa más espacio |            |
| |                   |   | porque el autor   |            |
| | (avatar) Autor    |   | tenía mucho que   |            |
| |          Rol·Cía  |   | contar y eso esta |            |
| +-------------------+   | bien.             |            |
| +-------------------+   |                   |            |
| | "                 |   | (avatar) Autor    |            |
| | Quote medio       |   |          Rol·Cía  |            |
| | 6 líneas.         |   +-------------------+            |
| | ...               |   +-------------------+            |
| | (avatar) Autor    |   | "                 |            |
| |          Rol·Cía  |   | Quote corto       |            |
| +-------------------+   | (avatar) Autor    |            |
|                         +-------------------+            |
|                                                          |
|              -> Ver todos los testimonios (11)           |
+----------------------------------------------------------+
```

### Mobile (< 768px)

```
+--------------------------+
| LO QUE DICEN DE MI       |
| Testimonios              |
| Personas con las que...  |
|                          |
| +----------------------+ |
| | "                    | |
| | Quote 1              | |
| | (avatar) Autor       | |
| +----------------------+ |
| +----------------------+ |
| | "                    | |
| | Quote 2              | |
| +----------------------+ |
| +----------------------+ |
| | Quote 3 ...          | |
| +----------------------+ |
|                          |
| -> Ver todos (11)        |
+--------------------------+
```

---

## Especificación de componentes

### `TestimonialsSection` (modificación)

Mantiene la cabecera y el wrapper de la sección. Cambia el cuerpo: en lugar de `TestimonialsSlider`, renderiza `TestimonialsMasonry` con `testimonials.slice(0, 4)` y un `Link` a la página completa.

### `TestimonialsMasonry` (nuevo, Server Component)

**Archivo:** `components/testimonials/testimonials-masonry.tsx`

**Props:**
```typescript
interface TestimonialsMasonryProps {
  testimonials: TestimonialDto[]
  viewLinkedinAriaLabelTemplate: string
}
```

**Estructura clave (clases Tailwind):**

- Wrapper masonry:
  `mt-6 columns-1 gap-4 md:columns-2`
- Cada card item (wrapper alrededor de `TestimonialCard`):
  `mb-4 break-inside-avoid`
- CTA "Ver todos":
  `mt-6 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[#FCA311] transition-colors duration-300 hover:text-[#FCA311]/80 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2`

`columns-2` de CSS reparte automáticamente los items entre dos columnas balanceando alturas; con `break-inside-avoid` nunca se corta una card. Cero JS.

### `TestimonialCard` (sin cambios estructurales)

Sigue siendo `flex flex-col` con altura natural. En masonry no necesita `h-full` ni `min-h-*`. Comprobar que NO tenga `h-full` residual de la iteración 1.

### Eliminar de `TestimonialsSlider`

- `currentIndex + 1 / total` (contador)
- Flechas prev/next
- Dots pagination
- Toda la lógica `useState` / `useRef` / `ResizeObserver` / `useEffect` de medición.

Si quieres conservar el slider para la futura página `/testimonios`, muévelo a `components/testimonials/testimonials-slider.tsx` pero no se monta en home.

---

## Decisión sobre paginación y flechas

**Eliminar las tres:**
- Contador "9 / 11": fuera (causa de confusión).
- Flechas prev/next: fuera (no hay slider).
- Dots: fuera (no hay slider).

**Sustitución:** CTA de texto "Ver todos los testimonios (11) →" como única vía de exploración completa. Anchor cerca del bento sin compromisos de altura.

---

## Flujo de interacción

1. Usuario llega al home y scrollea hasta la fila de testimonios.
2. Lee 4 testimonios variados en masonry. La sección ocupa exactamente lo que ocupan las cards + cabecera + CTA.
3. Si quiere más, clica "Ver todos" → página dedicada (fuera del alcance de esta iteración, puede ser un anchor a una sección de `/sobre-mi`).
4. Cada card es un `<a>` a LinkedIn (comportamiento actual conservado).

---

## Accesibilidad

- [x] Contraste 4.5:1 (mismos tokens que iteración 1).
- [x] CTA con `focus-visible:outline-2 outline-[#FCA311] outline-offset-2`.
- [x] Cards mantienen `aria-label` con autor y enlace externo (`rel="noopener noreferrer"`).
- [x] Semántica: `<section aria-labelledby="testimonials-title">`, `<blockquote>` dentro de cada card.
- [x] Sin `role="carousel"` ni `role="tablist"` ya que no hay slider — se simplifica el árbol ARIA.
- [x] `prefers-reduced-motion`: irrelevante, no hay animación.

---

## Responsive

- **Mobile (<768px):** `columns-1`, stack vertical, 4 cards visibles. Sin scroll horizontal.
- **Tablet/Desktop (≥768px):** `columns-2`, masonry balanceada. Si en el futuro el bento la sube a 12 columnas reales con espacio, se puede pasar a `lg:columns-3` mostrando 6 cards.
- **Altura del contenedor:** ya no se "reserva" — la sección crece exactamente con su contenido. Si la fila bento aún impone min-height, revisar en `app/[locale]/page.tsx` la clase de la celda (`md:col-span-12` no impone altura por sí solo, así que debería quedar limpio).

---

## i18n

Añadir a `messages/es.json` y `messages/en.json` en `testimonials`:

- `viewAllLabel`: "Ver todos los testimonios" / "View all testimonials"
- `viewAllCount`: "({count})" — interpolación con total

**Eliminar (ya no se usan):**
- `previousAriaLabel`, `nextAriaLabel`, `paginationAriaLabel` (si no se reutilizan en página dedicada, retirarlos).

---

## Dependencias

- Ninguna nueva (`columns-*` es Tailwind core, `break-inside-avoid` también).
- Icono flecha derecha del CTA: `lucide-react` `ArrowRight` (ya usado en el resto del portfolio).

---

## Segunda mejor opción — Opción B: Slider compactado con `auto-rows` y sin contador

Mantener slider pero:
- Quitar `mt-6` doble (un solo `mt-4`).
- Bajar controles directamente debajo del track sin `flex-row justify-between` (centrar en columna única: flechas + dots juntas).
- Eliminar contador "9 / 11" y reemplazar por barra de progreso fina (`h-0.5 bg-[#FCA311]` con `width: ((currentIndex+1)/total)*100%`).
- Forzar la card section a `h-fit` (la sección no se estira aunque la fila bento sea alta).

**Por qué NO la elegiría como principal:** el problema raíz es que el slider obliga al usuario a paginar 11 elementos para una info que se consume mejor en escaneo simultáneo. Reducir padding tapa el síntoma pero la fricción cognitiva sigue ahí. Además `h-fit` puede romper la estética bento si los hermanos son altos (la sección queda flotando con vacío externo en vez de interno — moviste el problema, no lo eliminaste).

---

## Trade-offs honestos

- **Pierdes** la sensación de "abundancia" del slider (sugerir que hay muchos más). **Compensación:** el CTA "(11)" hace explícita la cantidad y resulta más honesto.
- **Pierdes** autoplay/animación si lo querías en el futuro. **No pasa nada:** el tono del portfolio es editorial calmo, no marketing.
- **Ganas** SSR puro, cero JS, cero estado, cero medición DOM, cero `useEffect`. La iteración 1 traía 3 efectos + ResizeObserver para resolver un problema que el grid resuelve gratis.
- **Riesgo:** masonry CSS reordena los items por columnas (col1: 1,2 / col2: 3,4 en vez de 1,2 / 3,4 por filas). Para 4 testimonios curados no importa; si el orden semántico es crítico, ordena la fuente para que el reparto sea aceptable.
