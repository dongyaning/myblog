'use client'

import { useEffect, useState } from 'react'

/**
 * 页面滚动进度 Hook
 * 返回 0-100 的滚动百分比
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      const totalScroll = documentHeight - windowHeight
      const currentProgress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0

      setProgress(Math.min(Math.max(currentProgress, 0), 100))
    }

    // 初始计算
    calculateProgress()

    // 监听滚动
    window.addEventListener('scroll', calculateProgress, { passive: true })
    window.addEventListener('resize', calculateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', calculateProgress)
      window.removeEventListener('resize', calculateProgress)
    }
  }, [])

  return progress
}
