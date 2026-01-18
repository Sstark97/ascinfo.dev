import type { Metadata } from "next"
import { projects } from "@/src/lib/content"
import { ProyectosListingClient } from "./proyectos-listing-client"
import { JsonLd } from "@/components/json-ld"

const siteUrl = "https://ascinfo.dev"

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Portfolio de proyectos de software desarrollados por Aitor Santana. Aplicaciones web, herramientas open-source y experimentos con tecnologías modernas.",
  alternates: {
    canonical: `${siteUrl}/proyectos`,
  },
  openGraph: {
    title: "Proyectos | Aitor Santana",
    description:
      "Portfolio de proyectos de software desarrollados por Aitor Santana. Aplicaciones web, herramientas open-source y experimentos con tecnologías modernas.",
    url: `${siteUrl}/proyectos`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/aitor_profile.webp`,
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
    images: [`${siteUrl}/aitor_profile.webp`],
  },
}

export default async function ProyectosPage(): Promise<React.ReactElement> {
  const [allProjects, allTags] = await Promise.all([
    projects.getAll.execute(),
    projects.getAllTags.execute(),
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Proyectos de Aitor Santana",
    description: "Portfolio de proyectos de software desarrollados por Aitor Santana.",
    url: `${siteUrl}/proyectos`,
    author: {
      "@type": "Person",
      name: "Aitor Santana Cabrera",
      url: siteUrl,
    },
    inLanguage: "es-ES",
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProyectosListingClient projects={allProjects.map((project) => project.toDto())} allTags={allTags} />
    </>
  )
}
