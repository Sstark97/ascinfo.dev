"use client"

import { Search, X, Filter, Check } from "lucide-react"
import { useState, useMemo } from "react"

// Mapa de alias para normalizar tags duplicados (inglés/español)
const TAG_ALIASES: Record<string, string> = {
  // Architecture
  "Architecture": "Arquitectura",
  "Software Architecture": "Arquitectura de Software",
  "Hexagonal Architecture": "Arquitectura Hexagonal",
  
  // Design
  "Software Design": "Diseño de Software",
  "Design Patterns": "Patrones de Diseño",
  "Clean Code": "Código Limpio",
  
  // Testing
  "Testing": "Testing",
  "TDD": "TDD",
  "Test-Driven Development": "TDD",
  
  // Languages
  "TypeScript": "TypeScript",
  "JavaScript": "JavaScript",
  "C#": "C#",
  "Rust": "Rust",
  "Java": "Java",
  "Spring": "Spring",
  
  // Frontend
  "React": "React",
  "Next.js": "Next.js",
  "Astro": "Astro",
  "Frontend": "Frontend",
  
  // Backend
  "Backend": "Backend",
  ".NET": ".NET",
  "Node.js": "Node.js",
  
  // DevOps
  "DevOps": "DevOps",
  "Docker": "Docker",
  "Git": "Git",
  
  // Concepts
  "Refactoring": "Refactoring",
  "DDD": "DDD",
  "Domain-Driven Design": "DDD",
  "Functional Programming": "Programación Funcional",
  "OOP": "POO",
  "Object-Oriented Programming": "POO",
  "SOLID": "SOLID",
  
  // Career
  "Career": "Carrera",
  "Soft Skills": "Habilidades Blandas",
  "Junior": "Junior",
  
  // Talks
  "Talk": "Charla",
  "Conference": "Conferencia",
  "Meetup": "Meetup",
  
  // Projects
  "Open Source": "Open Source",
  "Side Project": "Proyecto Personal",
  "CLI": "CLI",
  "Web": "Web",
  "API": "API",
}

type SearchAndFilterProps = {
  tags: string[]
  onSearch: (query: string) => void
  onTagSelect: (tags: string[]) => void
  selectedTags: string[]
  searchQuery?: string
}

/**
 * Componente reutilizable para búsqueda y filtrado por tags.
 * Incluye canonicalización de tags (normalización de duplicados inglés/español)
 * y UI colapsable con Progressive Disclosure.
 * Soporta selección múltiple de tags (lógica OR).
 */
export function SearchAndFilter({
  tags,
  onSearch,
  onTagSelect,
  selectedTags,
  searchQuery = "",
}: SearchAndFilterProps): React.ReactElement {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Canonicalizar tags: normalizar usando el mapa de aliases
  const canonicalTags = useMemo(() => {
    const normalized = tags.map((tag) => TAG_ALIASES[tag] ?? tag)
    // Eliminar duplicados manteniendo el orden
    return Array.from(new Set(normalized))
  }, [tags])

  // Determinar si hay filtros activos
  const hasActiveFilters = selectedTags.length > 0

  // Manejar toggle de tag (agregar o quitar)
  const handleTagToggle = (tag: string): void => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter((t) => t !== tag))
    } else {
      onTagSelect([...selectedTags, tag])
    }
  }

  // Limpiar todos los filtros
  const clearAllFilters = (): void => {
    onTagSelect([])
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y botón de filtro */}
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
            placeholder="Buscar..."
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
              aria-label="Limpiar búsqueda"
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
              <span className="hidden sm:inline">Filtrado ({selectedTags.length})</span>
              <span className="sm:hidden">Tags ✓</span>
            </>
          ) : (
            <>
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrar por tag</span>
              <span className="sm:hidden">Tags</span>
            </>
          )}
        </button>
      </div>

      {/* Selected Tags Badges (always visible when active) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-[#888888]">
            {selectedTags.length === 1 ? "Filtro activo:" : "Filtros activos:"}
          </span>
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#fca311] px-3 py-1 font-mono text-xs text-[#1a1a1a] transition-all hover:bg-[#fca311]/90"
              aria-label={`Quitar filtro: ${tag}`}
            >
              {tag}
              <X className="h-3 w-3" />
            </button>
          ))}
          {selectedTags.length > 1 && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#2a2a2a] px-3 py-1 font-mono text-xs text-[#888888] transition-all hover:border-[#fca311]/50 hover:text-[#f5f5f5]"
              aria-label="Limpiar todos los filtros"
            >
              Limpiar todo
            </button>
          )}
        </div>
      )}

      {/* Collapsible Tag List */}
      <div
        id="filter-tags"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap gap-2 rounded-lg border border-white/5 bg-[#222222] p-4">
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
            <p className="text-sm text-[#888888]">No hay tags disponibles</p>
          )}
        </div>
      </div>
    </div>
  )
}
