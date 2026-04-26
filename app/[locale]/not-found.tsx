import { getTranslations } from "next-intl/server"
import { Link } from "@/src/i18n/navigation"

export default async function LocaleNotFound(): Promise<React.ReactElement> {
  const t = await getTranslations("notFound")

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a1a1a] px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-[120px] font-bold leading-none text-[#FCA311] md:text-[160px]">
            404
          </h1>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          {t("title")}
        </h2>

        <p className="mb-8 text-lg text-[#999999] md:text-xl">
          {t("description")}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-[#FCA311] px-6 py-3 text-base font-semibold text-[#1a1a1a] transition-all duration-200 hover:bg-[#FCA311]/90 focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
        >
          {t("backHome")}
        </Link>
      </div>
    </main>
  )
}
