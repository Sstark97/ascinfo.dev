import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ProfileBlockContent } from "@/components/bento/profile-block"

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}))

vi.mock("@/components/ui/language-switcher", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}))

describe("ProfileBlockContent", () => {
  const defaultProps = {
    impactSubtitle: "Especializado en arquitecturas limpias y TDD.",
    bio1: <span>Bio paragraph 1</span>,
    bio2: <span>Bio paragraph 2</span>,
    bio3: <span>Bio paragraph 3</span>,
    ctaLabel: "Hablemos",
    ctaAriaLabel: "Enviar email a Aitor Santana",
  }

  it("should display the impact subtitle below the Software Crafter line", () => {
    render(<ProfileBlockContent {...defaultProps} />)

    expect(screen.getByText("Especializado en arquitecturas limpias y TDD.")).toBeInTheDocument()
  })

  it("should display the CTA button with the correct mailto href", () => {
    render(<ProfileBlockContent {...defaultProps} />)

    const ctaLink = screen.getByRole("link", { name: "Enviar email a Aitor Santana" })
    expect(ctaLink).toHaveAttribute("href", "mailto:aitorscinfo@gmail.com")
  })

  it("should keep the existing bio paragraphs", () => {
    render(<ProfileBlockContent {...defaultProps} />)

    expect(screen.getByText("Bio paragraph 1")).toBeInTheDocument()
    expect(screen.getByText("Bio paragraph 2")).toBeInTheDocument()
    expect(screen.getByText("Bio paragraph 3")).toBeInTheDocument()
  })
})
