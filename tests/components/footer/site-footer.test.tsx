import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SiteFooterContent } from "@/components/footer/site-footer"

describe("SiteFooterContent", () => {
  const defaultProps = {
    contactTitle: "Contacto",
    emailLabel: "Email",
    emailAddress: "aitorscinfo@gmail.com",
    emailAriaLabel: "Enviar email a Aitor Santana",
    linkedinLabel: "LinkedIn",
    linkedinHandle: "@aitorscinfo",
    linkedinUrl: "https://www.linkedin.com/in/aitorscinfo/",
    linkedinAriaLabel: "Perfil de LinkedIn de Aitor Santana (se abre en una pestaña nueva)",
    githubLabel: "GitHub",
    githubHandle: "@Sstark97",
    githubUrl: "https://github.com/Sstark97",
    githubAriaLabel: "Perfil de GitHub de Aitor Santana (se abre en una pestaña nueva)",
    xLabel: "X",
    xHandle: "@aitorsci",
    xUrl: "https://www.twitter.com/aitorsci",
    xAriaLabel: "Perfil de X (Twitter) de Aitor Santana (se abre en una pestaña nueva)",
    blueskyLabel: "Bluesky",
    blueskyHandle: "@ascinfo.dev",
    blueskyUrl: "https://bsky.app/profile/ascinfo.dev",
    blueskyAriaLabel: "Perfil de Bluesky de Aitor Santana (se abre en una pestaña nueva)",
    copyrightText: "© 2026 Aitor Santana. Hecho con cuidado en Canarias.",
  }

  describe("contact section", () => {
    it("should render the contact section with role contentinfo", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    })

    it("should render all five social links in order: Email, LinkedIn, GitHub, X, Bluesky", () => {
      render(<SiteFooterContent {...defaultProps} />)

      const links = screen.getAllByRole("link")
      expect(links).toHaveLength(5)
      expect(links[0]).toHaveAttribute("href", "mailto:aitorscinfo@gmail.com")
      expect(links[1]).toHaveAttribute("href", "https://www.linkedin.com/in/aitorscinfo/")
      expect(links[2]).toHaveAttribute("href", "https://github.com/Sstark97")
      expect(links[3]).toHaveAttribute("href", "https://www.twitter.com/aitorsci")
      expect(links[4]).toHaveAttribute("href", "https://bsky.app/profile/ascinfo.dev")
    })

    it("should display the visible email address", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByText("aitorscinfo@gmail.com")).toBeInTheDocument()
    })

    it("should render the email link with mailto href and aria-label", () => {
      render(<SiteFooterContent {...defaultProps} />)

      const emailLink = screen.getByRole("link", { name: "Enviar email a Aitor Santana" })
      expect(emailLink).toHaveAttribute("href", "mailto:aitorscinfo@gmail.com")
    })

    it("should render the LinkedIn link with the provided url, target blank and rel noopener", () => {
      render(<SiteFooterContent {...defaultProps} />)

      const linkedinLink = screen.getByRole("link", {
        name: "Perfil de LinkedIn de Aitor Santana (se abre en una pestaña nueva)",
      })
      expect(linkedinLink).toHaveAttribute("href", "https://www.linkedin.com/in/aitorscinfo/")
      expect(linkedinLink).toHaveAttribute("target", "_blank")
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should display the LinkedIn handle as visible text", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByText("@aitorscinfo")).toBeInTheDocument()
    })

    it("should render the GitHub link with the provided url, target blank and rel noopener", () => {
      render(<SiteFooterContent {...defaultProps} />)

      const githubLink = screen.getByRole("link", {
        name: "Perfil de GitHub de Aitor Santana (se abre en una pestaña nueva)",
      })
      expect(githubLink).toHaveAttribute("href", "https://github.com/Sstark97")
      expect(githubLink).toHaveAttribute("target", "_blank")
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should display the GitHub handle as visible text", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByText("@Sstark97")).toBeInTheDocument()
    })

    it("should render the X link with the provided url, target blank and rel noopener", () => {
      render(<SiteFooterContent {...defaultProps} />)

      const xLink = screen.getByRole("link", {
        name: "Perfil de X (Twitter) de Aitor Santana (se abre en una pestaña nueva)",
      })
      expect(xLink).toHaveAttribute("href", "https://www.twitter.com/aitorsci")
      expect(xLink).toHaveAttribute("target", "_blank")
      expect(xLink).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should display the X handle as visible text", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByText("@aitorsci")).toBeInTheDocument()
    })

    it("should render the Bluesky link with the provided url, target blank and rel noopener", () => {
      render(<SiteFooterContent {...defaultProps} />)

      const blueskyLink = screen.getByRole("link", {
        name: "Perfil de Bluesky de Aitor Santana (se abre en una pestaña nueva)",
      })
      expect(blueskyLink).toHaveAttribute("href", "https://bsky.app/profile/ascinfo.dev")
      expect(blueskyLink).toHaveAttribute("target", "_blank")
      expect(blueskyLink).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should display the Bluesky handle as visible text", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(screen.getByText("@ascinfo.dev")).toBeInTheDocument()
    })

    it("should use a centered layout with text-center class on the inner wrapper", () => {
      const { container } = render(<SiteFooterContent {...defaultProps} />)

      const innerWrapper = container.querySelector(".text-center")
      expect(innerWrapper).not.toBeNull()
    })
  })

  describe("copyright section", () => {
    it("should display the copyright text passed via prop", () => {
      render(<SiteFooterContent {...defaultProps} />)

      expect(
        screen.getByText("© 2026 Aitor Santana. Hecho con cuidado en Canarias."),
      ).toBeInTheDocument()
    })
  })
})
