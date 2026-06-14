# Design: TestimonialsSection con 11 testimonios

## Resumen ejecutivo

**Problema:** La `TestimonialsSection` actual usa un grid 2 columnas. Con 2 testimonios placeholder funciona, pero con 11 testimonios reales (los del LinkedIn de Aitor) la sección crecería a ~6 filas en desktop y ~11 filas en mobile, dominando la home, rompiendo el ritmo del bento (que está pensado para escaneo rápido) y empujando los bloques inferiores fuera del primer fold.

**Objetivo:** Mostrar prueba social sin sacrificar el ritmo de la home, manteniendo:
- Mobile-first (375px)
- Accesibilidad WCAG 2.1 AA (teclado, `prefers-reduced-motion`, ARIA)
- Sin dependencias nuevas (HTML/CSS/React puro)
- Coherencia con el resto del bento (`HeroStats`, `FeaturedProjectBlock`, `RecentTalkBlock`)
- Reutilizable en `/sobre-mi` (donde el contexto es más amplio y se puede expandir más)

**Decisión de alto nivel:** En la home la **densidad debe ser baja** (es un bento, no una landing de testimonios). En `/sobre-mi` se puede permitir más densidad. Lo ideal es una sección que **muestre poco por defecto** y permita al usuario expandir si quiere más.

---

## Opción 1 — Slider manual con peek (1 card mobile, 2 cards desktop)

Card grande en el centro, flechas izq/der, indicador `3 / 11`, sin auto-rotación. En desktop muestra 2 cards a la vez (más eficiente que mostrar solo 1 con tanto ancho). En mobile, 1 card a pantalla completa con "peek" lateral (~12px del siguiente asomando) para indicar que hay más.

### Wireframe Mobile (<768px)

```
┌──────────────────────────────────────┐
│ TESTIMONIOS                          │
│ Lo que dicen de mí                   │
│ Recomendaciones de compañeros…       │
│                                      │
│  ┌────────────────────────────┐ ┌─   │
│  │ "                          │ │   │  ← peek 12px
│  │                            │ │   │
│  │ Quote text aquí, máximo    │ │   │
│  │ unas 4-5 líneas en mobile. │ │   │
│  │                            │ │   │
│  │                            │ │   │
│  │  ◉ Author Name             │ │   │
│  │    Role · Company          │ │   │
│  └────────────────────────────┘ └─   │
│                                      │
│   ←    ● ● ● ○ ○ ○ ○ ○ ○ ○ ○    →    │
│                3 / 11                │
└──────────────────────────────────────┘
```

### Wireframe Desktop (≥768px)

```
┌──────────────────────────────────────────────────────────────────┐
│ TESTIMONIOS                                          ← prev  → next│
│ Lo que dicen de mí                                                │
│ Recomendaciones de compañeros con los que he trabajado.           │
│                                                                   │
│  ┌─────────────────────────┐  ┌─────────────────────────┐         │
│  │ "                       │  │ "                       │         │
│  │ Quote text para el      │  │ Quote text para el      │         │
│  │ testimonio actual.      │  │ siguiente testimonio.   │         │
│  │ ~150-300 chars.         │  │                         │         │
│  │                         │  │                         │         │
│  │ ◉ Author Name           │  │ ◉ Author Name           │         │
│  │   Role · Company        │  │   Role · Company        │         │
│  └─────────────────────────┘  └─────────────────────────┘         │
│                                                                   │
│            ● ● ● ○ ○ ○ ○ ○ ○ ○ ○         3 / 11                  │
└──────────────────────────────────────────────────────────────────┘
```

### Clases Tailwind clave

**Wrapper sección (sin cambios respecto al actual):**
```
rounded-xl border border-white/5 bg-[#222222] p-6 md:p-8
transition-all duration-300 hover:border-white/10
```

**Track (viewport del slider):**
```
mt-6 overflow-hidden
```

**Inner flex track (el que se traslada):**
```
flex transition-transform duration-500 ease-out
motion-reduce:transition-none
gap-4
[transform:translateX(calc(-1*var(--slide-index)*(100%+1rem)))]
```
*(la traslación se calcula con CSS var actualizada en cliente con `useState`)*

