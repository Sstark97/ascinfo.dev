import React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { FeaturedPostsBlock } from "@/components/bento/featured-posts-block"
import type { PostDto } from "@/src/lib/content/application/dto/PostDto"

type HrefObject = {
  pathname?: string
  params?: Record<string, string>
  query?: Record<string, string>
}

function resolveHref(href: string | HrefObject): string {
  if (typeof href === "string") return href
  let path = href.pathname ?? ""
  if (href.params) {
    for (const [key, value] of Object.entries(href.params)) {
      path = path.replace(`[${key}]`, value)
    }
  }
  if (href.query) {
    const params = new URLSearchParams(href.query).toString()
    path = `${path}?${params}`
  }
  return path
}

vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: React.PropsWithChildren<{ href: string | HrefObject }>) => (
    <a href={resolveHref(href)} {...props}>{children}</a>
  ),
}))

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

const defaultTopTags = ["typescript", "clean-code", "tdd"]
const defaultExploreByTopicLabel = "Explore by topic"

describe("FeaturedPostsBlock", () => {
  it("should render section label", () => {
    render(
      <FeaturedPostsBlock
        posts={[]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
        viewAllLabel="View all articles"
        topTags={[]}
        exploreByTopicLabel={defaultExploreByTopicLabel}
      />
    )

    expect(screen.getByText("Featured articles")).toBeInTheDocument()
  })

  it("should render fallback and hide footer link when posts array is empty", () => {
    render(
      <FeaturedPostsBlock
        posts={[]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
        viewAllLabel="View all articles"
        topTags={[]}
        exploreByTopicLabel={defaultExploreByTopicLabel}
      />
    )

    expect(screen.getByText("—")).toBeInTheDocument()
    expect(screen.queryByText("View all articles")).not.toBeInTheDocument()
  })

  it("should render a link to /blog/{slug} for each post with title and reading time", () => {
    const postDtos = [
      createPostDto({ slug: "first-post", title: "First Post" }),
      createPostDto({ slug: "second-post", title: "Second Post" }),
    ]

    render(
      <FeaturedPostsBlock
        posts={postDtos}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
        viewAllLabel="View all articles"
        topTags={[]}
        exploreByTopicLabel={defaultExploreByTopicLabel}
      />
    )

    const blogPostLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/blog/"))
    expect(blogPostLinks).toHaveLength(2)
    expect(blogPostLinks[0]).toHaveAttribute("href", "/blog/first-post")
    expect(blogPostLinks[1]).toHaveAttribute("href", "/blog/second-post")
    expect(screen.getByText("First Post")).toBeInTheDocument()
    expect(screen.getByText("Second Post")).toBeInTheDocument()
    expect(screen.getAllByText("5 min")).toHaveLength(2)
  })

  it("should not render excerpts in list items", () => {
    const postDto = createPostDto({ excerpt: "This excerpt should NOT appear" })

    render(
      <FeaturedPostsBlock
        posts={[postDto]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
        viewAllLabel="View all articles"
        topTags={[]}
        exploreByTopicLabel={defaultExploreByTopicLabel}
      />
    )

    expect(screen.queryByText("This excerpt should NOT appear")).not.toBeInTheDocument()
  })

  it("should render a zero-padded ordinal number for each post", () => {
    const postDtos = [
      createPostDto({ slug: "a", title: "A" }),
      createPostDto({ slug: "b", title: "B" }),
      createPostDto({ slug: "c", title: "C" }),
    ]

    render(
      <FeaturedPostsBlock
        posts={postDtos}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
        viewAllLabel="View all articles"
        topTags={[]}
        exploreByTopicLabel={defaultExploreByTopicLabel}
      />
    )

    expect(screen.getByText("01")).toBeInTheDocument()
    expect(screen.getByText("02")).toBeInTheDocument()
    expect(screen.getByText("03")).toBeInTheDocument()
  })

  it("should render a zero-padded total count in the header", () => {
    const postDtos = [createPostDto({ slug: "a" }), createPostDto({ slug: "b" })]

    render(
      <FeaturedPostsBlock
        posts={postDtos}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
        viewAllLabel="View all articles"
        topTags={[]}
        exploreByTopicLabel={defaultExploreByTopicLabel}
      />
    )

    expect(screen.getByText("(02)")).toBeInTheDocument()
  })

  it("should render a footer link to /blog with the viewAll label", () => {
    const postDto = createPostDto()

    render(
      <FeaturedPostsBlock
        posts={[postDto]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
        viewAllLabel="→ View all articles"
        topTags={[]}
        exploreByTopicLabel={defaultExploreByTopicLabel}
      />
    )

    const footerLink = screen.getByRole("link", { name: "→ View all articles" })
    expect(footerLink).toHaveAttribute("href", "/blog")
  })

  it("should expose accessible reading time label via screen reader text", () => {
    const postDto = createPostDto({ readingTime: "5 min" })

    render(
      <FeaturedPostsBlock
        posts={[postDto]}
        sectionLabel="Featured articles"
        readingTimeAriaLabel={readingTimeAriaLabel}
        viewAllLabel="View all articles"
        topTags={[]}
        exploreByTopicLabel={defaultExploreByTopicLabel}
      />
    )

    expect(screen.getByText("Reading time: 5 min")).toBeInTheDocument()
  })

  describe("explore by topic section", () => {
    it("should render exploreByTopicLabel when topTags is non-empty", () => {
      const postDto = createPostDto()

      render(
        <FeaturedPostsBlock
          posts={[postDto]}
          sectionLabel="Featured articles"
          readingTimeAriaLabel={readingTimeAriaLabel}
          viewAllLabel="View all articles"
          topTags={defaultTopTags}
          exploreByTopicLabel="Explore by topic"
        />
      )

      expect(screen.getByText("Explore by topic")).toBeInTheDocument()
    })

    it("should render one link per tag with href /blog?tag={value}", () => {
      const postDto = createPostDto({ tags: [] })
      const tags = ["typescript", "tdd"]

      render(
        <FeaturedPostsBlock
          posts={[postDto]}
          sectionLabel="Featured articles"
          readingTimeAriaLabel={readingTimeAriaLabel}
          viewAllLabel="View all articles"
          topTags={tags}
          exploreByTopicLabel="Explore by topic"
        />
      )

      const typescriptLink = screen.getByRole("link", { name: "#typescript" })
      expect(typescriptLink).toHaveAttribute("href", "/blog?tag=typescript")

      const tddLink = screen.getByRole("link", { name: "#tdd" })
      expect(tddLink).toHaveAttribute("href", "/blog?tag=tdd")
    })

    it("should NOT render the explore section when topTags is empty", () => {
      const postDto = createPostDto()

      render(
        <FeaturedPostsBlock
          posts={[postDto]}
          sectionLabel="Featured articles"
          readingTimeAriaLabel={readingTimeAriaLabel}
          viewAllLabel="View all articles"
          topTags={[]}
          exploreByTopicLabel="Explore by topic"
        />
      )

      expect(screen.queryByText("Explore by topic")).not.toBeInTheDocument()
    })

    it("should render the # prefix on each tag pill", () => {
      const postDto = createPostDto({ tags: [] })

      render(
        <FeaturedPostsBlock
          posts={[postDto]}
          sectionLabel="Featured articles"
          readingTimeAriaLabel={readingTimeAriaLabel}
          viewAllLabel="View all articles"
          topTags={["typescript", "tdd"]}
          exploreByTopicLabel="Explore by topic"
        />
      )

      expect(screen.getByText("#typescript")).toBeInTheDocument()
      expect(screen.getByText("#tdd")).toBeInTheDocument()
    })
  })
})
