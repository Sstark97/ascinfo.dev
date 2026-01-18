import { talks } from "@/src/lib/content"
import { CharlasListingClient } from "./charlas-listing-client"

export default async function CharlasPage(): Promise<React.ReactElement> {
  const allTalks = await talks.getAll.execute()
  const allTags = await talks.getAllTags.execute()

  return <CharlasListingClient talks={allTalks.map((talk) => talk.toDto())} allTags={allTags} />
}
