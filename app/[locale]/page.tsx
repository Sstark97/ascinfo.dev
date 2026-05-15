import { setRequestLocale, getTranslations } from "next-intl/server"
import { ProfileBlock } from "@/components/bento/profile-block"
import { FeaturedPostsBlock } from "@/components/bento/featured-posts-block"
import { FeaturedProjectBlock } from "@/components/bento/featured-project-block"
import { RecentTalkBlock } from "@/components/bento/recent-talk-block"
import { NavigationDock } from "@/components/bento/navigation-dock"
import { HeroStatsBlock } from "@/components/bento/hero-stats-block"
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

  const [tHome, tProject, featuredPosts, featuredProject, featuredTalk, allPosts, allTalks, allProjects] = await Promise.all([
    getTranslations("home"),
    getTranslations("project"),
    posts.getFeaturedList.execute(l, 4),
    projects.getFeatured.execute(l),
    talks.getFeatured.execute(l),
    posts.getAll.execute(l),
    talks.getAll.execute(l),
    projects.getAll.execute(l),
  ])

  const featuredPostsDtos = featuredPosts.map((post) => post.toDto())
  const featuredProjectDto = featuredProject?.toDto()
  const featuredTalkDto = featuredTalk?.toDto()

  const tagCounts = new Map<string, number>()
  for (const post of allPosts) {
    for (const tag of post.toDto().tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
  }
  const topTags = [...tagCounts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag)

  const parseStatValue = (raw: string): number => {
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const heroStats = [
    {
      id: "years-experience",
      value: parseStatValue(tHome("heroStats.yearsExperience.value")),
      suffix: tHome("heroStats.yearsExperience.suffix"),
      label: tHome("heroStats.yearsExperience.label"),
    },
    {
      id: "articles",
      value: allPosts.length,
      label: tHome("heroStats.articlesPublished.label"),
    },
    {
      id: "talks",
      value: allTalks.length,
      label: tHome("heroStats.talksDelivered.label"),
    },
    {
      id: "linkedin",
      value: parseStatValue(tHome("heroStats.linkedinRecommendations.value")),
      label: tHome("heroStats.linkedinRecommendations.label"),
    },
  ] as const

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
              <FeaturedPostsBlock
                posts={featuredPostsDtos}
                sectionLabel={tHome("featuredPosts.label")}
                readingTimeAriaLabel={(time) => tHome("featuredPosts.readingTimeAria", { time })}
                viewAllLabel={tHome("featuredPosts.viewAll")}
                topTags={topTags}
                exploreByTopicLabel={tHome("featuredPosts.exploreByTopic")}
              />
            </div>

            <div className="md:col-span-12">
              <HeroStatsBlock
                sectionLabel={tHome("heroStats.label")}
                stats={heroStats}
              />
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
              <NavigationDock postsCount={allPosts.length} talksCount={allTalks.length} projectsCount={allProjects.length} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
