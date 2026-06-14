# Design: Home — ProfileBlock y FeaturedPostsBlock (rediseño de la fila superior)

## Resumen ejecutivo

La fila superior de la home (ProfileBlock + FeaturedPostsBlock, `md:col-span-6` cada una) presenta dos problemas detectados por el usuario tras el commit 4:

1. **ProfileBlock con huecos**: la composición vertical (foto+nombre → subtítulo → 3 párrafos de bio → CTA → indicador "HOME") genera espacios visuales muertos. El `min-h-[280px]` con `flex-col` y `mt-6` entre bloques crea ríos verticales. Además el flanco derecho de la foto queda vacío en desktop porque la columna de texto crece menos en alto que la propia foto.
2. **FeaturedPostsBlock demasiado cargante**: 4 cards con título grande + excerpt de 2 líneas + chip de tag naranja + reading time con icono Clock = 4 elementos por item × 4 items = 16 nodos visuales que compiten entre sí. Los chips naranja saturados saturan la jerarquía cromática de la card.

Este documento propone:
- **3 opciones para ProfileBlock** (A1 condensación, A2 saludo-hero, A3 split con stack rail)
- **3 opciones para FeaturedPostsBlock** (B1 hero + 3 compactos, B2 lista pura, B3 índice mono)
- Una **recomendación de combinación** (A2 + B1) con justificación.

Restricciones respetadas: paleta del design system, slot `md:col-span-6`, sin librerías nuevas, Server Components por defecto, i18n vía props.

---

## Diagnóstico previo (lo que falla hoy)

### ProfileBlock actual
```
┌──────────────────────────────────────────────┐
│ [foto 96px]   Aitor Santana                  │ ← header row OK
│               Software Crafter                │
│               (subtítulo de impacto)          │
│               [ES | EN]                       │
│                                                │ ← mt-6 = hueco
│ Bio párrafo 1...                              │
│ Bio párrafo 2...                              │ ← 3 párrafos
│ Bio párrafo 3...                              │
│                                                │ ← mt-6 = hueco
│ [ Hablemos → ]                                │
│                                                │ ← mt-4 = hueco
│ • HOME                                        │
└──────────────────────────────────────────────┘
```
Causas raíz:
- `mt-6` × 2 + `mt-4` = 64 px de margen vertical hard-coded.
- Repetición de 3 párrafos en `text-base leading-relaxed text-muted-foreground` crea bloque homogéneo plano sin jerarquía.
- Indicador `• HOME` al final compite con CTA por relevancia. En el bento del home el label "HOME" ya no aporta (estamos en home).
- Foto `h-24 w-24` (96 px) es muy pequeña respecto a la card de ~520-580 px de alto.

### FeaturedPostsBlock actual
```
┌──────────────────────────────────────────────┐
│ ARTÍCULOS DESTACADOS                          │
│                                                │
│ Título del post 1                       ↗     │
│ Excerpt línea 1                                │
│ Excerpt línea 2                                │
│ [#TAG]  🕐 8 MIN                              │
│ ──────────────────────────────────────────────│
│ Título del post 2                       ↗     │
│ Excerpt línea 1                                │
│ Excerpt línea 2                                │
│ [#TAG]  🕐 12 MIN                             │
│ ──────────────────────────────────────────────│
│ ... (×4)                                      │
└──────────────────────────────────────────────┘
```
Causas raíz:
- 4 títulos del mismo tamaño = sin jerarquía → el ojo no sabe dónde aterrizar.
- 4 chips naranja `bg-[#FCA311]/10 text-[#FCA311]` × 4 = 4 puntos calientes; saturan el acento.
- 4 iconos Clock + texto repetido `text-[11px] uppercase` = ruido tipográfico.
- Densidad de excerpt (2 líneas × 4 = 8 líneas) compite con el ProfileBlock contiguo, que ya tiene 3 párrafos de bio.

---

## Sección A: Opciones para ProfileBlock

### Opción A1 — Bio condensada en 1 párrafo + skill rail

**Concepto:** Reducir las 3 bios a 1 párrafo de presentación y rellenar el espacio liberado con un rail horizontal de "skills/contextos" en `font-mono` (tag-cloud minimalista). Mantiene la información clave pero corta la repetición de párrafos.

