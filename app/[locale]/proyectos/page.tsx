import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { projects } from "@/src/lib/content"
import { ProyectosListingClient } from "./proyectos-listing-client"
import { JsonLd } from "@/components/json-ld"
import { CollectionPageSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"
import type { Locale } from "@/src/lib/content/domain/types/Locale"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.projects" })
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/proyectos", languages: { es: "/proyectos", en: "/en/projects" } },
    openGraph: {
      title: t("ogTitle"),
      description: t("description"),
      url: "/proyectos",
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

export default async function ProyectosPage({ params }: Props): Promise<React.ReactElement> {
  const { locale } = await params
  setRequestLocale(locale)

  const l = locale as Locale
  const [t, tProject, tSearch] = await Promise.all([
    getTranslations("listing"),
    getTranslations("project"),
    getTranslations("search"),
  ])

  const [allProjects, allTags] = await Promise.all([
    projects.getAll.execute(l),
    projects.getAllTags.execute(l),
  ])

  const jsonLd = CollectionPageSchemaBuilder.forProjects()
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forProjectsListing()

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <ProyectosListingClient
        projects={allProjects.map((project) => project.toDto())}
        allTags={allTags}
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
        emptyMessage={t("projects.empty")}
        backLabel={t("backToHome")}
        projectLabels={{
          code: tProject("code"),
          demo: tProject("demo"),
          viewDetails: tProject("viewDetails"),
          statusActive: tProject("statusActive"),
          statusMaintenance: tProject("statusMaintenance"),
          statusArchived: tProject("statusArchived"),
        }}
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
