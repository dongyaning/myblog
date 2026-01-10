import { NextResponse } from 'next/server'

import { clearToken } from '@/lib/auth'

export async function POST() {
  try {
    await clearToken()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in logout API:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
