"use client"

import { ListingGrid } from "@/components/templates/listing-grid"
import { ProjectCard } from "@/components/listings/project-card"

// Mock data - In Astro, this would come from Content Collections via getCollection('projects')
const projectItems = [
  {
    slug: "lean-mind-tools",
    title: "Lean Mind Internal Tools",
    description:
      "Suite de herramientas internas para gestión de proyectos y automatización de flujos de trabajo del equipo.",
    techStack: ["TypeScript", "React", "Node", "Docker"],
    status: "active" as const,
    githubUrl: "https://github.com/example/lean-mind-tools",
    liveUrl: "https://tools.leanmind.es",
    stars: 42,
    forks: 12,
  },
  {
    slug: "portfolio-personal",
    title: "Personal Portfolio",
    description: "Mi portfolio personal construido con Astro y diseño inspirado en IDEs de programación.",
    techStack: ["Astro", "TypeScript", "React"],
    status: "active" as const,
    githubUrl: "https://github.com/example/portfolio",
    liveUrl: "https://example.dev",
    stars: 156,
    forks: 23,
  },
  {
    slug: "hexagonal-spring-template",
    title: "Hexagonal Spring Template",
    description: "Template de Spring Boot con arquitectura hexagonal pre-configurada y ejemplos de testing.",
    techStack: ["Java", "Spring", "Docker"],
    status: "maintenance" as const,
    githubUrl: "https://github.com/example/hex-spring",
    stars: 89,
    forks: 34,
  },
  {
    slug: "tdd-kata-runner",
    title: "TDD Kata Runner",
    description: "Aplicación web interactiva para practicar katas de TDD con feedback en tiempo real.",
    techStack: ["TypeScript", "React", "Node"],
    status: "archived" as const,
    githubUrl: "https://github.com/example/kata-runner",
    stars: 28,
    forks: 5,
  },
]

const allTags = ["TypeScript", "React", "Node", "Docker", "Astro", "Java", "Spring"]

export default function ProyectosPage() {
  return (
    <ListingGrid
      title="Proyectos"
      subtitle="Portfolio — Proyectos open source y side projects"
      items={projectItems}
      allTags={allTags}
      getItemTags={(item) => item.techStack}
      getSearchableText={(item) => `${item.title} ${item.description}`}
      renderItem={(item) => <ProjectCard {...item} />}
      emptyMessage="No se encontraron proyectos con esos filtros."
      gridClassName="grid gap-6 md:grid-cols-2"
    />
  )
}
