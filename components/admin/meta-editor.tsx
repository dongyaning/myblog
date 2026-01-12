'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Frontmatter {
  title: string
  date: string
  updated?: string
  description: string
  published: boolean
  category: string
  tags: string[]
  series?: string
  seriesOrder?: number
}

interface MetaEditorProps {
  frontmatter: Frontmatter
  onChange: (frontmatter: Frontmatter) => void
}

export function MetaEditor({ frontmatter, onChange }: MetaEditorProps) {
  const handleChange = (field: keyof Frontmatter, value: any) => {
    onChange({
      ...frontmatter,
      [field]: value,
    })
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    handleChange('tags', tags)
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="meta"
      className="border-border rounded-lg border"
    >
      <AccordionItem value="meta" className="border-none">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <span className="font-semibold">文章元信息</span>
            <span className="text-muted-foreground text-xs">
              {frontmatter.title || '未命名'} · {frontmatter.published ? '已发布' : '草稿'}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 px-4 pb-4">
          {/* 标题 */}
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={frontmatter.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="输入文章标题"
            />
          </div>

          {/* 日期 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">发布日期</Label>
              <Input
                id="date"
                type="date"
                value={frontmatter.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="updated">更新日期</Label>
              <Input
                id="updated"
                type="date"
                value={frontmatter.updated || frontmatter.date}
                onChange={(e) => handleChange('updated', e.target.value)}
              />
            </div>
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <textarea
              id="description"
              value={frontmatter.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="输入文章描述"
              className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring bg-background flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* 分类 */}
          <div className="space-y-2">
            <Label htmlFor="category">分类</Label>
            <Input
              id="category"
              value={frontmatter.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="输入分类"
            />
          </div>

          {/* 标签 */}
          <div className="space-y-2">
            <Label htmlFor="tags">标签（用逗号分隔）</Label>
            <Input
              id="tags"
              value={frontmatter.tags?.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="React, TypeScript, Next.js"
            />
          </div>

          {/* 系列名称 */}
          <div className="space-y-2">
            <Label htmlFor="series">系列名称（可选）</Label>
            <Input
              id="series"
              value={frontmatter.series || ''}
              onChange={(e) => handleChange('series', e.target.value || undefined)}
              placeholder="例如：React 18 完全指南"
            />
          </div>

          {/* 系列顺序 */}
          {frontmatter.series && (
            <div className="space-y-2">
              <Label htmlFor="seriesOrder">系列顺序</Label>
              <Input
                id="seriesOrder"
                type="number"
                min="1"
                value={frontmatter.seriesOrder || 1}
                onChange={(e) => handleChange('seriesOrder', parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>
          )}

          {/* 发布状态 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={frontmatter.published}
              onChange={(e) => handleChange('published', e.target.checked)}
              className="border-input ring-offset-background focus-visible:ring-ring h-4 w-4 rounded border"
            />
            <Label htmlFor="published" className="cursor-pointer">
              发布文章
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
