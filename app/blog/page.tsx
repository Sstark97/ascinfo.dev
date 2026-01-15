import { postRepository } from "@/src/lib/content"
import { BlogListingClient } from "./blog-listing-client"

export default async function BlogPage(): Promise<React.ReactElement> {
  const posts = await postRepository.getAll()
  const allTags = await postRepository.getAllTags()

  return <BlogListingClient posts={posts} allTags={allTags} />
}
