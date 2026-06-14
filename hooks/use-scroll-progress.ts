"use client"

import { useState, useEffect, useRef } from "react"

type UseScrollProgressOptions = {
  targetRef?: React.RefObject<HTMLElement | null>
}

type UseScrollProgressResult = {
  progress: number
}

export function useScrollProgress(options?: UseScrollProgressOptions): UseScrollProgressResult {
  const [progress, setProgress] = useState<number>(0)
  const frameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const calculateProgress = (): void => {
      const target = options?.targetRef?.current ?? document.documentElement
      const rect = target.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const elementHeight = rect.height
      const viewportHeight = window.innerHeight

      const scrolled = Math.max(0, window.scrollY - elementTop)
      const total = Math.max(1, elementHeight - viewportHeight)
      const clamped = Math.min(1, scrolled / total)

      setProgress(clamped)
    }

    const scheduleUpdate = (): void => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current)
      }
      frameRef.current = requestAnimationFrame(() => {
        calculateProgress()
        frameRef.current = undefined
      })
    }

    calculateProgress()

    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate, { passive: true })

    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [options?.targetRef])

  return { progress }
}
