import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { TestimonialRow } from "@/components/testimonials/testimonial-row"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement("img", props)
  },
}))

const makeTestimonialDto = (overrides?: Partial<TestimonialDto>): TestimonialDto => ({
  slug: "bob-builder",
  author: "Bob Builder",
  role: "Backend Engineer",
  company: "Builder Inc",
  quote: "A solid testimonial from Bob.",
  locale: "es",
  linkedinUrl: "https://www.linkedin.com/in/bob-builder/",
  avatarUrl: undefined,
  ...overrides,
})

describe("TestimonialRow", () => {
  describe("content rendering", () => {
    it("should render quote, author, role and company", () => {
      render(
        <TestimonialRow
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="View LinkedIn profile of Bob Builder"
        />
      )

      expect(screen.getByText("A solid testimonial from Bob.")).toBeInTheDocument()
      expect(screen.getByText(/Bob Builder/)).toBeInTheDocument()
      expect(screen.getByText(/Backend Engineer/)).toBeInTheDocument()
      expect(screen.getByText(/Builder Inc/)).toBeInTheDocument()
    })

    it("should not render the ' · company' segment when company is empty", () => {
      render(
        <TestimonialRow
          testimonial={makeTestimonialDto({ company: "" })}
          viewLinkedinAriaLabel="View LinkedIn profile of Bob Builder"
        />
      )

      expect(screen.queryByText(/·/)).toBeNull()
    })
  })

  describe("avatar rendering", () => {
    it("should render initials when avatarUrl is undefined", () => {
      render(
        <TestimonialRow
          testimonial={makeTestimonialDto({ avatarUrl: undefined })}
          viewLinkedinAriaLabel="View LinkedIn profile of Bob Builder"
        />
      )

      expect(screen.getByText("BB")).toBeInTheDocument()
    })

    it("should render an img element when avatarUrl is provided", () => {
      const { container } = render(
        <TestimonialRow
          testimonial={makeTestimonialDto({ avatarUrl: "/testimonials/bob.jpg" })}
          viewLinkedinAriaLabel="View LinkedIn profile of Bob Builder"
        />
      )

      const img = container.querySelector("img")
      expect(img).not.toBeNull()
      expect(img).toHaveAttribute("src", "/testimonials/bob.jpg")
    })
  })

  describe("link behavior", () => {
    it("should expose linkedinUrl as href with target=_blank and rel noopener noreferrer", () => {
      render(
        <TestimonialRow
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="View LinkedIn profile of Bob Builder"
        />
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/bob-builder/")
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should expose the supplied viewLinkedinAriaLabel as accessible name", () => {
      render(
        <TestimonialRow
          testimonial={makeTestimonialDto()}
          viewLinkedinAriaLabel="View LinkedIn profile of Bob Builder"
        />
      )

      const link = screen.getByRole("link", { name: "View LinkedIn profile of Bob Builder" })
      expect(link).toBeInTheDocument()
    })
  })
})
