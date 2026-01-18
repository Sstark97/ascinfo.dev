import { projects } from "@/src/lib/content"
import { ProyectosListingClient } from "./proyectos-listing-client"

export default async function ProyectosPage(): Promise<React.ReactElement> {
  const [allProjects, allTags] = await Promise.all([
    projects.getAll.execute(),
    projects.getAllTags.execute(),
  ])

  return <ProyectosListingClient projects={allProjects.map((project) => project.toDto())} allTags={allTags} />
}
