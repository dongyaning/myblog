'use client'

import { useEffect, useRef } from 'react'

interface PageViewTrackerProps {
  slug: string
}

// 获取或创建访客 ID
function getVisitorId(): string {
  if (typeof window === 'undefined') return ''

  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

export function PageViewTracker({ slug }: PageViewTrackerProps) {
  const trackedRef = useRef(false)
  // eslint-disable-next-line react-hooks/purity
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    // 只追踪一次
    if (trackedRef.current) return
    trackedRef.current = true

    const visitorId = getVisitorId()
    if (!visitorId) return

    // 立即记录访问
    const trackView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug,
            visitorId,
          }),
        })
      } catch (error) {
        console.error('Failed to track page view:', error)
      }
    }

    trackView()

    // 页面卸载时记录阅读时长
    const handleBeforeUnload = () => {
      const readTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
      if (readTime > 5) {
        // 至少阅读 5 秒才记录时长
        navigator.sendBeacon(
          '/api/analytics/track',
          JSON.stringify({
            slug,
            visitorId,
            readTime,
          })
        )
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [slug])

  return null
}
