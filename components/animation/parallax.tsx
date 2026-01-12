'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface ParallaxProps {
  children: React.ReactNode
  className?: string
  /**
   * 视差速度倍数（0-1）
   * 0 = 不动，0.5 = 一半速度，1 = 正常速度
   */
  speed?: number
  /**
   * 视差方向
   */
  direction?: 'up' | 'down'
}

/**
 * 视差滚动组件
 * 元素以不同于页面的速度滚动，创造深度感
 */
export function Parallax({ children, className, speed = 0.5, direction = 'up' }: ParallaxProps) {
  const [offset, setOffset] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const element = ref.current
      const rect = element.getBoundingClientRect()
      const scrollY = window.scrollY
      const elementTop = rect.top + scrollY

      // 计算元素相对于视口的位置
      const elementOffset = scrollY - elementTop
      const parallaxOffset = elementOffset * speed

      setOffset(direction === 'up' ? -parallaxOffset : parallaxOffset)
    }

    // 初始计算
    handleScroll()

    // 监听滚动
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [speed, direction])

  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  )
}
