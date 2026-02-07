"use client"

import { useState, useMemo, type ReactNode } from "react"
import { SearchAndFilter } from "@/components/search-and-filter"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ListingGridProps<T> {
  title: string
  subtitle: string
  backHref?: string
  backLabel?: string
  items: T[]
  allTags: string[]
  getItemTags: (item: T) => string[]
  getSearchableText: (item: T) => string
  renderItem: (item: T) => ReactNode
  emptyMessage?: string
  gridClassName?: string
}

export function ListingGrid<T>({
  title,
  subtitle,
  backHref = "/",
  backLabel = "Volver al inicio",
  items,
  allTags,
  getItemTags,
  getSearchableText,
  renderItem,
  emptyMessage = "No se encontraron resultados con esos filtros.",
  gridClassName = "grid gap-6 md:grid-cols-2",
}: ListingGridProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" || getSearchableText(item).toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => getItemTags(item).includes(tag))

      return matchesSearch && matchesTags
    })
  }, [items, searchQuery, selectedTags, getSearchableText, getItemTags])

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Back link */}
      <div className="mx-auto max-w-6xl px-4 pt-4 md:px-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-[#888888] transition-colors hover:text-[#fca311]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      </div>

      {/* Header Section */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#1a1a1a]/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-[#f5f5f5] md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-[#888888]">{subtitle}</p>}
          </div>

          {/* Search and Filter Component */}
          <SearchAndFilter
            tags={allTags}
            onSearch={setSearchQuery}
            onTagSelect={setSelectedTags}
            selectedTags={selectedTags}
            searchQuery={searchQuery}
          />
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className={gridClassName}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => <div key={index}>{renderItem(item)}</div>)
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-[#888888]">{emptyMessage}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
