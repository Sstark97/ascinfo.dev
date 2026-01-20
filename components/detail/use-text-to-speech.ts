"use client"

import { useEffect, useRef, useState } from "react"

type TTSStatus = "idle" | "playing" | "paused" | "unavailable"

export function useTextToSpeech(text: string) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [status, setStatus] = useState<TTSStatus>("idle")
  const [isSupported, setIsSupported] = useState(false)

  // Check support and cleanup on mount
  useEffect(() => {
    const supported = typeof window !== "undefined" && "speechSynthesis" in window
    setIsSupported(supported)
    
    if (!supported) {
      setStatus("unavailable")
    }
    
    if (supported) {
      window.speechSynthesis.cancel()
    }

    return () => {
      if (supported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Create utterance
  useEffect(() => {
    if (!isSupported) {
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "es-ES"
    utterance.onend = () => setStatus("idle")
    utterance.onerror = () => setStatus("idle")
    utteranceRef.current = utterance

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [text, isSupported])

  const play = (): void => {
    if (!utteranceRef.current) return
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utteranceRef.current)
    setStatus("playing")
  }

  const pause = (): void => {
    window.speechSynthesis.pause()
    setStatus("paused")
  }

  const resume = (): void => {
    window.speechSynthesis.resume()
    setStatus("playing")
  }

  const stop = (): void => {
    window.speechSynthesis.cancel()
    setStatus("idle")
  }

  return {
    status,
    isSupported,
    play,
    pause,
    resume,
    stop,
  }
}