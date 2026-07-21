/**
 * JS 颜色常量 — CSS 变量导出 + 地球专用色板
 */

export const COLORS = {
  page: '#F5F2ED', card: '#FFFFFF', cardHover: '#FAFAFA', sheet: '#FBF9F6',
  textPrimary: '#1C1E22', textSecondary: '#6B6E77', textTertiary: '#999CA6', textInverse: '#FFFFFF',
  sunset: '#E8714A', sunsetGlow: '#F0A080', ocean: '#3B7EC7', oceanDeep: '#2A5F9A',
  forest: '#4A9C7C', forestLight: '#6DBA9A',
  mapLand: '#F0E8D8', mapLandVisited: '#E8C9A0', mapLandWishlist: '#C5D8C0',
  mapWater: '#E8EDF2', mapWaterDark: '#D0D8E3',
  flightAccent: '#4468B2', flightDivider: '#E8E8EC',
  danger: '#D94848', warning: '#E8993A', success: '#4A9C7C', info: '#3B7EC7',
} as const

export const COLORS_DARK = {
  page: '#1C1E22', card: '#262830', cardHover: '#2E303A', sheet: '#22242A',
  textPrimary: '#EBEBED', textSecondary: '#9B9DA5', textTertiary: '#6B6D75',
  sunset: '#F08060', sunsetGlow: '#F5B090', ocean: '#5B9ED8', oceanDeep: '#7AB8E8',
  forest: '#5DBA90', forestLight: '#80D0AB',
  mapLandVisited: '#C89870', mapLandWishlist: '#90A890',
  mapWater: '#2A3040', mapWaterDark: '#222838',
  flightDivider: '#363840',
} as const

// ═══════════════════════════════════════════
// 地球色板 — Apple Maps Light Terrain 风格
// ═══════════════════════════════════════════

/** 去过 — 暖金色梯度 */
export const GLOBE_VISITED_GRADIENT = [
  '#D5A96A', '#CFA05E', '#C89650', '#C08C42',
  '#B88234', '#B07828', '#A86E1C', '#A06410',
] as const

/** 去过 — 多边形叠加层: 暖金色 78% opacity（海拔 0 层之上） */
export const GLOBE_VISITED_OVERLAY = '#D5A96A'

/** 想去 — 柔和鼠尾草绿 */
export const GLOBE_WISHLIST_OVERLAY = '#8BAF95'

/** 用户所在国 — 暖陶土色 */
export const GLOBE_HOME_OVERLAY = '#D4845A'

/** 有手记 — 叠加色 */
export const GLOBE_NOTES_TINT = '#5B8EC7'
/** 有红心 — 叠加色 */
export const GLOBE_HEART_TINT = '#D4687C'

/** 多边形边界色 */
export const GLOBE_STROKE = 'rgba(0,0,0,0.05)'

/** 半透明叠加的不透明度 */
export const GLOBE_OPACITY_VISITED  = 0.78
export const GLOBE_OPACITY_WISHLIST = 0.55
export const GLOBE_OPACITY_HOME     = 0.85
export const GLOBE_OPACITY_UNVISITED = 0

export function visitedGlobeColor(count: number): string {
  return GLOBE_VISITED_GRADIENT[Math.min(count - 1, GLOBE_VISITED_GRADIENT.length - 1)]
}

export function blendColor(base: string, overlay: string, ratio = 0.3): string {
  const h2r = (h: string) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) })
  const b = h2r(base), o = h2r(overlay)
  const mix = (a: number, b: number) => Math.round(a + (b - a) * ratio)
  return `#${mix(b.r, o.r).toString(16).padStart(2, '0')}${mix(b.g, o.g).toString(16).padStart(2, '0')}${mix(b.b, o.b).toString(16).padStart(2, '0')}`
}

// 旧别名（兼容）
export const GLOBE_UNVISITED = '#E0E3E8'
export const GLOBE_WISHLIST = '#A3BFA8'
export const GLOBE_HOME = '#D4845A'

export const GLOBE_COLORS = {
  visited: COLORS.mapLandVisited, wishlist: COLORS.mapLandWishlist,
  unvisited: COLORS.mapLand, water: COLORS.mapWater, glow: COLORS.sunset,
} as const

export const ROUTE_COLORS: Record<string, string> = {
  FLIGHT: COLORS.ocean, TRAIN: COLORS.forest, CAR: COLORS.textTertiary, OTHER: COLORS.textTertiary,
}
