"use client"

import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"

type RecentPost = {
  slug: string
  title: string
}

type LatestArticleBlockProps = {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  recentPosts: RecentPost[]
}

export function LatestArticleBlock({ slug, title, excerpt, tags, recentPosts }: LatestArticleBlockProps): React.ReactElement {
  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] transition-all duration-300">
      {/* Featured Article Section */}
      <Link 
        href={`/blog/${slug}`} 
        className="group block p-6 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 focus-visible:rounded-t-xl"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-start justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Último artículo</span>
            </div>
            <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FCA311]" />
          </div>

          {/* Content */}
          <div className="mt-4 flex-1">
            {/* Title */}
            <h2 className="text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-[#FCA311] md:text-2xl">
              {title}
            </h2>

            {/* Snippet */}
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {excerpt}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-[#FCA311]/10 px-2.5 py-1 font-mono text-xs font-medium text-[#FCA311] transition-colors group-hover:bg-[#FCA311]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Separator */}
      {recentPosts.length > 0 && (
        <div className="border-t border-white/5" />
      )}

      {/* Recent Posts Navigation */}
      {recentPosts.length > 0 && (
        <div className="p-6 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Anteriores</span>
          </div>
          <div className="space-y-2">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group/link flex items-start gap-2 py-1.5 transition-colors hover:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 rounded"
              >
                <ChevronRight 
                  aria-hidden="true" 
                  className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground/60 transition-all duration-200 group-hover/link:text-[#FCA311] group-hover/link:translate-x-0.5" 
                />
                <span className="text-sm leading-snug text-muted-foreground transition-colors group-hover/link:text-[#FCA311]">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
