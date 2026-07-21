/** 统一 API 响应体 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页响应 */
export interface PageResult<T> {
  records: T[]
  total: number
  page: number
  pageSize: number
}

/** 交通方式 */
export type TransportType = 'FLIGHT' | 'TRAIN' | 'CAR' | 'OTHER'

/** 旅行访问状态 */
export type VisitStatus = 'visited' | 'wishlist' | 'unvisited'

/** 通用选项类型（下拉选择器） */
export interface SelectOption {
  label: string
  value: string | number
  icon?: string
}
