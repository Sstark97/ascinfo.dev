import Image from "next/image"

export function ProfileBlock() {
  return (
    <div className="group flex h-full min-h-[280px] flex-col rounded-xl border border-white/5 bg-[#222222] p-6 transition-all duration-300 hover:border-white/10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Profile Image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
          <Image src="/aitor_profile.webp" alt="Aitor Santana" fill className="object-cover" priority />
          {/* Amber glow effect */}
          <div className="absolute inset-0 rounded-xl ring-2 ring-[#FCA311]/20" />
        </div>

        {/* Name and Title */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Aitor Santana</h1>
          <p className="mt-1 font-mono text-sm text-[#FCA311]">Software Crafter</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6 flex-1">
        <p className="text-base leading-relaxed text-muted-foreground">
          Amante del{" "}
          <span className="rounded bg-[#FCA311]/10 px-1.5 py-0.5 font-medium text-[#FCA311]">Código limpio</span>,{" "}
          <span className="rounded bg-[#FCA311]/10 px-1.5 py-0.5 font-medium text-[#FCA311]">TDD</span>, y{" "}
          <span className="rounded bg-[#FCA311]/10 px-1.5 py-0.5 font-medium text-[#FCA311]">
            Arquitecturas escalables
          </span>
          .
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          Aplicando estas prácticas en {" "}
          <a className="rounded bg-[#FCA311]/10 px-1.5 py-0.5 font-medium text-[#FCA311]" href="https://leanmind.es/es">LeanMind</a>,{" "}
        </p>
      </div>

      {/* Home anchor indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-[#FCA311]" />
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">Home</span>
      </div>
    </div>
  )
}
