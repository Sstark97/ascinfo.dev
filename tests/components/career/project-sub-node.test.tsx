import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectSubNode } from "@/components/career/project-sub-node";
import type { InternalProject } from "@/src/lib/career/career-data";

const mockActiveProject: InternalProject = {
  name: "Test Project",
  dateRange: "Jan 2024 - Present",
  stack: ["React", "TypeScript"],
  description: "Test description",
  isActive: true,
};

const mockInactiveProject: InternalProject = {
  name: "Past Project",
  dateRange: "Jan 2023 - Dec 2023",
  stack: ["Vue", "JavaScript"],
  description: "Past project description",
  isActive: false,
};

describe("ProjectSubNode", () => {
  it("renders project name as heading", () => {
    render(<ProjectSubNode project={mockActiveProject} isLast={false} />);

    const heading = screen.getByRole("heading", { level: 4 });
    expect(heading).toBeInTheDocument();
  });

  it("displays date range", () => {
    render(<ProjectSubNode project={mockActiveProject} isLast={false} />);

    expect(screen.getByText(mockActiveProject.dateRange)).toBeInTheDocument();
  });

  it("displays active badge when project is active", () => {
    render(<ProjectSubNode project={mockActiveProject} isLast={false} />);

    expect(screen.getByText("Actual")).toBeInTheDocument();
  });

  it("does not display active badge when project is inactive", () => {
    render(<ProjectSubNode project={mockInactiveProject} isLast={false} />);

    expect(screen.queryByText("Actual")).not.toBeInTheDocument();
  });

  it("renders all stack technologies", () => {
    render(<ProjectSubNode project={mockActiveProject} isLast={false} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("displays project description", () => {
    render(<ProjectSubNode project={mockActiveProject} isLast={false} />);

    expect(screen.getByText(mockActiveProject.description)).toBeInTheDocument();
  });

  it("renders dashed vertical line when not last", () => {
    const { container } = render(<ProjectSubNode project={mockActiveProject} isLast={false} />);

    const dashedLine = container.querySelector(".border-dashed");
    expect(dashedLine).toBeInTheDocument();
  });

  it("does not render vertical line when is last", () => {
    const { container } = render(<ProjectSubNode project={mockActiveProject} isLast={true} />);

    const dashedLine = container.querySelector(".border-dashed");
    expect(dashedLine).not.toBeInTheDocument();
  });

  it("applies active indicator styling when active", () => {
    const { container } = render(<ProjectSubNode project={mockActiveProject} isLast={false} />);

    // Active project should have orange indicator
    const activeIndicator = container.querySelector(".bg-\\[\\#FCA311\\]\\/50");
    expect(activeIndicator).toBeInTheDocument();
  });

  it("applies inactive indicator styling when inactive", () => {
    const { container } = render(<ProjectSubNode project={mockInactiveProject} isLast={false} />);

    // Inactive should have white/20 border
    const inactiveIndicator = container.querySelector(".border-white\\/20");
    expect(inactiveIndicator).toBeInTheDocument();
  });

  it("renders card with hover effect", () => {
    const { container } = render(<ProjectSubNode project={mockActiveProject} isLast={false} />);

    const card = container.querySelector(".hover\\:border-white\\/10");
    expect(card).toBeInTheDocument();
  });
});
