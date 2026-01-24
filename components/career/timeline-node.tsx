import type { ReactNode } from "react";

interface TimelineNodeProps {
  isActive: boolean;
  isPrimary: boolean;
  isLast?: boolean;
  children: ReactNode;
}

export function TimelineNode({ isActive, isPrimary, isLast = false, children }: TimelineNodeProps) {
  return (
    <div className="relative flex gap-6">
      {/* Timeline Line */}
      <div className="relative flex flex-col items-center">
        {/* Node Indicator */}
        <div
          className={`relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
            isActive
              ? "border-[#FCA311] bg-[#FCA311] shadow-lg shadow-[#FCA311]/50"
              : isPrimary
                ? "border-[#FCA311] bg-[#222222]"
                : "border-white/20 bg-[#222222]"
          }`}
        >
          {isActive && (
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          )}
        </div>

        {/* Vertical Line */}
        {!isLast && (
          <div
            className={`mt-1 h-full w-0.5 ${
              isPrimary ? "bg-[#FCA311]/30" : "bg-white/10"
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">{children}</div>
    </div>
  );
}
