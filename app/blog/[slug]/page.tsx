import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ChevronRight } from "lucide-react"
import { postRepository, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"

type PageProps = {
  params: Promise<{ slug: string }>
}

const siteUrl = "https://ascinfo.dev"

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await postRepository.getAll()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await postRepository.getBySlug(slug)

  if (!post) {
    return {
      title: "Post no encontrado",
    }
  }

  const postUrl = `${siteUrl}/blog/${post.slug}`
  const imageUrl = `${siteUrl}/aitor_profile.webp`

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      locale: "es_ES",
      url: postUrl,
      siteName: "ascinfo.dev",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aitorsci",
      creator: "@aitorsci",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const { slug } = await params
  const post = await postRepository.getBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await postRepository.getAll()
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

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
            <Link href="/blog" className="text-[#888888] transition-colors hover:text-[#fca311]">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4 text-[#666666]" />
            <span className="truncate text-[#f5f5f5]">{post.title}</span>
          </nav>

          {/* Title */}
          <h1 className="text-balance text-3xl font-bold text-[#f5f5f5] md:text-4xl lg:text-5xl">{post.title}</h1>

          {/* Metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#888888]">
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-[#666666]" />
            <span>{post.readingTime}</span>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#2a2a2a] px-3 py-1 font-mono text-xs text-[#888888]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
        <article className="mx-auto w-full">
          <div className="max-w-none text-lg">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* Navigation */}
          {(prevPost ?? nextPost) && (
            <nav className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex flex-col items-start gap-1 text-left"
                >
                  <span className="text-xs text-[#666666]">Anterior</span>
                  <span className="text-sm text-[#888888] transition-colors group-hover:text-[#fca311]">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex flex-col items-end gap-1 text-right"
                >
                  <span className="text-xs text-[#666666]">Siguiente</span>
                  <span className="text-sm text-[#888888] transition-colors group-hover:text-[#fca311]">
                    {nextPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          )}
        </article>
      </div>
    </div>
  )
}
