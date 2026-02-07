"use client"

import Link from "next/link"
import { FileText, Mic2, FolderKanban, User } from "lucide-react"
import { GithubIconOutline } from "@/components/icons/github-icon"

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
)

const BlueskyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
  </svg>
)

const NAV_ITEMS = [
  { href: "/blog", icon: FileText, label: "Blog" },
  { href: "/charlas", icon: Mic2, label: "Charlas" },
  { href: "/proyectos", icon: FolderKanban, label: "Proyectos" },
  { href: "/sobre-mi", icon: User, label: "Sobre mí" },
] as const

const SOCIAL_LINKS = [
  { href: "https://github.com/Sstark97", icon: GithubIconOutline, label: "GitHub" },
  { href: "https://www.linkedin.com/in/aitorscinfo/", icon: LinkedInIcon, label: "LinkedIn" },
  { href: "https://www.twitter.com/aitorsci", icon: XIcon, label: "X (Twitter)" },
  { href: "https://bsky.app/profile/ascinfo.dev", icon: BlueskyIcon, label: "Bluesky" },
] as const

export function NavigationDock() {
  return (
    <nav className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-white/5 bg-[#222222] p-4">
      {/* Navigation Links */}
      <div className="flex items-center gap-1 md:gap-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col items-center gap-1.5 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-[#FCA311]/10 focus-visible:bg-[#FCA311]/10 focus-visible:outline-2 focus-visible:outline-[#FCA311] md:px-4 md:py-3"
          >
            <item.icon aria-hidden="true" className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-[#FCA311]" />
            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-[#FCA311]">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-white/5" />

      {/* Social Links */}
      <div className="flex items-center gap-3">
        {SOCIAL_LINKS.map((social) => {
          const IconComponent = social.icon
          return (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="group rounded-lg p-3 transition-all duration-200 hover:bg-[#FCA311]/10 focus-visible:bg-[#FCA311]/10 focus-visible:outline-2 focus-visible:outline-[#FCA311]"
            >
              <div className="h-5 w-5 text-[#999999] transition-colors group-hover:text-[#FCA311]">
                <IconComponent />
              </div>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
