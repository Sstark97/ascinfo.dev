# Design: NavigationDock — rellenar densidad tras mover sociales al footer

## Resumen ejecutivo

Tras mover los iconos sociales y el email al footer global, la `NavigationDock` (col-span-4 en la fila inferior del bento, junto a `FeaturedProjectBlock` y `RecentTalkBlock`) se quedó con una sola fila de cuatro iconos centrados verticalmente y un label "SECCIONES" arriba. El resultado: una tarjeta con altura equivalente a sus vecinos pero con muchísimo menos peso visual.

El problema no es de "falta de elementos", es de **falta de densidad informativa y jerarquía**. Las dos tarjetas vecinas (`FeaturedProjectBlock`, `RecentTalkBlock`) siguen un patrón compositivo claro:

```
[label-mono]      [arrow-up-right]
   |
[contenido principal con jerarquía]
   |
─────────────── (border-t-white/5)
[CTA en naranja FCA311]
```

La NavigationDock debe **adoptar ese mismo ritmo compositivo** para encajar visualmente, no añadir elementos sueltos para tapar el hueco. A continuación, cuatro opciones evaluadas, con recomendación al final.

---

## Contexto

- **Pantalla:** `app/[locale]/page.tsx` (Home).
- **Posición:** tercer slot de la fila inferior (`md:col-span-4`), a la derecha de `FeaturedProjectBlock` y `RecentTalkBlock`.
- **Componente actual:** `components/bento/navigation-dock.tsx` (client component, usa `useTranslations("nav")`).
- **Vecinos visuales:**
  - Izquierda: `FeaturedProjectBlock` — label + icono GitHub + título proyecto + status + footer CTA "Ver proyecto →"
  - Centro: `RecentTalkBlock` — label + badge evento + título charla + footer CTA "Ver charla →"
- **Datos disponibles:**
  - `useTranslations("nav")` → `blog`, `talks`, `projects`, `about`, `sectionsLabel`
  - Counts dinámicos ya calculados en `page.tsx`: `allPosts.length`, `allTalks.length`, y se podría añadir `allProjects.length` (ya hay `projects.getAll`).
  - `LanguageSwitcher` reubicable desde `ProfileBlock`.
- **Restricciones:**
  - Mantener `"use client"`.
  - Sin librerías nuevas (no Framer Motion).
  - Sin duplicar email/sociales (ya en footer global).
  - Mantener altura coherente con vecinos (no encoger la card).

---

## Decisiones de UX (transversales)

1. **Adoptar el ritmo compositivo de las cards vecinas** (header con label + arrow, contenido con jerarquía, opcionalmente footer con border-t y acento). Esto es lo que más resuelve la sensación de "vacío": no es que falten cosas, es que falta el patrón.
2. **Aprovechar la altura vertical**: las cards vecinas son verticales-densas. Una nav horizontal en una columna estrecha de col-span-4 desperdicia el eje Y. Cambiar a stack vertical (mobile-first) es además más legible.
3. **Sumar valor informativo**: counts de cada sección (`21 artículos`, `4 charlas`, `7 proyectos`) sirven al recruiter como prueba de actividad y al visitante curioso como guía. Es el dato más útil que se puede añadir sin inventar contenido.
4. **No duplicar el footer global**: nada de email/sociales aquí.

---

## Opción 1: Lista vertical con descriptores ("Directory")

Stack vertical de 4 filas, una por sección, con icono + label + descriptor corto. Arrow-up-right alineada a la derecha de cada fila. Aprovecha al 100% la altura.

### Wireframe

#### Mobile (< 768px) — col-span-12

```
┌────────────────────────────────────────────────┐
│ • SECCIONES                                    │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ [📄] Blog                              ↗  │ │
│ │      Artículos técnicos                    │ │
│ ├────────────────────────────────────────────┤ │
│ │ [🎤] Charlas                           ↗  │ │
│ │      Conferencias y workshops              │ │
│ ├────────────────────────────────────────────┤ │
│ │ [📁] Proyectos                         ↗  │ │
│ │      Open source y side projects           │ │
│ ├────────────────────────────────────────────┤ │
│ │ [👤] Sobre mí                          ↗  │ │
│ │      Trayectoria y CV                      │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

#### Desktop (>= 768px) — col-span-4

```
┌──────────────────────────┐
│ • SECCIONES              │
│                          │
│ [📄] Blog            ↗  │
│      Artículos técnicos  │
│ ──────────────────────── │
│ [🎤] Charlas         ↗  │
│      Conferencias        │
│ ──────────────────────── │
│ [📁] Proyectos       ↗  │
│      Open source         │
│ ──────────────────────── │
│ [👤] Sobre mí        ↗  │
│      Trayectoria         │
└──────────────────────────┘
```

### Especificación

**Contenedor:**
```
flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6
transition-all duration-300 hover:border-white/10
```

**Header (label de sección con dot, igual que `ProfileBlock`):**
```html
<div class="flex items-center gap-2">
  <div class="h-1.5 w-1.5 rounded-full bg-[#FCA311]" />
  <span class="font-mono text-xs uppercase tracking-wider text-muted-foreground">
    SECCIONES
  </span>
