'use client'

import { useEffect, useState } from 'react'

import matter from 'gray-matter'
import { Eye, EyeOff, Maximize2, Minimize2, Save, Send, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { MDXEditor } from '@/components/admin/mdx-editor'
import { MDXPreview } from '@/components/admin/mdx-preview'
import { MetaEditor } from '@/components/admin/meta-editor'
import { Button } from '@/components/ui/button'

import { draftStorage } from '@/lib/draft-storage'
import { cn } from '@/lib/utils'

interface Post {
  slug: string
  title: string
  updatedAt: string
  published: boolean
}

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

export default function EditorPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentSlug, setCurrentSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingPost, setLoadingPost] = useState(false)
  const [saving, setSaving] = useState(false)

  // 当前编辑的文章内容
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    published: false,
    category: '',
    tags: [],
  })
  const [content, setContent] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 加载文章列表
  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch('/api/admin/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
          // 默认选择第一篇文章
          if (data.posts && data.posts.length > 0) {
            setCurrentSlug(data.posts[0].slug)
          }
        }
      } catch (error) {
        console.error('Failed to load posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  // 加载当前文章内容
  useEffect(() => {
    if (!currentSlug) return

    async function loadPost() {
      setLoadingPost(true)
      try {
        // 检查是否有草稿
        const draft = draftStorage.load(currentSlug as string)

        const response = await fetch(`/api/admin/posts/${currentSlug}`)
        if (response.ok) {
          const data = await response.json()

          // 从完整内容中提取纯内容（移除 frontmatter）
          const parsed = matter(data.content)
          const pureContent = parsed.content

          // 如果有草稿，询问是否恢复
          if (draft && draft.savedAt) {
            const savedAt = new Date(draft.savedAt)
            const useStorage = confirm(
              `发现未保存的草稿（${savedAt.toLocaleString()}），是否恢复？`
            )

            if (useStorage) {
              setFrontmatter(draft.frontmatter)
              setContent(draft.content)
              setIsDirty(true)
            } else {
              setFrontmatter(data.frontmatter)
              setContent(pureContent) // 只设置纯内容，不包含 frontmatter
              setIsDirty(false)
              draftStorage.remove(currentSlug as string)
            }
          } else {
            setFrontmatter(data.frontmatter)
            setContent(pureContent) // 只设置纯内容，不包含 frontmatter
            setIsDirty(false)
          }
        }
      } catch (error) {
        console.error('Failed to load post:', error)
      } finally {
        setLoadingPost(false)
      }
    }

    loadPost()
  }, [currentSlug])

  // 自动保存草稿
  useEffect(() => {
    if (!currentSlug || !isDirty) return

    const timer = setInterval(() => {
      draftStorage.save(currentSlug, { frontmatter, content })
      setLastAutoSave(new Date())
    }, 30000) // 每 30 秒自动保存

    return () => clearInterval(timer)
  }, [currentSlug, frontmatter, content, isDirty])

  // 保存文章
  const handleSave = async () => {
    if (!currentSlug) return

    setSaving(true)
    try {
      // content 已经是纯内容了，不需要再解析
      const response = await fetch(`/api/admin/posts/${currentSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontmatter,
          content: content, // 直接使用纯内容
        }),
      })

      if (response.ok) {
        toast.success('保存成功', { description: `文章 "${frontmatter.title}" 已保存。` })
        setIsDirty(false)
        // 删除草稿
        draftStorage.remove(currentSlug)
        // 重新加载文章列表
        const listResponse = await fetch('/api/admin/posts')
        if (listResponse.ok) {
          const data = await listResponse.json()
          setPosts(data.posts || [])
        }
      } else {
        toast.error('保存失败', { description: '保存文章时发生错误。' })
      }
    } catch (error) {
      console.error('Failed to save post:', error)
      toast.error('保存失败', { description: '保存文章时发生网络错误。' })
    } finally {
      setSaving(false)
    }
  }

  // 新建文章
  const handleNewPost = async () => {
    const title = prompt('请输入文章标题:')
    if (!title) return

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('文章创建成功', { description: `新文章 "${data.title}" 已创建。` })
        // 重新加载文章列表
        const listResponse = await fetch('/api/admin/posts')
        if (listResponse.ok) {
          const listData = await listResponse.json()
          setPosts(listData.posts || [])
          setCurrentSlug(data.slug)
        }
      } else {
        toast.error('创建文章失败', { description: '创建新文章时发生错误。' })
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      toast.error('创建文章失败', { description: '创建新文章时发生网络错误。' })
    }
  }

  // 删除文章
  const handleDeletePost = async () => {
    if (!currentSlug) return

    toast.warning('确认删除文章？', {
      description: `您确定要删除文章 "${frontmatter.title}" 吗？此操作不可撤销。`,
      action: {
        label: '删除',
        onClick: async () => {
          try {
            const response = await fetch(`/api/admin/posts/${currentSlug}`, {
              method: 'DELETE',
            })

            if (response.ok) {
              toast.success('删除成功', { description: `文章 "${frontmatter.title}" 已删除。` })
              // 删除草稿
              draftStorage.remove(currentSlug)
              // 重新加载文章列表
              const listResponse = await fetch('/api/admin/posts')
              if (listResponse.ok) {
                const data = await listResponse.json()
                setPosts(data.posts || [])
                // 选择第一篇文章
                if (data.posts && data.posts.length > 0) {
                  setCurrentSlug(data.posts[0].slug)
                } else {
                  setCurrentSlug(null)
                }
              }
            } else {
              toast.error('删除失败', { description: '删除文章时发生错误。' })
            }
          } catch (error) {
            console.error('Failed to delete post:', error)
            toast.error('删除失败', { description: '删除文章时发生网络错误。' })
          }
        },
      },
      cancel: {
        label: '取消',
        onClick: () => toast.info('删除已取消'),
      },
    })
  }

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S: 保存
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (isDirty && !saving && currentSlug) {
          handleSave()
        }
      }
      // ESC: 退出全屏
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, saving, currentSlug, isFullscreen])

  return (
    <div className="flex h-screen flex-col">
      {/* Header - 全屏模式下隐藏 */}
      {!isFullscreen && (
        <header className="border-border flex items-center justify-between border-b px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">📝 文章编辑器</h1>
            {isDirty && (
              <p className="text-muted-foreground text-sm">
                ● 未保存的更改
                {lastAutoSave && (
                  <span className="ml-2">（草稿已保存于 {lastAutoSave.toLocaleTimeString()}）</span>
                )}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? '隐藏预览' : '显示预览'}
            >
              {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showPreview ? '隐藏预览' : '显示预览'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              title="沉浸式写作模式"
            >
              <Maximize2 className="mr-2 h-4 w-4" />
              全屏
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} disabled={saving || !isDirty}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? '保存中...' : '保存'}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setFrontmatter({ ...frontmatter, published: true })
                handleSave()
              }}
              disabled={saving}
            >
              <Send className="mr-2 h-4 w-4" />
              发布
            </Button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File List Sidebar - 全屏模式下隐藏 */}
        {!isFullscreen && (
          <aside className="border-border bg-muted/30 w-64 overflow-y-auto border-r">
            <div className="p-4">
              <Button className="w-full" variant="outline" size="sm" onClick={handleNewPost}>
                + 新建文章
              </Button>
            </div>

            {loading ? (
              <div className="text-muted-foreground px-4 py-8 text-center text-sm">加载中...</div>
            ) : posts.length === 0 ? (
              <div className="text-muted-foreground px-4 py-8 text-center text-sm">暂无文章</div>
            ) : (
              <ul className="space-y-1 px-2">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <button
                      onClick={() => setCurrentSlug(post.slug)}
                      className={`hover:bg-accent w-full rounded-lg px-3 py-2 text-left transition-colors ${
                        currentSlug === post.slug ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="font-medium">{post.title}</div>
                      <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                        <span>{new Date(post.updatedAt).toLocaleDateString('zh-CN')}</span>
                        {post.published && (
                          <span className="text-primary bg-primary/10 rounded px-1.5 py-0.5">
                            已发布
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}

        {/* Editor Area */}
        <main className="relative flex flex-1 flex-col overflow-auto">
          {currentSlug ? (
            loadingPost ? (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                加载中...
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-6">
                {/* 沉浸式模式浮动工具栏 */}
                {isFullscreen && (
                  <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 border-border fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border px-4 py-2 shadow-lg backdrop-blur">
                    <span className="text-muted-foreground mr-2 text-sm">
                      {frontmatter.title || '未命名文章'}
                    </span>
                    <div className="border-border h-4 w-px border-l" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                      title={showPreview ? '隐藏预览' : '显示预览'}
                    >
                      {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                      disabled={saving || !isDirty}
                      title="保存 (Cmd/Ctrl + S)"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(false)}
                      title="退出全屏 (ESC)"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* 元信息编辑器和删除按钮 - 全屏模式下隐藏 */}
                {!isFullscreen && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <MetaEditor
                        frontmatter={frontmatter}
                        onChange={(newFrontmatter) => {
                          setFrontmatter(newFrontmatter)
                          setIsDirty(true)
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDeletePost}
                      title="删除文章"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* MDX 编辑器和预览 */}
                <div
                  className={`border-border flex gap-4 overflow-hidden rounded-lg ${!isFullscreen ? 'border' : ''} ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[600px]'}`}
                >
                  {/* 编辑器 */}
                  <div className={showPreview ? 'w-1/2' : 'w-full'}>
                    <MDXEditor
                      value={content}
                      onChange={(newContent) => {
                        setContent(newContent)
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  {/* 预览 */}
                  {showPreview && (
                    <>
                      <div className="border-border h-full w-px border-l" />
                      <div className="w-1/2 overflow-hidden">
                        <MDXPreview content={content} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-lg">请选择或创建一篇文章开始编辑</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
