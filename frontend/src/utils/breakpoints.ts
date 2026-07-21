/**
 * 响应式断点常量（MVP 仅 Desktop 1280px+）
 * 与 design-spec.md Section 9 保持一致
 */

/** 最小宽度断点 */
export const BREAKPOINTS = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
} as const

/** 设计基准宽度 */
export const DESIGN_WIDTH = 1440

/** 内容最大宽度 */
export const CONTENT_MAX_WIDTH = 1280

/** 页面两侧 padding */
export const PAGE_PADDING = 32

/** 当前视口是否匹配断点（useMediaQuery 辅助） */
export function matchBreakpoint(bp: number): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(min-width: ${bp}px)`).matches
}

/** 是否桌面端 */
export function isDesktop(): boolean {
  return matchBreakpoint(BREAKPOINTS.desktop)
}
