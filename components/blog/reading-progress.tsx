'use client'

import { useEffect, useState } from 'react'

import { useThrottleFn } from 'ahooks'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / docHeight) * 100

    setProgress(Math.min(scrollPercent, 100))
  }

  // 使用 ahooks 的节流 hook
  const { run: throttledUpdate } = useThrottleFn(updateProgress, { wait: 100 })

  useEffect(() => {
    // 初始计算

    updateProgress()

    // 滚动时更新（使用节流）
    window.addEventListener('scroll', throttledUpdate, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledUpdate)
      window.removeEventListener('resize', updateProgress)
    }
  }, [throttledUpdate])

  return (
    <div className="fixed top-0 left-0 z-100 h-1 w-full bg-transparent">
      <div
        className="bg-primary h-full transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
