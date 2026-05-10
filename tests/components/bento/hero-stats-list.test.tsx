import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { HeroStatsList } from "@/components/bento/hero-stats-list"
import type { HeroStat } from "@/components/bento/hero-stats-list"

vi.mock("@/hooks/use-count-up", () => ({
  useCountUp: (targetValue: number) => ({
    value: targetValue,
    ref: { current: null },
  }),
}))

const mockStats: readonly HeroStat[] = [
  { id: "years-experience", value: 3, suffix: "+", label: "Años de experiencia" },
  { id: "articles", value: 7, label: "Artículos técnicos" },
  { id: "talks", value: 5, label: "Charlas en conferencias" },
  { id: "linkedin", value: 11, label: "Recomendaciones en LinkedIn" },
]

describe("HeroStatsList", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      }))
    )
  })

  it("should render all stats provided", () => {
    render(<HeroStatsList stats={mockStats} />)

    expect(screen.getByText("Años de experiencia")).toBeInTheDocument()
    expect(screen.getByText("Artículos técnicos")).toBeInTheDocument()
    expect(screen.getByText("Charlas en conferencias")).toBeInTheDocument()
    expect(screen.getByText("Recomendaciones en LinkedIn")).toBeInTheDocument()
  })

  it("should render the suffix when provided", () => {
    render(<HeroStatsList stats={mockStats} />)

    expect(screen.getByText("+")).toBeInTheDocument()
  })

  it("should render without suffix when undefined", () => {
    const statsWithoutSuffix: readonly HeroStat[] = [
      { id: "articles", value: 7, label: "Artículos técnicos" },
    ]
    render(<HeroStatsList stats={statsWithoutSuffix} />)

    expect(screen.queryByText("+")).toBeNull()
  })

  it("should render labels in uppercase mono font class", () => {
    const { container } = render(<HeroStatsList stats={mockStats} />)

    const labelElements = container.querySelectorAll(".font-mono.text-xs.uppercase")
    expect(labelElements.length).toBeGreaterThan(0)
  })

  it("should reach target values after animation when in viewport", () => {
    render(<HeroStatsList stats={mockStats} />)

    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("7")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("11")).toBeInTheDocument()
  })
})
