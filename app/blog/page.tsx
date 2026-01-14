"use client"

import { ListingGrid } from "@/components/templates/listing-grid"
import { BlogCard } from "@/components/listings/blog-card"

// Mock data - In Astro, this would come from Content Collections via getCollection('blog')
const blogItems = [
  {
    slug: "arquitectura-hexagonal-spring",
    title: "Arquitectura Hexagonal en Spring",
    excerpt:
      "Una guía práctica para implementar arquitectura hexagonal en aplicaciones Spring Boot, separando la lógica de negocio de los detalles de infraestructura.",
    date: "15 Dic 2024",
    readingTime: "12 min",
    tags: ["Java", "Spring", "Arquitectura"],
  },
  {
    slug: "testing-junit-5",
    title: "Testing con JUnit 5: Guía Completa",
    excerpt:
      "Todo lo que necesitas saber para escribir tests efectivos con JUnit 5: desde las bases hasta técnicas avanzadas con mocks y parametrización.",
    date: "08 Nov 2024",
    readingTime: "15 min",
    tags: ["Testing", "Java", "TDD"],
  },
  {
    slug: "clean-code-principios",
    title: "Principios de Clean Code que Uso a Diario",
    excerpt:
      "Los principios de código limpio que más impacto han tenido en mi carrera como desarrollador y cómo los aplico en proyectos reales.",
    date: "22 Oct 2024",
    readingTime: "8 min",
    tags: ["Clean Code", "Best Practices"],
  },
  {
    slug: "ddd-bounded-contexts",
    title: "Domain-Driven Design: Bounded Contexts",
    excerpt:
      "Cómo identificar y definir bounded contexts en tus aplicaciones para mantener la coherencia del dominio y facilitar la evolución del sistema.",
    date: "10 Sep 2024",
    readingTime: "10 min",
    tags: ["DDD", "Arquitectura"],
  },
]

const allTags = ["Java", "Spring", "Arquitectura", "Testing", "TDD", "Clean Code", "DDD", "Best Practices"]

export default function BlogPage() {
  return (
    <ListingGrid
      title="Blog"
      subtitle="The Technical Log — Artículos sobre desarrollo de software"
      items={blogItems}
      allTags={allTags}
      getItemTags={(item) => item.tags}
      getSearchableText={(item) => `${item.title} ${item.excerpt}`}
      renderItem={(item) => <BlogCard {...item} />}
      emptyMessage="No se encontraron artículos con esos filtros."
      gridClassName="flex flex-col gap-4"
    />
  )
}
