import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { createToken, verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: '请输入密码' }, { status: 400 })
    }

    const isValid = await verifyPassword(password)

    if (!isValid) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }

    // Create JWT token
    const token = await createToken()

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in login API:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
