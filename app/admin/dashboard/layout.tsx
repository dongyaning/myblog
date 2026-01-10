import Link from 'next/link'
import { redirect } from 'next/navigation'

import { BarChart3, Home, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { isAuthenticated } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold">
              <BarChart3 className="h-6 w-6" />
              <span>管理后台</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </Link>
            <form action="/api/admin/logout" method="POST">
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">{children}</main>
    </div>
  )
}
