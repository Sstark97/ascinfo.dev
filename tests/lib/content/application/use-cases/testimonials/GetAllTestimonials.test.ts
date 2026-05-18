import { describe, it, expect, vi } from "vitest"
import { GetAllTestimonials } from "@/content/application/use-cases/testimonials/GetAllTestimonials"
import type { TestimonialRepository } from "@/content/domain/repositories/TestimonialRepository"
import { mockTestimonialsEs } from "@fixtures/testimonials.fixtures"

describe("GetAllTestimonials", () => {
  describe("execute()", () => {
    it("should call readAll with the requested locale and return its result", async () => {
      const mockRepo: TestimonialRepository = {
        readAll: vi.fn().mockResolvedValue(mockTestimonialsEs),
      }
      const useCase = new GetAllTestimonials(mockRepo)

      const result = await useCase.execute("es")

      expect(mockRepo.readAll).toHaveBeenCalledWith("es")
      expect(result).toBe(mockTestimonialsEs)
    })

    it("should return an empty array when the repository returns empty", async () => {
      const mockRepo: TestimonialRepository = {
        readAll: vi.fn().mockResolvedValue([]),
      }
      const useCase = new GetAllTestimonials(mockRepo)

      const result = await useCase.execute("es")

      expect(result).toHaveLength(0)
    })

    it("should forward the locale en to the repository", async () => {
      const mockRepo: TestimonialRepository = {
        readAll: vi.fn().mockResolvedValue([]),
      }
      const useCase = new GetAllTestimonials(mockRepo)

      await useCase.execute("en")

      expect(mockRepo.readAll).toHaveBeenCalledWith("en")
    })
  })
})
