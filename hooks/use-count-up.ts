import { useState, useRef, useEffect } from "react"

type UseCountUpOptions = {
  durationMs?: number
  thresholdRatio?: number
}

type UseCountUpResult<T extends HTMLElement = HTMLElement> = {
  value: number
  ref: React.RefObject<T | null>
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

export function useCountUp<T extends HTMLElement = HTMLElement>(
  targetValue: number,
  options?: UseCountUpOptions
): UseCountUpResult<T> {
  const [value, setValue] = useState<number>(0)
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const duration = options?.durationMs ?? 1200
    const threshold = options?.thresholdRatio ?? 0.3

    if (typeof window === "undefined") {
      setValue(targetValue)
      return
    }

    if (!("IntersectionObserver" in window)) {
      setValue(targetValue)
      return
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(targetValue)
      return
    }

    let frameId: number | undefined
    let startTimestamp: number | undefined

    const animate = (timestamp: number): void => {
      if (startTimestamp === undefined) {
        startTimestamp = timestamp
      }

      const elapsed = timestamp - startTimestamp
      const t = Math.min(elapsed / duration, 1)
      const easedValue = Math.round(targetValue * easeOutCubic(t))
      setValue(easedValue)

      if (t < 1) {
        frameId = requestAnimationFrame(animate)
      } else {
        setValue(targetValue)
        observer.disconnect()
      }
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          frameId = requestAnimationFrame(animate)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    const currentRef = ref.current
    if (currentRef !== null) {
      observer.observe(currentRef)
    }

    return () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId)
      }
      observer.disconnect()
    }
  }, [targetValue, options?.durationMs, options?.thresholdRatio])

  return { value, ref }
}
