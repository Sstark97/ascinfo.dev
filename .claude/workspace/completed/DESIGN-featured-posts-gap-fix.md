# Design: FeaturedPostsBlock — cerrar el hueco vertical

## Objetivo
Cerrar el hueco vertical que aparece entre el último item de la lista y el footer "→ Ver todos los artículos" en `FeaturedPostsBlock` cuando la card se estira para igualar la altura del `ProfileBlock` vecino (`md:col-span-6 + h-full`).

## Contexto
- Fila superior del bento de home: `ProfileBlock` (col-span-6) + `FeaturedPostsBlock` (col-span-6).
- `ProfileBlock` mide aproximadamente 480 px por su contenido (foto + nombre + role + impact subtitle + LangSwitcher + 2 párrafos de bio + 6 skill pills + CTA).
- `FeaturedPostsBlock` actual: 4 items compactos (~50 px cada) + label + footer = ~230 px de contenido, dejando ~250 px de hueco antes del footer empujado por `mt-auto`.
- `ProfileBlock` está fijo; no se puede tocar para reducir altura.

## Diagnóstico
La densidad del contenido del `FeaturedPostsBlock` está calibrada para una altura natural de ~230 px, pero la card recibe una altura impuesta de ~480 px por el grid (`h-full` + fila auto que toma la max-height entre las dos cards). El `mt-auto` del footer es correcto (mantiene el CTA pegado abajo), pero deja un vacío visual porque la lista no se redistribuye en el espacio disponible. La solución correcta NO es empujar más el footer, sino **aumentar la densidad de información o el aire vertical de los items** para que ocupen los ~480 px de forma equilibrada y orgánica.

---

## Opción 1: Lista respirada (5 posts, items con más aire)

**Idea:** Aumentar a 5 posts y dar a cada item más altura mediante `py-5` y un excerpt de 1 línea opcional. La distribución se reparte en `flex-1` con `justify-between` para que el aire se reparta de forma regular entre items, no en un único bloque al final.

### Wireframe Mobile (< 768px)
```
+-----------------------------------+
| ARTÍCULOS DESTACADOS         (05) |
|                                   |
| 01  Título del post          ↗    |
|     #arquitectura     8 MIN       |
| --------------------------------- |
| 02  Título del post          ↗    |
|     #.net            12 MIN       |
| --------------------------------- |
| 03  Título del post          ↗    |
|     #ia              10 MIN       |
| --------------------------------- |
| 04  Título del post          ↗    |
|     #open source     10 MIN       |
| --------------------------------- |
| 05  Título del post          ↗    |
|     #testing          6 MIN       |
|                                   |
| → VER TODOS LOS ARTÍCULOS         |
+-----------------------------------+
```

### Wireframe Desktop (≥ 768px)
```
+-----------------------------------------------+
| ARTÍCULOS DESTACADOS                     (05) |
|                                               |
| 01  Título del post                       ↗   |
|     #arquitectura                  8 MIN      |
| --------------------------------------------- |
| 02  Título del post                       ↗   |
|     #.net                          12 MIN     |
| --------------------------------------------- |
| 03  Título del post                       ↗   |
|     #ia                            10 MIN     |
| --------------------------------------------- |
| 04  Título del post                       ↗   |
|     #open source                   10 MIN     |
| --------------------------------------------- |
| 05  Título del post                       ↗   |
|     #testing                        6 MIN     |
|                                               |
| → VER TODOS LOS ARTÍCULOS                     |
+-----------------------------------------------+
```

### Clases Tailwind clave
- Contenedor lista: `mt-6 flex flex-1 flex-col justify-between divide-y divide-white/5`
- Item link: `group flex items-start gap-4 py-5 first:pt-0 last:pb-0` (de `py-4` a `py-5`)
- Footer: igual que actual (`mt-auto pt-4`)

### Cuántos posts trae
**5 posts.** Call site: `posts.getFeaturedList.execute(l, 5)`.

### Pros
- Cambio mínimo conceptual: misma estética actual, solo más densidad.
- `justify-between` reparte el aire entre items, evita el hueco grande al final.
- 5 es un número natural (top 5) y lee bien.
- Cero componentes nuevos.

