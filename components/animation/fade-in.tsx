'use client'

import { cn } from '@/lib/utils'

import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface FadeInProps {
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
   * 动画方向
   */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /**
   * 只触发一次（默认 true）
   */
  triggerOnce?: boolean
}

/**
 * 淡入动画组件
 * 元素进入视口时触发淡入效果
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 600,
  direction = 'up',
  triggerOnce = true,
}: FadeInProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce,
  })

  // 根据方向设置初始偏移
  const getTransform = () => {
    if (!isIntersecting) {
      switch (direction) {
        case 'up':
          return 'translateY(30px)'
        case 'down':
          return 'translateY(-30px)'
        case 'left':
          return 'translateX(30px)'
        case 'right':
          return 'translateX(-30px)'
        case 'none':
        default:
          return 'translateY(0)'
      }
    }
    return 'translateY(0)'
  }

  return (
    <div
      ref={ref}
      className={cn('transition-all', className)}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: getTransform(),
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}
