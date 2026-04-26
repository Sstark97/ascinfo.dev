"use client"

import { useState } from "react"
import { ListingGrid } from "@/components/templates/listing-grid"
import { ProjectCard } from "@/components/listings/project-card"
import { SearchAndFilter } from "@/components/search-and-filter"
import type { SearchLabels } from "@/components/search-and-filter"
import type { ProjectDto } from "@/src/lib/content/application/dto/ProjectDto"

interface ProjectLabels {
  code: string
  demo: string
  viewDetails: string
  statusActive: string
  statusMaintenance: string
  statusArchived: string
}

type ProyectosListingClientProps = {
  projects: ProjectDto[]
  allTags: string[]
  title: string
  subtitle: string
  emptyMessage: string
  backLabel: string
  projectLabels: ProjectLabels
  searchLabels: SearchLabels
}

export function ProyectosListingClient({ projects, allTags, title, subtitle, emptyMessage, backLabel, projectLabels, searchLabels }: ProyectosListingClientProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" || `${project.title} ${project.description}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => project.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  return (
    <ListingGrid
      title={title}
      subtitle={subtitle}
      backLabel={backLabel}
      searchAndFilter={
        <SearchAndFilter
          tags={allTags}
          onSearch={setSearchQuery}
          onTagSelect={setSelectedTags}
          selectedTags={selectedTags}
          searchQuery={searchQuery}
          labels={searchLabels}
        />
      }
    >
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              title={project.title}
              description={project.description}
              techStack={project.tags}
              status={project.status}
              githubUrl={project.repoUrl}
              liveUrl={project.demoUrl}
              stars={project.stars}
              forks={project.forks}
              labels={projectLabels}
            />
          ))}
        </div>
      ) : (
        <div className="col-span-full py-12 text-center">
          <p className="text-[#888888]">{emptyMessage}</p>
        </div>
      )}
    </ListingGrid>
  )
}
