"use client"

import { useState } from "react"
import { ListingGrid } from "@/components/templates/listing-grid"
import { TalkCard } from "@/components/listings/talk-card"
import { SearchAndFilter } from "@/components/search-and-filter"
import type { SearchLabels } from "@/components/search-and-filter"
import type { TalkDto } from "@/src/lib/content/application/dto/TalkDto"

type CharlasListingClientProps = {
  talks: TalkDto[]
  allTags: string[]
  title: string
  subtitle: string
  emptyMessage: string
  backLabel: string
  searchLabels: SearchLabels
}

export function CharlasListingClient({ talks, allTags, title, subtitle, emptyMessage, backLabel, searchLabels }: CharlasListingClientProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredTalks = talks.filter((talk) => {
    const matchesSearch =
      searchQuery === "" || `${talk.title} ${talk.event}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => talk.tags.includes(tag))
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
      {filteredTalks.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredTalks.map((talk) => (
            <TalkCard
              key={talk.slug}
              slug={talk.slug}
              title={talk.title}
              event={talk.event}
              date={talk.date}
              location={talk.location}
              slidesUrl={talk.slidesUrl}
              videoUrl={talk.videoUrl}
              tags={talk.tags}
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
