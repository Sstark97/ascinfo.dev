import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button"

const triggerScroll = (scrollY: number): void => {
  vi.stubGlobal("scrollY", scrollY)
  act(() => {
    window.dispatchEvent(new Event("scroll"))
  })
}

const stubMatchMedia = (matches: boolean): ReturnType<typeof vi.fn> => {
  const matchMediaMock = vi.fn().mockReturnValue({
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
  vi.stubGlobal("matchMedia", matchMediaMock)
  return matchMediaMock
}

describe("ScrollToTopButton", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollY", 0)
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    vi.stubGlobal("cancelAnimationFrame", vi.fn())
    vi.stubGlobal("scrollTo", vi.fn())
    stubMatchMedia(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  describe("visibility", () => {
    it("should be hidden when the page is below the scroll threshold", () => {
      render(<ScrollToTopButton />)

      const button = screen.getByRole("button", { name: "Scroll to top" })

      expect(button.className).toContain("opacity-0")
      expect(button.className).toContain("pointer-events-none")
    })

    it("should remain hidden when scrolling below the threshold", () => {
      render(<ScrollToTopButton />)

      triggerScroll(400)

      const button = screen.getByRole("button", { name: "Scroll to top" })

      expect(button.className).toContain("opacity-0")
    })

    it("should become visible after scrolling past the threshold", () => {
      render(<ScrollToTopButton />)

      triggerScroll(700)

      const button = screen.getByRole("button", { name: "Scroll to top" })

      expect(button.className).toContain("opacity-100")
      expect(button.className).toContain("pointer-events-auto")
    })

    it("should respect a custom threshold prop", () => {
      render(<ScrollToTopButton threshold={100} />)

      triggerScroll(150)

      const button = screen.getByRole("button", { name: "Scroll to top" })

      expect(button.className).toContain("opacity-100")
    })
  })

  describe("click behavior", () => {
    it("should scroll to top with smooth behavior by default", async () => {
      const user = userEvent.setup()
      render(<ScrollToTopButton />)

      const button = screen.getByRole("button", { name: "Scroll to top" })
      await user.click(button)

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })
    })

    it("should scroll to top with auto behavior when prefers-reduced-motion is reduce", async () => {
      stubMatchMedia(true)
      const user = userEvent.setup()
      render(<ScrollToTopButton />)

      const button = screen.getByRole("button", { name: "Scroll to top" })
      await user.click(button)

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" })
    })
  })

  describe("label", () => {
    it("should accept a custom accessible label", () => {
      render(<ScrollToTopButton label="Volver arriba" />)

      expect(screen.getByRole("button", { name: "Volver arriba" })).toBeInTheDocument()
    })
  })
})
