/**
 * 草稿存储工具
 * 使用 LocalStorage 存储未保存的草稿
 */

interface DraftData {
  frontmatter: any
  content: string
  savedAt: string
}

export const draftStorage = {
  /**
   * 保存草稿
   */
  save(slug: string, data: { frontmatter: any; content: string }): void {
    try {
      const draft: DraftData = {
        ...data,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(`draft:${slug}`, JSON.stringify(draft))
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  },

  /**
   * 加载草稿
   */
  load(slug: string): DraftData | null {
    try {
      const draftString = localStorage.getItem(`draft:${slug}`)
      if (!draftString) return null

      const draft: DraftData = JSON.parse(draftString)
      return draft
    } catch (error) {
      console.error('Failed to load draft:', error)
      return null
    }
  },

  /**
   * 删除草稿
   */
  remove(slug: string): void {
    try {
      localStorage.removeItem(`draft:${slug}`)
    } catch (error) {
      console.error('Failed to remove draft:', error)
    }
  },

  /**
   * 获取所有草稿的 slug 列表
   */
  getAllDrafts(): string[] {
    try {
      const drafts: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('draft:')) {
          drafts.push(key.replace('draft:', ''))
        }
      }
      return drafts
    } catch (error) {
      console.error('Failed to get drafts:', error)
      return []
    }
  },

  /**
   * 检查是否有草稿
   */
  hasDraft(slug: string): boolean {
    try {
      return localStorage.getItem(`draft:${slug}`) !== null
    } catch (error) {
      return false
    }
  },
}
