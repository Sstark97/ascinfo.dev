import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { CareerTimeline } from "@/components/career/career-timeline"
import { CvDownloadButtonDynamic } from "@/components/career/cv-download-button-dynamic"
import { JsonLd } from "@/components/json-ld"
import { BreadcrumbSchemaBuilder, PersonSchemaBuilder } from "@/src/lib/seo"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.about" })
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/sobre-mi", languages: { es: "/sobre-mi", en: "/en/about" } },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "profile",
      url: "/sobre-mi",
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  }
}

export default async function SobreMiPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, tBread, tCv] = await Promise.all([
    getTranslations("about"),
    getTranslations("breadcrumbs"),
    getTranslations("cv"),
  ])

  const jsonLd = PersonSchemaBuilder.build()
  const breadcrumbSchema = BreadcrumbSchemaBuilder.forAboutPage()

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />

      <div className="min-h-screen bg-[#1a1a1a] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="text-[#999999] transition-colors hover:text-[#fca311] focus-visible:text-[#fca311]"
            >
              {tBread("home")}
            </Link>
            <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#999999]" />
            <span aria-current="page" className="text-[#f5f5f5]">
              {tBread("about")}
            </span>
          </nav>

          <header className="mb-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              {t("pageTitle")}
            </h1>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                {t.rich("bio1", {
                  highlight: (chunks) => <span className="font-semibold text-[#FCA311]">{chunks}</span>,
                  strong: (chunks) => <span className="font-medium text-gray-300">{chunks}</span>,
                })}
              </p>
              <p>
                {t.rich("bio2", {
                  strong: (chunks) => <span className="font-medium text-gray-300">{chunks}</span>,
                })}
              </p>
            </div>

            <div className="mt-8">
              <CvDownloadButtonDynamic labels={{
                download: tCv("download"),
                generating: tCv("generating"),
                ariaReady: tCv("ariaReady"),
                ariaLoading: tCv("ariaLoading"),
              }} />
            </div>
          </header>

          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">{t("careerTitle")}</h2>
            <CareerTimeline />
          </section>

          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">{t("approachTitle")}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-100">Software Craftsmanship</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t("craftsmanshipDesc")}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-100">Test-Driven Development</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t("tddDesc")}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-100">Meaningful Naming</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t("namingDesc")}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-100">Clean Architecture</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t("architectureDesc")}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-100">{t("stackTitle")}</h2>
            <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {t("backend")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[".NET", "Java Spring Boot", "Node.js", "PostgreSQL", "Event-Driven"].map((tech) => (
                      <span key={tech} className="rounded-md bg-white/5 px-3 py-1.5 font-mono text-sm text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {t("frontend")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Angular", "TypeScript", "Next.js", "Tailwind CSS"].map((tech) => (
                      <span key={tech} className="rounded-md bg-white/5 px-3 py-1.5 font-mono text-sm text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {t("devops")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Docker", "Git", "CI/CD", "Modulith", "Azure"].map((tech) => (
                      <span key={tech} className="rounded-md bg-white/5 px-3 py-1.5 font-mono text-sm text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
