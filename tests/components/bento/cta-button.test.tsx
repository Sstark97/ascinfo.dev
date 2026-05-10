import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { CtaButton } from "@/components/bento/cta-button"

describe("CtaButton", () => {
  it("should render an anchor with the provided href", () => {
    render(
      <CtaButton
        href="mailto:aitorscinfo@gmail.com"
        label="Hablemos"
        ariaLabel="Enviar email a Aitor Santana"
      />
    )

    const anchor = screen.getByRole("link")
    expect(anchor).toHaveAttribute("href", "mailto:aitorscinfo@gmail.com")
  })

  it("should render the visible label", () => {
    render(
      <CtaButton
        href="mailto:aitorscinfo@gmail.com"
        label="Hablemos"
        ariaLabel="Enviar email a Aitor Santana"
      />
    )

    expect(screen.getByText("Hablemos")).toBeInTheDocument()
  })

  it("should expose the aria-label", () => {
    render(
      <CtaButton
        href="mailto:aitorscinfo@gmail.com"
        label="Hablemos"
        ariaLabel="Enviar email a Aitor Santana"
      />
    )

    const anchor = screen.getByRole("link")
    expect(anchor).toHaveAttribute("aria-label", "Enviar email a Aitor Santana")
  })

  it("should not render as a button element", () => {
    render(
      <CtaButton
        href="mailto:aitorscinfo@gmail.com"
        label="Hablemos"
        ariaLabel="Enviar email a Aitor Santana"
      />
    )

    expect(screen.queryByRole("button")).toBeNull()
  })
})
