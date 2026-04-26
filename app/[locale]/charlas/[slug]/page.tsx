import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { talks, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"
import { TalkHeader } from "@/components/detail/talk-header"
import { JsonLd } from "@/components/json-ld"
import { EventSchemaBuilder, VideoSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"
import { routing } from "@/src/i18n/routing"
import type { Locale } from "@/src/lib/content/domain/types/Locale"

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const results = await Promise.all(
    routing.locales.map(async (locale) => {
      const allTalks = await talks.getAll.execute(locale)
      return allTalks.map((talk) => ({ locale, slug: talk.slug }))
    })
  )
  return results.flat()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const talk = await talks.getBySlug.execute(slug, locale as Locale)

  if (!talk) {
    return { title: "Charla no encontrada" }
  }

  const talkUrl = `/charlas/${talk.slug}`
  const imageUrl = "/aitor_profile.webp"
  const dto = talk.toDto()
  const ogLocale = locale === "en" ? "en_US" : "es_ES"

  return {
    title: dto.metaTitle,
    description: dto.metaDescription,
    keywords: dto.tags,
    alternates: { canonical: talkUrl },
    openGraph: {
      type: "article",
      locale: ogLocale,
      url: talkUrl,
      siteName: "Aitor Santana - ascinfo.dev",
      title: dto.metaTitle,
      description: dto.metaDescription,
      publishedTime: dto.date,
      tags: dto.tags,
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

export default async function TalkDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [talk, tBreadcrumbs, tTts, tTalks] = await Promise.all([
    talks.getBySlug.execute(slug, locale as Locale),
    getTranslations("breadcrumbs"),
    getTranslations("tts"),
    getTranslations("talks"),
  ])

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
          homeLabel={tBreadcrumbs("home")}
          talksLabel={tBreadcrumbs("talks")}
          slidesLabel={tTalks("slides")}
          videoLabel={tTalks("video")}
          ttsLabels={{
            listen: tTts("listen"),
            pause: tTts("pause"),
            resume: tTts("resume"),
            unavailable: tTts("unavailable"),
          }}
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
