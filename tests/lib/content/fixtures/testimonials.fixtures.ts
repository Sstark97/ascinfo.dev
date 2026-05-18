import { Testimonial, type TestimonialFrontmatter } from "@/content/domain/entities/Testimonial"
import type { RawTestimonial } from "@/content/infrastructure/InMemoryTestimonialRepository"

export const mockTestimonialFrontmatter: TestimonialFrontmatter = {
  author: "Test Author One",
  role: "Test Role",
  company: "Test Company",
  quote: "Synthetic ES quote.",
  locale: "es",
  linkedinUrl: "https://www.linkedin.com/in/test-1/",
  avatarUrl: "/avatars/test-1.jpg",
}

export const mockTestimonialWithCompany = Testimonial.create("test-author-1", {
  ...mockTestimonialFrontmatter,
})

export const mockTestimonialNoCompany = Testimonial.create("test-author-2", {
  author: "Test Author Two",
  role: "Another Test Role",
  company: "",
  locale: "es",
  quote: "Another synthetic quote.",
  linkedinUrl: "https://www.linkedin.com/in/test-2/",
  avatarUrl: undefined,
})

export const mockTestimonialsEs: Testimonial[] = [
  Testimonial.create("test-first", {
    ...mockTestimonialFrontmatter,
    author: "Test Author One",
    quote: "First synthetic quote.",
  }),
  Testimonial.create("test-second", {
    ...mockTestimonialFrontmatter,
    author: "Test Author Two",
    quote: "Second synthetic quote.",
  }),
]

export const mockTestimonialsEn: Testimonial[] = [
  Testimonial.create("test-first", {
    ...mockTestimonialFrontmatter,
    locale: "en",
    author: "Test Author One",
    quote: "First synthetic quote in English.",
  }),
  Testimonial.create("test-second", {
    ...mockTestimonialFrontmatter,
    locale: "en",
    author: "Test Author Two",
    quote: "Second synthetic quote in English.",
  }),
]

export const mockTestimonials: Testimonial[] = [mockTestimonialWithCompany, mockTestimonialNoCompany]

export const syntheticRawTestimonials: ReadonlyArray<RawTestimonial> = [
  {
    slug: "synthetic-author-one",
    author: "Synthetic Author One",
    role: "Synthetic Role One",
    company: "Synthetic Company",
    linkedinUrl: "https://www.linkedin.com/in/synthetic-1/",
    avatarUrl: "/avatars/synthetic-1.jpg",
    quoteEs: "Primera cita sintética en español.",
    quoteEn: "First synthetic quote in English.",
  },
  {
    slug: "synthetic-author-two",
    author: "Synthetic Author Two",
    role: "Synthetic Role Two",
    company: "",
    linkedinUrl: "https://www.linkedin.com/in/synthetic-2/",
    avatarUrl: "/avatars/synthetic-2.jpg",
    quoteEs: "Segunda cita sintética en español.",
    quoteEn: "Second synthetic quote in English.",
  },
  {
    slug: "synthetic-author-three",
    author: "Synthetic Author Three",
    role: "Synthetic Role Three",
    company: "Another Synthetic Company",
    linkedinUrl: "https://www.linkedin.com/in/synthetic-3/",
    avatarUrl: "/avatars/synthetic-3.jpg",
    quoteEs: "Tercera cita sintética en español.",
    quoteEn: "Third synthetic quote in English.",
  },
]
