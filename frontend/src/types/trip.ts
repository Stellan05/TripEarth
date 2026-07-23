import type { TransportType } from './common'

/** 旅行基本信息（列表用） */
export interface Trip {
  id: number
  countryCode: string
  countryName: string
  flagEmoji: string
  title?: string
  cityName: string
  startDate: string
  endDate: string
  dayCount: number
  cityCount: number
  thumbnailUrl?: string
}

/** 旅行城市 */
export interface TripCity {
  id?: number
  name: string
  lat: number
  lng: number
  sortOrder: number
}

/** 旅行路线段 */
export interface TripRoute {
  id?: number
  fromCityName: string
  toCityName: string
  transportType: TransportType
  sortOrder: number
  flight?: Flight | null
}

/** 航班信息 */
export interface Flight {
  id?: number
  flightNo: string
  airline: string
  aircraft: string
  departureTime: string
  arrivalTime: string
  departureAirport: string
  arrivalAirport: string
  /** 航班状态 */
  status?: 'scheduled' | 'boarding' | 'departed' | 'in-air' | 'landed' | 'delayed' | 'cancelled'
  /** 实际出发时间（未提供则使用 departureTime） */
  actualDeparture?: string
  /** 实际到达时间 */
  actualArrival?: string
  /** 登机口 */
  gate?: string
  /** 航站楼 */
  terminal?: string
  /** 出发城市名 */
  departureCity?: string
  /** 到达城市名 */
  arrivalCity?: string
  /** 飞行时长（分钟） */
  duration?: number
}

/** 旅行详情 */
export interface TripDetail {
  id: number
  countryCode: string
  countryName: string
  flagEmoji: string
  startDate: string
  endDate: string
  dayCount: number
  cities: TripCity[]
  routes: TripRoute[]
  flights: Flight[]
  notesMd: string
  photos: import('./photo').Photo[]
}

/** 天信息（DayTimelineStrip 用） */
export interface DayInfo {
  dayIndex: number
  date: string
  hasPhotos: boolean
  hasNotes: boolean
}

/** 统计数据 */
export interface Stats {
  countryCount: number
  cityCount: number
  tripCount: number
  totalDays: number
  flightCount: number
  continentCount: number
}

/** 创建旅行请求 */
export interface TripCreateReq {
  countryCode: string
  startDate: string
  endDate: string
  cities: Omit<TripCity, 'id'>[]
  routes: {
    fromCityIndex: number
    toCityIndex: number
    transportType: TransportType
    flight?: Flight | null
  }[]
  notesMd?: string
}
