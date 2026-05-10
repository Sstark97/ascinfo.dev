import { CheckCircle2 } from "lucide-react";
import type { JSX } from "react";

interface ImpactListProps {
  items: string[];
  ariaLabel?: string;
}

export function ImpactList({ items, ariaLabel }: ImpactListProps): JSX.Element | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul aria-label={ariaLabel} className="mb-3 flex flex-col gap-2">
      {items.map((statement) => (
        <li
          key={statement}
          className="flex items-start gap-2 text-sm font-medium text-foreground"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FCA311]" aria-hidden="true" />
          <span>{statement}</span>
        </li>
      ))}
    </ul>
  );
}
