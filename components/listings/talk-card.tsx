import Link from "next/link"
import { ExternalLink, PlayCircle, Calendar, MapPin } from "lucide-react"

interface TalkCardProps {
  slug: string
  title: string
  event: string
  date: string
  location: string
  slidesUrl?: string
  videoUrl?: string
  tags: string[]
}

export function TalkCard({ slug, title, event, date, location, slidesUrl, videoUrl, tags }: TalkCardProps): React.ReactElement {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#222222] transition-all duration-300 hover:border-[#fca311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]">
      {/* Top decorative stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#fca311]/0 via-[#fca311]/50 to-[#fca311]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-col gap-4 p-5 md:flex-row">
        {/* Date Badge */}
        <Link href={`/charlas/${slug}`} className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-[#2a2a2a] p-3 md:w-20">
          <span className="text-2xl font-bold text-[#fca311]">{date.split(" ")[0]}</span>
          <span className="font-mono text-xs uppercase text-[#999999]">{date.split(" ")[1]}</span>
          <span className="font-mono text-xs text-[#999999]">{date.split(" ")[2]}</span>
        </Link>

        {/* Content */}
        <Link href={`/charlas/${slug}`} className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#fca311]">
            <Calendar aria-hidden="true" className="h-3 w-3" />
            {event}
          </p>
          <h2 className="mt-1.5 text-lg font-semibold text-[#f5f5f5]">{title}</h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-[#999999]">
            <MapPin aria-hidden="true" className="h-3 w-3" />
            {location}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="rounded bg-[#2a2a2a] px-2 py-0.5 font-mono text-xs text-[#999999]">
                {tag}
              </span>
            ))}
          </div>
        </Link>

        {/* Actions */}
        <div className="flex shrink-0 flex-row gap-2 md:flex-col">
          {slidesUrl && (
            <a
              href={slidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#999999] transition-all duration-200 hover:border-[#fca311]/50 hover:text-[#fca311]"
            >
              <ExternalLink aria-hidden="true" className="h-3 w-3" />
              Slides
            </a>
          )}
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-[#fca311]/50 bg-[#fca311]/10 px-3 py-1.5 text-xs text-[#fca311] transition-all duration-200 hover:bg-[#fca311]/20"
            >
              <PlayCircle aria-hidden="true" className="h-3 w-3" />
              Video
            </a>
          )}
        </div>
      </div>

      {/* Bottom ticket perforation effect */}
      <div aria-hidden="true" className="flex justify-between px-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-[#1a1a1a]" />
        ))}
      </div>
    </article>
  )
}
