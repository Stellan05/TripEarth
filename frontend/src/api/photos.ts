/**
 * 照片相关 API
 */
import { api } from './client'
import type { ApiResponse, PageResult } from '@/types/common'
import type { Photo } from '@/types/photo'
import * as mock from './mock'

const useMock = true

/** 获取旅行照片（分页） */
export function getTripPhotos(
  tripId: number,
  page?: number,
): Promise<ApiResponse<PageResult<Photo>>> {
  if (useMock) return mock.getTripPhotos(tripId, page)
  return api.get(`/trips/${tripId}/photos`, { params: { page } })
}

/** 上传照片 */
export function uploadPhotos(
  tripId: number,
  files: File[],
): Promise<ApiResponse<Photo[]>> {
  if (useMock) return mock.uploadPhotos(tripId, files)
  const formData = new FormData()
  files.forEach((f) => formData.append('files', f))
  return api.post(`/trips/${tripId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/** 更新照片信息 */
export function updatePhoto(
  id: number,
  data: { caption?: string; sortOrder?: number },
): Promise<ApiResponse<null>> {
  if (useMock) return mock.updatePhoto(id, data)
  return api.put(`/photos/${id}`, data)
}

/** 删除照片 */
export function deletePhoto(id: number): Promise<ApiResponse<null>> {
  if (useMock) return mock.deletePhoto(id)
  return api.delete(`/photos/${id}`)
}
