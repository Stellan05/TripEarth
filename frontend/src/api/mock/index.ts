/**
 * Mock API — 提供与真实 API 相同签名的模拟实现
 * 所有函数返回 Promise<ApiResponse<T>>，带 200-400ms 延迟
 */
import type { ApiResponse, PageResult } from '@/types/common'
import type { Country, CountryStatus } from '@/types/country'
import type { Trip, TripDetail, TripCreateReq, Stats } from '@/types/trip'
import type { Photo } from '@/types/photo'
import type { WishlistItem } from '@/types/wishlist'

import {
  mockCountries,
  mockCountryStatuses,
  mockTrips,
  mockTripDetails,
  mockStats,
  mockPhotos,
  mockWishlistItems,
} from './data'

/* ── Helpers ── */
let nextId = 100

function delay(ms?: number): Promise<void> {
  const t = ms ?? (200 + Math.random() * 200) // 200-400ms
  return new Promise((resolve) => setTimeout(resolve, t))
}

function ok<T>(data: T): ApiResponse<T> {
  return { code: 200, message: 'success', data }
}

function paged<T>(records: T[], page: number, pageSize: number): PageResult<T> {
  return {
    records,
    total: records.length,
    page,
    pageSize,
  }
}

/* ══════════════════════ Countries ══════════════════════ */

export async function getCountries(q?: string): Promise<ApiResponse<Country[]>> {
  await delay()
  if (q) {
    const lower = q.toLowerCase()
    return ok(mockCountries.filter(
      (c) => c.name.toLowerCase().includes(lower) || (c.nameCn?.includes(lower)),
    ))
  }
  return ok(mockCountries)
}

export async function getVisitedCountries(): Promise<ApiResponse<{ visited: CountryStatus[]; wishlist: CountryStatus[] }>> {
  await delay()
  const visited = mockCountryStatuses.filter((c) => c.status === 'visited')
  const wishlist = mockCountryStatuses.filter((c) => c.status === 'wishlist')
  return ok({ visited, wishlist })
}

export async function getCountryDetail(code: string): Promise<ApiResponse<{
  code: string
  name: string
  flagEmoji: string
  continent: string
  tripCount: number
  cityCount: number
  firstVisit: string | null
  lastVisit: string | null
}>> {
  await delay()
  const country = mockCountries.find(
    (c) => c.code.toLowerCase() === code.toLowerCase(),
  )
  if (!country) {
    return { code: 404, message: 'Country not found', data: null as never }
  }
  const status = mockCountryStatuses.find(
    (s) => s.code.toLowerCase() === code.toLowerCase(),
  )
  return ok({
    code: country.code,
    name: country.name,
    flagEmoji: country.flagEmoji,
    continent: country.continent,
    tripCount: status?.visitCount ?? 0,
    cityCount: 0,
    firstVisit: null,
    lastVisit: status?.lastVisit ?? null,
  })
}

export async function getCountryCities(code: string): Promise<ApiResponse<
  { id: number; name: string; lat: number; lng: number; visitCount: number; lastVisit: string | null }[]
>> {
  await delay()
  const details = mockTripDetails.filter(
    (t) => t.countryCode.toLowerCase() === code.toLowerCase(),
  )
  const cities = details.flatMap((d) =>
    d.cities.map((c) => ({
      id: c.id as number,
      name: c.name,
      lat: c.lat,
      lng: c.lng,
      visitCount: 1,
      lastVisit: d.startDate,
    })),
  )
  return ok(cities)
}

export async function getCountryTrips(
  code: string,
  _page?: number,
): Promise<ApiResponse<PageResult<Trip>>> {
  await delay()
  const trips = mockTrips.filter(
    (t) => t.countryCode.toLowerCase() === code.toLowerCase(),
  )
  return ok(paged(trips, _page ?? 1, 10))
}

export async function getCountryPhotos(
  code: string,
  _page?: number,
): Promise<ApiResponse<PageResult<Photo>>> {
  await delay()
  const detail = mockTripDetails.find(
    (t) => t.countryCode.toLowerCase() === code.toLowerCase(),
  )
  return ok(paged(detail?.photos ?? [], _page ?? 1, 10))
}

/* ══════════════════════ Trips ══════════════════════ */

export async function getTrips(params?: {
  limit?: number
  country?: string
}): Promise<ApiResponse<Trip[]>> {
  await delay()
  let result = [...mockTrips]
  if (params?.country) {
    result = result.filter(
      (t) => t.countryCode.toLowerCase() === params.country!.toLowerCase(),
    )
  }
  if (params?.limit && params.limit > 0) {
    result = result.slice(0, params.limit)
  }
  return ok(result)
}

