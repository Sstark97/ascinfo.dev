"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function LatestArticleBlock() {
  return (
    <Link href="/blog" className="group block h-full">
      <article className="flex h-full min-h-[280px] flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FCA311]/50 hover:shadow-lg hover:shadow-[#FCA311]/5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">Último artículo</span>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FCA311]" />
        </div>

        {/* Content */}
        <div className="mt-4 flex-1">
          {/* Tag */}
          <span className="inline-block rounded-full bg-[#FCA311]/10 px-3 py-1 font-mono text-xs font-medium text-[#FCA311]">
            Spring Boot
          </span>

          {/* Title */}
          <h2 className="mt-4 text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-[#FCA311] md:text-2xl">
            Arquitectura Hexagonal en Spring
          </h2>

          {/* Snippet */}
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            Cómo desacoplar tu dominio del framework usando Beans de configuración...
          </p>
        </div>

        {/* Footer CTA */}
        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-white/5">
          <span className="text-sm font-medium text-[#FCA311] transition-colors">Leer artículo</span>
          <ArrowUpRight className="h-4 w-4 text-[#FCA311] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </article>
    </Link>
  )
}
