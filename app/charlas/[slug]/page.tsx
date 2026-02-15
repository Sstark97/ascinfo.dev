import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { talks, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"
import { TalkHeader } from "@/components/detail/talk-header"
import { JsonLd } from "@/components/json-ld"
import { EventSchemaBuilder, VideoSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const allTalks = await talks.getAll.execute()
  return allTalks.map((talk) => ({ slug: talk.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const talk = await talks.getBySlug.execute(slug)

  if (!talk) {
    return {
      title: "Charla no encontrada",
    }
  }

  const talkUrl = `/charlas/${talk.slug}`
  const imageUrl = "/aitor_profile.webp"
  const dto = talk.toDto()

  return {
    title: dto.metaTitle,
    description: dto.metaDescription,
    keywords: dto.tags,
    alternates: {
      canonical: talkUrl,
    },
    openGraph: {
      type: "article",
      locale: "es_ES",
      url: talkUrl,
      siteName: "Aitor Santana - ascinfo.dev",
      title: dto.metaTitle,
      description: dto.metaDescription,
      publishedTime: dto.date,
      tags: dto.tags,
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

export default async function TalkDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const { slug } = await params
  const talk = await talks.getBySlug.execute(slug)

  if (!talk) {
    notFound()
  }

  const eventSchema = EventSchemaBuilder.build(talk)
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forTalk(talk.title, slug)
  const videoSchema = talk.videoUrl ? VideoSchemaBuilder.build(talk) : null

  return (
    <>
      <JsonLd data={eventSchema} />
      <JsonLd data={breadcrumbSchema} />
      {videoSchema && <JsonLd data={videoSchema} />}
      <div className="min-h-screen bg-[#1a1a1a]">
        <TalkHeader
          title={talk.title}
          date={talk.date}
          location={talk.location}
          event={talk.event}
          tags={talk.tags}
          plainTextContent={talk.plainTextContent}
          slidesUrl={talk.slidesUrl}
          videoUrl={talk.videoUrl}
        />

        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
          <article className="mx-auto w-full">
            <div className="max-w-none text-lg">
              <MDXRemote source={talk.content} components={mdxComponents} />
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
