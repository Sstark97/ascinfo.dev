import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { HeroStatsBlock } from "@/components/bento/hero-stats-block"
import type { HeroStat } from "@/components/bento/hero-stats-block"

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

describe("HeroStatsBlock", () => {
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

  it("should render the section label", () => {
    render(<HeroStatsBlock sectionLabel="Métricas" stats={mockStats} />)

    expect(screen.getAllByText("Métricas").length).toBeGreaterThan(0)
  })

  it("should render the stats list with provided data", () => {
    render(<HeroStatsBlock sectionLabel="Métricas" stats={mockStats} />)

    expect(screen.getByText("Años de experiencia")).toBeInTheDocument()
    expect(screen.getByText("Artículos técnicos")).toBeInTheDocument()
    expect(screen.getByText("Charlas en conferencias")).toBeInTheDocument()
    expect(screen.getByText("Recomendaciones en LinkedIn")).toBeInTheDocument()
  })

  it("should expose section role with aria-label", () => {
    render(<HeroStatsBlock sectionLabel="Métricas" stats={mockStats} />)

    expect(screen.getByRole("region", { name: "Métricas" })).toBeInTheDocument()
  })
})
