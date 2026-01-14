"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, language = "typescript", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group my-6 overflow-hidden rounded-xl border border-white/5 bg-[#111111]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#191919] px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Mac-style dots */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          {filename && <span className="font-mono text-xs text-[#666666]">{filename}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase text-[#666666]">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[#888888] opacity-0 transition-all duration-200 hover:bg-white/5 hover:text-[#f5f5f5] group-hover:opacity-100"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm leading-relaxed">
          <code
            dangerouslySetInnerHTML={{
              __html: code
                .replace(
                  /\b(const|let|var|function|return|import|export|from|class|interface|type)\b/g,
                  '<span class="text-[#c678dd]">$1</span>',
                )
                .replace(/\b(async|await|new|this)\b/g, '<span class="text-[#c678dd]">$1</span>')
                .replace(/"([^"]*)"/g, '<span class="text-[#98c379]">"$1"</span>')
                .replace(/'([^']*)'/g, "<span class=\"text-[#98c379]\">'$1'</span>")
                .replace(/\/\/(.*)/g, '<span class="text-[#5c6370] italic">//$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="text-[#d19a66]">$1</span>')
                .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-[#d19a66]">$1</span>'),
            }}
            className="text-[#abb2bf]"
          />
        </pre>
      </div>
    </div>
  )
}
