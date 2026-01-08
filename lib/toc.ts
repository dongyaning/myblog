/**
 * Extract table of contents from MDX content
 * Parses heading elements to create a navigation structure
 */

export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Extract headings from raw MDX content
 * This is a simple regex-based parser for frontmatter-stripped content
 */
export function extractTocFromContent(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const toc: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()

    // Generate ID from heading text (similar to how GitHub does it)
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // Keep only alphanumeric, Chinese chars, spaces, hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

    toc.push({ id, text, level })
  }

  return toc
}

/**
 * Generate heading IDs for MDX rehype plugin
 * This helps ensure consistent IDs between TOC and actual headings
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