#### Wireframe Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ ┌─────┐                              │
│ │foto │ Aitor Santana                │
│ │ 80  │ Software Crafter             │
│ └─────┘ [ES | EN]                    │
│                                       │
│ Especializado en arquitecturas       │
│ limpias y TDD. Entregando producto   │
│ en Fintech, Streaming y EdTech.      │
│                                       │
│ Hola, soy Aitor. Ayudo a equipos a   │
│ construir código sostenible desde    │
│ Canarias para el mundo.              │
│                                       │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐                  │
│ │TS│ │Hex│ │TDD│ │AI│                │
│ └──┘ └──┘ └──┘ └──┘                  │
│                                       │
│ [ ✉ Hablemos ↗ ]                     │
└─────────────────────────────────────┘
```

#### Wireframe Desktop (≥ 768px)
```
┌──────────────────────────────────────────────┐
│ ┌──────┐  Aitor Santana                       │
│ │ foto │  Software Crafter                    │
│ │ 96px │  Especializado en arquitecturas...   │
│ └──────┘  [ES | EN]                           │
│                                                 │
│ Hola, soy Aitor. Como Software Crafter ayudo  │
│ a equipos a construir código sostenible       │
│ desde Canarias para el mundo.                 │
│                                                 │
│ ┌────┐ ┌──────┐ ┌─────┐ ┌────────────┐         │
│ │ TS │ │ Hex  │ │ TDD │ │ GenAI      │         │
│ └────┘ └──────┘ └─────┘ └────────────┘         │
│ ┌────────┐ ┌──────────┐                        │
│ │ Fintech│ │ EdTech   │                        │
│ └────────┘ └──────────┘                        │
│                                                 │
│ [ ✉ Hablemos ↗ ]                              │
└──────────────────────────────────────────────┘
```

#### Clases Tailwind clave
- Contenedor exterior: `group flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10` (se elimina `min-h-[280px]`).
- Header row: `flex flex-col gap-4 sm:flex-row sm:items-center` (cambia `sm:items-start` → `sm:items-center` para alinear foto con bloque de texto sin huecos).
- Foto: `relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl`.
- Bio única: `mt-5 text-[15px] leading-relaxed text-muted-foreground` (un solo párrafo, sin `space-y-3`).
- Skill rail: `mt-5 flex flex-wrap gap-2`.
- Pill skill: `rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground`.
- CTA wrapper: `mt-auto pt-6` (empuja CTA al fondo eliminando el hueco hardcoded).
- Se elimina el dot "• HOME" final (redundante).

#### Pros
- Resuelve los huecos sustituyendo márgenes muertos por contenido relevante (skills).
- Mantiene la información clave (rol, impacto, valor, CTA).
- Skill rail añade densidad informativa sin saturar (font-mono apagado, no naranja).
- `mt-auto` en CTA elimina por completo huecos hard-coded.

#### Contras
- Pierde matices de las 3 bios (highlight de "IA Generativa" en naranja desaparece).
- Requiere coordinar con marketing/copy para decidir qué skills mostrar y traducirlas.
- Suma una nueva pieza visual (pills) que hay que mantener coherente con tags del blog.

#### Justificación UX
Resuelve directamente el problema 1 (huecos): elimina dos `mt-6` y un `mt-4` consecutivos. Sustituye una "pared de párrafos" por una estructura jerárquica clara (header → claim → bio corta → skills → CTA). El skill rail aporta valor inmediato al visitante (sabe en 2 segundos qué hace Aitor).

---

### Opción A2 — Header saludo + claim destacado (recomendada)

**Concepto:** Convertir el header en un saludo hero "Hola, soy Aitor" tipo landing. Elevar el `impactSubtitle` a claim principal (tipografía mayor). Reducir bio a 2 líneas máximo. CTA pegado al fondo via `mt-auto`. Eliminar el indicador `• HOME`.

#### Wireframe Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ ┌─────┐                              │
│ │foto │ Hola, soy                   │
│ │ 80  │ Aitor Santana                │
│ └─────┘ Software Crafter             │
│         [ES | EN]                    │
│                                       │
│ Especializado en arquitecturas       │
│ limpias y TDD. Entregando producto   │
│ en Fintech, Streaming y EdTech.      │
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ (acento)      │
│                                       │
│ Escribo, doy charlas y desarrollo    │
│ software de calidad desde Canarias.  │
│                                       │
│ [ ✉ Hablemos ↗ ]                     │
└─────────────────────────────────────┘
```

#### Wireframe Desktop (≥ 768px)
```
┌──────────────────────────────────────────────┐
│ ┌────────┐   Hola, soy                        │
│ │        │   Aitor Santana                    │
│ │ foto   │   ─────────────                    │
│ │ 112px  │   Software Crafter  [ES | EN]      │
│ └────────┘                                     │
│                                                 │
│   Especializado en arquitecturas limpias y   │
│   TDD. Entregando producto en Fintech,        │
│   Streaming y EdTech.                          │
│                                                 │
│   Escribo, doy charlas y desarrollo software  │
│   de calidad desde Canarias para el mundo.    │
│                                                 │
│                                                 │
│   [ ✉ Hablemos ↗ ]                            │
└──────────────────────────────────────────────┘
```

