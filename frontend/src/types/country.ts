import type { VisitStatus } from './common'

/** 国家基本信息 */
export interface Country {
  id: number
  code: string
  name: string
  nameCn?: string
  flagEmoji: string
  continent: string
}

/** 国家访问状态（给地球着色用） */
export interface CountryStatus {
  code: string
  name: string
  status: VisitStatus
  /** 去过次数 — 决定颜色深度 */
  visitCount?: number
  /** 最近一次访问 */
  lastVisit?: string
  /** 想去 — 已保存城市数 */
  citiesCount?: number
  /** 收藏/红心标记（在去过国家上加红心） */
  heartCount?: number
  /** 是否有旅行手记 */
  hasNotes?: boolean
  /** 用户当前所在国家（常住/定位） */
  isHome?: boolean
}
