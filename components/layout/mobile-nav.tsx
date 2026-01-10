'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// 2. 引入 createPortal

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Shield, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '分类', href: '/categories' },
  { name: '标签', href: '/tags' },
]

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Ensure portal is only rendered on client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      {/* Slide-in Menu */}
      <div className="border-border bg-background fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm border-l p-6 shadow-lg md:hidden">
        {/* Close Button */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">菜单</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="z-50 mt-8 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'hover:text-primary text-lg font-medium transition-colors',
                pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-border my-2 border-t" />

          {/* Admin Link */}
          <Link
            href="/admin"
            onClick={onClose}
            className={cn(
              'hover:text-primary flex items-center gap-2 text-lg font-medium transition-colors',
              pathname.startsWith('/admin') ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            <Shield className="h-5 w-5" />
            <span>管理后台</span>
          </Link>
        </nav>
      </div>
    </>,
    document.body
  )
}