#### Clases Tailwind clave
- Contenedor: `group flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 md:p-8 transition-all duration-300 hover:border-white/10` (sin `min-h-[280px]`).
- Header row: `flex flex-col gap-5 sm:flex-row sm:items-center`.
- Foto: `relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl` (se sube a 112 px en desktop; el wrapper ya es `rounded-2xl` para mayor presencia).
- Saludo: `font-mono text-xs uppercase tracking-wider text-muted-foreground` con el texto "Hola, soy" (clave nueva i18n `profile.greeting`).
- Nombre: `mt-1 text-3xl md:text-4xl font-bold tracking-tight text-foreground`.
- Línea acento debajo del nombre: `mt-2 h-0.5 w-12 bg-[#FCA311] rounded-full` (sustituye el dot "• HOME" del final → indicador de identidad arriba).
- Subrol y switcher en misma fila: `mt-2 flex items-center gap-3 flex-wrap` con `<p font-mono text-sm text-[#FCA311]>Software Crafter</p>` + `<LanguageSwitcher />`.
- Claim impacto: `mt-6 text-lg leading-snug text-gray-100` (más grande que el cuerpo, color casi blanco para destacar; toma el rol del antiguo "subtítulo" pero como pieza principal).
- Bio corta: `mt-3 text-base leading-relaxed text-muted-foreground` (un solo párrafo combinando bio1+bio3, sin bio2 técnico).
- CTA wrapper: `mt-auto pt-6` (empuja CTA al fondo, elimina huecos automáticamente sin importar el alto total).

#### Pros
- Carga emocional (saludo "Hola, soy") típica de portfolios de impacto.
- Foto más grande (112 px) ocupa el flanco izquierdo y elimina la sensación de "foto pegada al borde con vacío al lado".
- `mt-auto` en CTA elimina huecos hard-coded sea cual sea el alto que imponga el bento.
- Línea acento de 48 px sustituye el dot "• HOME" final → identidad visual al inicio, no al final.
- Claim destacado en `text-lg` y color `text-gray-100` jerarquiza: el visitante lee primero la propuesta de valor.

#### Contras
- Pierde un párrafo de bio (bio2 sobre Clean Code/Hex/GenAI técnica) — hay que decidir si esa info se mueve al CV o al "Sobre mí".
- Requiere nueva clave i18n `profile.greeting`.
- El `LanguageSwitcher` en la misma fila que el rol obliga a verificar que no rompa en `sm:` (probar en 640-720 px).

#### Justificación UX
Resuelve el problema 1 atacando las dos causas raíz: (a) `mt-auto` mata los huecos, (b) la foto más grande + saludo hero llena el flanco derecho y crea un header denso pero ordenado. Además mejora el "above the fold": el visitante recibe en 1 sola pantalla "quién + qué hace + claim + CTA" sin scroll.

---

### Opción A3 — Split en dos columnas (foto+identidad / bio+CTA)

**Concepto:** En desktop, dividir la card en 2 columnas internas (foto+nombre+claim a la izquierda, bio+CTA a la derecha). En mobile vuelve a stack. Aprovecha el espacio horizontal del `md:col-span-6`.

