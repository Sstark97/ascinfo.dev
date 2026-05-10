import React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { NavigationDock } from "@/components/bento/navigation-dock"

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      blog: "Blog",
      talks: "Charlas",
      projects: "Proyectos",
      about: "Sobre mí",
      sectionsLabel: "Secciones",
    }
    return dict[key] ?? key
  },
}))

vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe("NavigationDock", () => {
  describe("rendering", () => {
    it("should render a nav with sectionsLabel as accessible name", () => {
      render(<NavigationDock postsCount={21} talksCount={4} projectsCount={7} />)

      expect(screen.getByRole("navigation", { name: "Secciones" })).toBeInTheDocument()
    })

    it("should render the four section links (blog, talks, projects, about)", () => {
      render(<NavigationDock postsCount={21} talksCount={4} projectsCount={7} />)

      expect(screen.getByRole("link", { name: /Blog/i })).toBeInTheDocument()
      expect(screen.getByRole("link", { name: /Charlas/i })).toBeInTheDocument()
      expect(screen.getByRole("link", { name: /Proyectos/i })).toBeInTheDocument()
      expect(screen.getByRole("link", { name: /Sobre mí/i })).toBeInTheDocument()
    })

    it("should render count badges only for blog, talks, and projects", () => {
      render(<NavigationDock postsCount={21} talksCount={4} projectsCount={7} />)

      expect(screen.getByText("21")).toBeInTheDocument()
      expect(screen.getByText("4")).toBeInTheDocument()
      expect(screen.getByText("7")).toBeInTheDocument()
    })

    it("should NOT render a count badge for about (Sobre mí)", () => {
      render(<NavigationDock postsCount={21} talksCount={4} projectsCount={7} />)

      const aboutLink = screen.getByRole("link", { name: /Sobre mí/i })
      expect(aboutLink.querySelector(".bg-\\[\\#FCA311\\]\\/10")).toBeNull()
    })

    it("should display the provided counts as text inside badges", () => {
      render(<NavigationDock postsCount={42} talksCount={8} projectsCount={15} />)

      expect(screen.getByText("42")).toBeInTheDocument()
      expect(screen.getByText("8")).toBeInTheDocument()
      expect(screen.getByText("15")).toBeInTheDocument()
    })
  })
})
