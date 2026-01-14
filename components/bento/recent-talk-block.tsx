"use client"

import Link from "next/link"
import { ArrowUpRight, Presentation } from "lucide-react"

export function RecentTalkBlock() {
  return (
    <Link href="/charlas" className="group block h-full">
      <div className="flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FCA311]/50 hover:shadow-lg hover:shadow-[#FCA311]/5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="h-4 w-4 text-muted-foreground/60" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">Charla reciente</span>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FCA311]" />
        </div>

        {/* Content - Ticket Style */}
        <div className="mt-4 flex-1">
          {/* Event Badge */}
          <div className="inline-flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FCA311]" />
            <span className="font-mono text-xs text-[#FCA311]">JSDay Canarias</span>
          </div>

          {/* Talk Title */}
          <h3 className="mt-3 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-[#FCA311]">
            TDD: Desde cero a producción
          </h3>
        </div>

        {/* Footer CTA */}
        <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
          <span className="text-sm font-medium text-[#FCA311]">Ver charlas</span>
          <ArrowUpRight className="h-4 w-4 text-[#FCA311] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  )
}
