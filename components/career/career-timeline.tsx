import { getCareerData } from "@/src/lib/career/career-data";
import type { CareerPosition } from "@/src/lib/career/career-data";
import { getTranslations, getLocale } from "next-intl/server";
import { TimelineNode } from "./timeline-node";
import { ProjectSubNode } from "./project-sub-node";

interface CareerTimelineContentProps {
  careerData: CareerPosition[]
  activeLabel: string
}

export function CareerTimelineContent({ careerData, activeLabel }: CareerTimelineContentProps) {
  return (
    <div className="relative">
      {careerData.map((position: CareerPosition, index: number) => (
        <TimelineNode
          key={`${position.company}-${position.dateRange}`}
          isActive={position.isActive}
          isPrimary={position.isPrimary}
          isLast={index === careerData.length - 1}
        >
          <div
            className={`group rounded-xl border transition-all duration-200 ${
              position.isPrimary
                ? "border-white/5 bg-[#222222] p-6 hover:border-[#FCA311]/20"
                : "border-white/5 bg-[#222222] p-5 hover:border-white/10"
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3
                  className={`${position.isPrimary ? "text-xl" : "text-lg"} font-bold text-gray-100`}
                >
                  {position.company}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#FCA311]">
                  {position.role}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <span>{position.dateRange}</span>
                  {position.location && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{position.location}</span>
                    </>
                  )}
                </div>
              </div>
              {position.isActive && (
                <span className="flex items-center gap-1.5 rounded-full bg-[#FCA311]/10 px-3 py-1.5 font-mono text-xs font-medium text-[#FCA311]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FCA311]" />
                  {activeLabel}
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {position.description}
            </p>

            {position.stack && position.stack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {position.stack.map((tech: string) => (
                  <span
                    key={tech}
                    className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {position.projects && position.projects.length > 0 && (
            <div className="mt-4">
              {position.projects.map((project, projectIndex: number) => (
                <ProjectSubNode
                  key={`${project.name}-${project.dateRange}`}
                  project={project}
                  isLast={projectIndex === position.projects!.length - 1}
                />
              ))}
            </div>
          )}
        </TimelineNode>
      ))}
    </div>
  )
}

export async function CareerTimeline() {
  const locale = await getLocale()
  const t = await getTranslations("career")
  const careerData = getCareerData(locale)
  return <CareerTimelineContent careerData={careerData} activeLabel={t("active")} />
}
