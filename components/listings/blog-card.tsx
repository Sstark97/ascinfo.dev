import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BlogCardProps {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  tags: string[]
}

export function BlogCard({ slug, title, excerpt, date, readingTime, tags }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 focus-visible:rounded-xl">
      <article className="flex flex-col gap-4 rounded-xl border border-white/5 bg-[#222222] p-5 transition-all duration-300 hover:border-[#fca311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)] md:flex-row md:items-start">
        {/* Date Column */}
        <div className="shrink-0 md:w-24">
          <time className="font-mono text-xs text-[#999999]">{date}</time>
          <p className="mt-1 font-mono text-xs text-[#999999]">{readingTime}</p>
        </div>

        {/* Content Column */}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-[#f5f5f5] transition-colors duration-200 group-hover:text-[#fca311]">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#999999]">{excerpt}</p>
        </div>

        {/* Tags Column */}
        <div className="flex shrink-0 flex-wrap items-start gap-1 md:w-32 md:flex-col md:items-end">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded bg-[#2a2a2a] px-2 py-0.5 font-mono text-xs text-[#999999]">
              {tag}
            </span>
          ))}
        </div>

        {/* Arrow */}
        <div className="hidden shrink-0 items-center md:flex">
          <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#999999] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#fca311]" />
        </div>
      </article>
    </Link>
  )
}
