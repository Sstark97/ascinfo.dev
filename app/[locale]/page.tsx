import { setRequestLocale, getTranslations } from "next-intl/server"
import { ProfileBlock } from "@/components/bento/profile-block"
import { LatestArticleBlock } from "@/components/bento/latest-article-block"
import { FeaturedProjectBlock } from "@/components/bento/featured-project-block"
import { RecentTalkBlock } from "@/components/bento/recent-talk-block"
import { NavigationDock } from "@/components/bento/navigation-dock"
import { JsonLd } from "@/components/json-ld"
import { posts, projects, talks } from "@/src/lib/content"
import { PersonSchemaBuilder } from "@/src/lib/seo"
import { ProfilePageSchemaBuilder } from "@/src/lib/seo/schema-builders/ProfilePageSchemaBuilder"
import type { Locale } from "@/src/lib/content/domain/types/Locale"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props): Promise<React.ReactElement> {
  const { locale } = await params
  setRequestLocale(locale)

  const l = locale as Locale

  const [tHome, tProject, featuredPost, featuredProject, featuredTalk, allPosts] = await Promise.all([
    getTranslations("home"),
    getTranslations("project"),
    posts.getFeatured.execute(l),
    projects.getFeatured.execute(l),
    talks.getFeatured.execute(l),
    posts.getAll.execute(l),
  ])

  const featuredPostDto = featuredPost?.toDto()
  const featuredProjectDto = featuredProject?.toDto()
  const featuredTalkDto = featuredTalk?.toDto()

  const recentPosts = allPosts
    .filter((post) => post.slug !== featuredPost?.slug)
    .slice(0, 2)
    .map((post) => post.toDto())

  const personSchema = PersonSchemaBuilder.build()
  const profilePageSchema = ProfilePageSchemaBuilder.build()

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={profilePageSchema} />
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-[#1a1a1a] p-4 md:p-6 lg:p-8">
        <h1 className="sr-only">Aitor Santana Cabrera - Software Crafter</h1>
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
            <div className="md:col-span-6 flex">
              <ProfileBlock />
            </div>
            <div className="md:col-span-6 flex">
              {featuredPostDto && (
                <LatestArticleBlock
                  slug={featuredPostDto.slug}
                  title={featuredPostDto.title}
                  excerpt={featuredPostDto.excerpt}
                  tags={featuredPostDto.tags}
                  recentPosts={recentPosts}
                  latestArticleLabel={tHome("latestArticle")}
                  previousLabel={tHome("previous")}
                />
              )}
            </div>

            <div className="md:col-span-4">
              {featuredProjectDto && (
                <FeaturedProjectBlock
                  slug={featuredProjectDto.slug}
                  title={featuredProjectDto.title}
                  status={featuredProjectDto.status}
                  featuredProjectLabel={tHome("featuredProject")}
                  viewProjectLabel={tHome("viewProject")}
                  statusLabel={{ active: tProject("statusActive"), maintenance: tProject("statusMaintenance"), archived: tProject("statusArchived") }[featuredProjectDto.status]}
                />
              )}
            </div>
            <div className="md:col-span-4">
              {featuredTalkDto && (
                <RecentTalkBlock
                  slug={featuredTalkDto.slug}
                  title={featuredTalkDto.title}
                  event={featuredTalkDto.event}
                  recentTalkLabel={tHome("recentTalk")}
                  viewTalkLabel={tHome("viewTalk")}
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
