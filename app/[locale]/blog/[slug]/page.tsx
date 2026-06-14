import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { posts as postsUseCases, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"
import { BlogHeader } from "@/components/detail/blog-header"
import { BlogNavigation } from "@/components/detail/blog-navigation"
import { ReadingProgressBar } from "@/components/detail/reading-progress-bar"
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button"
import { JsonLd } from "@/components/json-ld"
import { BlogPostingSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"
import { routing } from "@/src/i18n/routing"
import type { Locale } from "@/src/lib/content/domain/types/Locale"

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const results = await Promise.all(
    routing.locales.map(async (locale) => {
      const allPosts = await postsUseCases.getAll.execute(locale)
      return allPosts.map((post) => ({ locale, slug: post.slug }))
    })
  )
  return results.flat()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await postsUseCases.getBySlug.execute(slug, locale as Locale)

  if (!post) {
    return { title: "Post no encontrado" }
  }

  const postUrl = `/blog/${post.slug}`
  const dto = post.toDto()
  const ogLocale = locale === "en" ? "en_US" : "es_ES"

  return {
    title: dto.metaTitle,
    description: dto.metaDescription,
    keywords: dto.focusKeyword ? [dto.focusKeyword, ...dto.tags] : dto.tags,
    alternates: { canonical: postUrl },
    openGraph: {
      type: "article",
      locale: ogLocale,
      url: postUrl,
      siteName: "Aitor Santana - ascinfo.dev",
      title: dto.metaTitle,
      description: dto.metaDescription,
      publishedTime: dto.date,
      tags: dto.tags,
    },
    twitter: {
      card: "summary_large_image",
      site: "@aitorsci",
      creator: "@aitorsci",
      title: dto.metaTitle,
      description: dto.metaDescription,
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const l = locale as Locale

  const [post, allPosts, tBreadcrumbs, tTts] = await Promise.all([
    postsUseCases.getBySlug.execute(slug, l),
    postsUseCases.getAll.execute(l),
    getTranslations("breadcrumbs"),
    getTranslations("tts"),
  ])

  if (!post) {
    notFound()
  }

  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  const jsonLd = BlogPostingSchemaBuilder.build(post)
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forBlogPost(post.title, post.slug)

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen bg-[#1a1a1a]">
        <ReadingProgressBar targetId="article-content" />
        <BlogHeader
          title={post.title}
          date={post.date}
          readingTime={post.readingTime}
          tags={post.tags}
          plainTextContent={post.plainTextContent}
          homeLabel={tBreadcrumbs("home")}
          blogLabel={tBreadcrumbs("blog")}
          ttsLabels={{
            listen: tTts("listen"),
            pause: tTts("pause"),
            resume: tTts("resume"),
            unavailable: tTts("unavailable"),
          }}
        />

        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
          <article id="article-content" className="mx-auto w-full">
            <div className="max-w-none text-lg">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            <BlogNavigation prevPost={prevPost} nextPost={nextPost} />
          </article>
        </div>
        <ScrollToTopButton />
      </div>
    </>
  )
}
