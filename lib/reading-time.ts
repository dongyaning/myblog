/**
 * Calculate reading time in minutes
 * Based on average reading speed of 200 words per minute for English
 * and 300-500 characters per minute for Chinese
 */
export function calculateReadingTime(content: string): number {
  // Remove MDX/HTML tags
  const text = content.replace(/<[^>]*>/g, '')

  // Count Chinese characters
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length

  // Count English words (non-Chinese text)
  const englishText = text.replace(/[\u4e00-\u9fa5]/g, '')
  const englishWords = englishText.split(/\s+/).filter((word) => word.length > 0).length

  // Calculate reading time
  // Chinese: ~400 characters per minute
  // English: ~200 words per minute
  const chineseTime = chineseChars / 400
  const englishTime = englishWords / 200

  const totalMinutes = Math.ceil(chineseTime + englishTime)

  return Math.max(1, totalMinutes) // At least 1 minute
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} 分钟阅读`
}
