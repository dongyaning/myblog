'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import Editor from '@monaco-editor/react'

interface MDXEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MDXEditor({ value, onChange }: MDXEditorProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-muted flex h-full items-center justify-center">
        <div className="text-muted-foreground">加载编辑器...</div>
      </div>
    )
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={value}
      onChange={(value: string | undefined) => onChange(value || '')}
      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
      }}
    />
  )
}