export async function getTripDetail(id: number): Promise<ApiResponse<TripDetail>> {
  await delay()
  const detail = mockTripDetails.find((t) => t.id === id)
  if (!detail) {
    return { code: 404, message: 'Trip not found', data: null as never }
  }
  return ok(detail)
}

export async function createTrip(
  data: TripCreateReq,
): Promise<ApiResponse<{ id: number }>> {
  await delay()
  const id = nextId++
  const country = mockCountries.find(
    (c) => c.code === data.countryCode,
  )
  const newTrip: Trip = {
    id,
    countryCode: data.countryCode,
    countryName: country?.name ?? data.countryCode,
    flagEmoji: country?.flagEmoji ?? '',
    cityName: data.cities[0]?.name ?? '',
    startDate: data.startDate,
    endDate: data.endDate,
    dayCount: 0,
    cityCount: data.cities.length,
  }
  mockTrips.unshift(newTrip)
  return ok({ id })
}

export async function updateTrip(
  id: number,
  data: Partial<TripCreateReq>,
): Promise<ApiResponse<{ id: number }>> {
  await delay()
  const trip = mockTrips.find((t) => t.id === id)
  if (trip && data.countryCode) {
    const country = mockCountries.find((c) => c.code === data.countryCode)
    if (country) {
      trip.countryCode = country.code
      trip.countryName = country.name
      trip.flagEmoji = country.flagEmoji
    }
  }
  return ok({ id })
}

export async function deleteTrip(id: number): Promise<ApiResponse<null>> {
  await delay()
  const idx = mockTrips.findIndex((t) => t.id === id)
  if (idx >= 0) mockTrips.splice(idx, 1)
  return ok(null)
}

/* ══════════════════════ Stats ══════════════════════ */

export async function getStats(): Promise<ApiResponse<Stats>> {
  await delay()
  return ok(mockStats)
}

/* ══════════════════════ Photos ══════════════════════ */

export async function getTripPhotos(
  tripId: number,
  _page?: number,
): Promise<ApiResponse<PageResult<Photo>>> {
  await delay()
  const detail = mockTripDetails.find((t) => t.id === tripId)
  return ok(paged(detail?.photos ?? [], _page ?? 1, 20))
}

export async function uploadPhotos(
  _tripId: number,
  _files: File[],
): Promise<ApiResponse<Photo[]>> {
  await delay()
  const photos: Photo[] = _files.map((f, i) => ({
    id: nextId++,
    url: URL.createObjectURL(f),
    caption: f.name,
    aspectRatio: 1.333,
    sortOrder: i,
  }))
  return ok(photos)
}

export async function updatePhoto(
  id: number,
  data: { caption?: string; sortOrder?: number },
): Promise<ApiResponse<null>> {
  await delay()
  const photo = mockPhotos.find((p) => p.id === id)
  if (photo) {
    if (data.caption !== undefined) photo.caption = data.caption
    if (data.sortOrder !== undefined) photo.sortOrder = data.sortOrder
  }
  return ok(null)
}

export async function deletePhoto(id: number): Promise<ApiResponse<null>> {
  await delay()
  return ok(null)
}

/* ══════════════════════ Wishlist ══════════════════════ */

export async function getWishlist(
  type?: 'COUNTRY' | 'CITY',
): Promise<ApiResponse<WishlistItem[]>> {
  await delay()
  let items = [...mockWishlistItems]
  if (type) {
    items = items.filter((i) => i.type === type)
  }
  return ok(items)
}

export async function addWishlistItem(data: {
  type: 'COUNTRY' | 'CITY'
  countryCode: string
  cityName?: string
  note?: string
}): Promise<ApiResponse<{ id: number }>> {
  await delay()
  const id = nextId++
  const country = mockCountries.find((c) => c.code === data.countryCode)
  const newItem: WishlistItem = {
    id,
    type: data.type,
    countryCode: data.countryCode,
    countryName: country?.name ?? data.countryCode,
    flagEmoji: country?.flagEmoji,
    cityName: data.cityName,
    note: data.note,
  }
  mockWishlistItems.push(newItem)
  return ok({ id })
}

export async function deleteWishlistItem(id: number): Promise<ApiResponse<null>> {
  await delay()
  const idx = mockWishlistItems.findIndex((i) => i.id === id)
  if (idx >= 0) mockWishlistItems.splice(idx, 1)
  return ok(null)
}
