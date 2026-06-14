import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"

vi.mock("@/hooks/use-scroll-progress", () => ({
  useScrollProgress: vi.fn(() => ({ progress: 0 })),
}))

import { useScrollProgress } from "@/hooks/use-scroll-progress"
import { ReadingProgressBar } from "@/components/detail/reading-progress-bar"

describe("ReadingProgressBar", () => {
  beforeEach(() => {
    vi.spyOn(document, "getElementById").mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("render", () => {
    it("should render progressbar with aria attributes", () => {
      render(<ReadingProgressBar targetId="article-content" />)

      const bar = screen.getByRole("progressbar")

      expect(bar).toBeInTheDocument()
      expect(bar).toHaveAttribute("aria-valuemin", "0")
      expect(bar).toHaveAttribute("aria-valuemax", "100")
      expect(bar).toHaveAttribute("aria-label", "Reading progress")
    })

    it("should accept a custom label via prop", () => {
      render(<ReadingProgressBar targetId="article-content" label="Progreso de lectura" />)

      const bar = screen.getByRole("progressbar")

      expect(bar).toHaveAttribute("aria-label", "Progreso de lectura")
    })

    it("should set aria-valuenow according to scroll progress", () => {
      vi.mocked(useScrollProgress).mockReturnValue({ progress: 0.5 })

      render(<ReadingProgressBar targetId="article-content" />)

      const bar = screen.getByRole("progressbar")

      expect(bar).toHaveAttribute("aria-valuenow", "50")
    })

    it("should not block pointer events", () => {
      render(<ReadingProgressBar targetId="article-content" />)

      const bar = screen.getByRole("progressbar")

      expect(bar.className).toContain("pointer-events-none")
    })

    it("should be positioned fixed at the top", () => {
      render(<ReadingProgressBar targetId="article-content" />)

      const bar = screen.getByRole("progressbar")

      expect(bar.className).toContain("fixed")
      expect(bar.className).toContain("top-0")
    })
  })
})