**Cada slide:**
```
shrink-0 basis-[88%] md:basis-[calc(50%-0.5rem)]
```
*(88% en mobile deja el "peek" de ~12% del siguiente)*

**Botones prev/next:**
```
inline-flex h-10 w-10 items-center justify-center rounded-full
border border-white/5 bg-[#1a1a1a] text-muted-foreground
transition-colors duration-300
hover:border-[#FCA311]/30 hover:text-[#FCA311]
focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2
disabled:opacity-40 disabled:cursor-not-allowed
```

**Dots (paginación):**
```
h-1.5 w-1.5 rounded-full bg-white/20
data-[active=true]:bg-[#FCA311] data-[active=true]:w-4
transition-all duration-300
```

**Contador `3 / 11`:**
```
font-mono text-xs uppercase tracking-wider text-muted-foreground
```

### Pros

- **Ritmo del bento intacto:** la sección ocupa la altura de UNA tarjeta, igual que `HeroStats`. No empuja el resto de la página.
- **Control total del usuario:** sin auto-rotación → no interrumpe la lectura.
- **Densidad visual baja:** la atención se centra en una/dos opiniones a la vez (más persuasivo que un muro de quotes).
- **Reutilizable en `/sobre-mi`** con el mismo componente; ahí puede vivir igual o ampliarse.

### Contras

- **Necesita `"use client"`** (estado de índice, listeners de teclado, swipe táctil).
- **Complejidad de implementación media:** swipe táctil + teclado + `aria-live` para anunciar el cambio + foco controlado.
- **Riesgo SEO/accesibilidad:** el contenido de los slides ocultos no es leído inmediatamente por screen readers. Hay que renderizar TODOS los slides en el DOM (no virtualizar) y usar `aria-hidden` en los no visibles + `aria-roledescription="carousel"`.
- **Descubribilidad mobile:** sin el "peek" lateral, un usuario podría pensar que solo hay 1 testimonio. El peek + los dots resuelven esto.

### Justificación UX

Para un bento de portfolio (no una landing de SaaS), un slider manual mantiene la **promesa visual del bento**: cada celda es del tamaño de una celda. Es la única opción que mantiene la sección **a la altura de una tarjeta** sin esconder los testimonios detrás de un click.

---

## Opción 2 — Lista colapsable ("Ver los 11 testimonios")

Mostrar los 3 testimonios más fuertes (curados, no aleatorios) en el grid actual (2 cols en desktop, con la tercera ocupando una fila propia o quedando como "card destacada"). Bajo ellos, un botón "Ver los 11 testimonios" que expande in-place o lleva a `/sobre-mi#testimonios`.

### Wireframe Mobile (<768px)

