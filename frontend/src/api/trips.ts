/**
 * 旅行相关 API
 */
import { api } from './client'
import type { ApiResponse } from '@/types/common'
import type { Trip, TripDetail, TripCreateReq } from '@/types/trip'
import * as mock from './mock'

const useMock = true

/** 获取旅行列表 */
export function getTrips(params?: {
  limit?: number
  country?: string
}): Promise<ApiResponse<Trip[]>> {
  if (useMock) return mock.getTrips(params)
  return api.get('/trips', { params })
}

/** 获取旅行详情 */
export function getTripDetail(id: number): Promise<ApiResponse<TripDetail>> {
  if (useMock) return mock.getTripDetail(id)
  return api.get(`/trips/${id}`)
}

/** 创建旅行 */
export function createTrip(
  data: TripCreateReq,
): Promise<ApiResponse<{ id: number }>> {
  if (useMock) return mock.createTrip(data)
  return api.post('/trips', data)
}

/** 更新旅行 */
export function updateTrip(
  id: number,
  data: Partial<TripCreateReq>,
): Promise<ApiResponse<{ id: number }>> {
  if (useMock) return mock.updateTrip(id, data)
  return api.put(`/trips/${id}`, data)
}

/** 删除旅行 */
export function deleteTrip(id: number): Promise<ApiResponse<null>> {
  if (useMock) return mock.deleteTrip(id)
  return api.delete(`/trips/${id}`)
}
