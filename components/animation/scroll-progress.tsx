'use client'

import { cn } from '@/lib/utils'

import { useScrollProgress } from '@/hooks/use-scroll-progress'

interface ScrollProgressProps {
  className?: string
  /**
   * 颜色主题
   */
  variant?: 'gradient' | 'primary' | 'accent'
  /**
   * 高度（像素）
   */
  height?: number
}

/**
 * 页面滚动进度条
 * 固定在页面顶部，显示当前滚动进度
 */
export function ScrollProgress({
  className,
  variant = 'gradient',
  height = 3,
}: ScrollProgressProps) {
  const progress = useScrollProgress()

  const getBackgroundClass = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
      case 'primary':
        return 'bg-primary'
      case 'accent':
        return 'bg-accent'
      default:
        return 'bg-primary'
    }
  }

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-50 transition-all duration-150',
        getBackgroundClass(),
        className
      )}
      style={{
        width: `${progress}%`,
        height: `${height}px`,
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}
