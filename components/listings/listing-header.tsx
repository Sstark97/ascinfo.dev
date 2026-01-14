"use client"

import { Search, X } from "lucide-react"
import { useState } from "react"

interface ListingHeaderProps {
  title: string
  subtitle?: string
  tags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ListingHeader({
  title,
  subtitle,
  tags,
  selectedTags,
  onTagToggle,
  searchQuery,
  onSearchChange,
}: ListingHeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-[#1a1a1a]/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#f5f5f5] md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-[#888888]">{subtitle}</p>}
          </div>

          {/* Search Bar */}
          <div
            className={`relative flex items-center rounded-lg border bg-[#222222] transition-all duration-200 ${
              isSearchFocused ? "border-[#fca311] ring-1 ring-[#fca311]/20" : "border-white/5"
            }`}
          >
            <Search className="ml-3 h-4 w-4 text-[#888888]" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full bg-transparent px-3 py-2 text-sm text-[#f5f5f5] placeholder-[#888888] outline-none md:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="mr-2 rounded p-1 text-[#888888] hover:bg-white/5 hover:text-[#f5f5f5]"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Tag Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`rounded-full px-3 py-1 font-mono text-xs transition-all duration-200 ${
                  isSelected
                    ? "bg-[#fca311] text-[#1a1a1a]"
                    : "border border-white/10 bg-[#2a2a2a] text-[#888888] hover:border-[#fca311]/50 hover:text-[#f5f5f5]"
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
