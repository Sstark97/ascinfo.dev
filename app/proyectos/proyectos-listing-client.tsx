"use client"

import { ListingGrid } from "@/components/templates/listing-grid"
import { ProjectCard } from "@/components/listings/project-card"
import type { ProjectDto } from "@/src/lib/content/application/dto/ProjectDto"

type ProyectosListingClientProps = {
  projects: ProjectDto[]
  allTags: string[]
}

export function ProyectosListingClient({ projects, allTags }: ProyectosListingClientProps): React.ReactElement {
  return (
    <ListingGrid
      title="Proyectos"
      subtitle="Portfolio — Proyectos open source y side projects"
      items={projects}
      allTags={allTags}
      getItemTags={(item) => item.tags}
      getSearchableText={(item) => `${item.title} ${item.description}`}
      renderItem={(item) => (
        <ProjectCard
          slug={item.slug}
          title={item.title}
          description={item.description}
          techStack={item.tags}
          status={item.status}
          githubUrl={item.repoUrl}
          liveUrl={item.demoUrl}
          stars={item.stars}
          forks={item.forks}
        />
      )}
      emptyMessage="No se encontraron proyectos con esos filtros."
      gridClassName="grid gap-6 md:grid-cols-2"
    />
  )
}
