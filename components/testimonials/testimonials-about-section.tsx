import React from "react"
import { getTranslations } from "next-intl/server"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"
import { TestimonialPullQuote } from "./testimonial-pull-quote"
import { TestimonialRow } from "./testimonial-row"

type TestimonialsAboutSectionContentProps = {
  testimonials: TestimonialDto[]
  title: string
  subtitle: string
  sectionLabelTemplate: string
  viewLinkedinAriaLabelTemplate: string
}

function buildLinkedinAriaLabel(template: string, author: string): string {
  return template.replace("{author}", author)
}

export function TestimonialsAboutSectionContent({
  testimonials,
  title,
  subtitle,
  sectionLabelTemplate,
  viewLinkedinAriaLabelTemplate,
}: TestimonialsAboutSectionContentProps): React.ReactElement | null {
  if (testimonials.length === 0) return null

  const sectionLabel = sectionLabelTemplate.replace("{count}", String(testimonials.length))
  const [anchor, ...rest] = testimonials

  return (
    <section
      id="testimonios"
      aria-labelledby="testimonials-about-title"
      className="mt-12 scroll-mt-24"
    >
      <header className="mb-10">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {sectionLabel}
        </span>
        <h2
          id="testimonials-about-title"
          className="mt-2 text-2xl font-bold text-gray-100"
        >
          {title}
        </h2>
        {subtitle.length > 0 && (
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">{subtitle}</p>
        )}
      </header>

      <TestimonialPullQuote
        testimonial={anchor}
        viewLinkedinAriaLabel={buildLinkedinAriaLabel(viewLinkedinAriaLabelTemplate, anchor.author)}
      />

      {rest.length > 0 && (
        <>
          <hr className="my-10 border-t border-white/5" />
          <div className="flex flex-col gap-4">
            {rest.map((testimonial) => (
              <TestimonialRow
                key={testimonial.slug}
                testimonial={testimonial}
                viewLinkedinAriaLabel={buildLinkedinAriaLabel(
                  viewLinkedinAriaLabelTemplate,
                  testimonial.author
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

type TestimonialsAboutSectionProps = {
  testimonials: TestimonialDto[]
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

export async function TestimonialsAboutSection({
  testimonials,
}: TestimonialsAboutSectionProps): Promise<React.ReactElement | null> {
  const t = await getTranslations("testimonials")
  return (
    <TestimonialsAboutSectionContent
      testimonials={testimonials}
      title={t("aboutTitle")}
      subtitle={t("aboutSubtitle")}
      sectionLabelTemplate={readString(t.raw("aboutLabel"))}
      viewLinkedinAriaLabelTemplate={readString(t.raw("viewLinkedinAriaLabel"))}
    />
  )
}
