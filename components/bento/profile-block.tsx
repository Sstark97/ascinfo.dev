import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { CtaButton } from "@/components/bento/cta-button"

type ProfileBlockContentProps = {
  impactSubtitle: string
  bio1: React.ReactNode
  bio2: React.ReactNode
  skills: string[]
  ctaLabel: string
  ctaAriaLabel: string
}

function toSkillsArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}

export function ProfileBlockContent({
  impactSubtitle,
  bio1,
  bio2,
  skills,
  ctaLabel,
  ctaAriaLabel,
}: ProfileBlockContentProps): React.ReactElement {
  return (
    <div className="group flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-[#FCA311]/30 hover:shadow-[0_0_30px_rgba(252,163,17,0.05)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            src="/aitor_profile.webp"
            alt="Aitor Santana"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 rounded-xl ring-2 ring-[#FCA311]/20" />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Aitor Santana
          </h2>
          <p className="mt-1 font-mono text-sm text-[#FCA311]">Software Crafter</p>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
            {impactSubtitle}
          </p>
          <div className="-ml-3 mt-1">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        <p>{bio1}</p>
        <p>{bio2}</p>
      </div>

      {skills.length > 0 && (
        <ul aria-label="Stack" className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-6">
        <CtaButton
          href="mailto:aitorscinfo@gmail.com"
          label={ctaLabel}
          ariaLabel={ctaAriaLabel}
        />
      </div>
    </div>
  )
}

export async function ProfileBlock(): Promise<React.ReactElement> {
  const t = await getTranslations("profile")

  const richOptions = {
    strong: (chunks: React.ReactNode) => <span className="font-semibold text-gray-100">{chunks}</span>,
    highlight: (chunks: React.ReactNode) => <span className="font-semibold text-[#FCA311]">{chunks}</span>,
  }

  const bio1 = t.rich("bio1", richOptions)
  const bio2 = t.rich("bio2", richOptions)
  const skills = toSkillsArray(t.raw("skills"))

  return (
    <ProfileBlockContent
      impactSubtitle={t("impactSubtitle")}
      bio1={bio1}
      bio2={bio2}
      skills={skills}
      ctaLabel={t("ctaLabel")}
      ctaAriaLabel={t("ctaAriaLabel")}
    />
  )
}
