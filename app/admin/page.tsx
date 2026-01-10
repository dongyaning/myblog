import { redirect } from 'next/navigation'

import { AuthForm } from '@/components/admin/auth-form'

import { isAuthenticated } from '@/lib/auth'

export default async function AdminLoginPage() {
  // If already authenticated, redirect to dashboard
  const authenticated = await isAuthenticated()
  if (authenticated) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <AuthForm />
    </div>
  )
}
