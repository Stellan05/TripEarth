/**
 * 心愿单相关 API
 */
import { api } from './client'
import type { ApiResponse } from '@/types/common'
import type { WishlistItem } from '@/types/wishlist'
import * as mock from './mock'

const useMock = true

/** 获取心愿单列表 */
export function getWishlist(
  type?: 'COUNTRY' | 'CITY',
): Promise<ApiResponse<WishlistItem[]>> {
  if (useMock) return mock.getWishlist(type)
  return api.get('/wishlist', { params: { type } })
}

/** 添加心愿单项 */
export function addWishlistItem(data: {
  type: 'COUNTRY' | 'CITY'
  countryCode: string
  cityName?: string
  note?: string
}): Promise<ApiResponse<{ id: number }>> {
  if (useMock) return mock.addWishlistItem(data)
  return api.post('/wishlist', data)
}

/** 删除心愿单项 */
export function deleteWishlistItem(id: number): Promise<ApiResponse<null>> {
  if (useMock) return mock.deleteWishlistItem(id)
  return api.delete(`/wishlist/${id}`)
}
