"use client"

import { useState } from "react"
import { ListingGrid } from "@/components/templates/listing-grid"
import { BlogCard } from "@/components/listings/blog-card"
import { SearchAndFilter } from "@/components/search-and-filter"
import type { SearchLabels } from "@/components/search-and-filter"
import type { PostDto } from "@/src/lib/content/application/dto/PostDto"

type BlogListingClientProps = {
  posts: PostDto[]
  allTags: string[]
  title: string
  subtitle: string
  emptyMessage: string
  backLabel: string
  searchLabels: SearchLabels
}

export function BlogListingClient({ posts, allTags, title, subtitle, emptyMessage, backLabel, searchLabels }: BlogListingClientProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" || `${post.title} ${post.excerpt}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => post.tags.includes(tag))
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
      {filteredPosts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              readingTime={post.readingTime}
              tags={post.tags}
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
