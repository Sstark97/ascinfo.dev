"use client"

import { Search, X, Filter, Check } from "lucide-react"
import { useState } from "react"

const TAG_ALIASES: Record<string, string> = {
  "Architecture": "Arquitectura",
  "Software Architecture": "Arquitectura de Software",
  "Hexagonal Architecture": "Arquitectura Hexagonal",
  "Software Design": "Diseño de Software",
  "Design Patterns": "Patrones de Diseño",
  "Clean Code": "Código Limpio",
  "Testing": "Testing",
  "TDD": "TDD",
  "Test-Driven Development": "TDD",
  "TypeScript": "TypeScript",
  "JavaScript": "JavaScript",
  "C#": "C#",
  "Rust": "Rust",
  "Java": "Java",
  "Spring": "Spring",
  "React": "React",
  "Next.js": "Next.js",
  "Astro": "Astro",
  "Frontend": "Frontend",
  "Backend": "Backend",
  ".NET": ".NET",
  "Node.js": "Node.js",
  "DevOps": "DevOps",
  "Docker": "Docker",
  "Git": "Git",
  "Refactoring": "Refactoring",
  "DDD": "DDD",
  "Domain-Driven Design": "DDD",
  "Functional Programming": "Programación Funcional",
  "OOP": "POO",
  "Object-Oriented Programming": "POO",
  "SOLID": "SOLID",
  "Career": "Carrera",
  "Soft Skills": "Habilidades Blandas",
  "Junior": "Junior",
  "Talk": "Charla",
  "Conference": "Conferencia",
  "Meetup": "Meetup",
  "Open Source": "Open Source",
  "Side Project": "Proyecto Personal",
  "CLI": "CLI",
  "Web": "Web",
  "API": "API",
}

export interface SearchLabels {
  placeholder: string
  filterByTag: string
  filteredTemplate: string
  tagsChecked: string
  activeFilter: string
  activeFilters: string
  clearAll: string
  noTags: string
  clearSearch: string
  removeFilterTemplate: string
  clearAllFilters: string
}

type SearchAndFilterProps = {
  tags: string[]
  onSearch: (query: string) => void
  onTagSelect: (tags: string[]) => void
  selectedTags: string[]
  searchQuery?: string
  labels: SearchLabels
}

export function SearchAndFilter({
  tags,
  onSearch,
  onTagSelect,
  selectedTags,
  searchQuery = "",
  labels,
}: SearchAndFilterProps): React.ReactElement {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const canonicalTags = Array.from(new Set(tags.map((tag) => TAG_ALIASES[tag] ?? tag)))

  const hasActiveFilters = selectedTags.length > 0

  const handleTagToggle = (tag: string): void => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter((t) => t !== tag))
    } else {
      onTagSelect([...selectedTags, tag])
    }
  }

  const clearAllFilters = (): void => {
    onTagSelect([])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search Bar */}
        <div
          className={`relative flex flex-1 items-center rounded-lg border bg-[#222222] transition-all duration-200 ${
            isSearchFocused ? "border-[#fca311] ring-1 ring-[#fca311]/20" : "border-white/5"
          }`}
        >
          <Search className="ml-3 h-4 w-4 text-[#888888]" />
          <input
            type="text"
            placeholder={labels.placeholder}
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full bg-transparent px-3 py-2 text-sm text-[#f5f5f5] placeholder-[#888888] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearch("")}
              className="mr-2 rounded p-1 text-[#888888] hover:bg-white/5 hover:text-[#f5f5f5]"
              aria-label={labels.clearSearch}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-sm transition-all duration-200 ${
            hasActiveFilters
              ? "border-[#fca311] bg-[#fca311] text-[#1a1a1a] hover:bg-[#fca311]/90"
              : "border-white/10 bg-[#2a2a2a] text-[#888888] hover:border-[#fca311]/50 hover:text-[#f5f5f5]"
          }`}
          aria-expanded={isFilterOpen}
          aria-controls="filter-tags"
        >
          {hasActiveFilters ? (
            <>
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.filteredTemplate.replace("{count}", String(selectedTags.length))}</span>
              <span className="sm:hidden">{labels.tagsChecked}</span>
            </>
          ) : (
            <>
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.filterByTag}</span>
              <span className="sm:hidden">Tags</span>
            </>
          )}
        </button>
      </div>

      {/* Selected Tags Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-[#888888]">
            {selectedTags.length === 1 ? labels.activeFilter : labels.activeFilters}
          </span>
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#fca311] px-3 py-1 font-mono text-xs text-[#1a1a1a] transition-all hover:bg-[#fca311]/90"
              aria-label={labels.removeFilterTemplate.replace("{tag}", tag)}
            >
              {tag}
              <X className="h-3 w-3" />
            </button>
          ))}
          {selectedTags.length > 1 && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#2a2a2a] px-3 py-1 font-mono text-xs text-[#888888] transition-all hover:border-[#fca311]/50 hover:text-[#f5f5f5]"
              aria-label={labels.clearAllFilters}
            >
              {labels.clearAll}
            </button>
          )}
        </div>
      )}

      {/* Collapsible Tag List */}
      <div
        id="filter-tags"
        className={`rounded-lg border border-white/5 bg-[#222222] transition-all duration-300 ease-in-out ${
          isFilterOpen
            ? "max-h-[60vh] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden border-transparent"
        }`}
      >
        <div
          className={`scrollbar-custom flex flex-wrap gap-2 p-4 pr-3 ${
            isFilterOpen ? "overflow-y-auto overscroll-contain" : "overflow-hidden"
          }`}
          style={{ maxHeight: isFilterOpen ? "60vh" : "0" }}
        >
          <div className="flex flex-wrap gap-2 w-full">
            {canonicalTags.length > 0 ? (
              canonicalTags.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`rounded-full px-3 py-1 font-mono text-xs transition-all duration-200 ${
                      isSelected
                        ? "bg-[#fca311] text-[#1a1a1a] ring-2 ring-[#fca311]/30"
                        : "border border-white/10 bg-[#2a2a2a] text-[#888888] hover:border-[#fca311]/50 hover:bg-[#2a2a2a]/80 hover:text-[#f5f5f5]"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {tag}
                  </button>
                )
              })
            ) : (
              <p className="text-sm text-[#888888]">{labels.noTags}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
