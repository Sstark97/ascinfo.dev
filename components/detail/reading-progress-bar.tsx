"use client"

import { useRef, useEffect } from "react"
import { useScrollProgress } from "@/hooks/use-scroll-progress"

interface ReadingProgressBarProps {
  targetId: string
  label?: string
}

export function ReadingProgressBar({ targetId, label = "Reading progress" }: ReadingProgressBarProps): React.ReactElement {
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    targetRef.current = document.getElementById(targetId)
  }, [targetId])

  const { progress } = useScrollProgress({ targetRef })
  const valuenow = Math.round(progress * 100)

  return (
    <div
      role="progressbar"
      aria-valuenow={valuenow}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="pointer-events-none fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent"
    >
      <div
        style={{ transform: `scaleX(${progress})`, transformOrigin: "left" }}
        className="h-full w-full bg-[#FCA311] transition-transform duration-75"
      />
    </div>
  )
}
