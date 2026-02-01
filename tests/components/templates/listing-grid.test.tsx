import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ListingGrid } from "@/components/templates/listing-grid"

interface TestItem {
  id: string
  title: string
  tags: string[]
}

const mockItems: TestItem[] = [
  { id: "1", title: "React Testing Guide", tags: ["react", "testing"] },
  { id: "2", title: "TypeScript Best Practices", tags: ["typescript"] },
  { id: "3", title: "Next.js Performance", tags: ["nextjs", "react"] },
]

describe("ListingGrid", () => {
  it("should render all items initially", () => {
    render(
      <ListingGrid
        title="Blog"
        subtitle="All posts"
        items={mockItems}
        allTags={["react", "testing", "typescript", "nextjs"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    expect(screen.getByText("React Testing Guide")).toBeInTheDocument()
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument()
    expect(screen.getByText("Next.js Performance")).toBeInTheDocument()
  })

  it("should render title and subtitle", () => {
    render(
      <ListingGrid
        title="Blog Posts"
        subtitle="All my articles"
        items={mockItems}
        allTags={["react"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    expect(screen.getByText("Blog Posts")).toBeInTheDocument()
    expect(screen.getByText("All my articles")).toBeInTheDocument()
  })

  it("should render back link with default values", () => {
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["react"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
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
        items={mockItems}
        allTags={["react"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    const backLink = screen.getByRole("link", { name: /back to custom/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute("href", "/custom")
  })

  it("should filter items by search query", async () => {
    const user = userEvent.setup()
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["react", "testing", "typescript", "nextjs"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    const searchInput = screen.getByPlaceholderText(/buscar/i)
    await user.type(searchInput, "testing")

    // Only items with "testing" in the title should appear
    expect(screen.getByText("React Testing Guide")).toBeInTheDocument()
    expect(screen.queryByText("TypeScript Best Practices")).not.toBeInTheDocument()
    expect(screen.queryByText("Next.js Performance")).not.toBeInTheDocument()
  })

  it("should filter items by tag", async () => {
    const user = userEvent.setup()
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["react", "testing", "typescript", "nextjs"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    const typescriptTag = screen.getByRole("button", { name: /typescript/i })
    await user.click(typescriptTag)

    expect(screen.queryByText("React Testing Guide")).not.toBeInTheDocument()
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument()
    expect(screen.queryByText("Next.js Performance")).not.toBeInTheDocument()
  })

  it("should filter by multiple tags (OR logic)", async () => {
    const user = userEvent.setup()
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["react", "testing", "typescript", "nextjs"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    // Open filter panel
    const filterButton = screen.getByRole("button", { name: /Tags/i })
    await user.click(filterButton)

    // Select "react" and "testing" tags
    const reactTag = screen.getByRole("button", { name: "react", pressed: false })
    const testingTag = screen.getByRole("button", { name: "testing", pressed: false })

    await user.click(reactTag)
    await user.click(testingTag)

    // Should show items that have either 'react' OR 'testing'
    expect(screen.getByText("React Testing Guide")).toBeInTheDocument()
    expect(screen.queryByText("TypeScript Best Practices")).not.toBeInTheDocument()
    expect(screen.getByText("Next.js Performance")).toBeInTheDocument()
  })

  it("should combine search and tag filters (AND logic)", async () => {
    const user = userEvent.setup()
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["react", "testing", "typescript", "nextjs"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    const searchInput = screen.getByPlaceholderText(/buscar/i)
    await user.type(searchInput, "react")

    const testingTag = screen.getByRole("button", { name: /testing/i })
    await user.click(testingTag)

    // Should show items that match search AND have the tag
    expect(screen.getByText("React Testing Guide")).toBeInTheDocument()
    expect(screen.queryByText("TypeScript Best Practices")).not.toBeInTheDocument()
    expect(screen.queryByText("Next.js Performance")).not.toBeInTheDocument()
  })

  it("should show empty state when no results", async () => {
    const user = userEvent.setup()
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["react", "testing", "typescript", "nextjs"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    const searchInput = screen.getByPlaceholderText(/buscar/i)
    await user.type(searchInput, "nonexistent")

    expect(screen.getByText(/no se encontraron resultados/i)).toBeInTheDocument()
    expect(screen.queryByText("React Testing Guide")).not.toBeInTheDocument()
  })

  it("should show custom empty message", async () => {
    const user = userEvent.setup()
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["react"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
        emptyMessage="Custom empty message"
      />
    )

    const searchInput = screen.getByPlaceholderText(/buscar/i)
    await user.type(searchInput, "nonexistent")

    expect(screen.getByText("Custom empty message")).toBeInTheDocument()
  })

  it("should clear search filter when input is cleared", async () => {
    const user = userEvent.setup()
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["react"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    const searchInput = screen.getByPlaceholderText(/buscar/i)
    await user.type(searchInput, "react")

    expect(screen.queryByText("TypeScript Best Practices")).not.toBeInTheDocument()

    await user.clear(searchInput)

    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument()
  })

  it("should toggle tags on and off", async () => {
    const user = userEvent.setup()
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["typescript"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    const typescriptTag = screen.getByRole("button", { name: /typescript/i })

    // Click to filter
    await user.click(typescriptTag)
    expect(screen.queryByText("React Testing Guide")).not.toBeInTheDocument()
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument()

    // Click again to remove filter
    await user.click(typescriptTag)
    expect(screen.getByText("React Testing Guide")).toBeInTheDocument()
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument()
  })

  it("should handle empty items array", () => {
    render(
      <ListingGrid<TestItem>
        title="Blog"
        subtitle="Posts"
        items={[]}
        allTags={["react"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    expect(screen.getByText(/no se encontraron resultados/i)).toBeInTheDocument()
  })

  it("should be case insensitive for search", async () => {
    const user = userEvent.setup()
    render(
      <ListingGrid
        title="Blog"
        subtitle="Posts"
        items={mockItems}
        allTags={["react"]}
        getItemTags={(item) => item.tags}
        getSearchableText={(item) => item.title}
        renderItem={(item) => <div>{item.title}</div>}
      />
    )

    const searchInput = screen.getByPlaceholderText(/buscar/i)
    await user.type(searchInput, "TYPESCRIPT")

    // Should match "TypeScript" case-insensitively
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument()
    expect(screen.queryByText("React Testing Guide")).not.toBeInTheDocument()
  })
})
