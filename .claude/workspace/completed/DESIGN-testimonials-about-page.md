# Design: Testimonios completos en About — Exploración

## Objetivo

Decidir cómo mostrar los 11 testimonios en `/sobre-mi#testimonios` (destino del CTA de la home). En home se muestran 4 en masonry; About es el espacio para verlos todos y debe aportar valor diferencial, no repetir el grid.

## Contexto

- Hoy About usa el mismo `TestimonialsSection` que la home con `slice(0, 4)`. Esto se sustituye cuando el contexto es "ver todos".
- 11 testimonios, longitud variable (~3 a ~12 líneas), todos con LinkedIn URL, mayoría con avatar.
- Vecinos en About: header con bio, career timeline, approach 2×2, stack, Contact CTA.
- `TestimonialCard` se mantiene tal cual. Variamos solo el contenedor y la jerarquía.

---

## Opción A — Masonry 3 columnas + chips de empresas

Mismo patrón que home con `columns-1 md:columns-2 lg:columns-3`, precedido por una fila de chips estáticos con las empresas representadas (no filtran, solo dan contexto).

Tono: editorial, ordenado, denso pero respirable. Continuidad con home.

```
Desktop:
┌────────────────────────────────────────────────┐
│ LO QUE DICEN · 11                              │
│ [Lean Mind] [DECIDE] [Cabify] [Telefónica]...  │
│ ┌────────┐ ┌────────┐ ┌────────┐               │
│ │ quote  │ │ quote  │ │ short  │               │
│ │ largo  │ │ medio  │ │ Author │               │
│ │ Author │ │ Author │ └────────┘               │
│ └────────┘ │ ...    │ ┌────────┐               │
│ ┌────────┐ └────────┘ │ quote  │               │
│ │ short  │ ┌────────┐ │ Author │               │
│ │ Author │ │ medio  │ └────────┘               │
│ └────────┘ └────────┘ ...                      │
└────────────────────────────────────────────────┘

Mobile: 1 columna + chips scroll-x.
```

**Gana:** familiar, accesible, Server Component trivial. **Pierde:** poca personalidad, columnas finas a 3 cols hacen que los quotes largos se vean rotos. **Complejidad:** baja.

---

## Opción B — Pull-quote destacado + lista editorial

Un testimonio "ancla" abre la sección como pull-quote a sangre completa (comillas grandes naranjas, tipografía 1.5×, autor a la derecha). Debajo, los 10 restantes en **lista vertical de una columna a ancho completo**, quote normal y autor inline.

Tono: periodístico, pausado, "página de prensa". Se lee, no se escanea.

```
Desktop:
┌────────────────────────────────────────────────┐
│ LO QUE DICEN · 11                              │
│                                                │
│   ❝                                            │
│     Aitor combina rigor técnico con            │
│     una capacidad poco común para...           │
│                       — Author, Role · Company │
│ ────────────────────────────────────           │
│ ┌────────────────────────────────────────────┐ │
│ │ " quote completo a ancho total           " │ │
│ │   — Author · Role · Company       LinkedIn │ │
│ └────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────┐ │
│ │ " quote... — Author                        │ │
│ └────────────────────────────────────────────┘ │
│ ...                                            │
└────────────────────────────────────────────────┘

Mobile: pull-quote en bloque + lista 1 col (igual que desktop).
```

**Gana:** mucha personalidad, jerarquía clara, **se diferencia de la home**, los quotes largos respiran a ancho completo. **Pierde:** la página crece en alto. **Complejidad:** baja, Server Component, una variante de card.

---

## Opción C — Sub-secciones por contexto profesional

Agrupar los 11 en 2-3 bloques temáticos ("Compañeros y mentores", "Clientes y mentees", "Comunidad y charlas") con mini-heading y masonry 2 cols compacto por grupo.

Tono: profesional, casi "case study". Estructura el ruido y da contexto.

```
Desktop:
┌────────────────────────────────────────────────┐
│ LO QUE DICEN · 11                              │
│ ● COMPAÑEROS Y MENTORES                        │
│ ┌────────┐ ┌────────┐                          │
│ │ quote  │ │ quote  │                          │
│ └────────┘ └────────┘                          │
│ ┌────────┐ ┌────────┐                          │
│ └────────┘ └────────┘                          │
│ ● CLIENTES Y MENTEES                           │
│ ┌────────┐ ┌────────┐                          │
│ └────────┘ └────────┘                          │
│ ● COMUNIDAD Y CHARLAS                          │
│ ┌────────┐ ┌────────┐                          │
└────────────────────────────────────────────────┘

Mobile: 1 col, mismos mini-headings entre bloques.
```

**Gana:** narrativa, ideal para reclutadores que escanean. **Pierde:** requiere taxonomía nueva (`category` en frontmatter), y un grupo con 1 testimonio queda cojo. **Complejidad:** media.

---

## Opción D — Masonry + índice de personas sticky lateral

Masonry de A pero acompañada en desktop por una columna estrecha sticky con lista de autores (avatar + nombre); click hace scroll suave al testimonio. En móvil se omite la sidebar.

Tono: navegable, "directorio profesional".

```
Desktop:
┌────────────────────────────────────────────────┐
│ LO QUE DICEN · 11                              │
│ ┌──────────────────────────┐ ┌──────────────┐  │
│ │ ┌──────┐ ┌──────┐        │ │ ● Author 1   │  │
│ │ │quote │ │quote │        │ │ ● Author 2   │  │
│ │ └──────┘ └──────┘        │ │ ● Author 3   │  │
│ │ ┌──────┐ ┌──────┐        │ │ ... (sticky) │  │
│ │ └──────┘ └──────┘        │ └──────────────┘  │
│ └──────────────────────────┘                   │
└────────────────────────────────────────────────┘

Mobile: solo masonry, sin sidebar.
```

**Gana:** sensación de "muchas voces", utilidad navegacional, escala bien a 20+. **Pierde:** sidebar en página max-w-4xl compite con contenido; smooth scroll afinado. **Complejidad:** media, probablemente `"use client"` para scroll suave.

---

## Recomendación

**Opción B (Pull-quote + lista editorial).**

1. **Coherente con home sin repetirla:** home = masonry de 4 cards iguales (escaneo). About = uno destacado + lista a ancho completo (lectura). El usuario percibe que llegó a otro sitio.
2. **Tono editorial calmo:** una columna larga es la voz natural del portfolio, igual que un blog post. Encaja con bio, timeline y stack sin fricción.
3. **Lectura óptima:** a max-w-4xl los quotes de 8-12 líneas respiran. En 3 columnas (opción A) los mismos quotes se vuelven columnas finas e incómodas.
4. **Simplicidad:** Server Component puro, una variante extra de `TestimonialCard`, sin filtros ni taxonomía nueva.

Plan B si se quiere más estructura: **Opción C**, pero solo si se acepta añadir `category` al frontmatter.

## i18n

Reutilizar `testimonials.title`, `subtitle`, `label`, `viewLinkedinAriaLabel`. La opción B puede necesitar un `testimonials.aboutSubtitle` distinto del de home.

## Accesibilidad (común)

- `<section id="testimonios" aria-labelledby="...">` con `scroll-mt-24` para el ancla.
- Cards siguen siendo `<a>` a LinkedIn con `aria-label` ya existente.
- Contraste de cursivas `text-gray-100` sobre `#222222` ya validado.
