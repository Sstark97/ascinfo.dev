# Design: Testimonios About — Iteración 2 (ajustes pull-quote + rows)

## Objetivo
Bajar el peso visual del pull-quote y reorganizar las `TestimonialRow` para que el quote respire y el autor no quede "flotando". Mantener jerarquía: ancla > rows.

## Recomendación principal
- **Pull-quote:** bajar el quote de `text-xl md:text-2xl` a `text-lg md:text-xl`, comillas de `h-12 w-12` a `h-7 w-7` y `mt-6` a `mt-3`. Es la mitad de aire vertical, pero sigue siendo el único bloque con cursiva grande, comilla naranja y sin borde — la jerarquía aguanta.
- **Rows:** **Variante B** (quote a ancho completo arriba, autor abajo a la derecha estilo prensa). Resuelve el "autor flotando" sin pelearse con quotes largos, lee de forma editorial coherente con el ancla, y elimina la columna lateral fija que rompía las proporciones a 4xl. Descarto A (autor arriba aplana la jerarquía y compite con el ancla), C (sigue forzando 240px que sobran con quotes cortos) y D (inline `— Author` con texto largo se confunde con el quote).
- **Hover:** quitar el glow naranja. Estado base `border-white/5`, hover `border-white/10` — alineado con el resto de tarjetas del sistema. El `border-[#FCA311]/30 + shadow` actual es lo que da sensación de "card destacada por defecto".

## Wireframes

### Pull-quote — Desktop y mobile (sin cambios estructurales, solo tamaños)
```
 ❞  (h-7 w-7 naranja)
 "Un quote en cursiva, text-lg en móvil,
  text-xl en md+, leading-relaxed."

                          [avatar] — Author
                                    role · company
```

### TestimonialRow — Variante B
**Desktop (≥ 768px, contenedor max-w-4xl):**
```
┌────────────────────────────────────────────────────────┐
│ ❞                                                       │
│ "Quote a ancho completo, italic, text-base              │
│  leading-relaxed, sin columna lateral."                 │
│                                                         │
│                        [avatar] — Author, Role · Company│
└────────────────────────────────────────────────────────┘
```
**Mobile (< 768px):**
```
┌──────────────────────┐
│ ❞                     │
│ "Quote ancho          │
│  completo."           │
│                       │
│ ──────────────────    │
│ [avatar] Author       │
│          Role·Company │
└──────────────────────┘
```

## Especificación

### TestimonialPullQuote (modificación)
**Cambios concretos:**
- `<svg>` comillas: `h-12 w-12` → `h-7 w-7`
- `<blockquote>`: `mt-6 text-xl italic leading-relaxed text-gray-100 md:text-2xl md:leading-[1.6]` → `mt-3 text-lg italic leading-relaxed text-gray-100 md:text-xl md:leading-[1.7]`
- `<footer>`: `mt-8` → `mt-6`
- Avatar: `h-12 w-12` → `h-11 w-11` (opcional, suaviza el bloque autor)

### TestimonialRow (modificación — Variante B)
**Reemplazar el `<a>` y su contenido por:**
```
className="group block rounded-xl border border-white/5 bg-[#222222]
           p-6 transition-all duration-300
           hover:border-white/10
           focus-visible:outline-2 focus-visible:outline-[#FCA311]
           focus-visible:outline-offset-2 md:p-7"
```
Estructura interna (sin grid lateral):
- Icono comillas `h-5 w-5 text-[#FCA311]/40` arriba.
- `<blockquote>` ancho completo: `mt-3 text-base italic leading-relaxed text-gray-100`.
- `<footer>` alineado a la derecha en desktop, completo en móvil:
  - Desktop (`md:`): `mt-5 flex items-center justify-end gap-3`
  - Mobile: `mt-5 flex items-center gap-3 border-t border-white/5 pt-4 md:border-t-0 md:pt-0`
- Bloque autor: avatar `h-9 w-9` + `<div>` con `text-sm font-semibold` (autor con guion em `— {author}`) y `font-mono text-xs uppercase tracking-wider text-muted-foreground` (role · company).
- Eliminar `md:w-56 md:shrink-0 md:flex-col md:items-start md:border-l md:pl-6` completos.

**Notas interacción:**
- Hover: solo `border-white/10`. Quitar `hover:shadow-lg hover:shadow-[#FCA311]/10`.
- Focus: outline naranja (sin cambios).

## Accesibilidad
- [x] Contraste `text-gray-100` sobre `#222222` ≥ 7:1.
- [x] Focus visible outline `#FCA311` se conserva.
- [x] `aria-label` LinkedIn ya construido en parent.
- [x] `<blockquote>` + `<footer>` semánticos.

## Responsive
- **Mobile:** quote full width, autor abajo separado por `border-t` sutil.
- **Tablet/Desktop:** quote full width, autor abajo justificado a la derecha sin borde superior.

## i18n
Sin cambios — claves `testimonials.aboutTitle`, `aboutSubtitle`, `aboutLabel`, `viewLinkedinAriaLabel` ya cubren los textos.

## Trade-offs
- Variante B sacrifica el "skim" rápido por columna de autores, pero con 10 rows en una sola página esa rejilla ya estaba rota por longitudes de quote dispares. Lectura editorial gana.
- Bajar el pull-quote a `md:text-xl` lo acerca al row; la distinción ahora descansa en cursiva grande + comilla naranja sólida + ausencia de borde/fondo. Si en revisión visual no separa lo suficiente, alternativa: subir solo el ancla a `md:text-[1.375rem]` y mantener rows en `text-base`.

## Dependencias
Ninguna nueva. Solo cambios de clases Tailwind en `testimonial-pull-quote.tsx` y `testimonial-row.tsx`.
