import type { Testimonial } from "@/content/domain/entities/Testimonial"
import type { Locale } from "@/content/domain/types/Locale"

export type TestimonialRepository = {
  readAll(locale: Locale): Promise<Testimonial[]>
}
