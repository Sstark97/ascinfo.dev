import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { talks } from "@/src/lib/content"
import { CharlasListingClient } from "./charlas-listing-client"
import { JsonLd } from "@/components/json-ld"
import { CollectionPageSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"
import type { Locale } from "@/src/lib/content/domain/types/Locale"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.talks" })
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/charlas", languages: { es: "/charlas", en: "/en/talks" } },
    openGraph: {
      title: t("ogTitle"),
      description: t("description"),
      url: "/charlas",
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

export default async function CharlasPage({ params }: Props): Promise<React.ReactElement> {
  const { locale } = await params
  setRequestLocale(locale)

  const l = locale as Locale
  const [t, tSearch] = await Promise.all([
    getTranslations("listing"),
    getTranslations("search"),
  ])

  const [allTalks, allTags] = await Promise.all([
    talks.getAll.execute(l),
    talks.getAllTags.execute(l),
  ])

  const jsonLd = CollectionPageSchemaBuilder.forTalks()
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forTalksListing()

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <CharlasListingClient
        talks={allTalks.map((talk) => talk.toDto())}
        allTags={allTags}
        title={t("talks.title")}
        subtitle={t("talks.subtitle")}
        emptyMessage={t("talks.empty")}
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
