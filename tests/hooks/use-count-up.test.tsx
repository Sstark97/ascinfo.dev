import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useCountUp } from "@/hooks/use-count-up"

class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  trigger(isIntersecting: boolean): void {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    )
  }
}

const mockMatchMedia = (matches: boolean): void => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}

describe("useCountUp", () => {
  let mockObserver: MockIntersectionObserver

  beforeEach(() => {
    mockMatchMedia(false)

    class TrackedObserver extends MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        super(callback)
        mockObserver = this
      }
    }

    mockObserver = new MockIntersectionObserver(() => {})
    vi.stubGlobal("IntersectionObserver", TrackedObserver)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe("when prefers-reduced-motion is reduce", () => {
    it("should return target value immediately without animation", () => {
      mockMatchMedia(true)

      const { result } = renderHook(() => useCountUp(42))

      expect(result.current.value).toBe(42)
    })
  })

  describe("when IntersectionObserver triggers", () => {
    it("should start at 0 before observer fires", () => {
      const { result } = renderHook(() => useCountUp(10))

      expect(result.current.value).toBe(0)
    })

    it("should reach target value after animation completes", async () => {
      const { result } = renderHook(() => useCountUp(100, { durationMs: 1200 }))

      act(() => {
        mockObserver.trigger(true)
      })

      await act(async () => {
        vi.advanceTimersByTime(1200)
        await Promise.resolve()
      })

      expect(result.current.value).toBe(100)
    })

    it("should disconnect the observer once animation completes", async () => {
      renderHook(() => useCountUp(50, { durationMs: 1200 }))

      act(() => {
        mockObserver.trigger(true)
      })

      await act(async () => {
        vi.advanceTimersByTime(1500)
        await Promise.resolve()
      })

      expect(mockObserver.disconnect).toHaveBeenCalled()
    })
  })

  describe("when component unmounts mid-animation", () => {
    it("should cancel the animation frame", () => {
      const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame")

      const { result, unmount } = renderHook(() => useCountUp(100, { durationMs: 1200 }))

      act(() => {
        mockObserver.trigger(true)
      })

      unmount()

      expect(cancelAnimationFrameSpy).toHaveBeenCalled()
      expect(result.current.value).toBeLessThanOrEqual(100)
    })
  })
})
