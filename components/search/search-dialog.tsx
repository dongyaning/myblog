'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { useDebounceFn } from 'ahooks'
import { Calendar, Search, Tag, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { CategoryBadge } from '../blog/badges'

interface SearchResult {
  slug: string
  title: string
  description: string
  category?: string
  tags?: string[]
  date: string
  titleMatch: boolean
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 防抖搜索函数
  const { run: debouncedSearch } = useDebounceFn(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        console.log(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    },
    { wait: 300 }
  )

  // 监听查询变化
  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  // 重置状态
  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
    }
  }, [open])

  // 高亮关键词
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return (
      <span key={text}>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-primary/20 rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>搜索博客内容</DialogTitle>
          <DialogDescription>输入关键词搜索文章标题、标签和分类</DialogDescription>
        </DialogHeader>

        {/* 搜索输入框 */}
        <div className="border-border flex items-center gap-2 border-b px-4 py-3">
          <Search className="text-muted-foreground h-5 w-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章标题、标签、分类..."
            className="border-0 shadow-none focus-visible:ring-0"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuery('')}
              aria-label="清除"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 搜索结果 */}
        <div className="max-h-[400px] overflow-y-auto p-4">
          {isSearching ? (
            <div className="text-muted-foreground py-8 text-center text-sm">搜索中...</div>
          ) : query && results.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">未找到相关结果</div>
          ) : query && results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result) => (
                <Link
                  key={result.slug}
                  href={`/blog/${result.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="hover:bg-accent block rounded-lg p-3 transition-colors"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="leading-tight font-semibold">
                      {highlightText(result.title, query)}
                    </h3>
                    {result.category && <CategoryBadge category={result.category} asLink={false} />}
                  </div>

                  {result.description && (
                    <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                      {highlightText(result.description, query)}
                    </p>
                  )}

                  <div className="text-muted-foreground flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(result.date).toLocaleDateString('zh-CN')}</span>
                    </div>

                    {result.tags && result.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {result.tags
                            .slice(0, 3)
                            .map((tag) => highlightText(tag, query))
                            .reduce<React.ReactNode[]>(
                              (acc, curr, i) => (i === 0 ? [curr] : [...acc, ', ', curr]),
                              []
                            )}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-8 text-center text-sm">输入关键词开始搜索</div>
          )}
        </div>

        {/* 快捷键提示 */}
        <div className="border-border text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-xs">
          <span>按 ESC 关闭</span>
          <span>按 ↑ ↓ 导航</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
