import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { talks, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"
import { TalkHeader } from "@/components/detail/talk-header"
import { JsonLd } from "@/components/json-ld"
import { EventSchemaBuilder } from "@/src/lib/seo"

type PageProps = {
  params: Promise<{ slug: string }>
}

const siteUrl = "https://ascinfo.dev"

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

  const talkUrl = `${siteUrl}/charlas/${talk.slug}`
  const imageUrl = `${siteUrl}/aitor_profile.webp`

  return {
    title: talk.title,
    description: talk.description,
    keywords: talk.tags,
    alternates: {
      canonical: talkUrl,
    },
    openGraph: {
      type: "article",
      locale: "es_ES",
      url: talkUrl,
      siteName: "ascinfo.dev",
      title: talk.title,
      description: talk.description ?? "",
      publishedTime: talk.date,
      tags: talk.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: talk.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aitorsci",
      creator: "@aitorsci",
      title: talk.title,
      description: talk.description ?? "",
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

  const jsonLd = EventSchemaBuilder.build(talk)

  return (
    <>
      <JsonLd data={jsonLd} />
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
