import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, Star, GitFork, Calendar, Scale } from "lucide-react"
import type { Project } from "@/src/lib/content"
import type { ReactNode } from "react"

type ProjectDetailTemplateProps = {
  project: Omit<Project, "content">
  children: ReactNode
}

const statusConfig = {
  active: { label: "Activo", color: "text-green-400", bgColor: "bg-green-500/10", dotColor: "bg-green-500" },
  maintenance: {
    label: "Mantenimiento",
    color: "text-[#fca311]",
    bgColor: "bg-[#fca311]/10",
    dotColor: "bg-[#fca311]",
  },
  archived: { label: "Archivado", color: "text-[#888888]", bgColor: "bg-[#888888]/10", dotColor: "bg-[#555555]" },
}

export function ProjectDetailTemplate({ project, children }: ProjectDetailTemplateProps): React.ReactElement {
  const { title, description, heroImage, tags, repoUrl, demoUrl, status, stars, forks, lastCommit, license } = project

  return (
    <div className="box-border min-h-screen w-full max-w-full overflow-hidden bg-[#1a1a1a] px-6 sm:px-0">
      {/* Back link */}
      <div className="mx-auto max-w-6xl pt-6 sm:px-6 md:px-8">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-1.5 text-sm text-[#888888] transition-colors hover:text-[#fca311]"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Volver a proyectos
        </Link>
      </div>

      {/* Hero Section with Screenshot */}
      <section className="mx-auto max-w-6xl py-8 sm:px-6 md:px-8">
        <div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-[#333333] bg-[#222222]">
          {/* Screenshot - using standard img for Astro compatibility */}
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={heroImage || "/placeholder.svg"}
              alt={`Screenshot de ${title}`}
              className="h-full w-full rounded-lg object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-[#222222]/60 to-transparent" />
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-8">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[status].bgColor} ${statusConfig[status].color}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[status].dotColor}`} />
                {statusConfig[status].label}
              </span>
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#444444] bg-[#1a1a1a]/80 px-2.5 py-1 font-mono text-xs text-[#aaaaaa]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-balance text-xl font-bold text-[#f5f5f5] sm:text-2xl md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-pretty text-sm text-[#aaaaaa] sm:text-base md:text-lg">{description}</p>

            {/* Action buttons */}
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#444444] bg-[#2a2a2a] px-3 py-2 text-sm font-medium text-[#f5f5f5] transition-all duration-300 hover:border-[#fca311] hover:text-[#fca311] sm:px-4 sm:py-2.5"
              >
                <Github className="h-4 w-4 shrink-0" />
                <span>GitHub</span>
              </a>
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#fca311] px-3 py-2 text-sm font-medium text-[#1a1a1a] transition-all duration-300 hover:bg-[#e5940f] sm:px-4 sm:py-2.5"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  <span>Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="mx-auto max-w-6xl pb-16 sm:px-6 md:px-8">
        <div className="grid max-w-full gap-8 lg:grid-cols-3">
          {/* Main Content - Markdown injection zone */}
          <div className="max-w-full lg:col-span-2">
            {/* 
              PROSE WRAPPER: This div receives the Markdown content as children.
              The prose classes automatically style H1, H2, p, lists, code blocks, etc.
              In Astro, you would use: <Content /> or dangerouslySetInnerHTML
            */}
            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-[#f5f5f5] prose-headings:font-semibold prose-p:text-[#aaaaaa] prose-p:leading-relaxed prose-a:text-[#fca311] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#f5f5f5] prose-code:rounded prose-code:bg-[#2a2a2a] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#fca311] prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-[#333333] prose-pre:rounded-xl prose-ul:text-[#aaaaaa] prose-ol:text-[#aaaaaa] prose-li:marker:text-[#fca311]">
              {children}
            </div>
          </div>

          {/* Sidebar - Project Stats (only show if metadata provided) */}
          <div className="max-w-full lg:col-span-1">
            <div className="sticky top-4 space-y-4 sm:space-y-6">
              {/* Stats Card - only render if any stats exist */}
              {(stars !== undefined || forks !== undefined || lastCommit || license) && (
                <div className="w-full rounded-xl border border-[#333333] bg-[#222222] p-4 sm:p-5 md:p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#888888] sm:text-sm">
                    Estadísticas
                  </h3>
                  <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                    {stars !== undefined && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-[#aaaaaa]">
                          <Star className="h-4 w-4 shrink-0 text-[#fca311]" />
                          <span>Stars</span>
                        </div>
                        <span className="font-mono text-sm text-[#f5f5f5]">{stars}</span>
                      </div>
                    )}
                    {forks !== undefined && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-[#aaaaaa]">
                          <GitFork className="h-4 w-4 shrink-0 text-[#fca311]" />
                          <span>Forks</span>
                        </div>
                        <span className="font-mono text-sm text-[#f5f5f5]">{forks}</span>
                      </div>
                    )}
                    {lastCommit && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-[#aaaaaa]">
                          <Calendar className="h-4 w-4 shrink-0 text-[#fca311]" />
                          <span>Último commit</span>
                        </div>
                        <span className="font-mono text-xs text-[#f5f5f5] sm:text-sm">{lastCommit}</span>
                      </div>
                    )}
                    {license && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-[#aaaaaa]">
                          <Scale className="h-4 w-4 shrink-0 text-[#fca311]" />
                          <span>Licencia</span>
                        </div>
                        <span className="font-mono text-sm text-[#f5f5f5]">{license}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tech Stack Card */}
              <div className="w-full rounded-xl border border-[#333333] bg-[#222222] p-4 sm:p-5 md:p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#888888] sm:text-sm">Tech Stack</h3>
                <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                  {tags.map((tech: string) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-[#444444] bg-[#1a1a1a] px-2.5 py-1.5 font-mono text-xs text-[#aaaaaa] sm:px-3 sm:py-2 sm:text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="w-full rounded-xl border border-[#333333] bg-[#222222] p-4 sm:p-5 md:p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#888888] sm:text-sm">Enlaces</h3>
                <div className="mt-3 space-y-2 sm:mt-4">
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-[#333333] bg-[#1a1a1a] px-3 py-2.5 text-sm text-[#aaaaaa] transition-all duration-300 hover:border-[#fca311] hover:text-[#fca311] sm:px-4 sm:py-3"
                  >
                    <Github className="h-4 w-4 shrink-0" />
                    <span className="truncate">Repositorio</span>
                    <ExternalLink className="ml-auto h-3 w-3 shrink-0" />
                  </a>
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-[#333333] bg-[#1a1a1a] px-3 py-2.5 text-sm text-[#aaaaaa] transition-all duration-300 hover:border-[#fca311] hover:text-[#fca311] sm:px-4 sm:py-3"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      <span className="truncate">Demo en vivo</span>
                      <ExternalLink className="ml-auto h-3 w-3 shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
