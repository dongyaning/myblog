'use client'

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * 是否只触发一次（默认 true）
   */
  triggerOnce?: boolean
  /**
   * 初始状态（默认 false）
   */
  initialIsIntersecting?: boolean
}

/**
 * Intersection Observer Hook
 * 用于检测元素是否进入视口
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
    initialIsIntersecting = false,
  } = options

  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // 如果已经触发过且只触发一次，则不再监听
    if (triggerOnce && hasIntersected) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting

        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting) {
          setHasIntersected(true)

          // 如果只触发一次，则断开观察
          if (triggerOnce) {
            observer.disconnect()
          }
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, triggerOnce, hasIntersected])

  return { ref, isIntersecting, hasIntersected }
}
