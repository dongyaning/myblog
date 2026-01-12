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

        const mdx = await serialize(pureContent, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            development: false,
          },
        })

        setMdxSource(mdx)
      } catch (err: any) {
        console.error('MDX compilation error:', err)
        setError(err.message || '预览渲染失败')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      compileMDX()
    }, 500) // 500ms 防抖

    return () => clearTimeout(timer)
  }, [content])

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
          <p className="text-destructive mb-2 font-semibold">预览渲染失败</p>
          <p className="text-muted-foreground text-sm">{error}</p>
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
