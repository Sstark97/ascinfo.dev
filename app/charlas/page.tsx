import { talks } from "@/src/lib/content"
import { CharlasListingClient } from "./charlas-listing-client"

export default async function CharlasPage(): Promise<React.ReactElement> {
  const [allTalks, allTags] = await Promise.all([
    talks.getAll.execute(),
    talks.getAllTags.execute(),
  ])

  return <CharlasListingClient talks={allTalks.map((talk) => talk.toDto())} allTags={allTags} />
}
