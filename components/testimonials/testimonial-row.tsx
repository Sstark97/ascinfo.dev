import React from "react"
import Image from "next/image"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"
import { computeInitials } from "./initials"

type TestimonialRowProps = {
  testimonial: TestimonialDto
  viewLinkedinAriaLabel: string
}

export function TestimonialRow({
  testimonial,
  viewLinkedinAriaLabel,
}: TestimonialRowProps): React.ReactElement {
  const { author, role, company, quote, linkedinUrl, avatarUrl } = testimonial
  const initials = computeInitials(author)

  return (
    <a
      href={linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={viewLinkedinAriaLabel}
      className="group block rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 md:p-7"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-5 w-5 text-[#FCA311]/40"
        fill="currentColor"
      >
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36 1 24.832 4.32 28 8.32 28c3.776 0 6.4-3.04 6.4-6.624 0-3.584-2.496-6.176-5.76-6.176-.64 0-1.504.128-1.728.256.576-3.84 4.224-8.32 7.872-10.56L9.352 4zm16 0c-4.864 3.456-8.32 9.12-8.32 15.36 0 5.472 3.328 8.64 7.36 8.64 3.744 0 6.4-3.04 6.4-6.624 0-3.584-2.528-6.176-5.792-6.176-.64 0-1.472.128-1.696.256.576-3.84 4.192-8.32 7.84-10.56L25.352 4z" />
      </svg>

      <blockquote className="mt-3 text-base italic leading-relaxed text-gray-100">
        {quote}
      </blockquote>

      <footer className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4 md:justify-end md:border-t-0 md:pt-0">
        {avatarUrl !== undefined ? (
          <Image
            src={avatarUrl}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FCA311] font-mono text-sm font-bold uppercase text-[#1a1a1a]"
          >
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-100">— {author}</p>
          <p className="truncate font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {role}
            {company !== "" && <> · {company}</>}
          </p>
        </div>
      </footer>
    </a>
  )
}
