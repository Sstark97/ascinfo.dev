import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { FeaturedPostsBlock } from "@/components/bento/featured-posts-block"
import type { PostDto } from "@/src/lib/content/application/dto/PostDto"

const createPostDto = (overrides?: Partial<PostDto>): PostDto => ({
  slug: "test-post",
  title: "Test post",
  excerpt: "Excerpt of the test post",
  date: "2024-01-15",
  lastModified: "2024-01-15",
  readingTime: "5 min",
  tags: ["typescript"],
  featured: true,
  content: "...",
  plainTextContent: "...",
  metaTitle: "Test post",
  metaDescription: "Excerpt of the test post",
  ...overrides,
})

const readingTimeAriaLabel = (time: string): string => `Reading time: ${time}`

describe("FeaturedPostsBlock", () => {
  it("should render section label", () => {
    render(
      <FeaturedPostsBlock
        posts={[]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
      />
    )

    expect(screen.getByText("Featured articles")).toBeInTheDocument()
  })

  it("should render fallback when posts array is empty", () => {
    render(
      <FeaturedPostsBlock
        posts={[]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
      />
    )

    expect(screen.getByText("—")).toBeInTheDocument()
  })

  it("should render a link to /blog/{slug} for each post with title, excerpt and reading time", () => {
    const postDtos = [
      createPostDto({ slug: "first-post", title: "First Post", excerpt: "First excerpt" }),
      createPostDto({ slug: "second-post", title: "Second Post", excerpt: "Second excerpt" }),
    ]

    render(
      <FeaturedPostsBlock
        posts={postDtos}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
      />
    )

    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute("href", "/blog/first-post")
    expect(links[1]).toHaveAttribute("href", "/blog/second-post")
    expect(screen.getByText("First Post")).toBeInTheDocument()
    expect(screen.getByText("First excerpt")).toBeInTheDocument()
    expect(screen.getByText("Second Post")).toBeInTheDocument()
    expect(screen.getByText("Second excerpt")).toBeInTheDocument()
    expect(screen.getAllByText("5 min")).toHaveLength(2)
  })

  it("should render primary tag chip when post has tags", () => {
    const postDto = createPostDto({ tags: ["typescript", "testing"] })

    render(
      <FeaturedPostsBlock
        posts={[postDto]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
      />
    )

    expect(screen.getByText("typescript")).toBeInTheDocument()
    expect(screen.queryByText("testing")).not.toBeInTheDocument()
  })

  it("should not render tag chip when post has no tags", () => {
    const postDto = createPostDto({ tags: [] })

    render(
      <FeaturedPostsBlock
        posts={[postDto]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
      />
    )

    expect(screen.queryByRole("listitem")).toBeInTheDocument()
    expect(screen.getByText("5 min")).toBeInTheDocument()
  })

  it("should expose accessible reading time label via screen reader text", () => {
    const postDto = createPostDto({ readingTime: "5 min" })

    render(
      <FeaturedPostsBlock
        posts={[postDto]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
      />
    )

    expect(screen.getByText("Reading time: 5 min")).toBeInTheDocument()
  })
})
