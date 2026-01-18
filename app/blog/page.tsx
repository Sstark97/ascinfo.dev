import { posts } from "@/src/lib/content"
import { BlogListingClient } from "./blog-listing-client"

export default async function BlogPage(): Promise<React.ReactElement> {
  const [allPosts, allTags] = await Promise.all([
    posts.getAll.execute(),
    posts.getAllTags.execute(),
  ])

  return <BlogListingClient posts={allPosts.map((post) => post.toDto())} allTags={allTags} />
}
