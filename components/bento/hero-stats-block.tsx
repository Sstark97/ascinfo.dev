import { HeroStatsList, type HeroStat } from "@/components/bento/hero-stats-list"

type HeroStatsBlockProps = {
  sectionLabel: string
  stats: readonly HeroStat[]
}

export function HeroStatsBlock({ sectionLabel, stats }: HeroStatsBlockProps): React.ReactElement {
  return (
    <section
      aria-label={sectionLabel}
      className="flex h-full w-full flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10"
    >
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {sectionLabel}
      </span>
      <HeroStatsList stats={stats} />
    </section>
  )
}

export type { HeroStat }
