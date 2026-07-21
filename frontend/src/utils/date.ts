/**
 * 日期格式化工具
 */

/** 格式化为 "Oct 12, 2024" */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** 格式化为 "Oct 12" */
export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** 格式化日期范围 "Oct 12 – Oct 19, 2024" */
export function formatDateRange(start: string | Date, end: string | Date): string {
  const s = typeof start === 'string' ? new Date(start) : start
  const e = typeof end === 'string' ? new Date(end) : end
  const sStr = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const eStr = e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${sStr} – ${eStr}`
}

/** 计算两个日期之间的天数 */
export function daysBetween(start: string | Date, end: string | Date): number {
  const s = typeof start === 'string' ? new Date(start) : start
  const e = typeof end === 'string' ? new Date(end) : end
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

/** "YYYY-MM-DD" → ISO string */
export function toISODate(date: string): string {
  return new Date(date).toISOString().split('T')[0]
}
