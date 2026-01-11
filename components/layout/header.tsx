'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Menu, Moon, Search, Shield, Sun } from 'lucide-react'

import { SearchDialog } from '@/components/search/search-dialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'

import MobileNav from './mobile-nav'

const navItems = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '分类', href: '/categories' },
  { name: '标签', href: '/tags' },
]

export default function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Cmd/Ctrl + K 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">NingBlog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'hover:text-primary text-sm font-medium transition-colors',
                pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side: Search + Admin + Theme Toggle + Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">搜索</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>搜索 (⌘K)</p>
            </TooltipContent>
          </Tooltip>

          {/* Admin Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Shield className="h-4 w-4" />
                  <span className="sr-only">管理后台</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>管理后台</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">切换主题</span>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">菜单</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
