import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { TestimonialPullQuote } from "@/components/testimonials/testimonial-pull-quote"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement("img", props)
  },
}))

const makeTestimonialDto = (overrides?: Partial<TestimonialDto>): TestimonialDto => ({
  slug: "alice-example",
  author: "Alice Example",
  role: "Frontend Engineer",
  company: "Test Corp",
  quote: "This is an excellent testimonial quote.",
  locale: "es",
  linkedinUrl: "https://www.linkedin.com/in/alice-example/",
  avatarUrl: undefined,
  ...overrides,
})

describe("TestimonialPullQuote", () => {
  describe("content rendering", () => {
    it("should render the quote text", () => {
      render(
        <TestimonialPullQuote
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="View LinkedIn profile of Alice Example"
        />
      )

      expect(screen.getByText("This is an excellent testimonial quote.")).toBeInTheDocument()
    })

    it("should render the author, role and company", () => {
      render(
        <TestimonialPullQuote
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="View LinkedIn profile of Alice Example"
        />
      )

      expect(screen.getByText(/Alice Example/)).toBeInTheDocument()
      expect(screen.getByText(/Frontend Engineer/)).toBeInTheDocument()
      expect(screen.getByText(/Test Corp/)).toBeInTheDocument()
    })

    it("should render the decorative quote SVG with aria-hidden", () => {
      const { container } = render(
        <TestimonialPullQuote
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="View LinkedIn profile of Alice Example"
        />
      )

      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("aria-hidden", "true")
    })
  })

  describe("avatar rendering", () => {
    it("should render an img element when avatarUrl is provided", () => {
      const { container } = render(
        <TestimonialPullQuote
          testimonial={makeTestimonialDto({ avatarUrl: "/testimonials/alice.jpg" })}
          viewLinkedinAriaLabel="View LinkedIn profile of Alice Example"
        />
      )

      const img = container.querySelector("img")
      expect(img).not.toBeNull()
      expect(img).toHaveAttribute("src", "/testimonials/alice.jpg")
    })

    it("should render initials when avatarUrl is undefined", () => {
      render(
        <TestimonialPullQuote
          testimonial={makeTestimonialDto({ avatarUrl: undefined })}
          viewLinkedinAriaLabel="View LinkedIn profile of Alice Example"
        />
      )

      expect(screen.getByText("AE")).toBeInTheDocument()
    })
  })

  describe("link behavior", () => {
    it("should expose linkedinUrl as href with target=_blank and rel noopener noreferrer", () => {
      render(
        <TestimonialPullQuote
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="View LinkedIn profile of Alice Example"
        />
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/alice-example/")
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should expose the supplied viewLinkedinAriaLabel as accessible name", () => {
      render(
        <TestimonialPullQuote
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="View LinkedIn profile of Alice Example"
        />
      )

      const link = screen.getByRole("link", { name: "View LinkedIn profile of Alice Example" })
      expect(link).toBeInTheDocument()
    })
  })
})
