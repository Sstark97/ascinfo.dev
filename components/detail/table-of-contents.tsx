"use client"

import { useState, useEffect } from "react"

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  items: TOCItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0px -80% 0px" },
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  return (
    <nav className="sticky top-24">
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[#888888]">Índice</p>
      <div className="relative border-l border-white/10 pl-4">
        {/* Active indicator line */}
        <div
          className="absolute left-0 h-5 w-0.5 bg-[#fca311] transition-all duration-200"
          style={{
            top: `${items.findIndex((item) => item.id === activeId) * 32}px`,
          }}
        />

        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block text-sm transition-colors duration-200 ${
                  activeId === item.id ? "text-[#fca311]" : "text-[#888888] hover:text-[#f5f5f5]"
                }`}
                style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
