import type { InternalProject } from "@/src/lib/career/career-data";

interface ProjectSubNodeProps {
  project: InternalProject;
  isLast: boolean;
}

export function ProjectSubNode({ project, isLast }: ProjectSubNodeProps) {
  return (
    <div className="relative flex gap-4 pl-6">
      {/* Dashed Line */}
      <div className="relative flex flex-col items-center">
        {/* Sub-node Indicator */}
        <div
          className={`relative z-10 h-2.5 w-2.5 rounded-full border transition-colors duration-200 ${
            project.isActive
              ? "border-[#FCA311] bg-[#FCA311]/50"
              : "border-white/20 bg-[#222222]"
          }`}
        />

        {/* Dashed Vertical Line */}
        {!isLast && (
          <div className="mt-1 h-full w-px border-l border-dashed border-white/20" />
        )}
      </div>

      {/* Project Card */}
      <div className="flex-1 pb-6">
        <div className="group rounded-lg border border-white/5 bg-[#222222] p-4 transition-all duration-200 hover:border-white/10">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <h4 className="text-base font-semibold text-gray-100">
                {project.name}
              </h4>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {project.dateRange}
              </p>
            </div>
            {project.isActive && (
              <span className="flex items-center gap-1.5 rounded-full bg-[#FCA311]/10 px-2.5 py-1 font-mono text-xs font-medium text-[#FCA311]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FCA311]" />
                Actual
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {/* Stack Tags */}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech: string) => (
              <span
                key={tech}
                className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
