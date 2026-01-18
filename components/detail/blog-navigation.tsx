import Link from "next/link"

interface Post {
  slug: string
  title: string
}

interface BlogNavigationProps {
  prevPost: Post | null
  nextPost: Post | null
}

export function BlogNavigation({ prevPost, nextPost }: BlogNavigationProps) {
  if (!prevPost && !nextPost) {
    return null
  }

  return (
    <nav className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
      {prevPost ? (
        <Link
          href={`/blog/${prevPost.slug}`}
          className="group flex flex-col items-start gap-1 text-left"
        >
          <span className="text-xs text-[#666666]">Anterior</span>
          <span className="text-sm text-[#888888] transition-colors group-hover:text-[#fca311]">
            {prevPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group flex flex-col items-end gap-1 text-right"
        >
          <span className="text-xs text-[#666666]">Siguiente</span>
          <span className="text-sm text-[#888888] transition-colors group-hover:text-[#fca311]">
            {nextPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
