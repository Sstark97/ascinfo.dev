import Link from "next/link"
import { ChevronRight, Calendar, MapPin, Presentation, Video } from "lucide-react"
import { TextToSpeechButton } from "./text-to-speech-button"

interface TalkHeaderProps {
  title: string
  date: string
  location: string
  event: string
  tags: string[]
  plainTextContent: string
  slidesUrl?: string
  videoUrl?: string
}

export function TalkHeader({ title, date, location, event, tags, plainTextContent, slidesUrl, videoUrl }: TalkHeaderProps) {
  return (
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
          <span className="truncate text-[#f5f5f5]">{title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-balance text-3xl font-bold text-[#f5f5f5] md:text-4xl lg:text-5xl">{title}</h1>

        {/* Event Info */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#888888]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <span className="h-1 w-1 rounded-full bg-[#666666]" />
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>

        {/* Event Name */}
        <div className="mt-3">
          <span className="inline-block rounded-full bg-[#fca311]/10 px-3 py-1 text-sm font-medium text-[#fca311]">
            {event}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#2a2a2a] px-3 py-1 font-mono text-xs text-[#888888]">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        {(slidesUrl || videoUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {slidesUrl && (
              <a
                href={slidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#444444] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-[#f5f5f5] transition-all duration-300 hover:border-[#fca311] hover:text-[#fca311]"
              >
                <Presentation className="h-4 w-4" />
                <span>Ver diapositivas</span>
              </a>
            )}
            {videoUrl && (
              <a
                href={videoUrl}
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

        {/* TTS Button */}
        <div className="mt-6">
          <TextToSpeechButton text={plainTextContent} />
        </div>
      </div>
    </header>
  )
}
