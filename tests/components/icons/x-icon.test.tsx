import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { XIcon } from "@/components/icons/x-icon"

describe("XIcon", () => {
  describe("render()", () => {
    it("should render an svg element", () => {
      const { container } = render(<XIcon />)

      expect(container.querySelector("svg")).not.toBeNull()
    })

    it("should forward the className prop to the svg", () => {
      const { container } = render(<XIcon className="h-4 w-4" />)

      const svg = container.querySelector("svg")
      expect(svg?.getAttribute("class")).toContain("h-4 w-4")
    })

    it("should forward arbitrary svg props such as aria-hidden", () => {
      const { container } = render(<XIcon aria-hidden="true" />)

      const svg = container.querySelector("svg")
      expect(svg?.getAttribute("aria-hidden")).toBe("true")
    })
  })
})
