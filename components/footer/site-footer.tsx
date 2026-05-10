import React from "react"
import { Mail } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { GithubIconOutline } from "@/components/icons/github-icon"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"
import { XIcon } from "@/components/icons/x-icon"
import { BlueskyIcon } from "@/components/icons/bluesky-icon"

const EMAIL_ADDRESS = "aitorscinfo@gmail.com"
const LINKEDIN_URL = "https://www.linkedin.com/in/aitorscinfo/"
const GITHUB_URL = "https://github.com/Sstark97"
const X_URL = "https://www.twitter.com/aitorsci"
const BLUESKY_URL = "https://bsky.app/profile/ascinfo.dev"

type SiteFooterContentProps = {
  contactTitle: string
  emailLabel: string
  emailAddress: string
  emailAriaLabel: string
  linkedinLabel: string
  linkedinHandle: string
  linkedinUrl: string
  linkedinAriaLabel: string
  githubLabel: string
  githubHandle: string
  githubUrl: string
  githubAriaLabel: string
  xLabel: string
  xHandle: string
  xUrl: string
  xAriaLabel: string
  blueskyLabel: string
  blueskyHandle: string
  blueskyUrl: string
  blueskyAriaLabel: string
  copyrightText: string
}

export function SiteFooterContent({
  contactTitle,
  emailLabel,
  emailAddress,
  emailAriaLabel,
  linkedinLabel,
  linkedinHandle,
  linkedinUrl,
  linkedinAriaLabel,
  githubLabel,
  githubHandle,
  githubUrl,
  githubAriaLabel,
  xLabel,
  xHandle,
  xUrl,
  xAriaLabel,
  blueskyLabel,
  blueskyHandle,
  blueskyUrl,
  blueskyAriaLabel,
  copyrightText,
}: SiteFooterContentProps): React.ReactElement {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/5 bg-[#1a1a1a] px-4 py-8 sm:px-6 md:py-10 lg:px-8"
    >
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {contactTitle}
        </h2>
        <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <li>
            <a
              href={`mailto:${emailAddress}`}
              aria-label={emailAriaLabel}
              className="group inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-[#FCA311] focus-visible:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-4"
            >
              <Mail aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
              <span className="sr-only">{emailLabel}: </span>
              <span className="break-all">{emailAddress}</span>
            </a>
          </li>
          <li>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={linkedinAriaLabel}
              className="group inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-[#FCA311] focus-visible:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-4"
            >
              <LinkedInIcon aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
              <span className="sr-only">{linkedinLabel}: </span>
              <span>{linkedinHandle}</span>
            </a>
          </li>
          <li>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={githubAriaLabel}
              className="group inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-[#FCA311] focus-visible:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-4"
            >
              <GithubIconOutline aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
              <span className="sr-only">{githubLabel}: </span>
              <span>{githubHandle}</span>
            </a>
          </li>
          <li>
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={xAriaLabel}
              className="group inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-[#FCA311] focus-visible:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-4"
            >
              <XIcon aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
              <span className="sr-only">{xLabel}: </span>
              <span>{xHandle}</span>
            </a>
          </li>
          <li>
            <a
              href={blueskyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={blueskyAriaLabel}
              className="group inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-[#FCA311] focus-visible:text-[#FCA311] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-4"
            >
              <BlueskyIcon aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
              <span className="sr-only">{blueskyLabel}: </span>
              <span>{blueskyHandle}</span>
            </a>
          </li>
        </ul>

        <div className="mt-8 border-t border-white/5 pt-6">
          <p className="text-xs text-muted-foreground">{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}

export async function SiteFooter(): Promise<React.ReactElement> {
  const t = await getTranslations("footer")
  const currentYear = new Date().getFullYear()

  return (
    <SiteFooterContent
      contactTitle={t("contactTitle")}
      emailLabel={t("emailLabel")}
      emailAddress={EMAIL_ADDRESS}
      emailAriaLabel={t("emailAriaLabel")}
      linkedinLabel={t("linkedinLabel")}
      linkedinHandle={t("linkedinHandle")}
      linkedinUrl={LINKEDIN_URL}
      linkedinAriaLabel={t("linkedinAriaLabel")}
      githubLabel={t("githubLabel")}
      githubHandle={t("githubHandle")}
      githubUrl={GITHUB_URL}
      githubAriaLabel={t("githubAriaLabel")}
      xLabel={t("xLabel")}
      xHandle={t("xHandle")}
      xUrl={X_URL}
      xAriaLabel={t("xAriaLabel")}
      blueskyLabel={t("blueskyLabel")}
      blueskyHandle={t("blueskyHandle")}
      blueskyUrl={BLUESKY_URL}
      blueskyAriaLabel={t("blueskyAriaLabel")}
      copyrightText={t("copyright", { year: currentYear })}
    />
  )
}
