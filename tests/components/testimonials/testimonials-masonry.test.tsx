import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { TestimonialsMasonry } from "@/components/testimonials/testimonials-masonry"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement("img", props)
  },
}))

vi.mock("@/src/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: unknown
    children: React.ReactNode
    [key: string]: unknown
  }) => React.createElement("a", { href: JSON.stringify(href), ...rest }, children),
}))

const makeTestimonialDto = (overrides?: Partial<TestimonialDto>): TestimonialDto => ({
  slug: "alice-example",
  author: "Alice Example",
  role: "Software Engineer",
  company: "Acme Corp",
  quote: "A great testimonial.",
  locale: "es",
  linkedinUrl: "https://www.linkedin.com/in/alice/",
  avatarUrl: undefined,
  ...overrides,
})

const makeTwoTestimonials = (): TestimonialDto[] => [
  makeTestimonialDto({ slug: "t-1", author: "Alice Example" }),
  makeTestimonialDto({ slug: "t-2", author: "Bob Builder", quote: "Another testimonial." }),
]

describe("TestimonialsMasonry", () => {
  describe("content rendering", () => {
    it("should render all supplied testimonials", () => {
      render(
        <TestimonialsMasonry
          testimonials={makeTwoTestimonials()}
          viewLinkedinAriaLabelTemplate="View {author}'s LinkedIn profile"
          viewAllLabel="View all testimonials"
          viewAllCount="({count})"
          total={11}
        />
      )

      expect(screen.getByText("A great testimonial.")).toBeInTheDocument()
      expect(screen.getByText("Another testimonial.")).toBeInTheDocument()
    })

    it("should interpolate author name in LinkedIn aria-label from template", () => {
      render(
        <TestimonialsMasonry
          testimonials={[makeTestimonialDto({ author: "Alice Example" })]}
          viewLinkedinAriaLabelTemplate="View {author}'s LinkedIn profile"
          viewAllLabel="View all testimonials"
          viewAllCount="({count})"
          total={11}
        />
      )

      expect(
        screen.getByRole("link", { name: "View Alice Example's LinkedIn profile" })
      ).toBeInTheDocument()
    })
  })

  describe("view all CTA", () => {
    it("should render a link containing the view all label and interpolated count", () => {
      render(
        <TestimonialsMasonry
          testimonials={makeTwoTestimonials()}
          viewLinkedinAriaLabelTemplate="View {author}'s LinkedIn profile"
          viewAllLabel="View all testimonials"
          viewAllCount="({count})"
          total={11}
        />
      )

      const ctaLink = screen.getByRole("link", {
        name: /View all testimonials.*\(11\)/,
      })
      expect(ctaLink).toBeInTheDocument()
      expect(ctaLink.textContent).toContain("View all testimonials")
      expect(ctaLink.textContent).toContain("(11)")
    })

    it("should interpolate the total into the count label replacing {count}", () => {
      render(
        <TestimonialsMasonry
          testimonials={makeTwoTestimonials()}
          viewLinkedinAriaLabelTemplate="View {author}'s LinkedIn profile"
          viewAllLabel="View all testimonials"
          viewAllCount="({count})"
          total={7}
        />
      )

      const ctaLink = screen.getByRole("link", {
        name: /\(7\)/,
      })
      expect(ctaLink.textContent).toContain("(7)")
    })
  })
})
