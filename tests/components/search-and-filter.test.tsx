import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { SearchAndFilter } from "@/components/search-and-filter"
import type { SearchLabels } from "@/components/search-and-filter"

describe("SearchAndFilter", () => {
  const mockTags = ["Arquitectura", "TDD", "React", "TypeScript"]
  const mockOnSearch = vi.fn()
  const mockOnTagSelect = vi.fn()

  const mockLabels: SearchLabels = {
    placeholder: "Buscar...",
    filterByTag: "Filtrar por tag",
    filteredTemplate: "Filtrado ({count})",
    tagsChecked: "tags seleccionados",
    activeFilter: "Filtro activo:",
    activeFilters: "Filtros activos:",
    clearAll: "Limpiar todo",
    noTags: "No hay tags disponibles",
    clearSearch: "Limpiar búsqueda",
    removeFilterTemplate: "Quitar filtro: {tag}",
    clearAllFilters: "Limpiar todos los filtros",
  }

  it("should render search input", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={[]}
        labels={mockLabels}
      />
    )

    expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument()
  })

  it("should render filter button", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={[]}
        labels={mockLabels}
      />
    )

    expect(screen.getByRole("button", { name: /Filtrar/i })).toBeInTheDocument()
  })

  it("should call onSearch when typing in search input", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={[]}
        labels={mockLabels}
      />
    )

    const input = screen.getByPlaceholderText("Buscar...")
    fireEvent.change(input, { target: { value: "arquitectura" } })

    expect(mockOnSearch).toHaveBeenCalledWith("arquitectura")
  })

  it("should toggle filter panel when clicking filter button", async () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={[]}
        labels={mockLabels}
      />
    )

    const filterButton = screen.getByRole("button", { name: /Filtrar/i })

    fireEvent.click(filterButton)

    const tagAfterOpen = screen.getByRole("button", { name: mockTags[0], pressed: false })
    expect(tagAfterOpen).toBeInTheDocument()

    fireEvent.click(tagAfterOpen)
    expect(mockOnTagSelect).toHaveBeenCalledWith([mockTags[0]])

    fireEvent.click(filterButton)
    fireEvent.click(filterButton)
    const tagAfterReopen = screen.getByRole("button", { name: mockTags[0], pressed: false })
    expect(tagAfterReopen).toBeInTheDocument()
  })

  it("should show active filter state when tag is selected", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={["Arquitectura"]}
        labels={mockLabels}
      />
    )

    const filterButton = screen.getByRole("button", { name: /\(1\)/i })
    expect(filterButton).toBeInTheDocument()

    const removeButton = screen.getByLabelText(/quitar filtro.*arquitectura/i)
    expect(removeButton).toBeInTheDocument()
  })

  it("should call onTagSelect when clicking a tag", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={[]}
        labels={mockLabels}
      />
    )

    const filterButton = screen.getByRole("button", { name: /Filtrar/i })
    fireEvent.click(filterButton)

    const tag = screen.getByRole("button", { name: "TDD" })
    fireEvent.click(tag)

    expect(mockOnTagSelect).toHaveBeenCalledWith(["TDD"])
  })

  it("should call onTagSelect with empty array when clicking active tag to deselect", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={["TDD"]}
        labels={mockLabels}
      />
    )

    const filterButton = screen.getByRole("button", { name: /Filtrado/i })
    fireEvent.click(filterButton)

    const tag = screen.getByRole("button", { name: "TDD", pressed: true })
    fireEvent.click(tag)

    expect(mockOnTagSelect).toHaveBeenCalledWith([])
  })

  it("should normalize duplicate tags (canonicalization)", () => {
    const duplicateTags = ["Architecture", "Arquitectura", "TDD", "Test-Driven Development"]

    render(
      <SearchAndFilter
        tags={duplicateTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={[]}
        labels={mockLabels}
      />
    )

    const filterButton = screen.getByRole("button", { name: /Filtrar/i })
    fireEvent.click(filterButton)

    const tagButtons = screen.getAllByRole("button", { pressed: false }).filter(
      (btn) => btn.closest("#filter-tags")
    )

    expect(tagButtons).toHaveLength(2)
  })

  it("should clear search when clicking X button", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={[]}
        searchQuery="test"
        labels={mockLabels}
      />
    )

    const clearButton = screen.getByLabelText(/limpiar búsqueda/i)
    fireEvent.click(clearButton)

    expect(mockOnSearch).toHaveBeenCalledWith("")
  })

  it("should clear filter when clicking X on active badge", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={["React"]}
        labels={mockLabels}
      />
    )

    const clearFilterButton = screen.getByLabelText(/quitar filtro.*react/i)
    fireEvent.click(clearFilterButton)

    expect(mockOnTagSelect).toHaveBeenCalledWith([])
  })

  it("should render all canonical tags when filter is open", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={[]}
        labels={mockLabels}
      />
    )

    const filterButton = screen.getByRole("button", { name: /Filtrar/i })
    fireEvent.click(filterButton)

    mockTags.forEach((tag) => {
      expect(screen.getByRole("button", { name: tag })).toBeInTheDocument()
    })
  })

  it("should show empty message when no tags available", () => {
    render(
      <SearchAndFilter
        tags={[]}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={[]}
        labels={mockLabels}
      />
    )

    const filterButton = screen.getByRole("button", { name: /Filtrar/i })
    fireEvent.click(filterButton)

    expect(screen.getByText(/no hay tags/i)).toBeInTheDocument()
  })

  it("should show multiple selected tags", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={["Arquitectura", "React"]}
        labels={mockLabels}
      />
    )

    const filterButton = screen.getByRole("button", { name: /\(2\)/i })
    expect(filterButton).toBeInTheDocument()

    expect(screen.getByLabelText(/quitar filtro.*arquitectura/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/quitar filtro.*react/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/limpiar todos/i)).toBeInTheDocument()
  })

  it("should clear all filters when clicking 'Limpiar todo'", () => {
    render(
      <SearchAndFilter
        tags={mockTags}
        onSearch={mockOnSearch}
        onTagSelect={mockOnTagSelect}
        selectedTags={["Arquitectura", "React", "TDD"]}
        labels={mockLabels}
      />
    )

    const clearAllButton = screen.getByLabelText(/limpiar todos/i)
    fireEvent.click(clearAllButton)

    expect(mockOnTagSelect).toHaveBeenCalledWith([])
  })
})
