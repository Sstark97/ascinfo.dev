import { describe, it, expect } from "vitest"
import { InMemoryTestimonialRepository } from "@/content/infrastructure/InMemoryTestimonialRepository"
import { syntheticRawTestimonials } from "@fixtures/testimonials.fixtures"

describe("InMemoryTestimonialRepository", () => {
  describe("readAll()", () => {
    describe("with synthetic constructor data", () => {
      it("should return all entries provided in the constructor", async () => {
        const repo = new InMemoryTestimonialRepository(syntheticRawTestimonials)

        const result = await repo.readAll("es")

        expect(result).toHaveLength(syntheticRawTestimonials.length)
      })

      it("should return ES quotes when locale is 'es'", async () => {
        const repo = new InMemoryTestimonialRepository(syntheticRawTestimonials)

        const result = await repo.readAll("es")

        result.forEach((testimonial, index) => {
          expect(testimonial.quote).toBe(syntheticRawTestimonials[index].quoteEs)
        })
      })

      it("should return EN quotes when locale is 'en'", async () => {
        const repo = new InMemoryTestimonialRepository(syntheticRawTestimonials)

        const result = await repo.readAll("en")

        result.forEach((testimonial, index) => {
          expect(testimonial.quote).toBe(syntheticRawTestimonials[index].quoteEn)
        })
      })

      it("should set the locale field to match the requested locale", async () => {
        const repo = new InMemoryTestimonialRepository(syntheticRawTestimonials)

        const result = await repo.readAll("en")

        for (const testimonial of result) {
          expect(testimonial.locale).toBe("en")
        }
      })

      it("should preserve slug and author from raw data", async () => {
        const repo = new InMemoryTestimonialRepository(syntheticRawTestimonials)

        const result = await repo.readAll("es")

        expect(result[0].slug).toBe(syntheticRawTestimonials[0].slug)
        expect(result[0].author).toBe(syntheticRawTestimonials[0].author)
      })

      it("should return results in stable order across calls", async () => {
        const repo = new InMemoryTestimonialRepository(syntheticRawTestimonials)

        const firstCall = await repo.readAll("es")
        const secondCall = await repo.readAll("es")

        expect(firstCall.map((t) => t.slug)).toEqual(secondCall.map((t) => t.slug))
      })
    })

    describe("with default constructor (smoke test)", () => {
      it("should return at least 1 testimonial", async () => {
        const repo = new InMemoryTestimonialRepository()

        const result = await repo.readAll("es")

        expect(result.length).toBeGreaterThan(0)
      })
    })
  })
})
