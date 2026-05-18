import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { TestimonialCard } from "@/components/testimonials/testimonial-card"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement("img", props)
  },
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

describe("TestimonialCard", () => {
  describe("content rendering", () => {
    it("should render the quote, author, role, and company", () => {
      render(
        <TestimonialCard
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="Ver perfil de LinkedIn de Alice Example"
        />
      )

      expect(screen.getByText("A great testimonial.")).toBeInTheDocument()
      expect(screen.getByText("Alice Example")).toBeInTheDocument()
      expect(screen.getByText(/Software Engineer/)).toBeInTheDocument()
      expect(screen.getByText(/Acme Corp/)).toBeInTheDocument()
    })

    it("should render the decorative quote SVG with aria-hidden", () => {
      const { container } = render(
        <TestimonialCard
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="Ver perfil de LinkedIn de Alice Example"
        />
      )

      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("aria-hidden", "true")
    })
  })

  describe("link behavior", () => {
    it("should expose the LinkedIn URL via the anchor href with target _blank and rel noopener", () => {
      render(
        <TestimonialCard
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="Ver perfil de LinkedIn de Alice Example"
        />
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/alice/")
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should expose the supplied viewLinkedinAriaLabel as the anchor accessible name", () => {
      render(
        <TestimonialCard
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="Ver perfil de LinkedIn de Alice Example"
        />
      )

      const link = screen.getByRole("link", { name: "Ver perfil de LinkedIn de Alice Example" })
      expect(link).toBeInTheDocument()
    })
  })

  describe("avatar rendering", () => {
    it("should render initials from author name when avatarUrl is undefined", () => {
      render(
        <TestimonialCard
          testimonial={makeTestimonialDto({ avatarUrl: undefined })}
          viewLinkedinAriaLabel="Ver perfil de LinkedIn de Alice Example"
        />
      )

      expect(screen.getByText("AE")).toBeInTheDocument()
    })

    it("should render initials by slicing the first two letters for a single-word author", () => {
      render(
        <TestimonialCard
          testimonial={makeTestimonialDto({ author: "Madonna", avatarUrl: undefined })}
          viewLinkedinAriaLabel="Ver perfil de LinkedIn de Madonna"
        />
      )

      expect(screen.getByText("MA")).toBeInTheDocument()
    })

    it("should render an img element when avatarUrl is provided", () => {
      const { container } = render(
        <TestimonialCard
          testimonial={makeTestimonialDto({ avatarUrl: "/testimonials/alice.jpg" })}
          viewLinkedinAriaLabel="Ver perfil de LinkedIn de Alice Example"
        />
      )

      const img = container.querySelector("img")
      expect(img).not.toBeNull()
      expect(img).toHaveAttribute("src", "/testimonials/alice.jpg")
    })
  })
})
