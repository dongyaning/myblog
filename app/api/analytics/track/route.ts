import { NextRequest, NextResponse } from 'next/server'

import { hasRecentVisit, recordPageView } from '@/lib/db/queries'

export const runtime = 'edge'

// Web Crypto API helper for Edge Runtime
async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, visitorId, readTime } = body

    if (!slug || !visitorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 防刷机制：检查同一访客在 1 分钟内是否已访问
    const hasVisited = await hasRecentVisit(slug, visitorId, 1)
    if (hasVisited) {
      return NextResponse.json({ success: true, message: 'Already tracked' }, { status: 200 })
    }

    // 获取 IP 地址并哈希处理（隐私保护）
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const ipHash = ip ? await hashString(ip) : undefined

    // 获取其他元数据
    const userAgent = request.headers.get('user-agent') || undefined
    const referer = request.headers.get('referer') || undefined

    // 记录访问
    const result = await recordPageView({
      slug,
      visitorId,
      ipHash,
      userAgent,
      referer,
      readTime,
    })

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      return NextResponse.json({ error: 'Failed to record view' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in track API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
