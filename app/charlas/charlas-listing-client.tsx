"use client"

import { ListingGrid } from "@/components/templates/listing-grid"
import { TalkCard } from "@/components/listings/talk-card"
import type { TalkDto } from "@/src/lib/content/application/dto/TalkDto"

type CharlasListingClientProps = {
  talks: TalkDto[]
  allTags: string[]
}

export function CharlasListingClient({ talks, allTags }: CharlasListingClientProps): React.ReactElement {
  return (
    <ListingGrid
      title="Charlas"
      subtitle="Talks & Events — Conferencias y workshops"
      items={talks}
      allTags={allTags}
      getItemTags={(item) => item.tags}
      getSearchableText={(item) => `${item.title} ${item.event}`}
      renderItem={(item) => (
        <TalkCard
          slug={item.slug}
          title={item.title}
          event={item.event}
          date={item.date}
          location={item.location}
          slidesUrl={item.slidesUrl}
          videoUrl={item.videoUrl}
          tags={item.tags}
        />
      )}
      emptyMessage="No se encontraron charlas con esos filtros."
      gridClassName="flex flex-col gap-4"
    />
  )
}
