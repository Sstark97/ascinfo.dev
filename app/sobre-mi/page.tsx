import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CareerTimeline } from "@/components/career/career-timeline";
import { CvDownloadButtonDynamic } from "@/components/career/cv-download-button-dynamic";
import { JsonLd } from "@/components/json-ld";
import { BreadcrumbSchemaBuilder, PersonSchemaBuilder } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Sobre mí - Aitor Santana | Software Crafter",
  description:
    "Software Crafter con más de 3 años de experiencia en Lean Mind. Especializado en arquitecturas limpias, TDD y desarrollo full-stack con .NET, Java Spring Boot y React.",
  alternates: {
    canonical: "/sobre-mi",
  },
  openGraph: {
    title: "Sobre mí - Aitor Santana",
    description:
      "Software Crafter especializado en arquitecturas limpias, TDD y desarrollo full-stack.",
    type: "profile",
    url: "/sobre-mi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre mí - Aitor Santana",
    description:
      "Software Crafter especializado en arquitecturas limpias, TDD y desarrollo full-stack.",
  },
};

const jsonLd = PersonSchemaBuilder.build();
const breadcrumbSchema = BreadcrumbSchemaBuilder.forAboutPage();

export default function SobreMiPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />

      <div className="min-h-screen bg-[#1a1a1a] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1 text-sm"
          >
            <Link
              href="/"
              className="text-[#999999] transition-colors hover:text-[#fca311] focus-visible:text-[#fca311]"
            >
              Inicio
            </Link>
            <ChevronRight
              aria-hidden="true"
              className="h-4 w-4 text-[#999999]"
            />
            <span aria-current="page" className="text-[#f5f5f5]">
              Sobre mí
            </span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Sobre mí
            </h1>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                Soy un{" "}
                <span className="font-semibold text-[#FCA311]">
                  Desarrollador de Software
                </span>{" "}
                apasionado por construir{" "}
                <span className="font-medium text-gray-300">
                  software sostenible
                </span>
                . En mis años en{" "}
                <span className="font-medium text-gray-300">Lean Mind</span>, he
                tenido la oportunidad de rotar por proyectos complejos (Fintech,
                Multimedia, EdTech), lo que me ha enseñado a adaptarme a nuevos
                stacks tecnológicos sin sacrificar la calidad.
              </p>
              <p>
                Veo el desarrollo de software como una{" "}
                <span className="font-medium text-gray-300">
                  disciplina de ingeniería
                </span>{" "}
                que requiere rigor y empatía. Mi objetivo diario es diseñar
                sistemas que no solo funcionen hoy, sino que sean fáciles de
                mantener y entender por mis compañeros mañana.
              </p>
            </div>

            <div className="mt-8">
              <CvDownloadButtonDynamic />
            </div>
          </header>

          {/* Career Timeline */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">
              Trayectoria Profesional
            </h2>
            <CareerTimeline />
          </section>

          {/* Values & Approach */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">
              Enfoque Técnico
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Software Craftsmanship */}
              <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-100">
                  Software Craftsmanship
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  El código es un artefacto de comunicación, no solo
                  instrucciones para la máquina. Priorizo la legibilidad, el
                  diseño emergente y el refactoring continuo.
                </p>
              </div>

              {/* Test-Driven Development */}
              <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-100">
                  Test-Driven Development
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Los tests son la primera documentación del sistema. TDD me
                  permite diseñar APIs antes de implementarlas y tener confianza
                  en los cambios.
                </p>
              </div>

              {/* Meaningful Naming */}
              <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-100">
                  Meaningful Naming
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Los nombres importan. Intento que el código cuente una
                  historia y refleje la intención del negocio, facilitando que
                  cualquier compañero pueda leerlo y entenderlo sin necesidad de
                  traducción.
                </p>
              </div>

              {/* Clean Architecture */}
              <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-100">
                  Clean Architecture
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Separo la lógica de negocio de los detalles de
                  infraestructura. Arquitectura hexagonal, puertos y
                  adaptadores, inversión de dependencias.
                </p>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-100">
              Stack Técnico Actual
            </h2>
            <div className="rounded-xl border border-white/5 bg-[#222222] p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Backend
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ".NET",
                      "Java Spring Boot",
                      "Node.js",
                      "PostgreSQL",
                      "Event-Driven",
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-white/5 px-3 py-1.5 font-mono text-sm text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Frontend
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React",
                      "Angular",
                      "TypeScript",
                      "Next.js",
                      "Tailwind CSS",
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-white/5 px-3 py-1.5 font-mono text-sm text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    DevOps & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Docker", "Git", "CI/CD", "Modulith", "Azure"].map(
                      (tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-white/5 px-3 py-1.5 font-mono text-sm text-gray-300"
                        >
                          {tech}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
