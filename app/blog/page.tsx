import type { Metadata } from "next"
import { posts } from "@/src/lib/content"
import { BlogListingClient } from "./blog-listing-client"
import { JsonLd } from "@/components/json-ld"

const siteUrl = "https://ascinfo.dev"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y buenas prácticas de programación por Aitor Santana.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Blog | Aitor Santana",
    description:
      "Artículos sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y buenas prácticas de programación.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/aitor_profile.webp`,
        width: 1200,
        height: 630,
        alt: "Blog de Aitor Santana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Aitor Santana",
    description:
      "Artículos sobre desarrollo de software, TDD, Clean Code y buenas prácticas.",
    images: [`${siteUrl}/aitor_profile.webp`],
  },
}

export default async function BlogPage(): Promise<React.ReactElement> {
  const [allPosts, allTags] = await Promise.all([
    posts.getAll.execute(),
    posts.getAllTags.execute(),
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de Aitor Santana",
    description:
      "Artículos sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y buenas prácticas de programación.",
    url: `${siteUrl}/blog`,
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
      <BlogListingClient posts={allPosts.map((post) => post.toDto())} allTags={allTags} />
    </>
  )
}