```
┌──────────────────────────────────────┐
│ TESTIMONIOS                          │
│ Lo que dicen de mí                   │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ " Quote 1                      │  │
│  │   ◉ Author 1 · Role            │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ " Quote 2                      │  │
│  │   ◉ Author 2 · Role            │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ " Quote 3                      │  │
│  │   ◉ Author 3 · Role            │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  → Ver los 11 testimonios      │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Wireframe Desktop (≥768px)

```
┌────────────────────────────────────────────────────────────────┐
│ TESTIMONIOS                                                    │
│ Lo que dicen de mí                                             │
│                                                                │
│ ┌─────────────────────────┐ ┌─────────────────────────┐        │
│ │ " Quote 1               │ │ " Quote 2               │        │
│ │   ◉ Author 1            │ │   ◉ Author 2            │        │
│ └─────────────────────────┘ └─────────────────────────┘        │
│ ┌─────────────────────────────────────────────────────┐        │
│ │ " Quote 3 (full-width destacada)                    │        │
│ │   ◉ Author 3                                        │        │
│ └─────────────────────────────────────────────────────┘        │
│                                                                │
│       →  Ver los 11 testimonios en /sobre-mi                  │
└────────────────────────────────────────────────────────────────┘
```

### Clases Tailwind clave

**Grid de 3 (mobile 1 col, desktop 2 col + 1 full-width):**
```
mt-6 grid grid-cols-1 gap-4 md:grid-cols-2
```
**Tercera card destacada (desktop):**
```
md:col-span-2
```

**Link "Ver los 11":**
```
mt-6 inline-flex items-center gap-2
font-mono text-sm uppercase tracking-wider text-[#FCA311]
hover:underline focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-4
```

### Pros

- **0 JavaScript adicional:** Server Component puro, no necesita `"use client"`.
- **Implementación trivial:** filtro `.slice(0, 3)` + link.
- **SEO-friendly:** todos los testimonios siguen renderizándose si la "vista completa" está en `/sobre-mi` (ya renderizada por el server).
- **Accesibilidad gratis:** es un link estándar, no hay patrones complejos.
- **El curado importa:** muestra solo los 3 mejores → más persuasivo que mostrar los 11 a granel.

### Contras

- **Necesita criterio de curado:** ¿qué 3 testimonios? O bien Aitor decide manualmente (campo `featured: true` en el repo), o se ordenan por algún criterio. Esto añade trabajo de contenido, no de diseño.
- **Discoverability del resto:** el usuario debe hacer click para ver los 8 restantes → algunos no lo harán.
- **Doble fuente de verdad:** la "vista completa" debe vivir en algún sitio (`/sobre-mi#testimonios` o una página `/testimonios` propia).

### Justificación UX

La home **no es la página de testimonios**. Es una vista de aterrizaje. Mostrar 3 cuidadosamente curados + un link es el patrón que usan portfolios senior (Brad Frost, Josh Comeau): respeta la atención del usuario y traslada el "deep dive" a la página adecuada.

---

## Opción 3 — Marquee horizontal infinito con pausa

Los testimonios se desplazan lateralmente de forma continua y lenta (CSS animation `translateX` + duplicación del array para loop infinito). Al hacer hover o foco, la animación se pausa. Sin paginación explícita. Estética "wall of love" tipo Vercel/Resend.

### Wireframe Mobile (<768px)

```
┌──────────────────────────────────────┐
│ TESTIMONIOS                          │
│ Lo que dicen de mí                   │
│                                      │
│  ─→  ┌──────────┐ ┌──────────┐ ┌──── │
│      │ " Quote  │ │ " Quote  │ │ " Q │
│      │   Author │ │   Author │ │   A │
│      └──────────┘ └──────────┘ └──── │
│                                      │
│  (auto-scroll continuo lento ←→)     │
└──────────────────────────────────────┘
```

### Wireframe Desktop (≥768px)

```
┌────────────────────────────────────────────────────────────────────┐
│ TESTIMONIOS                                                        │
│ Lo que dicen de mí                                                 │
│                                                                    │
│ ─→ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────     │
│    │ " Quote  │ │ " Quote  │ │ " Quote  │ │ " Quote  │ │ " Q       │
│    │   Author │ │   Author │ │   Author │ │   Author │ │   A       │
│    └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────     │
│                                                                    │
│  (pausa con hover/focus, respeta prefers-reduced-motion)           │
└────────────────────────────────────────────────────────────────────┘
```

### Clases Tailwind clave

**Wrapper con máscara fade en bordes:**
```
mt-6 overflow-hidden
[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]
```

**Track con animación CSS infinita:**
```
flex w-max gap-4 animate-[marquee_50s_linear_infinite]
hover:[animation-play-state:paused]
focus-within:[animation-play-state:paused]
motion-reduce:animate-none
```
*(Definir `@keyframes marquee { to { transform: translateX(-50%) } }` en `app/globals.css`. Renderizar el array duplicado para conseguir el loop infinito.)*

**Card individual:**
```
w-[280px] md:w-[360px] shrink-0
```

### Pros

- **Estética muy lograda:** se siente vivo, moderno, "social proof" pasivo.
- **Sin paginación que mantener:** cero estado, cero `useState`.
- **Implementable casi 100% en CSS:** solo se necesita `"use client"` si se hace control manual de pausa con JS; con `:hover` + `focus-within` basta.
- **Coherente con un portfolio que se posiciona como "moderno":** Vercel, Linear, Resend usan este patrón.

### Contras

- **Anti-pattern de accesibilidad si no se maneja bien:** movimiento continuo es problemático para usuarios con ADHD, trastornos vestibulares, dislexia. **Requiere `motion-reduce:animate-none` obligatorio** y un control de pausa visible (no solo hover, que no existe en touch).
- **Lectura difícil mientras se mueve:** el usuario tiene que cazar el testimonio que le interesa → frustrante si no se puede pausar fácil en mobile (touch no tiene hover).
- **Performance:** se renderizan 22 cards (11 × 2 para el loop). No es dramático, pero más que las otras opciones.
- **El usuario no sabe cuántos hay:** sensación de "infinito" que algunos perciben como "abrumador".

### Justificación UX

Es la opción más "marketing" y la menos técnica. Encaja en sitios de SaaS pero **no en un portfolio personal** donde lo que se vende es criterio y rigor. Además, el peso de accesibilidad y la dificultad en touch lo penalizan.

---

## Opción 4 — Híbrido: 3 testimonios + slider expansible

Combina las opciones 1 y 2: por defecto se muestran **3 testimonios curados** (como en la opción 2), pero en lugar de enlazar a otra página, hay un botón `→ Ver los 11 testimonios` que **expande in-place** transformando la sección en el slider manual de la opción 1.

### Wireframe Mobile (estado inicial)

```
┌──────────────────────────────────────┐
│ TESTIMONIOS                          │
│ Lo que dicen de mí                   │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ " Quote 1                      │  │
│  │   ◉ Author 1                   │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ " Quote 2                      │  │
│  │   ◉ Author 2                   │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ " Quote 3                      │  │
│  │   ◉ Author 3                   │  │
│  └────────────────────────────────┘  │
│                                      │
│   → Ver los 11 testimonios           │
└──────────────────────────────────────┘
```

### Wireframe Mobile (estado expandido → slider)

Idéntico al wireframe de la Opción 1 (slider con peek + flechas + dots).

### Clases Tailwind clave

Mismas que Opción 1 + Opción 2. El componente sería `<TestimonialsSection>` que renderiza:
- Si `expanded === false` → grid de 3 + botón
- Si `expanded === true` → slider con 11

Estado:
```
"use client" // solo si se quiere expansión cliente
```
*(Alternativa server: el botón puede ser un `<Link>` con `?testimonials=all` que vuelve a renderizar la sección en modo slider. Más complejo pero sin JS.)*

### Pros

- **Lo mejor de ambos mundos:** la home mantiene la densidad baja por defecto, y el usuario interesado tiene acceso a todos sin salir de la página.
- **Progressive disclosure:** patrón UX clásico bien entendido por usuarios.
- **Aitor decide el "trailer":** los 3 testimonios curados son su mejor argumento, los 11 son la "prueba completa".

### Contras

- **Complejidad doble:** hay que implementar dos modos (grid + slider) y la transición entre ellos.
- **El layout shift al expandir puede ser brusco** si no se anima (y no usamos Framer Motion).
- **Sobrediseño:** ¿realmente vale 11 testimonios el coste de un modo expandible? Posiblemente no.

### Justificación UX

Excelente como concepto, pero **probablemente over-engineered** para el caso. Tiene sentido si en el futuro Aitor planea llegar a 30+ testimonios. Con 11, la opción 2 es más limpia.

---

## Recomendación: Opción 2 (Lista colapsable con 3 curados + link a /sobre-mi)

### Por qué esta y no las otras

**Frente a Opción 1 (slider):** El slider es elegante, pero introduce `"use client"`, swipe táctil, `aria-live`, gestión de foco, dots, contador y traducciones nuevas. **Mucho coste técnico para resolver un problema que se resuelve con `.slice(0, 3)`**. Además, los sliders en home son históricamente uno de los componentes con peor engagement: la mayoría de usuarios solo ven el primer slide.

**Frente a Opción 3 (marquee):** El movimiento continuo no encaja con el tono del portfolio (rigor, criterio, Software Crafter). Vercel/Linear lo usan porque venden velocidad y "vibe"; un portfolio técnico vende lo contrario: pausa para leer, valor del contenido.

**Frente a Opción 4 (híbrido):** Sobreingeniería para 11 testimonios. Si el número crece a 30+, esta sería la siguiente evolución natural.

### Detalles concretos de la recomendación

1. **3 testimonios curados** en la home, marcados con campo `featured: boolean` en el dominio del testimonio (consistente con el patrón ya existente en `GetFeaturedX` use cases). Aitor controla cuáles destacar editando MDX/Notion.

2. **Layout:** en desktop, 2 cards en la primera fila + 1 card full-width en la segunda (col-span-2). Esto rompe la simetría rígida del grid y enfatiza visualmente el tercer testimonio. En mobile, 3 cards apiladas.

3. **Link al final:** `→ Ver los 11 testimonios en /sobre-mi` (o `/testimonios` si se decide página propia). Texto i18n.

4. **En `/sobre-mi`:** la misma sección **con la prop `showAll`** muestra los 11 en el grid 2 cols original. Ahí la densidad ya no es problema porque es una página de profundidad. No necesita slider. Reutilizamos `TestimonialsSectionContent` cambiando solo el array de entrada y omitiendo el link "Ver los 11".

5. **Anchor link:** `/sobre-mi#testimonios` con `id="testimonios-title"` en el `<h2>` para que el link de la home haga deep-link al bloque correcto.

### Coherencia con el sistema

- **Mismo patrón que `FeaturedPostsBlock`:** "→ Ver todos los artículos" ya existe en la home. Reutilizamos el patrón visual y verbal.
- **Mismo patrón que el use case `GetFeaturedX`:** ya hay precedente arquitectónico (`featured: true` en el dominio). Cero fricción conceptual.
- **Zero `"use client"` adicional:** la sección sigue siendo un Server Component como ahora.

### Especificación resumida del cambio

**TestimonialsSection (modificado):**
- Nueva prop `viewAllHref?: string` (cuando se pasa, renderiza el link al final).
- Nueva prop `viewAllLabel?: string` (texto del link).
- Se mantiene la prop `testimonials` (ya recibida desde la página, que decide cuántos pasar).
- La home pasa `featuredTestimonials` (3) + `viewAllHref="/sobre-mi#testimonios"`.
- `/sobre-mi` pasa `allTestimonials` (11) sin `viewAllHref` (la sección se autocontiene).

**Use case nuevo:** `GetFeaturedTestimonials.execute(locale, limit)` siguiendo el patrón de `GetFeaturedPostsList`.

**Campo nuevo en dominio:** `Testimonial.featured: boolean` (default `false`).

**i18n nuevo (`messages/{es,en}.json` bajo `testimonials`):**
```json
{
  "viewAll": "→ Ver los 11 testimonios",
  "viewAllAriaLabel": "Ver los 11 testimonios en la página Sobre mí"
}
```
*(El número "11" debería ser dinámico: `viewAll: "→ Ver los {count} testimonios"` con interpolación de next-intl.)*

### Accesibilidad de la recomendación

- [x] Cada card es un link nativo con `aria-label` ya existente → tab navigation funcional.
- [x] Contraste `text-gray-100` sobre `#222222` y `text-[#FCA311]` sobre `#222222` cumplen WCAG AA.
- [x] El link "Ver los 11" tiene `focus-visible` outline en el color de acento.
- [x] Sin movimiento → `prefers-reduced-motion` no aplica.
- [x] El landmark `<section aria-labelledby="testimonials-title">` ya existe.
- [x] `<h2 id="testimonios-title">` permite deep-link desde la home a `/sobre-mi#testimonios`.

### Responsive

- **Mobile (<768px):** 3 cards apiladas + link debajo.
- **Tablet/Desktop (≥768px):** 2 cards en fila superior + 1 card full-width destacada + link a la derecha o centrada debajo.
- **`/sobre-mi`:** grid 2 cols con 11 cards (5 filas + 1 huérfana, asumible en una página de profundidad).

### Riesgo y mitigación

**Riesgo:** Aitor no quiere "ocultar" testimonios; los 11 son su prueba social.
**Mitigación:** los 11 siguen siendo accesibles a un click. El link es explícito (`Ver los 11`) → no se "esconden", se contextualizan. La página `/sobre-mi` es además el contexto natural para profundizar.

**Riesgo:** SEO — el contenido textual de los 8 ocultos no estaría en la home.
**Mitigación:** los 11 están renderizados en `/sobre-mi`. Google los indexa allí. La home no necesita ser exhaustiva.

---

## Dependencias

- **Ninguna nueva.** Todo el patrón usa el sistema de diseño existente.
- **Iconos:** flecha `→` con carácter Unicode (como ya se usa en `featuredPosts.viewAll`).
