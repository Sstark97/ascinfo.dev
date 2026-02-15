import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a1a1a] px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[120px] font-bold leading-none text-[#FCA311] md:text-[160px]">
            404
          </h1>
        </div>

        {/* Heading */}
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Página no encontrada
        </h2>

        {/* Message */}
        <p className="mb-8 text-lg text-[#999999] md:text-xl">
          Lo siento, la página que buscas no existe o ha sido movida.
        </p>

        {/* Link to Homepage */}
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-[#FCA311] px-6 py-3 text-base font-semibold text-[#1a1a1a] transition-all duration-200 hover:bg-[#FCA311]/90 focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
