"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/src/i18n/navigation"
import { FileText, Mic2, FolderKanban, User, ArrowUpRight } from "lucide-react"

type NavigationDockProps = {
  postsCount: number
  talksCount: number
  projectsCount: number
}

export function NavigationDock({ postsCount, talksCount, projectsCount }: NavigationDockProps): React.ReactElement {
  const t = useTranslations("nav")

  const navItems = [
    { href: "/blog" as const, icon: FileText, label: t("blog"), count: postsCount },
    { href: "/charlas" as const, icon: Mic2, label: t("talks"), count: talksCount },
    { href: "/proyectos" as const, icon: FolderKanban, label: t("projects"), count: projectsCount },
    { href: "/sobre-mi" as const, icon: User, label: t("about"), count: undefined },
  ]

  return (
    <nav
      aria-label={t("sectionsLabel")}
      className="flex h-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10"
    >
      <div className="flex items-center gap-2">
        <div aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#FCA311]" />
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t("sectionsLabel")}
        </span>
      </div>

      <ul className="mt-4 flex flex-1 flex-col divide-y divide-white/5">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2 focus-visible:rounded"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] transition-colors group-hover:bg-[#FCA311]/10">
                <item.icon aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
              </div>
              <span className="text-sm font-medium text-foreground transition-colors group-hover:text-[#FCA311]">
                {item.label}
              </span>
              {item.count !== undefined && (
                <span className="ml-auto inline-flex items-center rounded-full bg-[#FCA311]/10 px-2 py-0.5 font-mono text-xs font-medium text-[#FCA311]">
                  {item.count}
                </span>
              )}
              <ArrowUpRight
                aria-hidden="true"
                className={`${item.count !== undefined ? "" : "ml-auto"} h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:text-[#FCA311] group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
