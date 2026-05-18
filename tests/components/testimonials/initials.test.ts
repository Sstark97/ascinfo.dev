import { describe, it, expect } from "vitest"
import { computeInitials } from "@/components/testimonials/initials"

describe("computeInitials", () => {
  it("should return '?' when author is empty string", () => {
    expect(computeInitials("")).toBe("?")
  })

  it("should return first two letters uppercased for a single-word author", () => {
    expect(computeInitials("alice")).toBe("AL")
  })

  it("should return first and last initials uppercased for a two-word author", () => {
    expect(computeInitials("Alice Example")).toBe("AE")
  })

  it("should return first and last initials for an author with middle names", () => {
    expect(computeInitials("Alice Marie Example Builder")).toBe("AB")
  })

  it("should trim whitespace before computing initials", () => {
    expect(computeInitials("  Bob Builder  ")).toBe("BB")
  })
})
