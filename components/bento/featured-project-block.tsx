"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { ProjectStatus } from "@/src/lib/content"

function GithubIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Active", color: "text-green-500", bgColor: "bg-green-400" },
  maintenance: { label: "Maintenance", color: "text-[#FCA311]", bgColor: "bg-[#FCA311]" },
  archived: { label: "Archived", color: "text-gray-500", bgColor: "bg-gray-400" },
}

type FeaturedProjectBlockProps = {
  slug: string
  title: string
  status: ProjectStatus
}

export function FeaturedProjectBlock({ slug, title, status }: FeaturedProjectBlockProps): React.ReactElement {
  const statusInfo = statusConfig[status]

  return (
    <Link href={`/proyectos/${slug}`} className="group block h-full">
      <div className="flex h-full min-h-[200px] flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FCA311]/50 hover:shadow-lg hover:shadow-[#FCA311]/5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">
            Proyecto destacado
          </span>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FCA311]" />
        </div>

        {/* Content */}
        <div className="mt-4 flex flex-1 items-center gap-4">
          {/* GitHub Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1a] transition-colors group-hover:bg-[#FCA311]/10">
            <GithubIcon className="h-6 w-6 text-foreground transition-colors group-hover:text-[#FCA311]" />
          </div>

          <div className="min-w-0 flex-1">
            {/* Title */}
            <h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-[#FCA311]">
              {title}
            </h3>

            {/* Status */}
            <div className="mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {status === "active" && (
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusInfo.bgColor} opacity-75`} />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${statusInfo.bgColor}`} />
              </span>
              <span className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
          <span className="text-sm font-medium text-[#FCA311]">Ver proyectos</span>
          <ArrowUpRight className="h-4 w-4 text-[#FCA311] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  )
}
