'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface CodeBlockWrapperProps {
  code: string
  highlightedHtml: string
  title?: string
}

export function CodeBlockWrapper({ code, highlightedHtml, title }: CodeBlockWrapperProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-6">
      {title && (
        <div className="border-border bg-muted rounded-t-lg border border-b-0 px-4 py-2 text-sm font-medium">
          {title}
        </div>
      )}
      <div className="relative overflow-x-auto">
        <div className="shiki-wrapper" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
