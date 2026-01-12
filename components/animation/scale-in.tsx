'use client'

import { cn } from '@/lib/utils'

import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface ScaleInProps {
  children: React.ReactNode
  className?: string
  /**
   * 延迟时间（毫秒）
   */
  delay?: number
  /**
   * 动画持续时间（毫秒）
   */
  duration?: number
  /**
   * 初始缩放比例
   */
  initialScale?: number
  /**
   * 只触发一次（默认 true）
   */
  triggerOnce?: boolean
}

/**
 * 缩放动画组件
 * 元素进入视口时触发缩放效果
 */
export function ScaleIn({
  children,
  className,
  delay = 0,
  duration = 600,
  initialScale = 0.8,
  triggerOnce = true,
}: ScaleInProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce,
  })

  return (
    <div
      ref={ref}
      className={cn('transition-all', className)}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'scale(1)' : `scale(${initialScale})`,
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}