</div>
```

**Lista (vertical, divisores entre items):**
```
mt-4 flex flex-1 flex-col divide-y divide-white/5
```

**Item (link):**
```
group flex items-center gap-3 py-3 first:pt-0 last:pb-0
transition-colors
focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 focus-visible:rounded
```

**Icon-wrapper dentro del item:**
```
flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a]
transition-colors group-hover:bg-[#FCA311]/10
```
- icon: `h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]`

**Texto del item:**
- Label: `text-sm font-medium text-foreground transition-colors group-hover:text-[#FCA311]`
- Descriptor: `mt-0.5 text-xs text-muted-foreground`

**Arrow alineada a la derecha:**
```
ml-auto h-4 w-4 text-muted-foreground/40
transition-all duration-300
group-hover:text-[#FCA311] group-hover:translate-x-0.5 group-hover:-translate-y-0.5
```

### Pros
- Aprovecha toda la altura vertical (encaja perfecto con vecinos).
- Replica patrón de `LatestArticleBlock` (sección "Anteriores" con divisores).
- Cada link tiene mucho área clickable (mejor en mobile, mejor accesibilidad).
- Los descriptores aportan contexto y SEO interno (anchor text rico).

### Contras
- Necesita 4 nuevas claves i18n (un descriptor por sección × 2 idiomas = 8 strings).
- Si los descriptores son largos, en col-span-4 pueden romper línea (hay que mantenerlos en 2-3 palabras).

### UX rationale
Una lista vertical-textual, en vez de una fila de iconos, comunica al recruiter de un vistazo **qué tipo de contenido hay en cada sección**, no solo que existe. Es la solución más "informativa" y la que más densidad real aporta.

---

## Opción 2: Nav horizontal compacto + Stats al pie ("Compact + Counts")

Mantiene la fila horizontal de 4 iconos arriba (más pequeña) y añade abajo, con `border-t border-white/5`, una mini-banda con los counts dinámicos: `21 ARTÍCULOS · 4 CHARLAS · 7 PROYECTOS`. Repite el patrón "header + content + footer-divisor" de las vecinas.

### Wireframe

#### Mobile (< 768px)

```
┌────────────────────────────────────────────────┐
│ • SECCIONES                                    │
│                                                │
│   ┌────┐  ┌────┐  ┌────┐  ┌────┐               │
│   │ 📄 │  │ 🎤 │  │ 📁 │  │ 👤 │               │
│   │Blog│  │Talk│  │Proj│  │Yo  │               │
│   └────┘  └────┘  └────┘  └────┘               │
│                                                │
│ ───────────────────────────────────────────────│
│   21       ·    4      ·    7                  │
│ ARTÍCULOS    CHARLAS     PROYECTOS             │
└────────────────────────────────────────────────┘
```

#### Desktop (>= 768px) — col-span-4

```
┌──────────────────────────┐
│ • SECCIONES              │
│                          │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐    │
│  │📄│ │🎤│ │📁│ │👤│    │
│  │Bg│ │Ch│ │Pr│ │Yo│    │
│  └──┘ └──┘ └──┘ └──┘    │
│                          │
│ ──────────────────────── │
│  21   ·   4   ·   7      │
│ ART     CHA     PRO      │
└──────────────────────────┘
```

### Especificación

**Contenedor:** misma card base que Opción 1.

**Header con dot + label:** idéntico a Opción 1.

**Nav horizontal (similar al actual, ligeramente más grande):**
```
mt-4 flex flex-1 items-center justify-around gap-2
```

**Item del nav:**
```
group flex flex-col items-center gap-2 rounded-lg px-3 py-3
transition-all duration-200
hover:bg-[#FCA311]/10
focus-visible:bg-[#FCA311]/10 focus-visible:outline-2 focus-visible:outline-[#FCA311]
```
- icon: `h-5 w-5 text-muted-foreground transition-colors group-hover:text-[#FCA311]`
- label: `text-xs font-medium text-muted-foreground transition-colors group-hover:text-[#FCA311]`

**Footer con stats (replica el footer-CTA de las vecinas):**
```
mt-4 flex items-center justify-around gap-2 border-t border-white/5 pt-4
```

**Stat individual (basado en `HeroStatsList`, pero compacto):**
```html
<div class="flex flex-col items-center gap-0.5">
  <span class="text-base font-bold text-foreground">21</span>
  <span class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
    Artículos
  </span>
</div>
```

**Separadores entre stats:** dot decorativo `<span aria-hidden class="h-1 w-1 rounded-full bg-white/10" />`

### Pros
- Repite literalmente el patrón "header + content + footer con border-t" de `FeaturedProjectBlock` y `RecentTalkBlock`. Encaja visualmente como un guante.
- Suma valor (counts dinámicos = prueba de actividad) sin inventar copy.
- Los counts ya están calculados en `page.tsx`, solo hay que pasarlos como props.
- Cambio mínimo de estructura sobre el componente actual.

### Contras
- "Sobre mí" no tiene un count natural (no es contable como artículos/charlas/proyectos), por lo que el footer solo cubre 3 de las 4 secciones — asimetría conceptual aunque visualmente limpia.
- Duplica parcialmente la información de `HeroStatsBlock` (que ya tiene articles/talks como stats). Aunque aquí tendría un rol distinto (sub-resumen junto a la nav, no estadística destacada), el riesgo de redundancia existe.

### UX rationale
Es la opción **más conservadora y coherente compositivamente**. Adopta el mismo ritmo que las vecinas, da un dato útil al recruiter (cuánto contenido hay) y no requiere copy nuevo más allá de las labels que ya existen. La duplicación con `HeroStatsBlock` se mitiga si se piensa la card como "sumario de directorio", no como "métrica destacada".

---

## Opción 3: Iconos grandes + LanguageSwitcher al pie ("Site Controls Hub")

Inflar los iconos de la nav (más grandes y con más respiración) y añadir abajo, separado con `border-t`, el `LanguageSwitcher` movido desde `ProfileBlock`. Convierte la card en un "centro de controles del sitio".

### Wireframe

#### Mobile (< 768px)

```
┌────────────────────────────────────────────────┐
│ • SECCIONES                                    │
│                                                │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│   │  📄  │  │  🎤  │  │  📁  │  │  👤  │       │
│   │      │  │      │  │      │  │      │       │
│   │ Blog │  │Charla│  │Proyec│  │Sobre │       │
│   └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                │
│ ───────────────────────────────────────────────│
│ IDIOMA                              ES / EN    │
└────────────────────────────────────────────────┘
```

#### Desktop (>= 768px) — col-span-4

```
┌──────────────────────────┐
│ • SECCIONES              │
│                          │
│  ┌────┐┌────┐┌────┐┌────┐│
│  │ 📄 ││ 🎤 ││ 📁 ││ 👤 ││
│  │    ││    ││    ││    ││
│  │Blog││ Cha││ Pro││ Yo ││
│  └────┘└────┘└────┘└────┘│
│                          │
│ ──────────────────────── │
│ IDIOMA          ES / EN  │
└──────────────────────────┘
```

### Especificación

**Header con dot + label:** idéntico a Opción 1.

**Nav inflada:**
```
mt-4 grid flex-1 grid-cols-4 gap-2
```

**Item del nav (tile cuadrado):**
```
group flex aspect-square flex-col items-center justify-center gap-2
rounded-lg bg-[#1a1a1a] p-2
transition-all duration-200
hover:bg-[#FCA311]/10 hover:-translate-y-0.5
focus-visible:bg-[#FCA311]/10 focus-visible:outline-2 focus-visible:outline-[#FCA311]
```
- icon: `h-6 w-6 text-muted-foreground transition-colors group-hover:text-[#FCA311]`
- label: `text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-[#FCA311]`

**Footer con LanguageSwitcher:**
```
mt-4 flex items-center justify-between border-t border-white/5 pt-4
```
- Label "IDIOMA / LANGUAGE": `font-mono text-xs uppercase tracking-wider text-muted-foreground`
- LanguageSwitcher reutilizado tal cual (sin el padding `px-3 py-2` actual, o con margin negativa para alinear).

### Pros
- Convierte la card en un hub funcional consistente: "navegación + control de idioma" agrupados.
- Los tiles cuadrados con `bg-[#1a1a1a]` repiten el patrón del wrapper de icono GitHub en `FeaturedProjectBlock` (coherencia visual).
- Libera el `ProfileBlock` del LanguageSwitcher (que ahora vive un poco "incrustado" debajo del subtítulo).

### Contras
- Mover el LanguageSwitcher implica tocar `ProfileBlock` (más superficie de cambio, posible rotura de tests del bloque).
- Los tiles aspect-square en col-span-4 pueden quedar pequeños y los labels (Charlas, Proyectos, Sobre mí) muy comprimidos: requiere truncar o usar abreviaturas.
- "IDIOMA" en mono uppercase rompe el patrón visual del LanguageSwitcher (que usa "ES / EN" en mono lowercase-uppercase mixto). Habría que refinar la integración.

### UX rationale
Conceptualmente sólido (agrupa controles del sitio), pero el LanguageSwitcher es un control raro y poco usado, dedicarle 1/4 de la altura visual de la card lo sobre-prioriza. Mejor candidato si el sitio tuviera más controles globales (tema, RSS, etc.).

---

## Opción 4: Lista vertical con count badge ("Directory + Counts")

Híbrido entre Opción 1 y Opción 2. Lista vertical de secciones (como Opción 1) pero en lugar de descriptor textual, un **badge con el count** alineado a la derecha. Mantiene la verticalidad y aprovecha los counts dinámicos sin necesidad de copy nuevo.

### Wireframe

#### Mobile (< 768px)

```
┌────────────────────────────────────────────────┐
│ • SECCIONES                                    │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ [📄] Blog                  [21]        ↗  │ │
│ ├────────────────────────────────────────────┤ │
│ │ [🎤] Charlas               [4]         ↗  │ │
│ ├────────────────────────────────────────────┤ │
│ │ [📁] Proyectos             [7]         ↗  │ │
│ ├────────────────────────────────────────────┤ │
│ │ [👤] Sobre mí                          ↗  │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

#### Desktop (>= 768px) — col-span-4

```
┌──────────────────────────┐
│ • SECCIONES              │
│                          │
│ [📄] Blog       [21]  ↗ │
│ ──────────────────────── │
│ [🎤] Charlas    [4]   ↗ │
│ ──────────────────────── │
│ [📁] Proyectos  [7]   ↗ │
│ ──────────────────────── │
│ [👤] Sobre mí         ↗ │
└──────────────────────────┘
```

### Especificación

**Contenedor, header, lista y divisores:** idénticos a Opción 1.

**Item (link):**
```
group flex items-center gap-3 py-3 first:pt-0
focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 focus-visible:rounded
```

**Icon-wrapper:** idéntico a Opción 1.

**Label del item:**
```
text-sm font-medium text-foreground transition-colors group-hover:text-[#FCA311]
```

**Count badge (chip alineado a la derecha, antes de la flecha):**
```html
<span class="ml-auto inline-flex items-center rounded-full bg-[#FCA311]/10 px-2 py-0.5 font-mono text-xs font-medium text-[#FCA311]">
  21
</span>
```
- En "Sobre mí", se omite el badge.

**Arrow:**
```
h-4 w-4 text-muted-foreground/40
transition-all duration-300
group-hover:text-[#FCA311] group-hover:translate-x-0.5
```

### Pros
- Cero copy nuevo: usa solo labels existentes (`nav.blog`, `nav.talks`, etc.) y counts dinámicos.
- Aprovecha la altura vertical igual que Opción 1.
- El badge en `bg-[#FCA311]/10` con `text-[#FCA311]` reutiliza el patrón de tags de `LatestArticleBlock` (coherencia visual).
- Los counts dan al recruiter el mismo valor informativo que Opción 2 pero asociado contextualmente a cada sección, no agregado.
- Sin asimetría conceptual: "Sobre mí" simplemente no tiene badge (es coherente: no hay nada contable allí).

### Contras
- Necesita pasar `projectsCount` como prop nueva (hoy no se calcula en `page.tsx`, pero sería trivial añadir `projects.getAll.execute(l)`).
- Visualmente menos rico que Opción 1 (sin descriptores textuales).

### UX rationale
Es la solución de **mejor relación valor / esfuerzo**: aprovecha la verticalidad, suma información útil (counts), no requiere copy nuevo, replica patrones visuales ya usados (badge tipo tag). El recruiter ve de un vistazo cuánto contenido hay en cada sección y puede priorizar a dónde clicar.

---

## Recomendación: **Opción 4 (Directory + Counts)**

### Por qué

1. **Encaja con el patrón compositivo de los vecinos** sin forzarlo: header con dot + label, contenido vertical denso con divisores (mismo recurso que `LatestArticleBlock` usa para "Anteriores"), y la lectura general queda equilibrada con `FeaturedProjectBlock` y `RecentTalkBlock`.
2. **Aprovecha la altura vertical** que la Opción 2 (horizontal) sigue desperdiciando. En col-span-4 el eje Y es el recurso abundante; gastarlo en padding vacío es lo que generaba la sensación de "vacío" original.
3. **No requiere copy nuevo**, solo passthrough de counts ya disponibles. Coste i18n: cero strings nuevos.
4. **Suma valor informativo real al recruiter**: ver "21" junto a "Blog" comunica más rápido que un descriptor genérico tipo "Artículos técnicos". Es un dato concreto, dinámico, que el sitio actualiza solo.
5. **Reutiliza patrones existentes** (badge tipo tag de `LatestArticleBlock`, icon-wrapper de `FeaturedProjectBlock`) — no introduce primitivas nuevas.
6. **Riesgo bajo**: cambio localizado en `navigation-dock.tsx` + 1 línea en `page.tsx` (calcular `allProjects` y pasar counts como props). Sin tocar `ProfileBlock`, sin mover el `LanguageSwitcher` (Opción 3).

### Si el rechazo a la Opción 4 surge porque "los números repiten lo de HeroStatsBlock"

Caer a **Opción 1 (Directory)**: misma estructura vertical, pero con descriptores textuales en lugar de counts. Coste: 8 strings i18n nuevos (4 × 2 idiomas). Valor: contexto editorial sobre cada sección.

### Si el rechazo es por "demasiado denso textualmente"

Caer a **Opción 2 (Compact + Counts)**: mantiene horizontal y resuelve el ritmo compositivo con un footer-stats. No es la primera opción porque sigue desperdiciando altura, pero es la solución que más se parece a las cards vecinas estructuralmente.

---

## Especificación de Componentes (para la opción recomendada)

### NavigationDock (modificación)
**Tipo:** Modificación de existente
**Archivo:** `components/bento/navigation-dock.tsx`
**Props (nuevas):**
```typescript
interface NavigationDockProps {
  postsCount: number
  talksCount: number
  projectsCount: number
}
```
**Tailwind classes clave:**
```
// Contenedor
flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6
transition-all duration-300 hover:border-white/10

// Header (dot + label)
flex items-center gap-2
  · h-1.5 w-1.5 rounded-full bg-[#FCA311]
  · font-mono text-xs uppercase tracking-wider text-muted-foreground

// Lista
mt-4 flex flex-1 flex-col divide-y divide-white/5

// Item link
group flex items-center gap-3 py-3 first:pt-0 last:pb-0
focus-visible:outline-2 focus-visible:outline-[#FCA311]
focus-visible:outline-offset-2 focus-visible:rounded

// Icon wrapper
flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a]
transition-colors group-hover:bg-[#FCA311]/10
  · h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]

// Label
text-sm font-medium text-foreground transition-colors group-hover:text-[#FCA311]

// Count badge
ml-auto inline-flex items-center rounded-full
bg-[#FCA311]/10 px-2 py-0.5
font-mono text-xs font-medium text-[#FCA311]

// Arrow
h-4 w-4 text-muted-foreground/40
transition-all duration-300
group-hover:text-[#FCA311] group-hover:translate-x-0.5
```
**Notas de interacción:**
- Hover de fila: el icon-wrapper se tinta con `bg-[#FCA311]/10`, el label cambia a `text-[#FCA311]`, la flecha avanza 0.5 a la derecha. El badge no cambia (ya está en estado activo).
- Focus visible: outline naranja de 2px alrededor de la fila completa, con `rounded` para suavizar.
- Sin transformaciones (`-translate-y`) para no romper el flujo de la lista vertical (sí en cards completas como `FeaturedProjectBlock`, no en items de lista).

### Cambios en `app/[locale]/page.tsx`
```typescript
// Añadir a Promise.all:
projects.getAll.execute(l) // como allProjects

// Pasar a NavigationDock:
<NavigationDock
  postsCount={allPosts.length}
  talksCount={allTalks.length}
  projectsCount={allProjects.length}
/>
```

---

## Flujo de Interacción

1. Usuario llega a la home y ve el bento; la NavigationDock aparece en la esquina inferior derecha (desktop) o al final de la lista vertical (mobile).
2. Lee de un vistazo: "Blog 21, Charlas 4, Proyectos 7, Sobre mí". Decide a dónde ir según interés.
3. Hover sobre una fila: feedback visual (icono naranja, label naranja, flecha avanza). Confirma que es clickable.
4. Click: navega a la sección.
5. Navegación con teclado: `Tab` recorre las 4 filas en orden; cada una muestra outline naranja en focus.

---

## Accesibilidad

- [x] Contraste mínimo 4.5:1: `text-foreground` sobre `#222222` (WCAG AA), `text-[#FCA311]` sobre `#222222` (verificar — el naranja sobre dark suele rozar AA, ya está validado en el resto del sitio).
- [x] Estado focus visible: `focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2`.
- [x] Navegación por teclado funcional: cada fila es un `Link` (`<a>`), tabbable.
- [x] ARIA labels: el `Link` ya tiene texto visible (label), no requiere aria-label adicional. El badge de count es decorativo + informativo; añadir `aria-label="Blog (21 artículos)"` al `Link` para que el lector de pantalla anuncie el count en contexto.
- [x] Iconos decorativos: `aria-hidden="true"` (igual que el componente actual).
- [x] Landmarks: el `<nav>` ya está como landmark; añadir `aria-label="Secciones del sitio"` para distinguir del `<nav>` global del header si lo hay.

---

## Responsive

- **Mobile (< 768px):** card a ancho completo (col-span-12). Lista vertical con padding `p-6`. Cada fila tiene `py-3` que da target táctil cómodo (~52px de altura). Divisores `divide-white/5` separan filas.
- **Tablet (768–1023px):** col-span-4 dentro del grid de 12. Misma estructura vertical, contenedor ~280px de ancho. Labels y badges caben sin truncar.
- **Desktop (>= 1024px):** col-span-4 dentro de `max-w-6xl`. Contenedor ~320px de ancho. Misma estructura. Altura igualada a `FeaturedProjectBlock` y `RecentTalkBlock` por `flex-1` en la lista interna.

---

## i18n

**Strings reutilizados (sin cambios):**
- `nav.blog`, `nav.talks`, `nav.projects`, `nav.about`
- `nav.sectionsLabel`

**Strings nuevos requeridos (solo si se elige Opción 1 — Directory con descriptores):**
- `nav.blogDescription` — "Artículos técnicos" / "Technical articles"
- `nav.talksDescription` — "Conferencias y workshops" / "Conferences and workshops"
- `nav.projectsDescription` — "Open source y side projects" / "Open source and side projects"
- `nav.aboutDescription` — "Trayectoria y CV" / "Career and CV"

**Strings nuevos requeridos para Opción 4 (recomendada):** ninguno.

**Strings nuevos requeridos para Opción 2 (Compact + Counts):**
- Reutiliza labels de `home.heroStats.*`: `articlesPublished.label`, `talksDelivered.label`. Habría que añadir `home.heroStats.projectsPublished.label` si no existe.

**Strings nuevos requeridos para Opción 3 (Site Controls Hub):**
- `nav.languageLabel` — "Idioma" / "Language"

---

## Dependencias

- Iconos `lucide-react` ya en uso: `FileText`, `Mic2`, `FolderKanban`, `User`. Sin nuevos.
- `Link` de `@/src/i18n/navigation`. Sin nuevos.
- Sin nuevos componentes de shadcn/ui.
- Sin librerías externas.

---

## Resumen ejecutivo de la decisión

| Criterio | Op.1 Directory | Op.2 Compact+Counts | Op.3 Site Controls | **Op.4 Directory+Counts** |
|---|---|---|---|---|
| Aprovecha altura vertical | Sí | No | No | **Sí** |
| Coherencia con vecinos | Alta | Muy alta | Media | **Alta** |
| Copy nuevo (i18n) | 8 strings | 0–1 strings | 1 string | **0 strings** |
| Valor para recruiter | Contexto editorial | Stats agregadas | Bajo | **Stats por sección** |
| Riesgo de cambio | Bajo | Muy bajo | Medio (toca ProfileBlock) | **Bajo** |
| Redundancia con HeroStats | No | Sí (parcial) | No | Sí (parcial) |

**Elegida: Opción 4** por mejor balance de valor / coste / coherencia. **Plan B: Opción 1** si se valora más el contexto editorial sobre el dato numérico.
