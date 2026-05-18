import React from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"
import { TestimonialCard } from "./testimonial-card"

type TestimonialsMasonryProps = {
  testimonials: TestimonialDto[]
  viewLinkedinAriaLabelTemplate: string
  viewAllLabel: string
  viewAllCount: string
  total: number
}

function buildLinkedinAriaLabel(template: string, author: string): string {
  return template.replace("{author}", author)
}

export function TestimonialsMasonry({
  testimonials,
  viewLinkedinAriaLabelTemplate,
  viewAllLabel,
  viewAllCount,
  total,
}: TestimonialsMasonryProps): React.ReactElement {
  const countLabel = viewAllCount.replace("{count}", String(total))

  return (
    <>
      <div className="mt-6 columns-1 gap-4 md:columns-2">
        {testimonials.map((testimonial) => (
          <div key={testimonial.slug} className="mb-4 break-inside-avoid">
            <TestimonialCard
              testimonial={testimonial}
              viewLinkedinAriaLabel={buildLinkedinAriaLabel(
                viewLinkedinAriaLabelTemplate,
                testimonial.author
              )}
            />
          </div>
        ))}
      </div>

      <Link
        href={{ pathname: "/sobre-mi", hash: "testimonios" }}
        className="mt-6 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[#FCA311] transition-colors duration-300 hover:text-[#FCA311]/80 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
      >
        {viewAllLabel} {countLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </>
  )
}
