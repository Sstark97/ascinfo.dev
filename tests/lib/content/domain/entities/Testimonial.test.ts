import { describe, it, expect } from "vitest"
import { Testimonial, type TestimonialFrontmatter } from "@/content/domain/entities/Testimonial"

const createTestimonialFrontmatter = (
  overrides?: Partial<TestimonialFrontmatter>
): TestimonialFrontmatter => ({
  author: "Alice Example",
  role: "Software Engineer",
  company: "Acme Corp",
  quote: "A great testimonial.",
  locale: "es",
  linkedinUrl: "https://www.linkedin.com/in/alice/",
  ...overrides,
})

describe("Testimonial", () => {
  describe("create() static method", () => {
    it("should create a Testimonial instance with all required fields", () => {
      const frontmatter = createTestimonialFrontmatter()

      const testimonial = Testimonial.create("alice-example", frontmatter)

      expect(testimonial).toBeInstanceOf(Testimonial)
      expect(testimonial.slug).toBe("alice-example")
      expect(testimonial.author).toBe("Alice Example")
      expect(testimonial.role).toBe("Software Engineer")
      expect(testimonial.company).toBe("Acme Corp")
      expect(testimonial.quote).toBe("A great testimonial.")
      expect(testimonial.locale).toBe("es")
      expect(testimonial.linkedinUrl).toBe("https://www.linkedin.com/in/alice/")
    })

    it("should carry avatarUrl through when provided", () => {
      const frontmatter = createTestimonialFrontmatter({
        avatarUrl: "/testimonials/alice.jpg",
      })

      const testimonial = Testimonial.create("alice", frontmatter)

      expect(testimonial.avatarUrl).toBe("/testimonials/alice.jpg")
    })

    it("should leave avatarUrl as undefined when omitted", () => {
      const frontmatter = createTestimonialFrontmatter()

      const testimonial = Testimonial.create("alice", frontmatter)

      expect(testimonial.avatarUrl).toBeUndefined()
    })

    it("should create a Testimonial with locale set to en", () => {
      const frontmatter = createTestimonialFrontmatter({ locale: "en" })

      const testimonial = Testimonial.create("alice-en", frontmatter)

      expect(testimonial.locale).toBe("en")
    })
  })

  describe("toDto()", () => {
    it("should return a plain object with all fields preserved", () => {
      const frontmatter = createTestimonialFrontmatter({
        avatarUrl: "/testimonials/alice.jpg",
      })
      const testimonial = Testimonial.create("alice-example", frontmatter)

      const dto = testimonial.toDto()

      expect(dto).toEqual({
        slug: "alice-example",
        author: "Alice Example",
        role: "Software Engineer",
        company: "Acme Corp",
        quote: "A great testimonial.",
        locale: "es",
        linkedinUrl: "https://www.linkedin.com/in/alice/",
        avatarUrl: "/testimonials/alice.jpg",
      })
    })

    it("should include avatarUrl as undefined when not set", () => {
      const frontmatter = createTestimonialFrontmatter()
      const testimonial = Testimonial.create("alice", frontmatter)

      const dto = testimonial.toDto()

      expect(dto.avatarUrl).toBeUndefined()
    })
  })
})