### Contras
- Si el `ProfileBlock` crece (futura iteración), volverá a aparecer hueco.
- 5 items siguen siendo poco contenido para una card de ~480 px; el `py-5` ayuda pero la solución es frágil.
- `justify-between` reparte aire fuera de los items, no dentro: el último item podría quedar pegado al footer o separarse de los demás según el cálculo del navegador.

---

## Opción 2: Lista compacta + bloque "Por tema" al fondo

**Idea:** Mantener 4 posts compactos arriba (la jerarquía actual) y añadir un bloque secundario "EXPLORA POR TEMA" antes del footer, con los top 5-6 tags como pills clicables que filtran el blog (`/blog?tag=xxx`). El espacio vacío se rellena con valor real: navegación por temática.

### Wireframe Mobile (< 768px)
```
+-----------------------------------+
| ARTÍCULOS DESTACADOS         (04) |
|                                   |
| 01  Título del post          ↗    |
|     #arquitectura     8 MIN       |
| --------------------------------- |
| 02  Título del post          ↗    |
|     #.net            12 MIN       |
| --------------------------------- |
| 03  Título del post          ↗    |
|     #ia              10 MIN       |
| --------------------------------- |
| 04  Título del post          ↗    |
|     #open source     10 MIN       |
|                                   |
| · · · · · · · · · · · · · · · · · |
|                                   |
| EXPLORA POR TEMA                  |
| ┌──────────┐ ┌──────┐ ┌────────┐  |
| │#arquitec.│ │#.net │ │#testing│  |
| └──────────┘ └──────┘ └────────┘  |
| ┌────┐ ┌────────────┐             |
| │#ia │ │#open source│             |
| └────┘ └────────────┘             |
|                                   |
| → VER TODOS LOS ARTÍCULOS         |
+-----------------------------------+
```

### Wireframe Desktop (≥ 768px)
```
+--------------------------------------------------+
| ARTÍCULOS DESTACADOS                        (04) |
|                                                  |
| 01  Título del post                          ↗   |
|     #arquitectura                    8 MIN       |
| ------------------------------------------------ |
| 02  Título del post                          ↗   |
|     #.net                           12 MIN       |
| ------------------------------------------------ |
| 03  Título del post                          ↗   |
|     #ia                             10 MIN       |
| ------------------------------------------------ |
| 04  Título del post                          ↗   |
|     #open source                    10 MIN       |
|                                                  |
| ········································ ······· |
|                                                  |
| EXPLORA POR TEMA                                 |
| ┌──────────────┐ ┌────────┐ ┌──────────┐         |
| │ #arquitectura│ │ #.net  │ │ #testing │         |
| └──────────────┘ └────────┘ └──────────┘         |
| ┌──────┐ ┌──────────────┐                        |
| │ #ia  │ │ #open source │                        |
| └──────┘ └──────────────┘                        |
|                                                  |
| → VER TODOS LOS ARTÍCULOS                        |
+--------------------------------------------------+
```

### Clases Tailwind clave
- Contenedor lista: `mt-6 flex flex-col divide-y divide-white/5` (sin `flex-1`, altura natural)
- Bloque temas separador: `mt-6 pt-6 border-t border-white/5`
- Label "Explora por tema": `font-mono text-xs uppercase tracking-wider text-muted-foreground`
- Lista de pills: `mt-3 flex flex-wrap gap-2`
- Pill: `rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-[#FCA311]/40 hover:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2`
- Wrapper general: `flex h-full w-full flex-col` (igual que actual); el bloque "por tema" empuja el footer hasta `mt-auto`.

### Cuántos posts trae
**4 posts** (igual que ahora) + **5-6 tags más frecuentes** derivados del agregado de tags de `allPosts`.

### Pros
- Aporta valor real: el usuario gana un segundo eje de navegación (post destacado vs. exploración por tema).
- Densidad coherente con el estilo del `ProfileBlock` (que también combina bio + skill rail).
- Visualmente equilibrado: lista arriba, taxonomía abajo, CTA al pie.
- Refuerza la coherencia con el `ProfileBlock` (ambos usan pills al final del bloque).
- 4 posts mantiene la jerarquía clara — sigue siendo "destacados" y no "lista larga".

