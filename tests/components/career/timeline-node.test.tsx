import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimelineNode } from "@/components/career/timeline-node";

describe("TimelineNode", () => {
  it("renders children content", () => {
    render(
      <TimelineNode isActive={false} isPrimary={false}>
        <div>Test Content</div>
      </TimelineNode>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("displays active indicator when isActive is true", () => {
    const { container } = render(
      <TimelineNode isActive={true} isPrimary={false}>
        <div>Content</div>
      </TimelineNode>
    );

    // Active node should have pulsing indicator
    const pulsing = container.querySelector(".animate-pulse");
    expect(pulsing).toBeInTheDocument();
  });

  it("applies primary styling when isPrimary is true", () => {
    const { container } = render(
      <TimelineNode isActive={false} isPrimary={true}>
        <div>Content</div>
      </TimelineNode>
    );

    // Primary node should have orange border
    const indicator = container.querySelector(".border-\\[\\#FCA311\\]");
    expect(indicator).toBeInTheDocument();
  });

  it("does not render vertical line when isLast is true", () => {
    const { container } = render(
      <TimelineNode isActive={false} isPrimary={false} isLast={true}>
        <div>Content</div>
      </TimelineNode>
    );

    // Should not have vertical line
    const verticalLine = container.querySelector(".h-full.w-0\\.5");
    expect(verticalLine).not.toBeInTheDocument();
  });

  it("renders vertical line when isLast is false", () => {
    const { container } = render(
      <TimelineNode isActive={false} isPrimary={false} isLast={false}>
        <div>Content</div>
      </TimelineNode>
    );

    // Should have vertical line
    const verticalLine = container.querySelector(".h-full");
    expect(verticalLine).toBeInTheDocument();
  });

  it("applies correct border color for active state", () => {
    const { container } = render(
      <TimelineNode isActive={true} isPrimary={false}>
        <div>Content</div>
      </TimelineNode>
    );

    // Active should have orange background
    const activeIndicator = container.querySelector(".bg-\\[\\#FCA311\\]");
    expect(activeIndicator).toBeInTheDocument();
  });

  it("applies correct border color for inactive primary state", () => {
    const { container } = render(
      <TimelineNode isActive={false} isPrimary={true}>
        <div>Content</div>
      </TimelineNode>
    );

    // Inactive primary should have orange border but dark background
    const indicator = container.querySelector(".border-\\[\\#FCA311\\].bg-\\[\\#222222\\]");
    expect(indicator).toBeInTheDocument();
  });

  it("applies correct border color for inactive non-primary state", () => {
    const { container } = render(
      <TimelineNode isActive={false} isPrimary={false}>
        <div>Content</div>
      </TimelineNode>
    );

    // Inactive non-primary should have white/20 border
    const indicator = container.querySelector(".border-white\\/20");
    expect(indicator).toBeInTheDocument();
  });
});
