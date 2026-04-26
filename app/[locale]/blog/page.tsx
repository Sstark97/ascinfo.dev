import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { posts } from "@/src/lib/content"
import { BlogListingClient } from "./blog-listing-client"
import { JsonLd } from "@/components/json-ld"
import { BlogSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"
import type { Locale } from "@/src/lib/content/domain/types/Locale"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.blog" })
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/blog", languages: { es: "/blog", en: "/en/blog" } },
    openGraph: {
      title: t("ogTitle"),
      description: t("description"),
      url: "/blog",
      type: "website",
      images: [{ url: "/aitor_profile.webp", width: 1200, height: 630, alt: t("ogTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("twitterDescription"),
      images: ["/aitor_profile.webp"],
    },
  }
}

export default async function BlogPage({ params }: Props): Promise<React.ReactElement> {
  const { locale } = await params
  setRequestLocale(locale)

  const l = locale as Locale
  const [t, tSearch] = await Promise.all([
    getTranslations("listing"),
    getTranslations("search"),
  ])

  const [allPosts, allTags] = await Promise.all([
    posts.getAll.execute(l),
    posts.getAllTags.execute(l),
  ])

  const jsonLd = BlogSchemaBuilder.build()
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forBlogListing()

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <BlogListingClient
        posts={allPosts.map((post) => post.toDto())}
        allTags={allTags}
        title={t("blog.title")}
        subtitle={t("blog.subtitle")}
        emptyMessage={t("blog.empty")}
        backLabel={t("backToHome")}
        searchLabels={{
          placeholder: tSearch("placeholder"),
          filterByTag: tSearch("filterByTag"),
          filteredTemplate: tSearch("filtered", { count: "{count}" }),
          tagsChecked: tSearch("tagsChecked"),
          activeFilter: tSearch("activeFilter"),
          activeFilters: tSearch("activeFilters"),
          clearAll: tSearch("clearAll"),
          noTags: tSearch("noTags"),
          clearSearch: tSearch("clearSearch"),
          removeFilterTemplate: tSearch("removeFilter", { tag: "{tag}" }),
          clearAllFilters: tSearch("clearAllFilters"),
        }}
      />
    </>
  )
}