### Contras
- Requiere nueva prop `topTags: string[]` en `FeaturedPostsBlock`.
- Requiere cálculo en el call site (`app/[locale]/page.tsx`): agregar tags de `allPosts`, ordenar por frecuencia, tomar top 5-6.
- Asume que `/blog` soporta `?tag=` como query param de filtro. Si no, los pills enlazan a `/blog` sin más y filtran client-side, o se difiere la feature.
- Añade textos nuevos a i18n (`featuredPosts.exploreByTopic`).

---

## Opción 3: Lista expandida (6 posts, item con excerpt)

**Idea:** Mostrar 6 posts y enriquecer cada item con una segunda línea (excerpt truncado a 1 línea o frase clave). La card se llena por densidad de información, no por aire vacío. La jerarquía visual cambia: el bloque pasa de "lista corta de top destacados" a "feed reciente".

### Wireframe Mobile (< 768px)
```
+-----------------------------------+
| ARTÍCULOS                    (06) |
|                                   |
| 01  Título del post          ↗    |
|     Excerpt corto en 1 línea...   |
|     #arquitectura     8 MIN       |
| --------------------------------- |
| 02  Título del post          ↗    |
|     Excerpt corto en 1 línea...   |
|     #.net            12 MIN       |
| --------------------------------- |
| ... (4 items más)                 |
|                                   |
| → VER TODOS LOS ARTÍCULOS         |
+-----------------------------------+
```

### Wireframe Desktop (≥ 768px)
```
+--------------------------------------------------+
| ARTÍCULOS                                   (06) |
|                                                  |
| 01  Título del post                          ↗   |
|     Excerpt corto en 1 línea...                  |
|     #arquitectura                    8 MIN       |
| ------------------------------------------------ |
| 02  Título del post                          ↗   |
|     Excerpt corto en 1 línea...                  |
|     #.net                           12 MIN       |
| ------------------------------------------------ |
| 03  Título del post                          ↗   |
|     Excerpt corto en 1 línea...                  |
|     #ia                             10 MIN       |
| ------------------------------------------------ |
| 04  Título del post                          ↗   |
|     Excerpt corto en 1 línea...                  |
|     #open source                    10 MIN       |
| ------------------------------------------------ |
| 05  Título del post                          ↗   |
|     Excerpt corto en 1 línea...                  |
|     #testing                         6 MIN       |
| ------------------------------------------------ |
| 06  Título del post                          ↗   |
|     Excerpt corto en 1 línea...                  |
|     #ddd                             9 MIN       |
|                                                  |
| → VER TODOS LOS ARTÍCULOS                        |
+--------------------------------------------------+
```

### Clases Tailwind clave
- Contenedor lista: `mt-6 flex flex-1 flex-col divide-y divide-white/5`
- Item link: `group flex items-start gap-4 py-4 first:pt-0`
- Excerpt (línea nueva): `mt-1 text-sm leading-snug text-muted-foreground line-clamp-1`
- Estructura interna del item:
  ```
  <span número /> 
  <div flex-1>
    <flex titulo + arrow />
    <p excerpt line-clamp-1 />
    <flex tag + readingTime />
  </div>
  ```

### Cuántos posts trae
**6 posts.** Call site: `posts.getFeaturedList.execute(l, 6)`.

### Pros
- Cierra el hueco por contenido real, no por aire artificial.
- El excerpt aporta valor SEO/UX: el usuario sabe de qué va el artículo antes de hacer click.
- La card pasa a sentirse densa y útil, equivalente en peso visual al `ProfileBlock`.
- Cero componentes nuevos.

### Contras
- 6 items con 3 líneas cada uno (~75 px por item × 6 = 450 px) sube el contenido a casi el límite, lo que puede sobrepasar la altura del `ProfileBlock` y desplazar el balance hacia el lado contrario (que el ProfileBlock sea quien tenga hueco… aunque su `mt-auto pt-6` ya lo controla).
- Rompe la jerarquía de "destacados": pasa a ser "feed de artículos", lo cual diluye el `(04)` actual.
- 6 excerpts compitiendo con el título visualmente — más ruido en la card.
- Si los excerpts son largos y el `line-clamp-1` corta de forma fea, se nota.

