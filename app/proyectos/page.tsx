import { projectRepository } from "@/src/lib/content"
import { ProyectosListingClient } from "./proyectos-listing-client"

export default async function ProyectosPage(): Promise<React.ReactElement> {
  const projects = await projectRepository.getAll()
  const allTags = await projectRepository.getAllTags()

  return <ProyectosListingClient projects={projects} allTags={allTags} />
}