#### Wireframe Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ ┌─────┐                              │
│ │foto │ Aitor Santana                │
│ │ 80  │ Software Crafter             │
│ └─────┘ [ES | EN]                    │
│                                       │
│ Especializado en arquitecturas       │
│ limpias y TDD...                     │
│                                       │
│ Bio condensada en 2 líneas.          │
│                                       │
│ [ ✉ Hablemos ↗ ]                     │
└─────────────────────────────────────┘
```
(idéntico al stack vertical de A2 — en mobile la división de columnas no aplica)

#### Wireframe Desktop (≥ 768px)
```
┌──────────────────────────────────────────────┐
│ ┌────────────┐  │  Hola, soy Aitor            │
│ │            │  │  Software Crafter           │
│ │   foto     │  │                              │
│ │  160×160   │  │  Bio condensada en          │
│ │            │  │  uno-dos párrafos cortos    │
│ └────────────┘  │  con highlight naranja.     │
│                  │                              │
│ [ES | EN]        │  [ ✉ Hablemos ↗ ]           │
│                  │                              │
│ • Canarias 🇪🇸  │                              │
└──────────────────────────────────────────────┘
```

#### Clases Tailwind clave
- Contenedor: `group flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10`.
- Split: `flex flex-col gap-6 md:grid md:grid-cols-[160px_1fr] md:gap-8 h-full`.
- Columna izq: `flex flex-col items-start gap-4`.
- Foto: `relative h-28 w-28 md:h-40 md:w-40 overflow-hidden rounded-2xl`.
- Columna der: `flex flex-col` con `mt-auto` en CTA.

#### Pros
- Aprovecha al máximo el ancho del `md:col-span-6`.
- Foto grande (160 px) es el "ancla visual" inmediata.
- Bio queda en columna estrecha (mejor lectura, no más de 50-60 caracteres por línea).

#### Contras
- Rompe el patrón de stack vertical que usan las otras cards del bento → menos coherencia interna.
- Más complejo de mantener responsive (3 breakpoints).
- El bloque "Canarias 🇪🇸" o cualquier metadato adicional puede sentirse forzado para rellenar columna izq.

#### Justificación UX
Resuelve los huecos forzando que ambas columnas tengan altura igual (`h-full` + `flex-col`). Pero introduce complejidad de layout que las otras cards del bento no tienen.

---

## Sección B: Opciones para FeaturedPostsBlock

### Opción B1 — 1 hero + 3 compactos (recomendada)

**Concepto:** Aplicar el patrón ya validado en `LatestArticleBlock` (que renderiza 1 destacado + lista de "anteriores"). El primer post es el HERO con título grande + excerpt + 1 tag. Los siguientes 3 son items compactos: solo título + reading time, sin excerpt ni chip de tag. Jerarquía visual clara.

#### Wireframe Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ ARTÍCULOS DESTACADOS                 │
│                                       │
│ ─────                                │
│                                       │
│ Título del post destacado    ↗       │
│ (text-xl, font-semibold)             │
│                                       │
│ Excerpt corto en 2 líneas máximo     │
│ para enganchar al lector.            │
│                                       │
│ [#TypeScript]    🕐 8 MIN            │
│ ────────────────────────────────── │
│ RECIENTES                            │
│                                       │
│ › Segundo post                  6 MIN│
│ › Tercer post                   4 MIN│
│ › Cuarto post                  11 MIN│
└─────────────────────────────────────┘
```

#### Wireframe Desktop (≥ 768px)
```
┌──────────────────────────────────────────────┐
│ ARTÍCULOS DESTACADOS                          │
│                                                 │
│ Título del post destacado                  ↗ │
│ (text-2xl, font-semibold)                     │
│                                                 │
│ Excerpt de 2 líneas que engancha al lector.   │
│                                                 │
│ [#TypeScript]              🕐 8 MIN           │
│ ──────────────────────────────────────────── │
│ RECIENTES                                     │
│                                                 │
│ › Segundo post                          6 MIN│
│ › Tercer post                           4 MIN│
│ › Cuarto post                          11 MIN│
└──────────────────────────────────────────────┘
```

#### Clases Tailwind clave
- Contenedor: `flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] transition-all duration-300 hover:border-white/10` (sin `p-6` exterior; padding se aplica por sección como en LatestArticleBlock).
- Hero (primer post) wrapper Link: `group block p-6 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 focus-visible:rounded-t-xl`.
- Header del hero: `flex items-start justify-between` con `<span font-mono text-xs uppercase tracking-wider text-muted-foreground>` + `<ArrowUpRight h-5 w-5 text-muted-foreground/40 group-hover:text-[#FCA311] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300>`.
- Título hero: `mt-4 text-xl md:text-2xl font-semibold leading-tight text-foreground transition-colors group-hover:text-[#FCA311]`.
- Excerpt hero: `mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground`.
- Metadata row hero: `mt-4 flex items-center justify-between gap-3`.
- Tag hero: `inline-block rounded-full bg-[#FCA311]/10 px-2.5 py-1 font-mono text-xs font-medium text-[#FCA311] transition-colors group-hover:bg-[#FCA311]/20`.
- Reading time hero: `flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-muted-foreground` con icono `Clock h-3 w-3`.
- Separador: `border-t border-white/5`.
- Sección "recientes": `p-6 pt-4` con label `font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3`.
- Item compacto Link: `group/link flex items-center justify-between gap-3 py-2 rounded transition-colors hover:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2`.
- Item lado izq: `<ChevronRight aria-hidden="true" h-4 w-4 text-muted-foreground/60 group-hover/link:text-[#FCA311] group-hover/link:translate-x-0.5 transition-all duration-200>` + `<span text-sm leading-snug text-muted-foreground line-clamp-1 group-hover/link:text-[#FCA311] transition-colors>{title}</span>`.
- Item lado der (reading time): `font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80 shrink-0` (sin icono, solo "6 MIN").