---

## Recomendación

**Opción 2: Lista compacta (4 posts) + bloque "Explora por tema" al fondo.**

### Razonamiento
1. **Cierra el hueco con valor real, no con aire ni con relleno mecánico.** El usuario gana un segundo eje de navegación (por temática) sin perder la jerarquía de "estos son mis 4 mejores artículos".
2. **Es la opción más robusta ante cambios futuros.** Si el `ProfileBlock` crece o decrece, la card sigue equilibrada: la lista es un bloque, los pills son otro, el CTA es otro. La distribución no depende de cuadrar píxeles exactos de altura.
3. **Refuerza la coherencia visual con el `ProfileBlock`** vecino, que también usa el patrón "contenido principal arriba + pills de taxonomía + CTA al pie". Las dos cards quedan visualmente hermanadas en estructura, lo que reforzará la sensación de fila bien resuelta.
4. **Opción 1** es la solución más barata pero la más frágil: depende de píxeles y de que el `ProfileBlock` no cambie. Si el usuario añade una línea más en la bio mañana, vuelve el hueco.
5. **Opción 3** introduce más ruido (excerpts) y rompe la jerarquía de "destacados". Es la opción de menor calidad UX a largo plazo: el bloque deja de ser una promesa curada y pasa a ser un feed.
6. **Coste de implementación de la Opción 2** es bajo: agregación de tags en el call site (un `reduce` + `sort`), una prop nueva (`topTags`), un sub-bloque con divider, pills enlazando a `/blog?tag=xxx`. Sin componentes nuevos, sin librerías nuevas, sin tocar `ProfileBlock`.

### Plan de aplicación (para el siguiente agente)
1. Añadir prop `topTags: string[]` a `FeaturedPostsBlock`.
2. Añadir prop `exploreByTopicLabel: string` para i18n del label del sub-bloque.
3. En `app/[locale]/page.tsx`, derivar `topTags` agregando `allPosts.flatMap(p => p.toDto().tags)`, contando frecuencias y tomando top 5-6.
4. Añadir traducciones `home.featuredPosts.exploreByTopic` en `messages/es.json` y `messages/en.json` ("Explora por tema" / "Browse by topic").
5. Verificar/extender que `/blog` lee `?tag=` y filtra (si no, dejar pills enlazando a `/blog` y abrir tarea aparte).

---

## Accesibilidad (común a las 3 opciones)
- [ ] Contraste mínimo 4.5:1 para texto sobre `#222222` (cumplido con `text-foreground` y `text-muted-foreground`).
- [ ] Cada `<Link>` tiene `focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2`.
- [ ] Bloque "Explora por tema" (Opción 2) usa `<nav aria-label="...">` o `<ul aria-label="...">` para el grupo de pills.
- [ ] El número de item (`01`, `02`...) lleva `aria-hidden="true"` (ya está).
- [ ] El reading time mantiene el patrón actual: `<span class="sr-only">` con la frase completa traducida + `<span aria-hidden>` con el valor visual.
- [ ] El divider visual (border-t) entre lista y "Explora por tema" en Opción 2 es decorativo; no necesita rol.

## Responsive (común)
- **Mobile (< 768px):** card a 100% del ancho. En Opción 2, los pills de tags hacen `flex-wrap` natural.
- **Tablet/Desktop (≥ 768px):** card en `md:col-span-6`. La altura sigue dictada por `h-full` igualando al `ProfileBlock`. Las tres opciones se comportan de forma equivalente.

## i18n (textos a añadir)
- Opción 1: ninguno nuevo.
- Opción 2: `home.featuredPosts.exploreByTopic` → ES: "Explora por tema" / EN: "Browse by topic".
- Opción 3: ninguno nuevo (el excerpt ya viene del PostDto).

## Dependencias
Ninguna nueva. Todo se resuelve con componentes y utilidades existentes.
