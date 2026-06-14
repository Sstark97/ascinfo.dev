import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useScrollProgress } from "@/hooks/use-scroll-progress"
import React from "react"

describe("useScrollProgress", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollY", 0)
    vi.stubGlobal("innerHeight", 800)
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
    vi.stubGlobal("cancelAnimationFrame", vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("when no targetRef is provided", () => {
    it("should return 0 progress when scrollY is 0", () => {
      vi.spyOn(document.documentElement, "getBoundingClientRect").mockReturnValue({
        top: 0,
        height: 2000,
        bottom: 2000,
        left: 0,
        right: 1024,
        width: 1024,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })

      const { result } = renderHook(() => useScrollProgress())

      expect(result.current.progress).toBe(0)
    })

    it("should return 1 progress when element is fully scrolled past viewport", () => {
      vi.spyOn(document.documentElement, "getBoundingClientRect").mockReturnValue({
        top: -1200,
        height: 2000,
        bottom: 800,
        left: 0,
        right: 1024,
        width: 1024,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })
      vi.stubGlobal("scrollY", 1200)

      const { result } = renderHook(() => useScrollProgress())

      expect(result.current.progress).toBe(1)
    })

    it("should clamp progress between 0 and 1 when scrollY is negative", () => {
      vi.spyOn(document.documentElement, "getBoundingClientRect").mockReturnValue({
        top: 100,
        height: 2000,
        bottom: 2100,
        left: 0,
        right: 1024,
        width: 1024,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })
      vi.stubGlobal("scrollY", 0)

      const { result } = renderHook(() => useScrollProgress())

      expect(result.current.progress).toBeGreaterThanOrEqual(0)
      expect(result.current.progress).toBeLessThanOrEqual(1)
    })
  })

  describe("when targetRef points to an element", () => {
    it("should return 0 progress when element is fully below viewport", () => {
      const element = document.createElement("div")
      vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
        top: 2000,
        height: 1000,
        bottom: 3000,
        left: 0,
        right: 1024,
        width: 1024,
        x: 0,
        y: 2000,
        toJSON: () => ({}),
      })
      vi.stubGlobal("scrollY", 0)

      const ref = { current: element }
      const { result } = renderHook(() => useScrollProgress({ targetRef: ref }))

      expect(result.current.progress).toBe(0)
    })

    it("should update progress on scroll event", () => {
      const element = document.createElement("div")
      const getBoundingClientRectMock = vi.spyOn(element, "getBoundingClientRect")

      getBoundingClientRectMock.mockReturnValue({
        top: 0,
        height: 1600,
        bottom: 1600,
        left: 0,
        right: 1024,
        width: 1024,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })
      vi.stubGlobal("scrollY", 0)

      const ref = { current: element }
      const { result } = renderHook(() => useScrollProgress({ targetRef: ref }))

      expect(result.current.progress).toBe(0)

      getBoundingClientRectMock.mockReturnValue({
        top: -400,
        height: 1600,
        bottom: 1200,
        left: 0,
        right: 1024,
        width: 1024,
        x: 0,
        y: -400,
        toJSON: () => ({}),
      })
      vi.stubGlobal("scrollY", 400)

      act(() => {
        window.dispatchEvent(new Event("scroll"))
      })

      expect(result.current.progress).toBeGreaterThan(0)
      expect(result.current.progress).toBeLessThanOrEqual(1)
    })
  })

  describe("on unmount", () => {
    it("should remove scroll listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener")

      vi.spyOn(document.documentElement, "getBoundingClientRect").mockReturnValue({
        top: 0,
        height: 2000,
        bottom: 2000,
        left: 0,
        right: 1024,
        width: 1024,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })

      const { unmount } = renderHook(() => useScrollProgress())
      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function))
    })
  })
})
