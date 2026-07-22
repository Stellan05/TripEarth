/**
 * 国家相关 API
 */
import { api } from './client'
import type { ApiResponse, PageResult } from '@/types/common'
import type { Country, CountryStatus } from '@/types/country'
import type { Trip } from '@/types/trip'
import type { Photo } from '@/types/photo'
import * as mock from './mock'

const useMock = true

/** 获取所有国家列表 */
export function getCountries(q?: string): Promise<ApiResponse<Country[]>> {
  if (useMock) return mock.getCountries(q)
  return api.get('/countries', { params: { q } })
}

/** 获取去过/想去的国家 */
export function getVisitedCountries(): Promise<
  ApiResponse<{ visited: CountryStatus[]; wishlist: CountryStatus[] }>
> {
  if (useMock) return mock.getVisitedCountries()
  return api.get('/countries/visited')
}

/** 获取国家详情 */
export function getCountryDetail(
  code: string,
): Promise<
  ApiResponse<{
    code: string
    name: string
    flagEmoji: string
    continent: string
    tripCount: number
    cityCount: number
    firstVisit: string | null
    lastVisit: string | null
  }>
> {
  if (useMock) return mock.getCountryDetail(code)
  return api.get(`/countries/${code}`)
}

/** 获取国家下城市列表 */
export function getCountryCities(
  code: string,
): Promise<
  ApiResponse<
    { id: number; name: string; lat: number; lng: number; visitCount: number; lastVisit: string | null }[]
  >
> {
  if (useMock) return mock.getCountryCities(code)
  return api.get(`/countries/${code}/cities`)
}

/** 获取国家下的旅行列表 */
export function getCountryTrips(
  code: string,
  page?: number,
): Promise<ApiResponse<PageResult<Trip>>> {
  if (useMock) return mock.getCountryTrips(code, page)
  return api.get(`/countries/${code}/trips`, { params: { page } })
}

/** 获取国家下的照片 */
export function getCountryPhotos(
  code: string,
  page?: number,
): Promise<ApiResponse<PageResult<Photo>>> {
  if (useMock) return mock.getCountryPhotos(code, page)
  return api.get(`/countries/${code}/photos`, { params: { page } })
}
