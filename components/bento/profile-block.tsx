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
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Aitor Santana</h2>
          <p className="mt-1 font-mono text-sm text-[#FCA311]">Software Crafter</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6 flex-1 space-y-3">
        <p className="text-base leading-relaxed text-muted-foreground">
          Hola, soy Aitor Santana. Como{" "}
          <span className="font-semibold text-gray-100">Desarrollador de Software</span>{" "}
          y{" "}
          <span className="font-semibold text-gray-100">Software Crafter</span>, ayudo
          a equipos a construir código sostenible.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          Mi especialidad está en la intersección entre el{" "}
          <span className="font-semibold text-gray-100">Clean Code</span>, la{" "}
          <span className="font-semibold text-gray-100">Arquitectura Hexagonal</span>{" "}
          y la nueva ola de{" "}
          <span className="font-semibold text-[#FCA311]">IA Generativa</span>.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          Escribo, doy charlas y desarrollo software de calidad desde{" "}
          <span className="font-semibold text-gray-100">Canarias</span> para el mundo.
        </p>
      </div>

      {/* Home anchor indicator */}
      <div aria-hidden="true" className="mt-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-[#FCA311]" />
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Home</span>
      </div>
    </div>
  )
}
