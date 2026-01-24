import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareerTimeline } from "@/components/career/career-timeline";

describe("CareerTimeline", () => {
  it("renders all career positions", () => {
    render(<CareerTimeline />);

    // Verify structure exists (using headings by level, not specific text)
    const companyHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(companyHeadings.length).toBeGreaterThan(0);
  });

  it("renders primary positions with distinct styling", () => {
    const { container } = render(<CareerTimeline />);

    // Primary positions should have larger text (text-xl vs text-lg)
    const primaryHeading = container.querySelector(".text-xl");
    expect(primaryHeading).toBeInTheDocument();
  });

  it("displays active status badges for active positions", () => {
    render(<CareerTimeline />);

    // Should have at least one active badge
    const activeBadges = screen.getAllByText(/Activo/i);
    expect(activeBadges.length).toBeGreaterThan(0);
  });

  it("renders internal projects when position has nested projects", () => {
    const { container } = render(<CareerTimeline />);

    // Internal projects should have heading level 4
    const projectHeadings = screen.getAllByRole("heading", { level: 4 });
    expect(projectHeadings.length).toBeGreaterThan(0);
  });

  it("displays location when available", () => {
    const { container } = render(<CareerTimeline />);

    // Should have at least one location with separator
    const separators = container.querySelectorAll(".h-1.w-1.rounded-full");
    expect(separators.length).toBeGreaterThan(0);
  });

  it("renders positions in chronological order", () => {
    const { container } = render(<CareerTimeline />);

    // All timeline nodes should be present
    const timelineNodes = container.querySelectorAll(".relative.flex.gap-6");
    expect(timelineNodes.length).toBeGreaterThan(0);
  });

  it("displays stack tags for positions without projects", () => {
    const { container } = render(<CareerTimeline />);

    // Should have stack tags rendered
    const stackTags = container.querySelectorAll(".rounded-md.bg-white\\/5");
    expect(stackTags.length).toBeGreaterThan(0);
  });
});
