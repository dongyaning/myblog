/**
 * Giscus 评论系统配置
 * 文档：https://giscus.app/zh-CN
 */
export const giscusConfig = {
  // GitHub 仓库信息
  repo: 'dongyaning/myblog' as const,
  repoId: 'R_kgDOQ0fCfw',

  // 讨论分类
  category: 'Announcements',
  categoryId: 'DIC_kwDOQ0fCf84C0020',

  // 映射策略
  // pathname: 基于页面路径（推荐）
  // url: 基于完整 URL
  // title: 基于页面标题
  // og:title: 基于 Open Graph 标题
  mapping: 'pathname' as const,

  // 严格匹配标题（避免相似路径混淆）
  strict: '1' as const,

  // 功能开关
  reactionsEnabled: '1' as const, // 启用表情反应
  emitMetadata: '0' as const, // 不发送元数据

  // UI 配置
  inputPosition: 'top' as const, // 输入框在顶部
  lang: 'zh-CN' as const, // 中文界面
  loading: 'lazy' as const, // 懒加载

  // 主题配置
  themes: {
    light: 'light',
    dark: 'transparent_dark', // 透明暗色主题，适配博客主题
  },
}

/**
 * 获取 Giscus 主题
 */
export function getGiscusTheme(isDark: boolean): string {
  return isDark ? giscusConfig.themes.dark : giscusConfig.themes.light
}
