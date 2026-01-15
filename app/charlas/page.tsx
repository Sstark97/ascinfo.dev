import { talkRepository } from "@/src/lib/content"
import { CharlasListingClient } from "./charlas-listing-client"

export default async function CharlasPage(): Promise<React.ReactElement> {
  const talks = await talkRepository.getAll()
  const allTags = await talkRepository.getAllTags()

  return <CharlasListingClient talks={talks} allTags={allTags} />
}
