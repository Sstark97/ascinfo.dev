# Plan: Botón de descarga de CV (Harvard Template) en /sobre-mi

## Contexto

La página `/sobre-mi` ya contiene toda la información profesional (experiencia, skills, stack técnico) en `career-data.ts` y datos personales en `seo/constants.ts`. Se necesita un botón que genere un PDF con formato Harvard y un enlace de descarga directa, todo basado en los datos existentes.

## Enfoque

Usar **`@react-pdf/renderer`** (by diegomura) para generar el PDF directamente en el navegador con componentes React. Es la librería más madura para generación de PDFs en React (benchmark score 92.2, reputación alta).

### Harvard Template - Estructura

Basado en las guías oficiales de Harvard Career Services:
- **Fuente**: Times New Roman o similar serif (registraremos fuente serif)
- **Layout**: Una columna, limpio y formal
- **Secciones ordenadas**: Nombre/Contacto > Perfil > Educación > Experiencia > Habilidades
- **Formato**: Bullet points para logros, separadores entre secciones
- **Tamaño nombre**: 14-16pt, títulos de sección: 12pt, contenido: 10-11pt

## Archivos a modificar/crear

### 1. Instalar dependencia
```
pnpm add @react-pdf/renderer
```

### 2. Crear datos del CV
**Archivo**: `src/lib/career/cv-data.ts`

Centralizar los datos para el CV en un solo lugar, reutilizando `careerData` y `AUTHOR`:
- **Datos personales**: Aitor Santana Cabrera, aitorscinfo@gmail.com, LinkedIn, GitHub, ascinfo.dev
- **Educación**: CFGS Desarrollo de Aplicaciones Web - IES Ana Luisa Benítez
- **Experiencia profesional**: Reutilizar `careerData` de `career-data.ts`
- **Skills técnicos**: Reutilizar los stacks de la página (Backend, Frontend, DevOps)
- **Idioma**: Español (mismo que la página)

### 3. Crear template PDF Harvard
**Archivo**: `components/career/cv-pdf-document.tsx`

Componente React usando `@react-pdf/renderer`:
- `Document` > `Page` con layout Harvard
- Registrar fuente serif (Times New Roman o EB Garamond desde Google Fonts)
- Secciones: Header con nombre y contacto, Perfil profesional, Educación, Experiencia (con proyectos como bullets), Stack técnico
- Estilos con `StyleSheet.create()` respetando márgenes y tipografía Harvard

### 4. Crear componente botón de descarga
**Archivo**: `components/career/cv-download-button.tsx`

Componente **Client** (`"use client"`) que:
- Usa `PDFDownloadLink` de `@react-pdf/renderer`
- Muestra estado de carga mientras se genera
- Estilizado consistente con el diseño del sitio (borde `#333`, hover `#FCA311`)
- Incluye icono de descarga (lucide-react `Download`)

### 5. Modificar página sobre-mi
**Archivo**: `app/sobre-mi/page.tsx`

- Importar el botón con **`next/dynamic`** (lazy loading) - sigue la regla `bundle-dynamic-imports` de Vercel para no cargar `@react-pdf/renderer` (~500KB) en el bundle inicial
- Colocar el botón en el header, debajo de la descripción personal
- El enlace de descarga directa se integra en el mismo componente

### 6. Tests
**Archivo**: `tests/components/career/cv-download-button.test.tsx`

- Test que verifica que el botón se renderiza correctamente
- Test de estados loading/ready

## Decisiones de rendimiento (Vercel Best Practices)

1. **`bundle-dynamic-imports`**: `@react-pdf/renderer` es una librería pesada (~500KB). Se carga con `next/dynamic` + `ssr: false` (solo funciona en cliente)
2. **`server-serialization`**: La página sigue siendo Server Component; solo el botón es Client Component
3. **`rendering-conditional-render`**: Usar ternario para estados loading/ready del PDF

## Verificación

1. `pnpm dev` - Navegar a `/sobre-mi`, verificar que el botón aparece
2. Hacer click en el botón - debe descargar `cv-aitor-santana.pdf`
3. Abrir el PDF - verificar formato Harvard (secciones correctas, tipografía serif, layout limpio)
4. `pnpm test` - Los tests existentes no deben romperse
5. `pnpm build` - Verificar que el build completa sin errores
6. Verificar en Network tab que `@react-pdf/renderer` solo se carga al interactuar con la sección del CV
