/** 列表入场 stagger 动画 — 返回每个元素的延迟毫秒数 */
export function useStagger(
  count: number,
  baseDelay = 100,
  staggerDelay = 60,
): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay + i * staggerDelay)
}

/** 生成 CSS animation-delay 样式字符串 */
export function staggerDelays(
  count: number,
  baseDelay = 100,
  staggerDelay = 60,
): string[] {
  return useStagger(count, baseDelay, staggerDelay)
    .map((d) => `${d}ms`)
}
