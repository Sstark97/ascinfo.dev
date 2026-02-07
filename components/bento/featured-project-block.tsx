"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { GithubIcon } from "@/components/icons/github-icon"
import type { ProjectStatus } from "@/src/lib/content"

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
    <Link href={`/proyectos/${slug}`} className="group block h-full focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 focus-visible:rounded-xl">
      <div className="flex h-full min-h-[200px] flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FCA311]/50 hover:shadow-lg hover:shadow-[#FCA311]/5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Proyecto destacado
          </span>
          <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FCA311]" />
        </div>

        {/* Content */}
        <div className="mt-4 flex flex-1 items-center gap-4">
          {/* GitHub Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1a] transition-colors group-hover:bg-[#FCA311]/10">
            <GithubIcon aria-hidden="true" className="h-6 w-6 text-foreground transition-colors group-hover:text-[#FCA311]" />
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
          <span className="text-sm font-medium text-[#FCA311]">Ver proyecto</span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[#FCA311] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  )
}
