import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface ArticleNavProps {
  prev?: {
    slug: string
    title: string
  }
  next?: {
    slug: string
    title: string
  }
  basePath: string
}

export function ArticleNav({ prev, next, basePath }: ArticleNavProps) {
  return (
    <nav className="mt-12 grid gap-4 border-t border-white/5 pt-8 md:grid-cols-2">
      {prev ? (
        <Link
          href={`${basePath}/${prev.slug}`}
          className="group flex items-center gap-3 rounded-xl border border-white/5 bg-[#222222] p-4 transition-all duration-300 hover:border-[#fca311]/30 focus-visible:border-[#fca311]/30 focus-visible:outline-2 focus-visible:outline-[#fca311]"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5 text-[#999999] transition-all duration-200 group-hover:-translate-x-1 group-hover:text-[#fca311]" />
          <div>
            <p className="text-xs text-[#999999]">Anterior</p>
            <p className="text-sm font-medium text-[#f5f5f5] transition-colors duration-200 group-hover:text-[#fca311]">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link
          href={`${basePath}/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-xl border border-white/5 bg-[#222222] p-4 text-right transition-all duration-300 hover:border-[#fca311]/30 focus-visible:border-[#fca311]/30 focus-visible:outline-2 focus-visible:outline-[#fca311]"
        >
          <div>
            <p className="text-xs text-[#999999]">Siguiente</p>
            <p className="text-sm font-medium text-[#f5f5f5] transition-colors duration-200 group-hover:text-[#fca311]">
              {next.title}
            </p>
          </div>
          <ArrowRight aria-hidden="true" className="h-5 w-5 text-[#999999] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#fca311]" />
        </Link>
      )}
    </nav>
  )
}
