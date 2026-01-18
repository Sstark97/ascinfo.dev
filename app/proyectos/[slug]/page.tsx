import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ProjectDetailTemplate } from "@/components/templates/project-detail-template"
import { projects, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"
import { JsonLd } from "@/components/json-ld"

type PageProps = {
  params: Promise<{ slug: string }>
}

const siteUrl = "https://ascinfo.dev"

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

  const projectUrl = `${siteUrl}/proyectos/${project.slug}`
  const imageUrl = project.heroImage
    ? project.heroImage.startsWith("http")
      ? project.heroImage
      : `${siteUrl}${project.heroImage}`
    : `${siteUrl}/og-image.png`

  return {
    title: project.title,
    description: project.description,
    keywords: project.tags,
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: projectUrl,
      siteName: "ascinfo.dev",
      title: project.title,
      description: project.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aitorsci",
      creator: "@aitorsci",
      title: project.title,
      description: project.description,
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

  const imageUrl = project.heroImage
    ? project.heroImage.startsWith("http")
      ? project.heroImage
      : `${siteUrl}${project.heroImage}`
    : `${siteUrl}/og-image.png`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    url: `${siteUrl}/proyectos/${project.slug}`,
    image: imageUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: "Aitor Santana Cabrera",
      url: siteUrl,
    },
    ...(project.repoUrl && { codeRepository: project.repoUrl }),
    ...(project.demoUrl && {
      offers: {
        "@type": "Offer",
        url: project.demoUrl,
        price: "0",
        priceCurrency: "EUR",
      },
    }),
    keywords: project.tags.join(", "),
    inLanguage: "es-ES",
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProjectDetailTemplate project={project}>
        <MDXRemote source={project.content} components={mdxComponents} />
      </ProjectDetailTemplate>
    </>
  )
}
