"use client"

import Link from "next/link"
import { FileText, Mic2, FolderKanban } from "lucide-react"

const navItems = [
  { href: "/blog", icon: FileText, label: "Blog" },
  { href: "/charlas", icon: Mic2, label: "Charlas" },
  { href: "/proyectos", icon: FolderKanban, label: "Proyectos" },
]

const socialLinks = [
  {
    href: "https://github.com/Sstark97",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
        <path d="M9 18c-4.51 2-5-2-7-2"/>
      </svg>
    ),
    label: "GitHub"
  },
  {
    href: "https://www.linkedin.com/in/aitorscinfo/",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    label: "LinkedIn"
  },
  {
    href: "https://www.twitter.com/aitorsci",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    ),
    label: "X (Twitter)"
  },
  {
    href: "https://bsky.app/profile/ascinfo.dev",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
      </svg>
    ),
    label: "Bluesky"
  },
]

export function NavigationDock() {
  return (
    <nav className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-white/5 bg-[#222222] p-4">
      {/* Navigation Links */}
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

      {/* Divider */}
      <div className="h-px w-full bg-white/5" />

      {/* Social Links */}
      <div className="flex items-center gap-3">
        {socialLinks.map((social) => {
          const IconComponent = social.icon
          return (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="group rounded-lg p-2 transition-all duration-200 hover:bg-[#FCA311]/10"
            >
              <div className="h-5 w-5 text-[#888888] transition-colors group-hover:text-[#FCA311]">
                <IconComponent />
              </div>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
