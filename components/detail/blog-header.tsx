import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { TextToSpeechButton } from "./text-to-speech-button"

interface BlogHeaderProps {
  title: string
  date: string
  readingTime: string
  tags: string[]
  plainTextContent: string
}

export function BlogHeader({ title, date, readingTime, tags, plainTextContent }: BlogHeaderProps) {
  return (
    <header className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm">
          <Link href="/" className="text-[#999999] transition-colors hover:text-[#fca311] focus-visible:text-[#fca311]">
            Inicio
          </Link>
          <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#999999]" />
          <Link href="/blog" className="text-[#999999] transition-colors hover:text-[#fca311] focus-visible:text-[#fca311]">
            Blog
          </Link>
          <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#999999]" />
          <span aria-current="page" className="truncate text-[#f5f5f5]">{title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-balance text-3xl font-bold text-[#f5f5f5] md:text-4xl lg:text-5xl">{title}</h1>

        {/* Metadata */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#999999]">
          <span>{date}</span>
          <span className="h-1 w-1 rounded-full bg-[#999999]" />
          <span>{readingTime}</span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#2a2a2a] px-3 py-1 font-mono text-xs text-[#999999]">
              {tag}
            </span>
          ))}
        </div>

        {/* TTS Button */}
        <div className="mt-6">
          <TextToSpeechButton text={plainTextContent} />
        </div>
      </div>
    </header>
  )
}
