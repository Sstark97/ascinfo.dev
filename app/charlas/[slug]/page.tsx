import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ChevronRight, Calendar, MapPin, Presentation, Video } from "lucide-react"
import { talkRepository, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"

type PageProps = {
  params: Promise<{ slug: string }>
}

const siteUrl = "https://ascinfo.dev"

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const talks = await talkRepository.getAll()
  return talks.map((talk) => ({ slug: talk.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const talk = await talkRepository.getBySlug(slug)

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
  const talk = await talkRepository.getBySlug(slug)

  if (!talk) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-1 text-sm">
            <Link href="/" className="text-[#888888] transition-colors hover:text-[#fca311]">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 text-[#666666]" />
            <Link href="/charlas" className="text-[#888888] transition-colors hover:text-[#fca311]">
              Charlas
            </Link>
            <ChevronRight className="h-4 w-4 text-[#666666]" />
            <span className="truncate text-[#f5f5f5]">{talk.title}</span>
          </nav>

          {/* Title */}
          <h1 className="text-balance text-3xl font-bold text-[#f5f5f5] md:text-4xl lg:text-5xl">{talk.title}</h1>

          {/* Event Info */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#888888]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{talk.date}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-[#666666]" />
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{talk.location}</span>
            </div>
          </div>

          {/* Event Name */}
          <div className="mt-3">
            <span className="inline-block rounded-full bg-[#fca311]/10 px-3 py-1 text-sm font-medium text-[#fca311]">
              {talk.event}
            </span>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {talk.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#2a2a2a] px-3 py-1 font-mono text-xs text-[#888888]">
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          {(talk.slidesUrl || talk.videoUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {talk.slidesUrl && (
                <a
                  href={talk.slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#444444] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-[#f5f5f5] transition-all duration-300 hover:border-[#fca311] hover:text-[#fca311]"
                >
                  <Presentation className="h-4 w-4" />
                  <span>Ver diapositivas</span>
                </a>
              )}
              {talk.videoUrl && (
                <a
                  href={talk.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#fca311] px-4 py-2 text-sm font-medium text-[#1a1a1a] transition-all duration-300 hover:bg-[#e5940f]"
                >
                  <Video className="h-4 w-4" />
                  <span>Ver video</span>
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <article className="mx-auto w-full">
          <div className="max-w-none text-lg">
            <MDXRemote source={talk.content} components={mdxComponents} />
          </div>
        </article>
      </div>
    </div>
  )
}
