import type { Metadata } from "next"
import { talks } from "@/src/lib/content"
import { CharlasListingClient } from "./charlas-listing-client"
import { JsonLd } from "@/components/json-ld"

const siteUrl = "https://ascinfo.dev"

export const metadata: Metadata = {
  title: "Charlas",
  description:
    "Charlas y ponencias de Aitor Santana sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y metodologías ágiles en conferencias y eventos técnicos.",
  alternates: {
    canonical: `${siteUrl}/charlas`,
  },
  openGraph: {
    title: "Charlas | Aitor Santana",
    description:
      "Charlas y ponencias de Aitor Santana sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y metodologías ágiles.",
    url: `${siteUrl}/charlas`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/aitor_profile.webp`,
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
    images: [`${siteUrl}/aitor_profile.webp`],
  },
}

export default async function CharlasPage(): Promise<React.ReactElement> {
  const [allTalks, allTags] = await Promise.all([
    talks.getAll.execute(),
    talks.getAllTags.execute(),
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Charlas de Aitor Santana",
    description:
      "Charlas y ponencias sobre desarrollo de software, TDD, Clean Code y arquitectura hexagonal.",
    url: `${siteUrl}/charlas`,
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
      <CharlasListingClient talks={allTalks.map((talk) => talk.toDto())} allTags={allTags} />
    </>
  )
}
