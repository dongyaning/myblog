'use client'

import { useEffect, useState } from 'react'

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

import remarkGfm from 'remark-gfm'

import { mdxComponentsClient } from '@/components/admin/mdx-components-client'

interface MDXPreviewProps {
  content: string
}

export function MDXPreview({ content }: MDXPreviewProps) {
  const [mdxSource, setMdxSource] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function compileMDX() {
      setLoading(true)
      setError(null)

      try {
        // 提取纯内容（移除 frontmatter）
        const pureContent = content.replace(/^---[\s\S]*?---\n*/, '')

        // 检查是否有明显的未闭合标签（简单检查）
        const hasUnclosedJSX = checkUnclosedJSX(pureContent)
        if (hasUnclosedJSX) {
          setError('检测到未闭合的 JSX 标签，请完成标签输入...')
          setLoading(false)
          return
        }

        const mdx = await serialize(pureContent, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            development: false,
          },
        })

        setMdxSource(mdx)
      } catch (err: any) {
        // 只在控制台显示警告，不抛出错误
        console.warn('MDX 预览编译失败（输入中...）:', err.message)

        // 提取更友好的错误信息
        const errorMsg = extractFriendlyError(err.message)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      compileMDX()
    }, 800) // 增加到 800ms，给用户更多输入时间

    return () => clearTimeout(timer)
  }, [content])

  // 检查是否有未闭合的 JSX 标签
  function checkUnclosedJSX(text: string): boolean {
    // 检查独立的 < 或 <> 后面没有闭合
    const unclosedFragmentPattern = /<>\s*$/
    const unclosedTagPattern = /<[A-Z][a-zA-Z0-9]*\s*$/
    const unclosedSelfClosingPattern = /<[A-Z][a-zA-Z0-9]*[^/>]*$/

    return (
      unclosedFragmentPattern.test(text) ||
      unclosedTagPattern.test(text) ||
      unclosedSelfClosingPattern.test(text)
    )
  }

  // 提取友好的错误信息
  function extractFriendlyError(errorMsg: string): string {
    if (errorMsg.includes('Expected a closing tag')) {
      return '等待标签闭合...'
    }
    if (errorMsg.includes('Unexpected character')) {
      return '语法输入中...'
    }
    if (errorMsg.includes('Could not parse')) {
      return 'MDX 语法检查中...'
    }
    return '预览编译中，请继续输入...'
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-sm">渲染预览中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2 text-sm">📝 {error}</p>
          <p className="text-muted-foreground text-xs">保存后会自动更新预览</p>
        </div>
      </div>
    )
  }

  if (!mdxSource) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-sm">无内容</div>
      </div>
    )
  }

  return (
    <div className="prose prose-neutral dark:prose-invert h-full overflow-y-auto p-6">
      <MDXRemote {...mdxSource} components={mdxComponentsClient} />
    </div>
  )
}
