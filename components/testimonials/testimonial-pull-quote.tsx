import React from "react"
import Image from "next/image"
import type { TestimonialDto } from "@/src/lib/content/application/dto/TestimonialDto"
import { computeInitials } from "./initials"

type TestimonialPullQuoteProps = {
  testimonial: TestimonialDto
  viewLinkedinAriaLabel: string
}

export function TestimonialPullQuote({
  testimonial,
  viewLinkedinAriaLabel,
}: TestimonialPullQuoteProps): React.ReactElement {
  const { author, role, company, quote, linkedinUrl, avatarUrl } = testimonial
  const initials = computeInitials(author)

  return (
    <a
      href={linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={viewLinkedinAriaLabel}
      className="group block rounded-xl px-4 py-6 transition-colors duration-300 hover:bg-white/[0.02] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 md:px-8 md:py-8"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-7 w-7 text-[#FCA311]"
        fill="currentColor"
      >
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36 1 24.832 4.32 28 8.32 28c3.776 0 6.4-3.04 6.4-6.624 0-3.584-2.496-6.176-5.76-6.176-.64 0-1.504.128-1.728.256.576-3.84 4.224-8.32 7.872-10.56L9.352 4zm16 0c-4.864 3.456-8.32 9.12-8.32 15.36 0 5.472 3.328 8.64 7.36 8.64 3.744 0 6.4-3.04 6.4-6.624 0-3.584-2.528-6.176-5.792-6.176-.64 0-1.472.128-1.696.256.576-3.84 4.192-8.32 7.84-10.56L25.352 4z" />
      </svg>

      <blockquote className="mt-3 text-lg italic leading-relaxed text-gray-100 md:text-xl md:leading-[1.7]">
        {quote}
      </blockquote>

      <footer className="mt-6 flex items-center justify-end gap-3">
        {avatarUrl !== undefined ? (
          <Image
            src={avatarUrl}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FCA311] font-mono text-base font-bold uppercase text-[#1a1a1a]"
          >
            {initials}
          </span>
        )}
        <div className="min-w-0 text-right">
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
