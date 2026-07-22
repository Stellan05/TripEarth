/**
 * 统计相关 API
 */
import { api } from './client'
import type { ApiResponse } from '@/types/common'
import type { Stats } from '@/types/trip'
import * as mock from './mock'

const useMock = true

/** 获取统计数据 */
export function getStats(): Promise<ApiResponse<Stats>> {
  if (useMock) return mock.getStats()
  return api.get('/stats')
}
