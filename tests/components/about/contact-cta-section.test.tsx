import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ContactCtaSectionContent } from "@/components/about/contact-cta-section"

describe("ContactCtaSectionContent", () => {
  const defaultProps = {
    title: "¿Hablamos?",
    description: "Si tienes un proyecto entre manos, escríbeme.",
    primaryLabel: "Enviar email",
    primaryAriaLabel: "Enviar email a Aitor Santana",
    secondaryLabel: "Conectar en LinkedIn",
    secondaryAriaLabel: "Conectar con Aitor Santana en LinkedIn (se abre en una pestaña nueva)",
  }

  describe("title and description", () => {
    it("should render the section title as a heading", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      expect(screen.getByRole("heading", { name: "¿Hablamos?" })).toBeInTheDocument()
    })

    it("should render the description paragraph", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      expect(
        screen.getByText("Si tienes un proyecto entre manos, escríbeme."),
      ).toBeInTheDocument()
    })
  })

  describe("primary CTA", () => {
    it("should render a mailto link with the primary aria-label", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      const primary = screen.getByRole("link", { name: "Enviar email a Aitor Santana" })
      expect(primary).toHaveAttribute("href", "mailto:aitorscinfo@gmail.com")
    })

    it("should display the primary label text", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      expect(screen.getByText("Enviar email")).toBeInTheDocument()
    })
  })

  describe("secondary CTA", () => {
    it("should render the LinkedIn link with target blank and rel noopener", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      const secondary = screen.getByRole("link", {
        name: "Conectar con Aitor Santana en LinkedIn (se abre en una pestaña nueva)",
      })
      expect(secondary).toHaveAttribute("href", "https://www.linkedin.com/in/aitorscinfo/")
      expect(secondary).toHaveAttribute("target", "_blank")
      expect(secondary).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should display the secondary label text", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      expect(screen.getByText("Conectar en LinkedIn")).toBeInTheDocument()
    })
  })

  describe("section landmark", () => {
    it("should expose a region with the title as accessible name", () => {
      render(<ContactCtaSectionContent {...defaultProps} />)

      const section = screen.getByRole("region", { name: "¿Hablamos?" })
      expect(section).toBeInTheDocument()
    })
  })
})
