import { cookies } from 'next/headers'

import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD
}

export async function createToken(): Promise<string> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
  return token
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value
}

export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken()
  if (!token) return false
  return await verifyToken(token)
}

export async function verifyAuth(request?: Request): Promise<{ authenticated: boolean }> {
  const authenticated = await isAuthenticated()
  return { authenticated }
}
