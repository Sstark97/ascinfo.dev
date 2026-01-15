"use client"

import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { codeToHtml } from "shiki"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, language = "typescript", filename }: CodeBlockProps): React.ReactElement {
  const [copied, setCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState("")

  useEffect(() => {
    const highlightCode = async (): Promise<void> => {
      try {
        const html = await codeToHtml(code, {
          lang: language,
          theme: "one-dark-pro",
        })
        setHighlightedCode(html)
      } catch (error) {
        console.error("Error highlighting code:", error)
        setHighlightedCode(`<pre><code>${code}</code></pre>`)
      }
    }

    void highlightCode()
  }, [code, language])

  const handleCopy = async (): Promise<void> => {
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
      <div className="overflow-x-auto [&>div>pre]:!bg-[#111111] [&>div>pre]:!m-0 [&>div>pre]:p-4 [&>div>pre]:font-mono [&>div>pre]:text-sm [&>div>pre]:leading-relaxed">
        {highlightedCode ? (
          <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        ) : (
          <pre className="!bg-[#111111] !m-0 p-4 font-mono text-sm leading-relaxed text-[#abb2bf]">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
