import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

const siteUrl = "https://ascinfo.dev"
const defaultImage = `${siteUrl}/aitor_profile.webp`

export const metadata: Metadata = {
  title: {
    default: "Aitor Santana | Desarrollador de Software",
    template: "%s | Aitor Santana",
  },
  description:
    "Soy Aitor Santana, Desarrollador de Software apasionado por escribir código limpio y sostenible, aplicando TDD y buenas prácticas como patrones de diseño y arquitecturas limpias. En Lean Mind, colaboro con un equipo que me impulsa a crecer profesionalmente.",
  keywords: [
    "aitor santana cabrera",
    "aitor santana",
    "ascinfo",
    "ascinfo.dev",
    "TDD",
    "Clean Code",
    "Código Limpio",
    "DDD",
    "Arquitectura Hexagonal",
    "Lean Mind",
  ],
  authors: [{ name: "Aitor Santana Cabrera", url: siteUrl }],
  creator: "Aitor Santana Cabrera",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "ascinfo.dev",
    title: "Aitor Santana | Desarrollador de Software",
    description:
      "Soy Aitor Santana, Desarrollador de Software apasionado por escribir código limpio y sostenible, aplicando TDD y buenas prácticas como patrones de diseño y arquitecturas limpias.",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: "Aitor Santana Cabrera",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aitorsci",
    creator: "@aitorsci",
    title: "Aitor Santana | Desarrollador de Software",
    description:
      "Soy Aitor Santana, Desarrollador de Software apasionado por escribir código limpio y sostenible, aplicando TDD y buenas prácticas.",
    images: [defaultImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#222222",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#FCA311] focus:px-4 focus:py-2 focus:text-[#1a1a1a] focus:font-medium focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
        >
          Saltar al contenido principal
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
