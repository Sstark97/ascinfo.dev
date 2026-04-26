"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ListingGridProps {
  title: string
  subtitle: string
  backHref?: string
  backLabel?: string
  searchAndFilter: ReactNode
  children: ReactNode
}

export function ListingGrid({
  title,
  subtitle,
  backHref = "/",
  backLabel = "Back",
  searchAndFilter,
  children,
}: ListingGridProps) {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="mx-auto max-w-6xl px-4 pt-4 md:px-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-[#888888] transition-colors hover:text-[#fca311]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      </div>

      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#1a1a1a]/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-[#f5f5f5] md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-[#888888]">{subtitle}</p>}
          </div>
          {searchAndFilter}
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {children}
      </main>
    </div>
  )
}
