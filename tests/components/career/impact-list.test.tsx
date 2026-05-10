import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImpactList } from "@/components/career/impact-list";

describe("ImpactList", () => {
  it("should render one list item per item in the array", () => {
    const items = ["Bullet A", "Bullet B", "Bullet C"];

    render(<ImpactList items={items} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
    expect(screen.getByText("Bullet A")).toBeInTheDocument();
    expect(screen.getByText("Bullet B")).toBeInTheDocument();
    expect(screen.getByText("Bullet C")).toBeInTheDocument();
  });

  it("should apply the provided aria-label to the list element", () => {
    const items = ["x"];
    const ariaLabel = "Impacto";

    render(<ImpactList items={items} ariaLabel={ariaLabel} />);

    expect(screen.getByRole("list", { name: "Impacto" })).toBeInTheDocument();
  });

  it("should render nothing when items array is empty", () => {
    const { container } = render(<ImpactList items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("should render one icon per bullet item", () => {
    const items = ["a", "b"];

    const { container } = render(<ImpactList items={items} />);

    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });
});
