import React from "react"
import { getTranslations } from "next-intl/server"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"
import { TestimonialsMasonry } from "./testimonials-masonry"

const FEATURED_COUNT = 4

type TestimonialsSectionContentProps = {
  testimonials: TestimonialDto[]
  title: string
  subtitle: string
  sectionLabel: string
  viewLinkedinAriaLabelTemplate: string
  viewAllLabel: string
  viewAllCount: string
  total: number
}

export function TestimonialsSectionContent({
  testimonials,
  title,
  subtitle,
  sectionLabel,
  viewLinkedinAriaLabelTemplate,
  viewAllLabel,
  viewAllCount,
  total,
}: TestimonialsSectionContentProps): React.ReactElement | null {
  if (testimonials.length === 0) return null

  return (
    <section
      aria-labelledby="testimonials-title"
      className="rounded-xl border border-white/5 bg-[#222222] p-5 transition-all duration-300 hover:border-white/10 sm:p-6 md:p-8"
    >
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {sectionLabel}
        </span>
        <h2 id="testimonials-title" className="mt-2 text-2xl font-bold text-gray-100">
          {title}
        </h2>
        {subtitle.length > 0 && (
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <TestimonialsMasonry
        testimonials={testimonials.slice(0, FEATURED_COUNT)}
        viewLinkedinAriaLabelTemplate={viewLinkedinAriaLabelTemplate}
        viewAllLabel={viewAllLabel}
        viewAllCount={viewAllCount}
        total={total}
      />
    </section>
  )
}

type TestimonialsSectionProps = {
  testimonials: TestimonialDto[]
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

export async function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps): Promise<React.ReactElement | null> {
  const t = await getTranslations("testimonials")
  return (
    <TestimonialsSectionContent
      testimonials={testimonials}
      title={t("title")}
      subtitle={t("subtitle")}
      sectionLabel={t("label")}
      viewLinkedinAriaLabelTemplate={readString(t.raw("viewLinkedinAriaLabel"))}
      viewAllLabel={t("viewAllLabel")}
      viewAllCount={readString(t.raw("viewAllCount"))}
      total={testimonials.length}
    />
  )
}
