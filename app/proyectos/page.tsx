import type { Metadata } from "next"
import { projects } from "@/src/lib/content"
import { ProyectosListingClient } from "./proyectos-listing-client"
import { JsonLd } from "@/components/json-ld"
import { CollectionPageSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Portfolio de proyectos de software desarrollados por Aitor Santana. Aplicaciones web, herramientas open-source y experimentos con tecnologías modernas.",
  alternates: {
    canonical: "/proyectos",
  },
  openGraph: {
    title: "Proyectos | Aitor Santana",
    description:
      "Portfolio de proyectos de software desarrollados por Aitor Santana. Aplicaciones web, herramientas open-source y experimentos con tecnologías modernas.",
    url: "/proyectos",
    type: "website",
    images: [
      {
        url: "/aitor_profile.webp",
        width: 1200,
        height: 630,
        alt: "Proyectos de Aitor Santana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proyectos | Aitor Santana",
    description: "Portfolio de proyectos de software desarrollados por Aitor Santana.",
    images: ["/aitor_profile.webp"],
  },
}

export default async function ProyectosPage(): Promise<React.ReactElement> {
  const [allProjects, allTags] = await Promise.all([
    projects.getAll.execute(),
    projects.getAllTags.execute(),
  ])

  const jsonLd = CollectionPageSchemaBuilder.forProjects()
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forProjectsListing()

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <ProyectosListingClient projects={allProjects.map((project) => project.toDto())} allTags={allTags} />
    </>
  )
}
