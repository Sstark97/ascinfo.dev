import type React from "react"
import { Info, AlertTriangle } from "lucide-react"

interface CalloutProps {
  type: "info" | "warning"
  title?: string
  children: React.ReactNode
}

export function Callout({ type, title, children }: CalloutProps) {
  const config = {
    info: {
      icon: Info,
      borderColor: "border-l-[#fca311]",
      bgColor: "bg-[#fca311]/5",
      iconColor: "text-[#fca311]",
    },
    warning: {
      icon: AlertTriangle,
      borderColor: "border-l-amber-500",
      bgColor: "bg-amber-500/5",
      iconColor: "text-amber-500",
    },
  }

  const { icon: Icon, borderColor, bgColor, iconColor } = config[type]

  return (
    <div className={`my-6 rounded-r-lg border-l-4 ${borderColor} ${bgColor} p-4`}>
      <div className="flex gap-3">
        <Icon aria-hidden="true" className={`h-5 w-5 shrink-0 ${iconColor}`} />
        <div>
          {title && <p className="mb-1 font-semibold text-[#f5f5f5]">{title}</p>}
          <div className="text-sm leading-relaxed text-[#999999]">{children}</div>
        </div>
      </div>
    </div>
  )
}
