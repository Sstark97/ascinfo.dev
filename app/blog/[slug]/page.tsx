import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { posts as postsUseCases, mdxComponents } from "@/src/lib/content"
import { MDXRemote } from "next-mdx-remote/rsc"
import { BlogHeader } from "@/components/detail/blog-header"
import { BlogNavigation } from "@/components/detail/blog-navigation"
import { JsonLd } from "@/components/json-ld"
import { BlogPostingSchemaBuilder } from "@/src/lib/seo"
import { BreadcrumbSchemaBuilder } from "@/src/lib/seo/schema-builders/BreadcrumbSchemaBuilder"

type PageProps = {
  params: Promise<{ slug: string }>
}

const siteUrl = "https://ascinfo.dev"

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const allPosts = await postsUseCases.getAll.execute()
  return allPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await postsUseCases.getBySlug.execute(slug)

  if (!post) {
    return {
      title: "Post no encontrado",
    }
  }

  const postUrl = `${siteUrl}/blog/${post.slug}`
  const imageUrl = `${siteUrl}/aitor_profile.webp`
  const dto = post.toDto()

  return {
    title: dto.metaTitle,
    description: dto.metaDescription,
    keywords: dto.focusKeyword
      ? [dto.focusKeyword, ...dto.tags]
      : dto.tags,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      locale: "es_ES",
      url: postUrl,
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

export default async function BlogDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([
    postsUseCases.getBySlug.execute(slug),
    postsUseCases.getAll.execute(),
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
        <BlogHeader
          title={post.title}
          date={post.date}
          readingTime={post.readingTime}
          tags={post.tags}
          plainTextContent={post.plainTextContent}
        />

        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
          <article className="mx-auto w-full">
            <div className="max-w-none text-lg">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            <BlogNavigation prevPost={prevPost} nextPost={nextPost} />
          </article>
        </div>
      </div>
    </>
  )
}
