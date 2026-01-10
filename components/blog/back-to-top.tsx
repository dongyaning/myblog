'use client'

import { useEffect, useState } from 'react'

import { useThrottleFn } from 'ahooks'
import { ArrowUp } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    // 滚动超过 300px 时显示按钮
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // 使用 ahooks 的节流 hook
  const { run: throttledToggle } = useThrottleFn(toggleVisibility, { wait: 100 })

  useEffect(() => {
    // 初始检查
    // eslint-disable-next-line react-hooks/set-state-in-effect
    toggleVisibility()

    window.addEventListener('scroll', throttledToggle, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledToggle)
    }
  }, [throttledToggle])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={cn(
        'fixed right-8 bottom-8 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300',
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-16 opacity-0'
      )}
      aria-label="回到顶部"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
