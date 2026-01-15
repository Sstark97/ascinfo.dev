# ascinfo.dev - Portfolio Personal

Portfolio personal de Aitor Santana, desarrollador de software especializado en código limpio, TDD, DDD y arquitectura hexagonal.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://ascinfo.dev)

## 🚀 Tecnologías

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Contenido:** MDX con next-mdx-remote
- **Syntax Highlighting:** Shiki
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel

## 📁 Estructura del Proyecto

```
ascinfo.dev/
├── app/                      # App Router de Next.js
│   ├── blog/                # Páginas del blog
│   ├── proyectos/           # Páginas de proyectos
│   ├── charlas/             # Páginas de charlas
│   ├── layout.tsx           # Layout principal con SEO
│   ├── sitemap.ts           # Sitemap dinámico
│   └── robots.ts            # Configuración de robots
├── src/
│   ├── lib/content/         # Capa de contenido (Repository Pattern)
│   │   ├── domain/          # Entidades y contratos de repositorios
│   │   │   ├── entities/    # Post, Project, Talk
│   │   │   └── repositories/
│   │   └── infrastructure/  # Implementaciones MDX
│   │       └── mdx/         # Componentes y compilador MDX
│   └── content/             # Contenido en MDX
│       ├── posts/           # Artículos del blog
│       ├── projects/        # Proyectos
│       └── talks/           # Charlas y presentaciones
└── components/              # Componentes React
    ├── bento/              # Componentes del Bento Grid
    ├── detail/             # Componentes de detalle (CodeBlock, Callout)
    └── templates/          # Plantillas de páginas
```

## 🎨 Características

### Arquitectura
- **Repository Pattern:** Desacoplamiento entre UI y origen de datos
- **Hexagonal Architecture:** Preparado para migrar a Notion u otro proveedor de contenido
- **TypeScript estricto:** Sin `any`, tipos explícitos en todas las funciones

### SEO
- ✅ Metaetiquetas completas (Open Graph, Twitter Cards)
- ✅ Sitemap.xml dinámico
- ✅ Robots.txt configurado
- ✅ Canonical URLs
- ✅ Structured data

### Contenido
- ✅ 14 posts del blog
- ✅ 7 proyectos
- ✅ 1 charla destacada
- ✅ Syntax highlighting con Shiki
- ✅ Componentes MDX personalizados (CodeBlock, Callout)

## 🛠️ Desarrollo

### Requisitos
- Node.js 18+
- pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Sstark97/ascinfo.dev.git

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev
```

### Scripts disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linter
pnpm type-check   # Verificación de tipos
```

## 📝 Añadir Contenido

### Nuevo Post

Crear un archivo `.mdx` en `src/content/posts/`:

```mdx
---
title: "Título del post"
excerpt: "Descripción breve"
date: "2024-01-15"
readingTime: "5 min"
tags: ["Tag1", "Tag2"]
featured: false
---

Contenido del post...
```

### Nuevo Proyecto

Crear un archivo `.mdx` en `src/content/projects/`:

```mdx
---
title: "Nombre del proyecto"
description: "Descripción del proyecto"
heroImage: "/images/projects/proyecto.webp"
tags: ["React", "TypeScript"]
repoUrl: "https://github.com/..."
demoUrl: "https://..."
status: "active"
featured: false
---

Contenido del proyecto...
```

### Nueva Charla

Crear un archivo `.mdx` en `src/content/talks/`:

```mdx
---
title: "Título de la charla"
event: "Nombre del evento"
date: "2024-01-15"
location: "Ciudad, País"
slidesUrl: "https://..."
videoUrl: "https://..."
tags: ["Testing", "TDD"]
featured: false
description: "Descripción"
---

Contenido opcional...
```

## 🌐 Redes Sociales

- **GitHub:** [@Sstark97](https://github.com/Sstark97)
- **LinkedIn:** [Aitor Santana](https://www.linkedin.com/in/aitorscinfo/)
- **Twitter/X:** [@aitorsci](https://www.twitter.com/aitorsci)
- **Bluesky:** [@ascinfo.dev](https://bsky.app/profile/ascinfo.dev)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

Desarrollado con ❤️ por [Aitor Santana](https://ascinfo.dev)