#### Pros
- Jerarquía visual clara: 1 elemento principal + 3 secundarios → el ojo sabe dónde aterrizar.
- Reduce drásticamente la carga: 1 excerpt (no 4), 1 tag naranja (no 4), 1 icono Clock destacado (resto solo texto).
- Coherente con `LatestArticleBlock` existente (que es exactamente este patrón) → reutiliza diseño ya probado y testeado.
- Aprovecha que `featured: true` ya implica jerarquía editorial; el primero suele ser el más relevante.

#### Contras
- "Aplana" la importancia visual de los posts 2-4 (pueden parecer menos relevantes pese a estar todos `featured`).
- Requiere ordenar los posts por relevancia (date desc o orden editorial).
- Si solo hay 1-2 posts featured, la sección "recientes" queda corta o desaparece.

#### Justificación UX
Resuelve directamente el problema 2 (carga). Reduce de 16 nodos visuales (4×4) a 4+9 = 13 pero con jerarquía clara: el ojo procesa primero el hero (atención focalizada) y después escanea la lista compacta (lectura periférica). Patrón ya validado en `LatestArticleBlock` → consistencia interna del bento.

---

### Opción B2 — Lista pura (solo títulos + reading time)

**Concepto:** Eliminar excerpts y chips de tag. Card como índice tipográfico puro: cada post es título + reading time + número de orden mono. Inspiración: índice de revista o sumario editorial.

