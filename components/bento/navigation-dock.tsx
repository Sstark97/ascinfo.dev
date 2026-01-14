"use client"

import Link from "next/link"
import { Home, FileText, Mic2, FolderKanban } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/blog", icon: FileText, label: "Blog" },
  { href: "/charlas", icon: Mic2, label: "Charlas" },
  { href: "/proyectos", icon: FolderKanban, label: "Proyectos" },
]

export function NavigationDock() {
  return (
    <nav className="flex h-full items-center justify-center rounded-xl border border-white/5 bg-[#222222] p-4">
      <div className="flex items-center gap-1 md:gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col items-center gap-1.5 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-[#FCA311]/10 md:px-4 md:py-3"
          >
            <item.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-[#FCA311]">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
