"use client"

import { ListingGrid } from "@/components/templates/listing-grid"
import { BlogCard } from "@/components/listings/blog-card"
import type { PostDto } from "@/src/lib/content/application/dto/PostDto"

type BlogListingClientProps = {
  posts: PostDto[]
  allTags: string[]
}

export function BlogListingClient({ posts, allTags }: BlogListingClientProps): React.ReactElement {
  return (
    <ListingGrid
      title="Blog"
      subtitle="The Technical Log — Artículos sobre desarrollo de software"
      items={posts}
      allTags={allTags}
      getItemTags={(item) => item.tags}
      getSearchableText={(item) => `${item.title} ${item.excerpt}`}
      renderItem={(item) => (
        <BlogCard
          slug={item.slug}
          title={item.title}
          excerpt={item.excerpt}
          date={item.date}
          readingTime={item.readingTime}
          tags={item.tags}
        />
      )}
      emptyMessage="No se encontraron artículos con esos filtros."
      gridClassName="flex flex-col gap-4"
    />
  )
}
