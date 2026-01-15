import { ProfileBlock } from "@/components/bento/profile-block"
import { LatestArticleBlock } from "@/components/bento/latest-article-block"
import { FeaturedProjectBlock } from "@/components/bento/featured-project-block"
import { RecentTalkBlock } from "@/components/bento/recent-talk-block"
import { NavigationDock } from "@/components/bento/navigation-dock"
import { postRepository, projectRepository, talkRepository } from "@/src/lib/content"

export default async function Home(): Promise<React.ReactElement> {
  const [featuredPost, featuredProject, featuredTalk] = await Promise.all([
    postRepository.getFeatured(),
    projectRepository.getFeatured(),
    talkRepository.getFeatured(),
  ])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a1a1a] p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
          {/* Row 1: Profile (6 cols) + Latest Article (6 cols) */}
          <div className="md:col-span-6">
            <ProfileBlock />
          </div>
          <div className="md:col-span-6">
            {featuredPost && (
              <LatestArticleBlock
                slug={featuredPost.slug}
                title={featuredPost.title}
                excerpt={featuredPost.excerpt}
                tag={featuredPost.tags[0] ?? "Blog"}
              />
            )}
          </div>

          {/* Row 2: Featured Project (4 cols) + Recent Talk (4 cols) + Nav Dock (4 cols) */}
          <div className="md:col-span-4">
            {featuredProject && (
              <FeaturedProjectBlock
                slug={featuredProject.slug}
                title={featuredProject.title}
                status={featuredProject.status}
              />
            )}
          </div>
          <div className="md:col-span-4">
            {featuredTalk && (
              <RecentTalkBlock
                title={featuredTalk.title}
                event={featuredTalk.event}
              />
            )}
          </div>
          <div className="md:col-span-4">
            <NavigationDock />
          </div>
        </div>
      </div>
    </main>
  )
}
