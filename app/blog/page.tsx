import type { Metadata } from "next"
import { posts } from "@/src/lib/content"
import { BlogListingClient } from "./blog-listing-client"
import { JsonLd } from "@/components/json-ld"
import { BlogSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y buenas prácticas de programación por Aitor Santana.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Aitor Santana",
    description:
      "Artículos sobre desarrollo de software, TDD, Clean Code, arquitectura hexagonal y buenas prácticas de programación.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/aitor_profile.webp",
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
    images: ["/aitor_profile.webp"],
  },
}

export default async function BlogPage(): Promise<React.ReactElement> {
  const [allPosts, allTags] = await Promise.all([
    posts.getAll.execute(),
    posts.getAllTags.execute(),
  ])

  const jsonLd = BlogSchemaBuilder.build()
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forBlogListing()

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <BlogListingClient posts={allPosts.map((post) => post.toDto())} allTags={allTags} />
    </>
  )
}
