'use client'

import { cn } from '@/lib/utils'

import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface SlideInProps {
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
   * 滑入方向
   */
  direction?: 'left' | 'right' | 'up' | 'down'
  /**
   * 偏移距离（像素）
   */
  offset?: number
  /**
   * 只触发一次（默认 true）
   */
  triggerOnce?: boolean
}

/**
 * 滑入动画组件
 * 元素进入视口时触发滑入效果
 */
export function SlideIn({
  children,
  className,
  delay = 0,
  duration = 600,
  direction = 'up',
  offset = 50,
  triggerOnce = true,
}: SlideInProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce,
  })

  const getTransform = () => {
    if (!isIntersecting) {
      switch (direction) {
        case 'left':
          return `translateX(${offset}px)`
        case 'right':
          return `translateX(-${offset}px)`
        case 'up':
          return `translateY(${offset}px)`
        case 'down':
          return `translateY(-${offset}px)`
        default:
          return 'translateY(0)'
      }
    }
    return 'translate(0, 0)'
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
