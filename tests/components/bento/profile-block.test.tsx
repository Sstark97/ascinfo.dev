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
    bio1: <span>Hola, soy Aitor. Desarrollador de Software.</span>,
    bio2: <span>Mi especialidad está en Clean Code y Arquitectura Hexagonal.</span>,
    skills: ["TypeScript", ".NET", "TDD"],
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

  it("should render the first bio paragraph", () => {
    render(<ProfileBlockContent {...defaultProps} />)

    expect(screen.getByText("Hola, soy Aitor. Desarrollador de Software.")).toBeInTheDocument()
  })

  it("should render the second bio paragraph", () => {
    render(<ProfileBlockContent {...defaultProps} />)

    expect(screen.getByText("Mi especialidad está en Clean Code y Arquitectura Hexagonal.")).toBeInTheDocument()
  })

  it("should render both bio paragraphs independently", () => {
    render(<ProfileBlockContent {...defaultProps} />)

    const bio1 = screen.getByText("Hola, soy Aitor. Desarrollador de Software.")
    const bio2 = screen.getByText("Mi especialidad está en Clean Code y Arquitectura Hexagonal.")
    expect(bio1).toBeInTheDocument()
    expect(bio2).toBeInTheDocument()
  })

  it("should render a skill pill for each skill in the rail", () => {
    render(<ProfileBlockContent {...defaultProps} />)

    expect(screen.getByText("TypeScript")).toBeInTheDocument()
    expect(screen.getByText(".NET")).toBeInTheDocument()
    expect(screen.getByText("TDD")).toBeInTheDocument()
  })

  it("should not render the skill rail when skills array is empty", () => {
    render(<ProfileBlockContent {...defaultProps} skills={[]} />)

    expect(screen.queryByLabelText("Stack")).not.toBeInTheDocument()
  })

  it("should not render the HOME indicator anymore", () => {
    render(<ProfileBlockContent {...defaultProps} />)

    expect(screen.queryByText("Home")).not.toBeInTheDocument()
  })
})
