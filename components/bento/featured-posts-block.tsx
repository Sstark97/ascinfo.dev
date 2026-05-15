import Link from "next/link"
import { ArrowUpRight, Clock } from "lucide-react"
import type { PostDto } from "@/src/lib/content/application/dto/PostDto"

type FeaturedPostsBlockProps = {
  posts: PostDto[]
  sectionLabel: string
  readingTimeAriaLabel: (minutes: string) => string
}

export function FeaturedPostsBlock({
  posts,
  sectionLabel,
  readingTimeAriaLabel,
}: FeaturedPostsBlockProps): React.ReactElement {
  return (
    <section
      aria-label={sectionLabel}
      className="flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {sectionLabel}
        </span>
      </div>

      {posts.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">—</p>
      ) : (
        <ul className="mt-4 flex flex-1 flex-col divide-y divide-white/5">
          {posts.map((post) => {
            const primaryTag = post.tags[0]
            return (
              <li key={post.slug} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-[#FCA311]">
                      {post.title}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FCA311]"
                    />
                  </div>

                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    {primaryTag !== undefined && (
                      <span className="inline-block rounded-full bg-[#FCA311]/10 px-2 py-0.5 font-mono text-[11px] font-medium text-[#FCA311]">
                        {primaryTag}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      <Clock aria-hidden="true" className="h-3 w-3" />
                      <span className="sr-only">{readingTimeAriaLabel(post.readingTime)}</span>
                      <span aria-hidden="true">{post.readingTime}</span>
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
