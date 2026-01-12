'use client'

import { useEffect, useState } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'

/**
 * 页面顶部加载进度条
 * 在路由切换时自动显示
 */
export function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 路由开始切换
    setIsLoading(true)
    setProgress(20)

    // 模拟加载进度
    const timer1 = setTimeout(() => setProgress(40), 100)
    const timer2 = setTimeout(() => setProgress(60), 300)
    const timer3 = setTimeout(() => setProgress(80), 600)

    // 路由切换完成
    const completeTimer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 200)
    }, 800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(completeTimer)
    }
  }, [pathname, searchParams])

  if (!isLoading && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        opacity: isLoading ? 1 : 0,
      }}
    />
  )
}
