'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import Giscus from '@giscus/react'

import { getGiscusTheme, giscusConfig } from '@/lib/giscus-config'

/**
 * Giscus 评论组件
 * 集成 GitHub Discussions 作为评论系统
 *
 * 优化特性：
 * - 防止 hydration mismatch
 * - 主题自动同步
 * - 懒加载优化
 * - 骨架屏 loading 状态
 */
export default function Comments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 确保只在客户端渲染，避免 hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // 服务端渲染时显示骨架屏
  if (!mounted) {
    return (
      <div className="giscus-skeleton">
        <div className="bg-muted animate-pulse space-y-4 rounded-lg p-6">
          <div className="bg-muted-foreground/20 h-4 w-1/4 rounded" />
          <div className="bg-muted-foreground/20 h-24 rounded" />
          <div className="bg-muted-foreground/20 h-10 w-24 rounded" />
        </div>
      </div>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <div className="giscus-wrapper">
      <Giscus
        id="comments"
        repo={giscusConfig.repo}
        repoId={giscusConfig.repoId}
        category={giscusConfig.category}
        categoryId={giscusConfig.categoryId}
        mapping={giscusConfig.mapping}
        strict={giscusConfig.strict}
        reactionsEnabled={giscusConfig.reactionsEnabled}
        emitMetadata={giscusConfig.emitMetadata}
        inputPosition={giscusConfig.inputPosition}
        theme={getGiscusTheme(isDark)}
        lang={giscusConfig.lang}
        loading={giscusConfig.loading}
      />
    </div>
  )
}