#### Wireframe Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ ARTÍCULOS DESTACADOS         (04)   │
│                                       │
│ 01  Título del primer post           │
│     ─────────────────────  8 MIN ↗   │
│                                       │
│ 02  Título del segundo post          │
│     ─────────────────────  6 MIN ↗   │
│                                       │
│ 03  Título del tercer post           │
│     ─────────────────────  4 MIN ↗   │
│                                       │
│ 04  Título del cuarto post           │
│     ─────────────────────  11 MIN ↗  │
│                                       │
│ ────────────────                    │
│ → Ver todos los artículos            │
└─────────────────────────────────────┘
```

#### Wireframe Desktop (≥ 768px)
```
┌──────────────────────────────────────────────┐
│ ARTÍCULOS DESTACADOS                    (04) │
│                                                 │
│ 01  Título del primer artículo destacado  8 MIN│
│ ────────────────────────────────────────────  │
│ 02  Título del segundo artículo           6 MIN│
│ ────────────────────────────────────────────  │
│ 03  Título del tercer artículo            4 MIN│
│ ────────────────────────────────────────────  │
│ 04  Título del cuarto artículo           11 MIN│
│                                                 │
│ → Ver todos los artículos                      │
└──────────────────────────────────────────────┘
```

#### Clases Tailwind clave
- Contenedor: `flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10`.
- Header: `flex items-center justify-between` con label + contador `(04)` en `font-mono text-xs text-muted-foreground/60`.
- Lista: `mt-6 flex flex-1 flex-col divide-y divide-white/5`.
- Item Link: `group flex items-center gap-4 py-4 first:pt-0 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 rounded`.
- Número: `font-mono text-xs text-muted-foreground/60 group-hover:text-[#FCA311] transition-colors shrink-0 w-6` (alineación tabular).
- Título: `flex-1 text-base font-medium leading-snug text-foreground transition-colors group-hover:text-[#FCA311] line-clamp-1`.
- Reading time: `font-mono text-[11px] uppercase tracking-wider text-muted-foreground shrink-0`.
- Flecha: `h-4 w-4 text-muted-foreground/40 group-hover:text-[#FCA311] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0`.
- Footer link: `mt-auto pt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-[#FCA311] transition-colors`.

#### Pros
- Mínima carga visual: 0 excerpts, 0 tags coloridos, 0 iconos Clock duplicados.
- Estética editorial tipo "tabla de contenidos" — muy elegante para portfolio técnico.
- Permite mostrar 4 posts sin saturación.
- Footer "Ver todos" da continuidad al flujo.

#### Contras
- Pierde **mucho contexto**: sin excerpt ni tag, el lector decide solo por el título. Posts con títulos crípticos pierden CTR.
- "Demasiado minimalista" puede sentirse vacío al lado de un ProfileBlock denso.
- La numeración `01-04` es decorativa, no aporta info real.

#### Justificación UX
Es la opción más drástica para resolver "demasiado cargante". Funciona muy bien si los títulos son auto-explicativos. Riesgo: si los títulos no son auto-explicativos, el visitante no hace clic en ninguno.

---

### Opción B3 — Híbrido mono: título + tag inline + reading time (sin excerpt)

**Concepto:** Mantener 4 items iguales (sin jerarquía) pero **eliminar el excerpt** y simplificar los chips. Cada item: título + tag inline (sin pill, solo texto en `font-mono text-[#FCA311]`) + reading time. Estructura limpia tipo "feed" pero sin la pesadez actual.

#### Wireframe Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ ARTÍCULOS DESTACADOS                 │
│                                       │
│ Título del post 1               ↗    │
│ #TYPESCRIPT · 8 MIN                  │
│ ──────────────────────────────────  │
│ Título del post 2               ↗    │
│ #ARQUITECTURA · 12 MIN               │
│ ──────────────────────────────────  │
│ Título del post 3               ↗    │
│ #TESTING · 4 MIN                     │
│ ──────────────────────────────────  │
│ Título del post 4               ↗    │
│ #IA · 11 MIN                         │
└─────────────────────────────────────┘
```

#### Wireframe Desktop (≥ 768px)
```
┌──────────────────────────────────────────────┐
│ ARTÍCULOS DESTACADOS                          │
│                                                 │
│ Título del primer post destacado          ↗  │
│ #TYPESCRIPT · 8 MIN                            │
│ ────────────────────────────────────────────  │
│ Título del segundo post destacado         ↗  │
│ #ARQUITECTURA · 12 MIN                         │
│ ────────────────────────────────────────────  │
│ Título del tercer post                    ↗  │
│ #TESTING · 4 MIN                               │
│ ────────────────────────────────────────────  │
│ Título del cuarto post                    ↗  │
│ #IA · 11 MIN                                   │
└──────────────────────────────────────────────┘
```

#### Clases Tailwind clave
- Contenedor: `flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10`.
- Header: igual que actual.
- Lista: `mt-4 flex flex-1 flex-col divide-y divide-white/5`.
- Item: `py-4 first:pt-0 last:pb-0`.
- Link: `group block focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 rounded`.
- Fila superior título+flecha: `flex items-start justify-between gap-3`.
- Título: `text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-[#FCA311]`.
- Fila inferior metadata: `mt-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground`.
- Tag inline (sin pill): `text-[#FCA311] before:content-['#']`.
- Separador metadata: `text-muted-foreground/40` con punto `·` literal.
- Reading time: `text-muted-foreground`.

#### Pros
- Reduce carga textual (sin excerpt) sin perder jerarquía (4 posts iguales).
- Tag inline `#TYPESCRIPT` en `font-mono` se siente más editorial y menos "chip de e-commerce".
- Mantiene paridad: 4 posts visibles → si todos son featured, todos se ven.
- Cambio menor desde el estado actual → migración rápida.

#### Contras
- Sin jerarquía visual → el ojo no sabe dónde aterrizar (no resuelve el problema de "4 títulos iguales").
- 4 ocurrencias de `#TAG` en naranja siguen sumando 4 puntos calientes (aunque más sutiles que los chips actuales).
- Pierde excerpt → menos contexto, similar tradeoff que B2.

#### Justificación UX
Cambio quirúrgico mínimo: elimina los dos elementos que más cargan (excerpts y chips pill) pero mantiene el resto. Bajo riesgo de implementación, beneficio medio. Es la opción "conservadora".

---

## Recomendación de combinación: A2 + B1

### Combinación recomendada
- **ProfileBlock → Opción A2** (Header saludo + claim destacado)
- **FeaturedPostsBlock → Opción B1** (1 hero + 3 compactos)

### Razonamiento

1. **Equilibrio visual en la fila superior.** A2 produce una card con **header denso (foto 112 px + saludo + nombre + claim) y cuerpo ligero (bio corta + CTA empujado al fondo)**. B1 produce una card con **header ligero (label) + hero denso (título grande + excerpt + tag) + lista ligera (3 items compactos)**. Visualmente son simétricas: ambas tienen un "punto caliente" (foto + nombre en A2 / hero post en B1) y zonas de respiro (CTA al fondo / lista compacta).

2. **Coherencia con el resto del bento.** B1 replica el patrón exacto de `LatestArticleBlock` (que ya está implementado y funciona). Reutilizar este patrón da consistencia interna al bento sin introducir un nuevo lenguaje visual. De hecho, si tras analizarlo se ve que `LatestArticleBlock` ya cubre la necesidad, podría **plantearse fusionar ambos componentes** (FeaturedPostsBlock → renombrar `LatestArticleBlock` a un componente único parametrizable).

3. **Resolución directa de los dos problemas.**
   - Problema 1 (huecos): A2 usa `mt-auto pt-6` en el CTA, lo que elimina huecos hard-coded sea cual sea la altura impuesta por el bento. Además la foto más grande (112 px) ocupa el flanco que antes quedaba vacío.
   - Problema 2 (carga): B1 reduce de 16 nodos visuales (4 × 4 elementos) a 4+9 = 13 con jerarquía clara.

4. **Coste de implementación bajo.** A2 requiere solo (i) cambiar el header, (ii) condensar 3 bios a 1 párrafo, (iii) añadir clave i18n `profile.greeting`, (iv) eliminar el dot "• HOME", (v) `mt-auto` en CTA. B1 reutiliza la estructura ya existente de `LatestArticleBlock` — el diff principal es renderizar 1 hero + N items en lugar de N cards iguales.

5. **Mejora medible.** Carga textual estimada (palabras visibles en above-the-fold):
   - Estado actual: ProfileBlock ~95 palabras + FeaturedPostsBlock ~120 palabras (4 títulos + 4 excerpts) ≈ **215 palabras**.
   - A2 + B1: ProfileBlock ~55 palabras (claim + bio corta) + FeaturedPostsBlock ~60 palabras (1 hero + 3 títulos) ≈ **115 palabras** (-46%).

### Alternativa secundaria
Si el usuario quiere mantener las **3 bios** (decisión editorial), combinar **A1 + B1**:
- A1 mantiene más densidad informativa (bio corta + skill rail) sin huecos.
- B1 sigue siendo la mejor opción para FeaturedPosts independientemente del Profile elegido.

### Combinación a evitar
- **A3 + B2**: ambas son "minimalistas radicales". Juntas dan sensación de portfolio vacío. Demasiada blanca/negativa en una sola fila.

---

## Especificación de componentes (resumen para handoff a fullstack-developer)

### ProfileBlockContent (Opción A2)
**Tipo:** Modificación de existente.
**Archivo:** `components/bento/profile-block.tsx`.

**Props (sin cambios mayores, dos nuevas claves i18n consumidas):**
```typescript
type ProfileBlockContentProps = {
  greeting: string             // NUEVO — "Hola, soy" / "Hi, I'm"
  name: string                 // NUEVO — "Aitor Santana" (puede quedarse hardcoded)
  role: string                 // existente conceptualmente — "Software Crafter"
  impactClaim: string          // renombrado desde impactSubtitle
  bioShort: React.ReactNode    // bio condensada (1 párrafo, con highlight rich)
  ctaLabel: string
  ctaAriaLabel: string
}
```

**Decisiones de interacción:**
- Hover en la card: `border-white/5 → border-white/10` (existente).
- Hover en el CTA: `-translate-y-0.5` (existente).
- Focus visible en `LanguageSwitcher`, foto-link (si linka a `/sobre-mi`) y CTA: `focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2`.
- Transición: `transition-all duration-300`.

### FeaturedPostsBlock (Opción B1)
**Tipo:** Modificación de existente (estructura similar a `LatestArticleBlock`).
**Archivo:** `components/bento/featured-posts-block.tsx`.

**Props:**
```typescript
type FeaturedPostsBlockProps = {
  posts: PostDto[]                                    // existente, hasta 4
  sectionLabel: string                                // "Artículos destacados"
  recentLabel: string                                 // NUEVO — "Anteriores" / "Previous" (puede reutilizar home.previous)
  readingTimeAriaLabel: (minutes: string) => string   // existente
}
```

**Estructura visual:**
- `posts[0]` → hero (link grande con título xl/2xl + excerpt + tag + reading time).
- `posts.slice(1, 4)` → lista compacta (ChevronRight + título line-clamp-1 + reading time).
- Si `posts.length === 1`: solo hero, sin sección "anteriores".
- Si `posts.length === 0`: estado vacío `—`.

**Decisiones de interacción:**
- Hover hero: `text-foreground → text-[#FCA311]` en título; flecha `↗` se mueve `-translate-y-0.5 translate-x-0.5`.
- Hover item compacto: `text-muted-foreground → text-[#FCA311]` en título y chevron; chevron se mueve `translate-x-0.5`.
- Focus visible en cada Link: outline naranja.

---

## Accesibilidad (aplica a la combinación A2 + B1)

- [ ] Contraste verificado: `text-foreground` sobre `#222222` ≥ 4.5:1; `text-muted-foreground` sobre `#222222` ≥ 4.5:1; `#FCA311` sobre `#222222` para CTAs ≥ 4.5:1; `#1a1a1a` sobre `#FCA311` (texto del CTA) ≥ 7:1.
- [ ] Foto con `alt="Aitor Santana"` ya presente.
- [ ] La card ProfileBlock no debe envolverse en un único `<a>`: la foto y el CTA son interactivos independientes; el resto es estático.
- [ ] Hero post y items compactos son `<a>` con `focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2`.
- [ ] Icono Clock con `aria-hidden="true"` + texto reading time con `sr-only` accesible (`readingTimeAriaLabel`).
- [ ] Icono ArrowUpRight / ChevronRight con `aria-hidden="true"`.
- [ ] Label sección con `<span aria-hidden="false">` o estructurar la card como `<section aria-label={sectionLabel}>` (ya presente).
- [ ] Saludo "Hola, soy" puede leerse como parte del título (`<h2>` engloba saludo+nombre o saludo en `<span class="sr-only">` solo si visualmente queda mal).
- [ ] Navegación por teclado: orden tab esperado en ProfileBlock = foto/nombre (si linka) → LanguageSwitcher → CTA. En FeaturedPostsBlock = hero → item 1 → item 2 → item 3.
- [ ] Landmarks: `ProfileBlock` puede llevar `<section aria-labelledby="profile-heading">` con el `<h2>` que envuelva nombre+saludo.

---

## Responsive (combinación A2 + B1)

### Mobile (< 768px)
- ProfileBlock: stack vertical — foto 80 px → saludo + nombre + rol → claim → bio → CTA al fondo (mt-auto).
- FeaturedPostsBlock: hero arriba con título `text-xl`, excerpt 2 líneas, tag + reading time; separador; lista compacta 3 items.

### Tablet (768-1024px)
- Idéntico a desktop pero foto 96 px en ProfileBlock; título hero `text-xl`.

### Desktop (≥ 1024px)
- ProfileBlock: header con foto 112 px y `flex-row sm:items-center`; título nombre `text-4xl`; padding `p-8`.
- FeaturedPostsBlock: título hero `text-2xl`, padding `p-6`.

---

## i18n — claves a añadir/modificar

### `messages/es.json` y `messages/en.json`

**Profile (A2):**
```jsonc
"profile": {
  "greeting": "Hola, soy",                // NUEVO
  "role": "Software Crafter",             // ya existe implícitamente (hardcoded)
  "impactClaim": "Especializado en arquitecturas limpias y TDD. Entregando producto en Fintech, Streaming y EdTech.",  // renombrado desde impactSubtitle
  "bioShort": "Escribo, doy charlas y desarrollo software de calidad con <strong>Clean Code</strong> y <highlight>IA Generativa</highlight> desde <strong>Canarias</strong> para el mundo.",  // NUEVO — combina bio1+bio2+bio3
  "ctaLabel": "Hablemos",
  "ctaAriaLabel": "Enviar email a Aitor Santana"
}
```

**Decisión editorial:** A confirmar si se conservan `bio1`, `bio2`, `bio3` para futuras pantallas (CV, sobre-mí) o se eliminan.

**Home / FeaturedPosts (B1):**
```jsonc
"home": {
  "previous": "Anteriores",                       // ya existe — reutilizable
  "featuredPosts": {
    "label": "Artículos destacados",              // ya existe
    "recentLabel": "Anteriores",                  // NUEVO o reutiliza "home.previous"
    "readingTimeAria": "Tiempo de lectura: {time}"  // ya existe
  }
}
```

---

## Dependencias

- **Componentes shadcn/ui a añadir:** ninguno nuevo.
- **Iconos lucide-react usados:** `Mail`, `ArrowUpRight`, `Clock`, `ChevronRight` (todos ya en uso).
- **Imágenes:** `/aitor_profile.webp` (ya existente). Si A2 con foto 112 px, verificar nitidez en HiDPI (la imagen debe tener al menos 224 px de lado físico).
- **Server Components:** ambos pueden seguir siendo Server Components (no requieren `"use client"`); `LanguageSwitcher` ya gestiona su propio estado cliente.

---

## Notas finales

- Tras implementar, **considerar fusionar `LatestArticleBlock` y `FeaturedPostsBlock`** en un solo componente parametrizable (`HeroListBlock` o similar) ya que ambos comparten estructura "1 hero + N compactos". Esto se discutirá con el `planner` antes de implementar.
- El dot "• HOME" del final del ProfileBlock se elimina: en la home no aporta info y el indicador `h-0.5 w-12 bg-[#FCA311]` bajo el nombre cumple la función identitaria de "esto es lo principal de esta página".
- Verificar que `pnpm type-check` y `pnpm test` siguen pasando tras renombrar `impactSubtitle → impactClaim` (afecta a tests de `ProfileBlock`).
