import type { Testimonial } from "@/content/domain/entities/Testimonial"
import type { TestimonialRepository } from "@/content/domain/repositories/TestimonialRepository"
import type { Locale } from "@/content/domain/types/Locale"

export class GetAllTestimonials {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async execute(locale: Locale): Promise<Testimonial[]> {
    return this.testimonialRepository.readAll(locale)
  }
}
