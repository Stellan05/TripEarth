/**
 * 数字/文字格式化工具
 */

/** 数字千分位分隔 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

/** 格式化时长（分钟 → "11h 50m"） */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** 格式化距离（km → "9,200 km"） */
export function formatDistance(km: number): string {
  return `${formatNumber(Math.round(km))} km`
}

/** 文字截断 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/** 大写首字母 */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
