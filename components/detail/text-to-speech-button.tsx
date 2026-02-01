"use client"

import { Volume2, Pause, Play, VolumeX } from "lucide-react"
import { useTextToSpeech } from "./use-text-to-speech"
import type { ReactElement } from "react"

interface TextToSpeechButtonProps {
  text: string
}

export function TextToSpeechButton({ text }: TextToSpeechButtonProps): ReactElement {
  const { status, isSupported, play, pause, resume, stop } = useTextToSpeech(text)

  const handleClick = (): void => {
    if (status === "idle") {
      play()
    } else if (status === "playing") {
      pause()
    } else if (status === "paused") {
      resume()
    }
  }

  const getIcon = (): ReactElement => {
    switch (status) {
      case "playing":
        return <Pause className="h-4 w-4" aria-hidden="true" />
      case "paused":
        return <Play className="h-4 w-4" aria-hidden="true" />
      case "unavailable":
        return <VolumeX className="h-4 w-4" aria-hidden="true" />
      default:
        return <Volume2 className="h-4 w-4" aria-hidden="true" />
    }
  }

  const getLabel = (): string => {
    switch (status) {
      case "playing":
        return "Pausar"
      case "paused":
        return "Continuar"
      case "unavailable":
        return "No disponible"
      default:
        return "Escuchar"
    }
  }

  const isPrimary = status === "playing"
  const isDisabled = !isSupported || status === "unavailable"

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={getLabel()}
      aria-pressed={status === "playing"}
      className={`
        inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300
        ${
          isPrimary
            ? "bg-[#fca311] text-[#1a1a1a] hover:bg-[#e5940f]"
            : "border border-[#444444] bg-[#2a2a2a] text-[#f5f5f5] hover:border-[#fca311] hover:text-[#fca311]"
        }
        ${isDisabled ? "cursor-not-allowed opacity-50" : ""}
      `}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </button>
  )
}
