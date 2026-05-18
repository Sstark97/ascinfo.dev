import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { TestimonialsAboutSectionContent } from "@/components/testimonials/testimonials-about-section"
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
  quote: "A great testimonial from Alice.",
  locale: "es",
  linkedinUrl: "https://www.linkedin.com/in/alice-example/",
  avatarUrl: undefined,
  ...overrides,
})

const makeTestimonialsDto = (count: number): TestimonialDto[] =>
  Array.from({ length: count }, (_, index) =>
    makeTestimonialDto({
      slug: `test-author-${index + 1}`,
      author: `Test Author ${index + 1}`,
      quote: `Quote from test author ${index + 1}.`,
    })
  )

const defaultProps = {
  title: "What they say",
  subtitle: "Testimonials from colleagues.",
  sectionLabelTemplate: "{count} testimonials",
  viewLinkedinAriaLabelTemplate: "View LinkedIn profile of {author}",
}

describe("TestimonialsAboutSectionContent", () => {
  it("should return null when testimonials is empty", () => {
    const { container } = render(
      <TestimonialsAboutSectionContent testimonials={[]} {...defaultProps} />
    )

    expect(container.firstChild).toBeNull()
  })

  it("should render only the pull-quote when exactly one testimonial is provided", () => {
    const testimonials = makeTestimonialsDto(1)

    render(
      <TestimonialsAboutSectionContent testimonials={testimonials} {...defaultProps} />
    )

    expect(screen.getByText("Quote from test author 1.")).toBeInTheDocument()
    expect(screen.queryByText(/Test Author 2/)).toBeNull()
  })

  it("should render the first testimonial as pull-quote and the rest as rows when multiple are provided", () => {
    const testimonials = makeTestimonialsDto(3)

    render(
      <TestimonialsAboutSectionContent testimonials={testimonials} {...defaultProps} />
    )

    expect(screen.getByText("Quote from test author 1.")).toBeInTheDocument()
    expect(screen.getByText("Quote from test author 2.")).toBeInTheDocument()
    expect(screen.getByText("Quote from test author 3.")).toBeInTheDocument()
  })

  it("should expose id='testimonios' on the section element", () => {
    const { container } = render(
      <TestimonialsAboutSectionContent
        testimonials={makeTestimonialsDto(1)}
        {...defaultProps}
      />
    )

    const section = container.querySelector("section")
    expect(section).toHaveAttribute("id", "testimonios")
  })

  it("should interpolate the total into sectionLabelTemplate replacing {count}", () => {
    render(
      <TestimonialsAboutSectionContent
        testimonials={makeTestimonialsDto(3)}
        {...defaultProps}
        sectionLabelTemplate="{count} testimonials"
      />
    )

    expect(screen.getByText("3 testimonials")).toBeInTheDocument()
  })

  it("should interpolate each author into viewLinkedinAriaLabelTemplate replacing {author}", () => {
    const testimonials = makeTestimonialsDto(2)

    render(
      <TestimonialsAboutSectionContent
        testimonials={testimonials}
        {...defaultProps}
        viewLinkedinAriaLabelTemplate="View LinkedIn profile of {author}"
      />
    )

    expect(
      screen.getByRole("link", { name: "View LinkedIn profile of Test Author 1" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "View LinkedIn profile of Test Author 2" })
    ).toBeInTheDocument()
  })

  it("should render the subtitle paragraph only when subtitle has length > 0", () => {
    const { rerender } = render(
      <TestimonialsAboutSectionContent
        testimonials={makeTestimonialsDto(1)}
        {...defaultProps}
        subtitle="Colleagues and collaborators."
      />
    )

    expect(screen.getByText("Colleagues and collaborators.")).toBeInTheDocument()

    rerender(
      <TestimonialsAboutSectionContent
        testimonials={makeTestimonialsDto(1)}
        {...defaultProps}
        subtitle=""
      />
    )

    expect(screen.queryByText("Colleagues and collaborators.")).toBeNull()
  })
})
