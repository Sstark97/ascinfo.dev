"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/src/lib/utils/cn"

interface ScrollToTopButtonProps {
  threshold?: number
  label?: string
}

export function ScrollToTopButton({ threshold = 600, label = "Scroll to top" }: ScrollToTopButtonProps): React.ReactElement {
  const [visible, setVisible] = useState<boolean>(false)
  const frameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const scheduleVisibilityUpdate = (): void => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current)
      }
      frameRef.current = requestAnimationFrame(() => {
        setVisible(window.scrollY > threshold)
        frameRef.current = undefined
      })
    }

    window.addEventListener("scroll", scheduleVisibilityUpdate, { passive: true })

    return () => {
      window.removeEventListener("scroll", scheduleVisibilityUpdate)
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [threshold])

  const scrollToTop = (): void => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#222222] text-[#999999] shadow-lg transition-all duration-300 hover:border-[#FCA311]/30 hover:text-[#FCA311] hover:shadow-[0_0_20px_rgba(252,163,17,0.15)] focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2",
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      <ArrowUp aria-hidden="true" className="h-5 w-5" />
      <span className="sr-only">{label}</span>
    </button>
  )
}
