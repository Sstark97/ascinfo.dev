"use client"

import { useCountUp } from "@/hooks/use-count-up"

export type HeroStat = {
  id: string
  value: number
  suffix?: string
  label: string
}

type HeroStatsListProps = {
  stats: readonly HeroStat[]
}

type HeroStatItemProps = {
  stat: HeroStat
}

function HeroStatItem({ stat }: HeroStatItemProps): React.ReactElement {
  const { value, ref } = useCountUp<HTMLLIElement>(stat.value)

  return (
    <li ref={ref} className="flex flex-col items-start gap-1">
      <span className="text-3xl font-bold text-foreground md:text-4xl">
        {value}
        {stat.suffix !== undefined && (
          <span className="text-[#FCA311]">{stat.suffix}</span>
        )}
      </span>
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {stat.label}
      </span>
    </li>
  )
}

export function HeroStatsList({ stats }: HeroStatsListProps): React.ReactElement {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {stats.map((stat) => (
        <HeroStatItem key={stat.id} stat={stat} />
      ))}
    </ul>
  )
}
