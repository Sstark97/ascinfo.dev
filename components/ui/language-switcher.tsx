"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/src/i18n/navigation"
import { useParams } from "next/navigation"

export function LanguageSwitcher(): React.ReactElement {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  const switchTo = (target: "es" | "en") => {
    router.replace(
      // @ts-expect-error — pathname and params always match the current page
      { pathname, params },
      { locale: target }
    )
  }

  return (
    <div className="flex items-center gap-1 px-3 py-2 font-mono text-xs font-medium">
      <button
        onClick={() => switchTo("es")}
        aria-label="Cambiar a Español"
        aria-current={locale === "es" ? "true" : undefined}
        disabled={locale === "es"}
        className={`transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#FCA311] ${
          locale === "es" ? "cursor-default text-[#FCA311]" : "cursor-pointer text-muted-foreground hover:underline hover:text-[#FCA311]"
        }`}
      >
        ES
      </button>
      <span className="text-muted-foreground/40">/</span>
      <button
        onClick={() => switchTo("en")}
        aria-label="Switch to English"
        aria-current={locale === "en" ? "true" : undefined}
        disabled={locale === "en"}
        className={`transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#FCA311] ${
          locale === "en" ? "cursor-default text-[#FCA311]" : "cursor-pointer text-muted-foreground hover:underline hover:text-[#FCA311]"
        }`}
      >
        EN
      </button>
    </div>
  )
}
