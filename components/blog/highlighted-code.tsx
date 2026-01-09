import { codeToHtml } from 'shiki'

import { CodeBlockWrapper } from './code-block-wrapper'

interface HighlightedCodeProps {
  code: string
  language: string
  title?: string
}

export async function HighlightedCode({ code, language, title }: HighlightedCodeProps) {
  let highlightedHtml = ''

  try {
    highlightedHtml = await codeToHtml(code, {
      lang: language,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })
  } catch (error) {
    console.error('Shiki highlighting error:', error)
    // Fallback to plain code with basic styling
    highlightedHtml = `<pre class="shiki github-light github-dark" style="background-color: #24292e; color: #e1e4e8; padding: 1rem; border-radius: 0.5rem; overflow-x: auto;"><code>${escapeHtml(code)}</code></pre>`
  }

  return <CodeBlockWrapper code={code} highlightedHtml={highlightedHtml} title={title} />
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
