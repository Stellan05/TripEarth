/**
 * useGlobe — 3D 地球辅助函数
 *
 * 核心逻辑由 Globe3D / ContextGlobe 组件自行管理。
 * 此文件导出：
 *   - colorForStatus() — 根据访问状态返回颜色
 *   - GlobeInstance 类型（供外部引用）
 */

import { COLORS } from '@/utils/colors'
import type { CountryStatus } from '@/types/country'

/** globe.gl 实例类型（简化，供 ContextGlobe 等组件使用） */
export type GlobeInstance = ReturnType<(typeof import('globe.gl'))['default']>

/** 根据 CountryStatus 返回地图/地球颜色 */
export function colorForStatus(status: CountryStatus['status']): string {
  switch (status) {
    case 'visited':
      return COLORS.mapLandVisited
    case 'wishlist':
      return COLORS.mapLandWishlist
    default:
      return COLORS.mapLand
  }
}

/** 根据 ISO_A3 从 CountryStatus[] 中查找并返回颜色 */
export function colorForCode(
  code: string,
  statuses: CountryStatus[],
): string {
  const s = statuses.find(
    (st) => st.code.toLowerCase() === code.toLowerCase(),
  )
  return s ? colorForStatus(s.status) : COLORS.mapLand
}
