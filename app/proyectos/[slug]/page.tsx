import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ProjectDetailTemplate } from "@/components/templates/project-detail-template"
import { projects, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"
import { JsonLd } from "@/components/json-ld"
import { SoftwareApplicationSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const allProjects = await projects.getAll.execute()
  return allProjects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await projects.getBySlug.execute(slug)

  if (!project) {
    return {
      title: "Proyecto no encontrado",
    }
  }

  const projectUrl = `/proyectos/${project.slug}`
  const imageUrl = project.heroImage
    ? project.heroImage.startsWith("http")
      ? project.heroImage
      : project.heroImage
    : "/og-image.png"
  const dto = project.toDto()

  return {
    title: dto.metaTitle,
    description: dto.metaDescription,
    keywords: dto.tags,
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: projectUrl,
      siteName: "Aitor Santana - ascinfo.dev",
      title: dto.metaTitle,
      description: dto.metaDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: dto.metaTitle,
        },
      ],
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
  const { slug } = await params
  const project = await projects.getBySlug.execute(slug)

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
