'use client'

import { Children, cloneElement, isValidElement } from 'react'

import { cn } from '@/lib/utils'

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  /**
   * 每个子元素的延迟间隔（毫秒）
   */
  staggerDelay?: number
  /**
   * 初始延迟（毫秒）
   */
  initialDelay?: number
}

/**
 * 交错动画容器
 * 子元素按顺序依次出现
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  initialDelay = 0,
}: StaggerContainerProps) {
  const childArray = Children.toArray(children)

  return (
    <div className={cn(className)}>
      {childArray.map((child, index) => {
        if (isValidElement(child)) {
          // 为每个子元素添加递增的延迟
          return cloneElement(child, {
            ...child.props,
            delay: initialDelay + index * staggerDelay,
          } as any)
        }
        return child
      })}
    </div>
  )
}
