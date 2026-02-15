import type { Metadata } from "next"
import { talks } from "@/src/lib/content"
import { CharlasListingClient } from "./charlas-listing-client"
import { JsonLd } from "@/components/json-ld"
import { CollectionPageSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"

export const metadata: Metadata = {
  title: "Charlas",
  description:
    "Charlas y ponencias de Aitor Santana sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y metodologías ágiles en conferencias y eventos técnicos.",
  alternates: {
    canonical: "/charlas",
  },
  openGraph: {
    title: "Charlas | Aitor Santana",
    description:
      "Charlas y ponencias de Aitor Santana sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y metodologías ágiles.",
    url: "/charlas",
    type: "website",
    images: [
      {
        url: "/aitor_profile.webp",
        width: 1200,
        height: 630,
        alt: "Charlas de Aitor Santana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charlas | Aitor Santana",
    description:
      "Charlas y ponencias de Aitor Santana sobre desarrollo de software y buenas prácticas.",
    images: ["/aitor_profile.webp"],
  },
}

export default async function CharlasPage(): Promise<React.ReactElement> {
  const [allTalks, allTags] = await Promise.all([
    talks.getAll.execute(),
    talks.getAllTags.execute(),
  ])

  const jsonLd = CollectionPageSchemaBuilder.forTalks()
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forTalksListing()

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <CharlasListingClient talks={allTalks.map((talk) => talk.toDto())} allTags={allTags} />
    </>
  )
}
