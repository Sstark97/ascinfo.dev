import { ProfileBlock } from "@/components/bento/profile-block"
import { LatestArticleBlock } from "@/components/bento/latest-article-block"
import { FeaturedProjectBlock } from "@/components/bento/featured-project-block"
import { RecentTalkBlock } from "@/components/bento/recent-talk-block"
import { NavigationDock } from "@/components/bento/navigation-dock"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
          {/* Row 1: Profile (6 cols) + Latest Article (6 cols) */}
          <div className="md:col-span-6">
            <ProfileBlock />
          </div>
          <div className="md:col-span-6">
            <LatestArticleBlock />
          </div>

          {/* Row 2: Featured Project (4 cols) + Recent Talk (4 cols) + Nav Dock (4 cols) */}
          <div className="md:col-span-4">
            <FeaturedProjectBlock />
          </div>
          <div className="md:col-span-4">
            <RecentTalkBlock />
          </div>
          <div className="md:col-span-4">
            <NavigationDock />
          </div>
        </div>
      </div>
    </main>
  )
}
