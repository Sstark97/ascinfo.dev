import { ArrowUpRight } from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import type { PostDto } from "@/src/lib/content/application/dto/PostDto"

type FeaturedPostsBlockProps = {
  posts: PostDto[]
  sectionLabel: string
  readingTimeAriaLabel: (minutes: string) => string
  viewAllLabel: string
  topTags: string[]
  exploreByTopicLabel: string
}

export function FeaturedPostsBlock({
  posts,
  sectionLabel,
  readingTimeAriaLabel,
  viewAllLabel,
  topTags,
  exploreByTopicLabel,
}: FeaturedPostsBlockProps): React.ReactElement {
  const formattedCount = posts.length.toString().padStart(2, "0")

  return (
    <section
      aria-label={sectionLabel}
      className="flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {sectionLabel}
        </span>
        {posts.length > 0 && (
          <span
            aria-hidden="true"
            className="font-mono text-xs text-muted-foreground/60"
          >
            ({formattedCount})
          </span>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">—</p>
      ) : (
        <ul className="mt-6 flex flex-col divide-y divide-white/5">
          {posts.map((post, index) => {
            const itemNumber = (index + 1).toString().padStart(2, "0")
            const firstTag = post.tags[0]
            return (
              <li key={post.slug}>
                <Link
                  href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                  className="group flex items-start gap-4 py-4 first:pt-0 last:pb-0 rounded focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 w-6 shrink-0 font-mono text-xs text-muted-foreground/60 transition-colors group-hover:text-[#FCA311]"
                  >
                    {itemNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <h3 className="flex-1 text-base font-medium leading-snug text-foreground line-clamp-1 transition-colors group-hover:text-[#FCA311]">
                        {post.title}
                      </h3>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FCA311]"
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80">
                      {firstTag !== undefined && <span>#{firstTag}</span>}
                      <span className="ml-auto shrink-0">
                        <span className="sr-only">{readingTimeAriaLabel(post.readingTime)}</span>
                        <span aria-hidden="true">{post.readingTime}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {topTags.length > 0 && (
        <div className="mt-6 border-t border-white/5 pt-6">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {exploreByTopicLabel}
          </span>
          <ul className="mt-3 flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <li key={tag}>
                <Link
                  href={{ pathname: "/blog", query: { tag } }}
                  className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-[#FCA311]/40 hover:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-auto pt-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 rounded"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </section>
  )
}
