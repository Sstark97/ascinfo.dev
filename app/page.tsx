import { ProfileBlock } from "@/components/bento/profile-block"
import { LatestArticleBlock } from "@/components/bento/latest-article-block"
import { FeaturedProjectBlock } from "@/components/bento/featured-project-block"
import { RecentTalkBlock } from "@/components/bento/recent-talk-block"
import { NavigationDock } from "@/components/bento/navigation-dock"
import { JsonLd } from "@/components/json-ld"
import { posts, projects, talks } from "@/src/lib/content"
import { PersonSchemaBuilder } from "@/src/lib/seo"
import { ProfilePageSchemaBuilder } from "@/src/lib/seo/schema-builders/ProfilePageSchemaBuilder"

export default async function Home(): Promise<React.ReactElement> {
  const [featuredPost, featuredProject, featuredTalk] = await Promise.all([
    posts.getFeatured.execute(),
    projects.getFeatured.execute(),
    talks.getFeatured.execute(),
  ])

  const featuredPostDto = featuredPost?.toDto()
  const featuredProjectDto = featuredProject?.toDto()
  const featuredTalkDto = featuredTalk?.toDto()

  const personSchema = PersonSchemaBuilder.build()
  const profilePageSchema = ProfilePageSchemaBuilder.build()

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={profilePageSchema} />
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-[#1a1a1a] p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
          {/* Row 1: Profile (6 cols) + Latest Article (6 cols) */}
          <div className="md:col-span-6">
            <ProfileBlock />
          </div>
          <div className="md:col-span-6">
            {featuredPostDto && (
              <LatestArticleBlock
                slug={featuredPostDto.slug}
                title={featuredPostDto.title}
                excerpt={featuredPostDto.excerpt}
                tag={featuredPostDto.tags[0] ?? "Blog"}
              />
            )}
          </div>

          {/* Row 2: Featured Project (4 cols) + Recent Talk (4 cols) + Nav Dock (4 cols) */}
          <div className="md:col-span-4">
            {featuredProjectDto && (
              <FeaturedProjectBlock
                slug={featuredProjectDto.slug}
                title={featuredProjectDto.title}
                status={featuredProjectDto.status}
              />
            )}
          </div>
          <div className="md:col-span-4">
            {featuredTalkDto && (
              <RecentTalkBlock
                slug={featuredTalkDto.slug}
                title={featuredTalkDto.title}
                event={featuredTalkDto.event}
              />
            )}
          </div>
          <div className="md:col-span-4">
            <NavigationDock />
          </div>
        </div>
        </div>
      </main>
    </>
  )
}
