import { Mail, ArrowUpRight } from "lucide-react"

type CtaButtonProps = {
  href: string
  label: string
  ariaLabel: string
}

export function CtaButton({ href, label, ariaLabel }: CtaButtonProps): React.ReactElement {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-all duration-300 hover:bg-[#FCA311]/90 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#FCA311] focus-visible:outline-offset-2"
    >
      <Mail aria-hidden="true" className="h-4 w-4" />
      <span>{label}</span>
      <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  )
}
