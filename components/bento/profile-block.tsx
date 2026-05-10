import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { CtaButton } from "@/components/bento/cta-button"

type ProfileBlockContentProps = {
  impactSubtitle: string
  bio1: React.ReactNode
  bio2: React.ReactNode
  bio3: React.ReactNode
  ctaLabel: string
  ctaAriaLabel: string
}

export function ProfileBlockContent({
  impactSubtitle,
  bio1,
  bio2,
  bio3,
  ctaLabel,
  ctaAriaLabel,
}: ProfileBlockContentProps): React.ReactElement {
  return (
    <div className="group flex h-full min-h-[280px] flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
          <Image src="/aitor_profile.webp" alt="Aitor Santana" fill className="object-cover" priority />
          <div className="absolute inset-0 rounded-xl ring-2 ring-[#FCA311]/20" />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Aitor Santana</h2>
          <p className="mt-1 font-mono text-sm text-[#FCA311]">Software Crafter</p>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
            {impactSubtitle}
          </p>
          <div className="-ml-3 mt-1">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 space-y-3">
        <p className="text-base leading-relaxed text-muted-foreground">{bio1}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{bio2}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{bio3}</p>
      </div>

      <div className="mt-6">
        <CtaButton
          href="mailto:aitorscinfo@gmail.com"
          label={ctaLabel}
          ariaLabel={ctaAriaLabel}
        />
      </div>

      <div aria-hidden="true" className="mt-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-[#FCA311]" />
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Home</span>
      </div>
    </div>
  )
}

export async function ProfileBlock(): Promise<React.ReactElement> {
  const t = await getTranslations("profile")

  const bio1 = t.rich("bio1", {
    strong: (chunks) => <span className="font-semibold text-gray-100">{chunks}</span>,
  })

  const bio2 = t.rich("bio2", {
    strong: (chunks) => <span className="font-semibold text-gray-100">{chunks}</span>,
    highlight: (chunks) => <span className="font-semibold text-[#FCA311]">{chunks}</span>,
  })

  const bio3 = t.rich("bio3", {
    strong: (chunks) => <span className="font-semibold text-gray-100">{chunks}</span>,
  })

  return (
    <ProfileBlockContent
      impactSubtitle={t("impactSubtitle")}
      bio1={bio1}
      bio2={bio2}
      bio3={bio3}
      ctaLabel={t("ctaLabel")}
      ctaAriaLabel={t("ctaAriaLabel")}
    />
  )
}
