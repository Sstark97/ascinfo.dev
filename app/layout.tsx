import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { JsonLd } from "@/components/json-ld"
import { WebSiteSchemaBuilder } from "@/src/lib/seo/schema-builders/WebSiteSchemaBuilder"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

const siteUrl = "https://ascinfo.dev"

export const metadata: Metadata = {
  title: {
    default: "Aitor Santana | Software Crafter & Clean Code",
    template: "%s | Aitor Santana",
  },
  description:
    "Aitor Santana - Software Crafter especializado en TDD, Clean Code y Arquitectura Hexagonal. Blog y charlas sobre desarrollo sostenible.",
  keywords: [
    "Aitor Santana",
    "Aitor Santana Cabrera",
    "ascinfo",
    "ascinfo.dev",
    "TDD",
    "Test-Driven Development",
    "Software Crafter",
    "Clean Code",
    "Código Limpio",
    "IA",
    "Inteligencia Artificial",
    "DDD",
    "Arquitectura Hexagonal",
    "Clean Architecture",
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
    siteName: "Aitor Santana - ascinfo.dev",
    title: "Aitor Santana | Software Crafter & Clean Code",
    description:
      "Aitor Santana - Software Crafter especializado en TDD, Clean Code y Arquitectura Hexagonal. Blog y charlas sobre desarrollo sostenible.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aitorsci",
    creator: "@aitorsci",
    title: "Aitor Santana | Software Crafter & Clean Code",
    description:
      "Aitor Santana - Software Crafter especializado en TDD, Clean Code y Arquitectura Hexagonal. Blog y charlas sobre desarrollo sostenible.",
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
        <JsonLd data={WebSiteSchemaBuilder.build()} />
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
