import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { ProjectDetailTemplate } from "@/components/templates/project-detail-template"
import { projects, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"
import { JsonLd } from "@/components/json-ld"
import { SoftwareApplicationSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"
import { routing } from "@/src/i18n/routing"
import type { Locale } from "@/src/lib/content/domain/types/Locale"

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const results = await Promise.all(
    routing.locales.map(async (locale) => {
      const allProjects = await projects.getAll.execute(locale)
      return allProjects.map((project) => ({ locale, slug: project.slug }))
    })
  )
  return results.flat()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await projects.getBySlug.execute(slug, locale as Locale)

  if (!project) {
    return { title: "Proyecto no encontrado" }
  }

  const projectUrl = `/proyectos/${project.slug}`
  const imageUrl = project.heroImage ?? "/og-image.png"
  const dto = project.toDto()
  const ogLocale = locale === "en" ? "en_US" : "es_ES"

  return {
    title: dto.metaTitle,
    description: dto.metaDescription,
    keywords: dto.tags,
    alternates: { canonical: projectUrl },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: projectUrl,
      siteName: "Aitor Santana - ascinfo.dev",
      title: dto.metaTitle,
      description: dto.metaDescription,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: dto.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aitorsci",
      creator: "@aitorsci",
      title: dto.metaTitle,
      description: dto.metaDescription,
      images: [imageUrl],
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = await projects.getBySlug.execute(slug, locale as Locale)

  if (!project) {
    notFound()
  }

  const jsonLd = SoftwareApplicationSchemaBuilder.build(project)
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forProject(project.title, slug)

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <ProjectDetailTemplate project={project}>
        <MDXRemote source={project.content} components={mdxComponents} />
      </ProjectDetailTemplate>
    </>
  )
}
