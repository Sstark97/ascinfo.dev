import { notFound } from "next/navigation"
import { ProjectDetailTemplate } from "@/components/templates/project-detail-template"
import type { ProjectFrontmatter } from "@/types/content"

// Mock data - In Astro, this would come from Content Collections
const projectsData: Record<
  string,
  ProjectFrontmatter & { content: { problem: string; solution: string; howToRun: string[] } }
> = {
  "lean-mind-tools": {
    title: "Lean Mind Internal Tools",
    description:
      "Un conjunto completo de herramientas diseñadas para optimizar los procesos internos del equipo de Lean Mind.",
    heroImage: "/modern-dark-dashboard-interface-project-management.jpg",
    tags: ["TypeScript", "React", "Node", "Docker"],
    repoUrl: "https://github.com/example/lean-mind-tools",
    demoUrl: "https://tools.leanmind.es",
    status: "active",
    stars: 42,
    forks: 12,
    lastCommit: "hace 2 días",
    license: "MIT",
    content: {
      problem:
        "El equipo de Lean Mind necesitaba una forma centralizada de gestionar proyectos, clientes y horas de trabajo sin depender de múltiples herramientas externas que no se integraban bien entre sí.",
      solution:
        "Desarrollé una suite de herramientas internas que integra gestión de proyectos, tracking de tiempo, generación de informes y automatización de facturación en una única plataforma construida con arquitectura hexagonal.",
      howToRun: [
        "git clone https://github.com/example/lean-mind-tools.git",
        "cd lean-mind-tools",
        "docker-compose up -d",
        "npm install && npm run dev",
      ],
    },
  },
  "portfolio-personal": {
    title: "Personal Portfolio",
    description: "Portfolio personal con un diseño único inspirado en los IDEs de programación modernos.",
    heroImage: "/dark-developer-portfolio-bento-grid.jpg",
    tags: ["Astro", "TypeScript", "React"],
    repoUrl: "https://github.com/example/portfolio",
    demoUrl: "https://example.dev",
    status: "active",
    stars: 156,
    forks: 23,
    lastCommit: "hace 1 semana",
    license: "MIT",
    content: {
      problem:
        "Necesitaba un portfolio que reflejara mi identidad como desarrollador y que fuera técnicamente impresionante mientras mantenía un rendimiento excepcional.",
      solution:
        "Construí un portfolio con Astro para máximo rendimiento, usando un diseño Bento Grid inspirado en IDEs modernos con animaciones sutiles y una paleta de colores coherente.",
      howToRun: ["git clone https://github.com/example/portfolio.git", "cd portfolio", "npm install", "npm run dev"],
    },
  },
  "hexagonal-spring-template": {
    title: "Hexagonal Spring Template",
    description: "Un template completo de Spring Boot que implementa arquitectura hexagonal con ejemplos de testing.",
    heroImage: "/clean-architecture-hexagonal-diagram.jpg",
    tags: ["Java", "Spring", "Docker"],
    repoUrl: "https://github.com/example/hex-spring",
    status: "maintenance",
    stars: 89,
    forks: 34,
    lastCommit: "hace 1 mes",
    license: "Apache 2.0",
    content: {
      problem:
        "Cada vez que empezaba un nuevo proyecto en Java con Spring Boot, tenía que configurar manualmente la arquitectura hexagonal, el testing y las herramientas de desarrollo.",
      solution:
        "Creé un template reutilizable que incluye toda la configuración necesaria para empezar un proyecto con arquitectura hexagonal, incluyendo ejemplos de tests en todos los niveles.",
      howToRun: ["git clone https://github.com/example/hex-spring.git", "cd hex-spring", "./gradlew bootRun"],
    },
  },
  "tdd-kata-runner": {
    title: "TDD Kata Runner",
    description: "Una plataforma educativa para practicar Test-Driven Development a través de katas de programación.",
    heroImage: "/code-editor-tdd-testing-interface.jpg",
    tags: ["TypeScript", "React", "Node"],
    repoUrl: "https://github.com/example/kata-runner",
    status: "archived",
    stars: 28,
    forks: 5,
    lastCommit: "hace 6 meses",
    license: "MIT",
    content: {
      problem:
        "Los desarrolladores que quieren aprender TDD a menudo no tienen un entorno seguro para practicar con feedback inmediato.",
      solution:
        "Desarrollé una aplicación web que guía a los usuarios a través de katas de TDD, detectando automáticamente en qué fase del ciclo se encuentran.",
      howToRun: [
        "git clone https://github.com/example/kata-runner.git",
        "cd kata-runner",
        "npm install",
        "npm run dev",
      ],
    },
  },
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projectData = projectsData[slug]

  if (!projectData) {
    notFound()
  }

  const { content, ...frontmatter } = projectData

  return (
    <ProjectDetailTemplate frontmatter={frontmatter}>
      {/* 
        MARKDOWN CONTENT ZONE
        In Astro, replace this with: <Content />
        The prose wrapper in the template will automatically style all HTML
      */}
      <h2>El Problema</h2>
      <p>{content.problem}</p>

      <h2>La Solución</h2>
      <p>{content.solution}</p>

      <h2>Cómo ejecutar</h2>
      <pre>
        <code>
          {content.howToRun.map((line, i) => (
            <span key={i} className="block">
              <span className="text-[#fca311]">$</span> {line}
            </span>
          ))}
        </code>
      </pre>
    </ProjectDetailTemplate>
  )
}
