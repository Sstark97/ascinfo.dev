"use client"

import { useRouter } from "next/navigation"
import { Github, ExternalLink } from "lucide-react"

interface ProjectCardProps {
  slug: string
  title: string
  description: string
  techStack: string[]
  status: "active" | "maintenance" | "archived"
  githubUrl?: string
  liveUrl?: string
  stars?: number
  forks?: number
}

const techColors: Record<string, string> = {
  Java: "text-orange-400",
  TypeScript: "text-blue-400",
  React: "text-cyan-400",
  Astro: "text-purple-400",
  Spring: "text-green-400",
  Node: "text-green-500",
  Python: "text-yellow-400",
  Docker: "text-blue-500",
}

const statusConfig = {
  active: { label: "Activo", color: "text-green-400", dotColor: "bg-green-500", glowColor: "shadow-green-500/50" },
  maintenance: {
    label: "Mantenimiento",
    color: "text-[#fca311]",
    dotColor: "bg-[#fca311]",
    glowColor: "shadow-[#fca311]/50",
  },
  archived: { label: "Archivado", color: "text-[#999999]", dotColor: "bg-[#555555]", glowColor: "" },
}

export function ProjectCard({
  slug,
  title,
  description,
  techStack,
  status,
  githubUrl,
  liveUrl,
  stars,
  forks,
}: ProjectCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/proyectos/${slug}`)
  }

  return (
    <article
      onClick={handleCardClick}
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-[#333333] bg-[#222222] p-5 transition-all duration-300 hover:border-[#fca311] hover:shadow-[0_0_30px_rgba(252,163,17,0.1)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#333333] bg-[#1a1a1a] text-[#999999] transition-all duration-300 group-hover:border-[#fca311]/50 group-hover:text-[#fca311]">
            <Github aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#f5f5f5] transition-colors duration-300 group-hover:text-[#fca311]">
              {title}
            </h3>
            {(stars !== undefined || forks !== undefined) && (
              <div className="mt-0.5 flex items-center gap-3 text-xs text-[#999999]">
                {stars !== undefined && (
                  <span className="flex items-center gap-1">
                    <svg aria-hidden="true" className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
                    </svg>
                    {stars}
                  </span>
                )}
                {forks !== undefined && (
                  <span className="flex items-center gap-1">
                    <svg aria-hidden="true" className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 0-1.5 0v.878a.25.25 0 0 1-.25.25h-1.5V4.5h.25a.75.75 0 0 0 0-1.5h-2a.75.75 0 0 0 0 1.5h.25v2h-1.5a.25.25 0 0 1-.25-.25v-.878a2.25 2.25 0 1 0-1.5 0zM8 1.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM4.75 6.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm6.5 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
                    </svg>
                    {forks}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`h-2 w-2 rounded-full ${statusConfig[status].dotColor} ${statusConfig[status].glowColor} shadow-sm`}
          />
          <span className={`text-xs ${statusConfig[status].color}`}>{statusConfig[status].label}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 flex-1 text-sm leading-relaxed text-[#999999]">{description}</p>

      {/* Tech Stack */}
      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className={`whitespace-nowrap rounded border border-[#333333] bg-[#1a1a1a] px-2 py-1 font-mono text-xs transition-all duration-300 group-hover:border-[#444444] ${techColors[tech] || "text-[#999999]"}`}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action Links */}
      <div className="mt-4 flex items-center justify-between border-t border-[#333333] pt-4">
        <div className="flex gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-md border border-[#333333] bg-[#1a1a1a] px-3 py-1.5 text-xs text-[#999999] transition-all duration-300 hover:border-[#fca311] hover:text-[#fca311]"
            >
              <Github aria-hidden="true" className="h-3.5 w-3.5" />
              Código
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-md border border-[#333333] bg-[#1a1a1a] px-3 py-1.5 text-xs text-[#999999] transition-all duration-300 hover:border-[#fca311] hover:text-[#fca311] group-hover:border-[#fca311]/50 group-hover:text-[#fca311] group-hover:shadow-[0_0_10px_rgba(252,163,17,0.2)]"
            >
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              Demo
            </a>
          )}
        </div>
        <span className="text-xs text-[#555555] transition-colors duration-300 group-hover:text-[#fca311]">
          Ver detalles →
        </span>
      </div>
    </article>
  )
}
