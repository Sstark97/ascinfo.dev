import React from "react"
import { getTranslations } from "next-intl/server"
import { CtaButton } from "@/components/bento/cta-button"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"

const EMAIL_HREF = "mailto:aitorscinfo@gmail.com"
const LINKEDIN_URL = "https://www.linkedin.com/in/aitorscinfo/"

type ContactCtaSectionContentProps = {
  title: string
  description: string
  primaryLabel: string
  primaryAriaLabel: string
  secondaryLabel: string
  secondaryAriaLabel: string
}

export function ContactCtaSectionContent({
  title,
  description,
  primaryLabel,
  primaryAriaLabel,
  secondaryLabel,
  secondaryAriaLabel,
}: ContactCtaSectionContentProps): React.ReactElement {
  return (
    <section
      aria-labelledby="about-contact-title"
      className="mt-12 rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10 md:p-8"
    >
      <h2 id="about-contact-title" className="text-2xl font-bold text-gray-100">
        {title}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <CtaButton
          href={EMAIL_HREF}
          label={primaryLabel}
          ariaLabel={primaryAriaLabel}
        />
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={secondaryAriaLabel}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-gray-100 transition-all duration-300 hover:border-[#FCA311]/40 hover:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
        >
          <LinkedInIcon aria-hidden="true" className="h-4 w-4" />
          <span>{secondaryLabel}</span>
        </a>
      </div>
    </section>
  )
}

export async function ContactCtaSection(): Promise<React.ReactElement> {
  const t = await getTranslations("about.contact")

  return (
    <ContactCtaSectionContent
      title={t("title")}
      description={t("description")}
      primaryLabel={t("primaryLabel")}
      primaryAriaLabel={t("primaryAriaLabel")}
      secondaryLabel={t("secondaryLabel")}
      secondaryAriaLabel={t("secondaryAriaLabel")}
    />
  )
}
