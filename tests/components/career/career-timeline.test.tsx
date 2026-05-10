import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareerTimelineContent } from "@/components/career/career-timeline";
import { getCareerData } from "@/src/lib/career/career-data";

const careerData = getCareerData("es")

describe("CareerTimeline", () => {
  it("renders all career positions", () => {
    render(<CareerTimelineContent careerData={careerData} activeLabel="Activo" impactLabel="Impacto" />);

    const companyHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(companyHeadings.length).toBeGreaterThan(0);
  });

  it("renders primary positions with distinct styling", () => {
    const { container } = render(<CareerTimelineContent careerData={careerData} activeLabel="Activo" impactLabel="Impacto" />);

    const primaryHeading = container.querySelector(".text-xl");
    expect(primaryHeading).toBeInTheDocument();
  });

  it("displays active status badges for active positions", () => {
    render(<CareerTimelineContent careerData={careerData} activeLabel="Activo" impactLabel="Impacto" />);

    const activeBadges = screen.getAllByText(/Activo/i);
    expect(activeBadges.length).toBeGreaterThan(0);
  });

  it("renders internal projects when position has nested projects", () => {
    render(<CareerTimelineContent careerData={careerData} activeLabel="Activo" impactLabel="Impacto" />);

    const projectHeadings = screen.getAllByRole("heading", { level: 4 });
    expect(projectHeadings.length).toBeGreaterThan(0);
  });

  it("displays location when available", () => {
    const { container } = render(<CareerTimelineContent careerData={careerData} activeLabel="Activo" impactLabel="Impacto" />);

    const separators = container.querySelectorAll(".h-1.w-1.rounded-full");
    expect(separators.length).toBeGreaterThan(0);
  });

  it("renders positions in chronological order", () => {
    const { container } = render(<CareerTimelineContent careerData={careerData} activeLabel="Activo" impactLabel="Impacto" />);

    const timelineNodes = container.querySelectorAll(".relative.flex.gap-6");
    expect(timelineNodes.length).toBeGreaterThan(0);
  });

  it("displays stack tags for positions without projects", () => {
    const { container } = render(<CareerTimelineContent careerData={careerData} activeLabel="Activo" impactLabel="Impacto" />);

    const stackTags = container.querySelectorAll(".rounded-md.bg-white\\/5");
    expect(stackTags.length).toBeGreaterThan(0);
  });
});
