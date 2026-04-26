import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ListingGrid } from "@/components/templates/listing-grid"

describe("ListingGrid", () => {
  it("should render title and subtitle", () => {
    render(
      <ListingGrid
        title="Blog Posts"
        subtitle="All my articles"
        searchAndFilter={<div />}
      >
        <div>Item 1</div>
      </ListingGrid>
    )

    expect(screen.getByText("Blog Posts")).toBeInTheDocument()
    expect(screen.getByText("All my articles")).toBeInTheDocument()
  })

  it("should render children", () => {
    render(
      <ListingGrid title="Blog" subtitle="Posts" searchAndFilter={<div />}>
        <div>React Testing Guide</div>
        <div>TypeScript Best Practices</div>
      </ListingGrid>
    )

    expect(screen.getByText("React Testing Guide")).toBeInTheDocument()
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument()
  })

  it("should render all items initially", () => {
    render(
      <ListingGrid title="Blog" subtitle="All posts" searchAndFilter={<div />}>
        <div>React Testing Guide</div>
        <div>TypeScript Best Practices</div>
        <div>Next.js Performance</div>
      </ListingGrid>
    )

    expect(screen.getByText("React Testing Guide")).toBeInTheDocument()
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument()
    expect(screen.getByText("Next.js Performance")).toBeInTheDocument()
  })

  it("should render back link with default values", () => {
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        backLabel="Volver al inicio"
        searchAndFilter={<div />}
      >
        <div />
      </ListingGrid>
    )

    const backLink = screen.getByRole("link", { name: /volver al inicio/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute("href", "/")
  })

  it("should render back link with custom values", () => {
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        backHref="/custom"
        backLabel="Back to custom"
        searchAndFilter={<div />}
      >
        <div />
      </ListingGrid>
    )

    const backLink = screen.getByRole("link", { name: /back to custom/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute("href", "/custom")
  })

  it("should render the searchAndFilter slot", () => {
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        searchAndFilter={<input placeholder="search-slot" />}
      >
        <div />
      </ListingGrid>
    )

    expect(screen.getByPlaceholderText("search-slot")).toBeInTheDocument()
  })

  it("should render empty state when no children provided", () => {
    render(
      <ListingGrid title="Blog" subtitle="Posts" searchAndFilter={<div />}>
        <p>No se encontraron resultados</p>
      </ListingGrid>
    )

    expect(screen.getByText(/no se encontraron resultados/i)).toBeInTheDocument()
  })

  it("should handle empty items array", () => {
    render(
      <ListingGrid title="Blog" subtitle="Posts" searchAndFilter={<div />}>
        <p>No se encontraron resultados</p>
      </ListingGrid>
    )

    expect(screen.getByText(/no se encontraron resultados/i)).toBeInTheDocument()
  })

  it("should render back link with default href when not provided", () => {
    render(
      <ListingGrid title="Blog" subtitle="Posts" backLabel="Home" searchAndFilter={<div />}>
        <div />
      </ListingGrid>
    )

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/")
  })
})
