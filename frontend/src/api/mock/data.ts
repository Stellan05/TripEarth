/**
 * 模拟数据 — 与 GlobeHome.vue 已有的 mock 数据保持一致并扩展
 */
import type { Country } from '@/types/country'
import type { CountryStatus } from '@/types/country'
import type { Trip, TripDetail, Stats } from '@/types/trip'
import type { Photo } from '@/types/photo'
import type { WishlistItem } from '@/types/wishlist'

/* ══════════════════════ Countries ══════════════════════ */
export const mockCountries: Country[] = [
  { id: 1,  code: 'FRA', name: 'France',         nameCn: '法国',        flagEmoji: '🇫🇷', continent: 'Europe' },
  { id: 2,  code: 'JPN', name: 'Japan',          nameCn: '日本',        flagEmoji: '🇯🇵', continent: 'Asia' },
  { id: 3,  code: 'ITA', name: 'Italy',          nameCn: '意大利',      flagEmoji: '🇮🇹', continent: 'Europe' },
  { id: 4,  code: 'THA', name: 'Thailand',       nameCn: '泰国',        flagEmoji: '🇹🇭', continent: 'Asia' },
  { id: 5,  code: 'ESP', name: 'Spain',          nameCn: '西班牙',      flagEmoji: '🇪🇸', continent: 'Europe' },
  { id: 6,  code: 'KOR', name: 'South Korea',    nameCn: '韩国',        flagEmoji: '🇰🇷', continent: 'Asia' },
  { id: 7,  code: 'GBR', name: 'United Kingdom',  nameCn: '英国',        flagEmoji: '🇬🇧', continent: 'Europe' },
  { id: 8,  code: 'ISL', name: 'Iceland',        nameCn: '冰岛',        flagEmoji: '🇮🇸', continent: 'Europe' },
  { id: 9,  code: 'NZL', name: 'New Zealand',    nameCn: '新西兰',      flagEmoji: '🇳🇿', continent: 'Oceania' },
  { id: 10, code: 'PER', name: 'Peru',           nameCn: '秘鲁',        flagEmoji: '🇵🇪', continent: 'South America' },
  { id: 11, code: 'MAR', name: 'Morocco',        nameCn: '摩洛哥',      flagEmoji: '🇲🇦', continent: 'Africa' },
  { id: 12, code: 'NOR', name: 'Norway',         nameCn: '挪威',        flagEmoji: '🇳🇴', continent: 'Europe' },
  { id: 13, code: 'USA', name: 'United States',  nameCn: '美国',        flagEmoji: '🇺🇸', continent: 'North America' },
  { id: 14, code: 'CAN', name: 'Canada',         nameCn: '加拿大',      flagEmoji: '🇨🇦', continent: 'North America' },
  { id: 15, code: 'AUS', name: 'Australia',      nameCn: '澳大利亚',    flagEmoji: '🇦🇺', continent: 'Oceania' },
  { id: 16, code: 'CHN', name: 'China',          nameCn: '中国',        flagEmoji: '🇨🇳', continent: 'Asia' },
  { id: 17, code: 'DEU', name: 'Germany',        nameCn: '德国',        flagEmoji: '🇩🇪', continent: 'Europe' },
  { id: 18, code: 'PRT', name: 'Portugal',       nameCn: '葡萄牙',      flagEmoji: '🇵🇹', continent: 'Europe' },
  { id: 19, code: 'NLD', name: 'Netherlands',    nameCn: '荷兰',        flagEmoji: '🇳🇱', continent: 'Europe' },
  { id: 20, code: 'CHE', name: 'Switzerland',    nameCn: '瑞士',        flagEmoji: '🇨🇭', continent: 'Europe' },
  { id: 21, code: 'GRC', name: 'Greece',         nameCn: '希腊',        flagEmoji: '🇬🇷', continent: 'Europe' },
  { id: 22, code: 'TUR', name: 'Türkiye',        nameCn: '土耳其',      flagEmoji: '🇹🇷', continent: 'Asia' },
  { id: 23, code: 'VNM', name: 'Vietnam',        nameCn: '越南',        flagEmoji: '🇻🇳', continent: 'Asia' },
  { id: 24, code: 'SGP', name: 'Singapore',      nameCn: '新加坡',      flagEmoji: '🇸🇬', continent: 'Asia' },
  { id: 25, code: 'MYS', name: 'Malaysia',       nameCn: '马来西亚',    flagEmoji: '🇲🇾', continent: 'Asia' },
  { id: 26, code: 'ARE', name: 'UAE',            nameCn: '阿联酋',      flagEmoji: '🇦🇪', continent: 'Asia' },
  { id: 27, code: 'EGY', name: 'Egypt',          nameCn: '埃及',        flagEmoji: '🇪🇬', continent: 'Africa' },
  { id: 28, code: 'ZAF', name: 'South Africa',   nameCn: '南非',        flagEmoji: '🇿🇦', continent: 'Africa' },
  { id: 29, code: 'BRA', name: 'Brazil',         nameCn: '巴西',        flagEmoji: '🇧🇷', continent: 'South America' },
  { id: 30, code: 'ARG', name: 'Argentina',      nameCn: '阿根廷',      flagEmoji: '🇦🇷', continent: 'South America' },
]

/* ══════════════════════ Country Statuses ══════════════════════ */
export const mockCountryStatuses: CountryStatus[] = [
  { code: 'FRA', name: 'France',         status: 'visited',  visitCount: 3, lastVisit: '2024-10-12', heartCount: 2, hasNotes: true },
  { code: 'JPN', name: 'Japan',          status: 'visited',  visitCount: 5, lastVisit: '2025-03-15', heartCount: 3, hasNotes: true },
  { code: 'ITA', name: 'Italy',          status: 'visited',  visitCount: 2, lastVisit: '2024-07-05', hasNotes: true },
  { code: 'THA', name: 'Thailand',       status: 'visited',  visitCount: 1, lastVisit: '2024-03-08' },
  { code: 'ESP', name: 'Spain',          status: 'visited',  visitCount: 1, lastVisit: '2023-08-10', heartCount: 1 },
  { code: 'KOR', name: 'South Korea',    status: 'visited',  visitCount: 1, lastVisit: '2023-05-01' },
  { code: 'GBR', name: 'United Kingdom', status: 'visited',  visitCount: 2, lastVisit: '2024-12-20', heartCount: 1 },
  { code: 'CHN', name: 'China',          status: 'visited',  visitCount: 8, isHome: true, hasNotes: true, heartCount: 5 },
  { code: 'ISL', name: 'Iceland',        status: 'wishlist', citiesCount: 12 },
  { code: 'NZL', name: 'New Zealand',    status: 'wishlist', citiesCount: 8 },
  { code: 'PER', name: 'Peru',           status: 'wishlist', citiesCount: 5 },
  { code: 'MAR', name: 'Morocco',        status: 'wishlist', citiesCount: 4 },
  { code: 'NOR', name: 'Norway',         status: 'wishlist', citiesCount: 6 },
]

/* ══════════════════════ Trips ══════════════════════ */
export const mockTrips: Trip[] = [
  { id: 1, countryCode: 'FRA', countryName: 'France', flagEmoji: '🇫🇷', cityName: 'Paris',   startDate: '2024-10-12', endDate: '2024-10-19', dayCount: 8, cityCount: 3 },
  { id: 2, countryCode: 'JPN', countryName: 'Japan',  flagEmoji: '🇯🇵', cityName: 'Tokyo',   startDate: '2025-03-15', endDate: '2025-03-21', dayCount: 7, cityCount: 2 },
  { id: 3, countryCode: 'THA', countryName: 'Thailand', flagEmoji: '🇹🇭', cityName: 'Bangkok', startDate: '2024-03-08', endDate: '2024-03-14', dayCount: 7, cityCount: 3 },
  { id: 4, countryCode: 'CHN', countryName: 'China', flagEmoji: '🇨🇳', cityName: '北京', startDate: '2025-01-15', endDate: '2025-01-22', dayCount: 8, cityCount: 4 },
  { id: 5, countryCode: 'CHN', countryName: 'China', flagEmoji: '🇨🇳', cityName: '成都', startDate: '2024-06-10', endDate: '2024-06-16', dayCount: 7, cityCount: 3 },
]

/** 获取国家对应的城市-路线-航班详情 */
function buildTrip1Detail(): TripDetail {
  return {
    id: 1,
    countryCode: 'FRA',
    countryName: 'France',
    flagEmoji: '🇫🇷',
    startDate: '2024-10-12',
    endDate: '2024-10-19',
    dayCount: 8,
    cities: [
      { id: 1, name: 'Paris',     lat: 48.8566,  lng: 2.3522,   sortOrder: 0 },
      { id: 2, name: 'Lyon',      lat: 45.7640,  lng: 4.8357,   sortOrder: 1 },
      { id: 3, name: 'Marseille', lat: 43.2965,  lng: 5.3698,   sortOrder: 2 },
    ],
    routes: [
      { id: 1, fromCityName: 'Paris',     toCityName: 'Lyon',      transportType: 'TRAIN', sortOrder: 0 },
      { id: 2, fromCityName: 'Lyon',      toCityName: 'Marseille', transportType: 'TRAIN', sortOrder: 1 },
    ],
    flights: [
      {
        id: 1, flightNo: 'AF1234', airline: 'Air France', aircraft: 'Airbus A320',
        departureTime: '2024-10-12T10:00:00', arrivalTime: '2024-10-12T11:30:00',
        departureAirport: 'CDG', arrivalAirport: 'ORY',
        status: 'landed',
        actualDeparture: '2024-10-12T10:05:00', actualArrival: '2024-10-12T11:28:00',
        gate: 'B24', terminal: '2E',
        departureCity: 'Paris', arrivalCity: 'Paris',
        duration: 90,
      },
    ],
    notesMd: '# France Trip 2024\n\nA wonderful journey through France, starting in Paris, then Lyon, and ending in Marseille.',
    photos: [
      { id: 1, url: 'https://picsum.photos/seed/fra1/800/600', caption: 'Eiffel Tower', takenAt: '2024-10-12T14:00:00', lat: 48.8584, lng: 2.2945, aspectRatio: 1.333, sortOrder: 0 },
      { id: 2, url: 'https://picsum.photos/seed/fra2/800/600', caption: 'Lyon Old Town', takenAt: '2024-10-14T10:00:00', lat: 45.7640, lng: 4.8357, aspectRatio: 1.333, sortOrder: 1 },
      { id: 3, url: 'https://picsum.photos/seed/fra3/800/600', caption: 'Marseille Port', takenAt: '2024-10-16T16:00:00', lat: 43.2965, lng: 5.3698, aspectRatio: 1.333, sortOrder: 2 },
      { id: 4, url: 'https://picsum.photos/seed/fra4/800/600', caption: 'Lyon Food Market', takenAt: '2024-10-15T09:00:00', lat: 45.7640, lng: 4.8357, aspectRatio: 1.333, sortOrder: 3 },
      { id: 5, url: 'https://picsum.photos/seed/fra5/800/600', caption: 'Seine River', takenAt: '2024-10-13T18:00:00', lat: 48.8566, lng: 2.3522, aspectRatio: 1.500, sortOrder: 4 },
    ],
  }
}

function buildTrip2Detail(): TripDetail {
  return {
    id: 2,
    countryCode: 'JPN',
    countryName: 'Japan',
    flagEmoji: '🇯🇵',
    startDate: '2025-03-15',
    endDate: '2025-03-21',
    dayCount: 7,
    cities: [
      { id: 4, name: 'Tokyo',     lat: 35.6762,  lng: 139.6503, sortOrder: 0 },
      { id: 5, name: 'Osaka',     lat: 34.6937,  lng: 135.5023, sortOrder: 1 },
    ],
    routes: [
      { id: 3, fromCityName: 'Tokyo', toCityName: 'Osaka', transportType: 'TRAIN', sortOrder: 0 },
    ],
    flights: [
      {
        id: 2, flightNo: 'NH123', airline: 'ANA', aircraft: 'Boeing 787-9',
        departureTime: '2025-03-15T08:00:00', arrivalTime: '2025-03-15T12:00:00',
        departureAirport: 'HND', arrivalAirport: 'KIX',
        status: 'landed',
        actualDeparture: '2025-03-15T08:12:00', actualArrival: '2025-03-15T11:55:00',
        gate: '12', terminal: '2',
        departureCity: 'Tokyo', arrivalCity: 'Osaka',
        duration: 120,
      },
    ],
    notesMd: '# Japan Spring Trip 2025\n\nCherry blossoms and amazing food in Tokyo and Osaka.',
    photos: [
      { id: 6,  url: 'https://picsum.photos/seed/jpn1/800/600', caption: 'Shibuya Crossing',  takenAt: '2025-03-15T15:00:00', lat: 35.6580, lng: 139.7016, aspectRatio: 1.333, sortOrder: 0 },
      { id: 7,  url: 'https://picsum.photos/seed/jpn2/800/600', caption: 'Cherry Blossoms',   takenAt: '2025-03-16T09:00:00', lat: 35.6762, lng: 139.6503, aspectRatio: 1.333, sortOrder: 1 },
      { id: 8,  url: 'https://picsum.photos/seed/jpn3/800/600', caption: 'Osaka Castle',     takenAt: '2025-03-18T11:00:00', lat: 34.6873, lng: 135.5262, aspectRatio: 1.333, sortOrder: 2 },
      { id: 9,  url: 'https://picsum.photos/seed/jpn4/800/600', caption: 'Tsukiji Market',   takenAt: '2025-03-17T07:00:00', lat: 35.6654, lng: 139.7707, aspectRatio: 1.333, sortOrder: 3 },
      { id: 10, url: 'https://picsum.photos/seed/jpn5/800/600', caption: 'Dotonbori Night',  takenAt: '2025-03-19T20:00:00', lat: 34.6688, lng: 135.5013, aspectRatio: 1.500, sortOrder: 4 },
    ],
  }
}

function buildTrip3Detail(): TripDetail {
  return {
    id: 3,
    countryCode: 'THA',
    countryName: 'Thailand',
    flagEmoji: '🇹🇭',
    startDate: '2024-03-08',
    endDate: '2024-03-14',
    dayCount: 7,
    cities: [
      { id: 6,  name: 'Bangkok',  lat: 13.7563,  lng: 100.5018, sortOrder: 0 },
      { id: 7,  name: 'Chiang Mai', lat: 18.7883, lng: 98.9853,  sortOrder: 1 },
      { id: 8,  name: 'Phuket',   lat: 7.8804,   lng: 98.3923,  sortOrder: 2 },
    ],
    routes: [
      { id: 4, fromCityName: 'Bangkok',   toCityName: 'Chiang Mai', transportType: 'FLIGHT', sortOrder: 0 },
      { id: 5, fromCityName: 'Chiang Mai', toCityName: 'Phuket',     transportType: 'FLIGHT', sortOrder: 1 },
    ],
    flights: [
      {
        id: 3, flightNo: 'TG123', airline: 'Thai Airways', aircraft: 'Boeing 777-300ER',
        departureTime: '2024-03-10T08:00:00', arrivalTime: '2024-03-10T09:30:00',
        departureAirport: 'BKK', arrivalAirport: 'CNX',
        status: 'landed',
        actualDeparture: '2024-03-10T08:15:00', actualArrival: '2024-03-10T09:28:00',
        gate: 'C5', terminal: '1',
        departureCity: 'Bangkok', arrivalCity: 'Chiang Mai',
        duration: 90,
      },
      {
        id: 4, flightNo: 'TG456', airline: 'Thai Airways', aircraft: 'Airbus A330-300',
        departureTime: '2024-03-12T14:00:00', arrivalTime: '2024-03-12T15:30:00',
        departureAirport: 'CNX', arrivalAirport: 'HKT',
        status: 'landed',
        actualDeparture: '2024-03-12T14:22:00', actualArrival: '2024-03-12T15:25:00',
        gate: '3', terminal: 'D',
        departureCity: 'Chiang Mai', arrivalCity: 'Phuket',
        duration: 90,
      },
    ],
    notesMd: '# Thailand Adventure 2024\n\nFrom Bangkok temples to Chiang Mai mountains and Phuket beaches.',
    photos: [
      { id: 11, url: 'https://picsum.photos/seed/tha1/800/600', caption: 'Wat Arun',        takenAt: '2024-03-08T16:00:00', lat: 13.7437, lng: 100.4888, aspectRatio: 1.333, sortOrder: 0 },
      { id: 12, url: 'https://picsum.photos/seed/tha2/800/600', caption: 'Chiang Mai Temple', takenAt: '2024-03-10T10:00:00', lat: 18.7883, lng: 98.9853, aspectRatio: 1.333, sortOrder: 1 },
      { id: 13, url: 'https://picsum.photos/seed/tha3/800/600', caption: 'Phi Phi Island',   takenAt: '2024-03-13T12:00:00', lat: 7.8804, lng: 98.3923, aspectRatio: 1.500, sortOrder: 2 },
      { id: 14, url: 'https://picsum.photos/seed/tha4/800/600', caption: 'Street Food',      takenAt: '2024-03-09T19:00:00', lat: 13.7563, lng: 100.5018, aspectRatio: 1.333, sortOrder: 3 },
      { id: 15, url: 'https://picsum.photos/seed/tha5/800/600', caption: 'Night Market',     takenAt: '2024-03-11T20:00:00', lat: 18.7883, lng: 98.9853, aspectRatio: 1.333, sortOrder: 4 },
    ],
  }
}

function buildTrip4Detail(): TripDetail {
  return {
    id: 4,
    countryCode: 'CHN',
    countryName: 'China',
    flagEmoji: '🇨🇳',
    startDate: '2025-01-15',
    endDate: '2025-01-22',
    dayCount: 8,
    cities: [
      { id: 9,  name: '北京', lat: 39.9042,  lng: 116.4074, sortOrder: 0 },
      { id: 10, name: '西安', lat: 34.3416,  lng: 108.9398, sortOrder: 1 },
      { id: 11, name: '上海', lat: 31.2304,  lng: 121.4737, sortOrder: 2 },
      { id: 12, name: '杭州', lat: 30.2741,  lng: 120.1551, sortOrder: 3 },
    ],
    routes: [
      { id: 6, fromCityName: '北京', toCityName: '西安', transportType: 'TRAIN', sortOrder: 0 },
      { id: 7, fromCityName: '西安', toCityName: '上海', transportType: 'FLIGHT', sortOrder: 1 },
      { id: 8, fromCityName: '上海', toCityName: '杭州', transportType: 'TRAIN', sortOrder: 2 },
    ],
    flights: [
      {
        id: 5, flightNo: 'MU1234', airline: '中国东方航空', aircraft: 'Airbus A330-200',
        departureTime: '2025-01-17T14:00:00', arrivalTime: '2025-01-17T16:00:00',
        departureAirport: 'XIY', arrivalAirport: 'PVG',
        status: 'landed',
        actualDeparture: '2025-01-17T14:08:00', actualArrival: '2025-01-17T15:52:00',
        gate: 'H18', terminal: 'T3',
        departureCity: '西安', arrivalCity: '上海',
        duration: 120,
      },
    ],
    notesMd: '# 中国之旅 2025\n\n从北京出发，经西安到上海，最后在杭州结束。一路感受中国的历史文化与现代繁华。',
    photos: [
      { id: 16, url: 'https://picsum.photos/seed/chn1/800/600', caption: '故宫',     takenAt: '2025-01-15T10:00:00', lat: 39.9163, lng: 116.3972, aspectRatio: 1.333, sortOrder: 0 },
      { id: 17, url: 'https://picsum.photos/seed/chn2/800/600', caption: '兵马俑',   takenAt: '2025-01-16T14:00:00', lat: 34.3845, lng: 109.2734, aspectRatio: 1.333, sortOrder: 1 },
      { id: 18, url: 'https://picsum.photos/seed/chn3/800/600', caption: '外滩',     takenAt: '2025-01-18T19:00:00', lat: 31.2400, lng: 121.4900, aspectRatio: 1.333, sortOrder: 2 },
      { id: 19, url: 'https://picsum.photos/seed/chn4/800/600', caption: '西湖',     takenAt: '2025-01-20T08:00:00', lat: 30.2590, lng: 120.1450, aspectRatio: 1.333, sortOrder: 3 },
    ],
  }
}

function buildTrip5Detail(): TripDetail {
  return {
    id: 5,
    countryCode: 'CHN',
    countryName: 'China',
    flagEmoji: '🇨🇳',
    startDate: '2024-06-10',
    endDate: '2024-06-16',
    dayCount: 7,
    cities: [
      { id: 13, name: '成都', lat: 30.5728,  lng: 104.0668, sortOrder: 0 },
      { id: 14, name: '重庆', lat: 29.4316,  lng: 106.9123, sortOrder: 1 },
      { id: 15, name: '丽江', lat: 26.8721,  lng: 100.2299, sortOrder: 2 },
    ],
    routes: [
      { id: 9,  fromCityName: '成都', toCityName: '重庆', transportType: 'TRAIN', sortOrder: 0 },
      { id: 10, fromCityName: '重庆', toCityName: '丽江', transportType: 'FLIGHT', sortOrder: 1 },
    ],
    flights: [
      {
        id: 6, flightNo: 'CA567', airline: '中国国航', aircraft: 'Airbus A320neo',
        departureTime: '2024-06-13T08:00:00', arrivalTime: '2024-06-13T09:30:00',
        departureAirport: 'CKG', arrivalAirport: 'LJG',
        status: 'landed',
        actualDeparture: '2024-06-13T08:06:00', actualArrival: '2024-06-13T09:20:00',
        gate: 'G07', terminal: 'T3A',
        departureCity: '重庆', arrivalCity: '丽江',
        duration: 90,
      },
    ],
    notesMd: '# 西南之旅 2024\n\n成都的美食、重庆的夜景、丽江的古城，一次难忘的西南之旅。',
    photos: [
      { id: 20, url: 'https://picsum.photos/seed/chn5/800/600', caption: '宽窄巷子', takenAt: '2024-06-10T15:00:00', lat: 30.6667, lng: 104.0667, aspectRatio: 1.333, sortOrder: 0 },
      { id: 21, url: 'https://picsum.photos/seed/chn6/800/600', caption: '洪崖洞',   takenAt: '2024-06-12T20:00:00', lat: 29.5628, lng: 106.5928, aspectRatio: 1.333, sortOrder: 1 },
      { id: 22, url: 'https://picsum.photos/seed/chn7/800/600', caption: '古城',     takenAt: '2024-06-14T11:00:00', lat: 26.8721, lng: 100.2299, aspectRatio: 1.333, sortOrder: 2 },
    ],
  }
}

export const mockTripDetails: TripDetail[] = [
  buildTrip1Detail(),
  buildTrip2Detail(),
  buildTrip3Detail(),
  buildTrip4Detail(),
  buildTrip5Detail(),
]

/* ══════════════════════ Stats ══════════════════════ */
export const mockStats: Stats = {
  countryCount: 7,
  cityCount: 29,
  tripCount: 14,
  totalDays: 52,
  flightCount: 10,
  continentCount: 3,
}

/* ══════════════════════ Photos ══════════════════════ */
export const mockPhotos: Photo[] = [
  // France
  { id: 1,  url: 'https://picsum.photos/seed/fra1/800/600', caption: 'Eiffel Tower',     takenAt: '2024-10-12T14:00:00', aspectRatio: 1.333, sortOrder: 0 },
  { id: 2,  url: 'https://picsum.photos/seed/fra2/800/600', caption: 'Lyon Old Town',    takenAt: '2024-10-14T10:00:00', aspectRatio: 1.333, sortOrder: 1 },
  { id: 3,  url: 'https://picsum.photos/seed/fra3/800/600', caption: 'Marseille Port',   takenAt: '2024-10-16T16:00:00', aspectRatio: 1.333, sortOrder: 2 },
  { id: 4,  url: 'https://picsum.photos/seed/fra4/800/600', caption: 'Lyon Food Market', takenAt: '2024-10-15T09:00:00', aspectRatio: 1.333, sortOrder: 3 },
  { id: 5,  url: 'https://picsum.photos/seed/fra5/800/600', caption: 'Seine River',      takenAt: '2024-10-13T18:00:00', aspectRatio: 1.500, sortOrder: 4 },
  // Japan
  { id: 6,  url: 'https://picsum.photos/seed/jpn1/800/600', caption: 'Shibuya Crossing', takenAt: '2025-03-15T15:00:00', aspectRatio: 1.333, sortOrder: 0 },
  { id: 7,  url: 'https://picsum.photos/seed/jpn2/800/600', caption: 'Cherry Blossoms',  takenAt: '2025-03-16T09:00:00', aspectRatio: 1.333, sortOrder: 1 },
  { id: 8,  url: 'https://picsum.photos/seed/jpn3/800/600', caption: 'Osaka Castle',     takenAt: '2025-03-18T11:00:00', aspectRatio: 1.333, sortOrder: 2 },
  { id: 9,  url: 'https://picsum.photos/seed/jpn4/800/600', caption: 'Tsukiji Market',   takenAt: '2025-03-17T07:00:00', aspectRatio: 1.333, sortOrder: 3 },
  { id: 10, url: 'https://picsum.photos/seed/jpn5/800/600', caption: 'Dotonbori Night',  takenAt: '2025-03-19T20:00:00', aspectRatio: 1.500, sortOrder: 4 },
  // Thailand
  { id: 11, url: 'https://picsum.photos/seed/tha1/800/600', caption: 'Wat Arun',         takenAt: '2024-03-08T16:00:00', aspectRatio: 1.333, sortOrder: 0 },
  { id: 12, url: 'https://picsum.photos/seed/tha2/800/600', caption: 'Chiang Mai Temple', takenAt: '2024-03-10T10:00:00', aspectRatio: 1.333, sortOrder: 1 },
  { id: 13, url: 'https://picsum.photos/seed/tha3/800/600', caption: 'Phi Phi Island',   takenAt: '2024-03-13T12:00:00', aspectRatio: 1.500, sortOrder: 2 },
  { id: 14, url: 'https://picsum.photos/seed/tha4/800/600', caption: 'Street Food',      takenAt: '2024-03-09T19:00:00', aspectRatio: 1.333, sortOrder: 3 },
  { id: 15, url: 'https://picsum.photos/seed/tha5/800/600', caption: 'Night Market',     takenAt: '2024-03-11T20:00:00', aspectRatio: 1.333, sortOrder: 4 },
]

/* ══════════════════════ Wishlist ══════════════════════ */
export const mockWishlistItems: WishlistItem[] = [
  {
    id: 1, type: 'COUNTRY', countryCode: 'ISL', countryName: 'Iceland', flagEmoji: '🇮🇸', cityCount: 4,
    entries: [
      { id: 101, title: 'Blue Lagoon', description: 'Geothermal spa with milky-blue waters surrounded by lava fields.', imageUrl: 'https://picsum.photos/seed/isl1/400/300', addedAt: '2024-11-10' },
      { id: 102, title: 'Northern Lights Tour', description: 'Chase the aurora borealis in the Icelandic winter.', addedAt: '2024-11-15' },
      { id: 103, title: 'Golden Circle', description: 'Þingvellir, Gullfoss, and Geysir — Iceland\'s iconic route.', imageUrl: 'https://picsum.photos/seed/isl2/400/300', addedAt: '2024-12-01' },
      { id: 104, title: 'Reykjavik City Walk', description: 'Explore the colorful streets of the world\'s northernmost capital.', addedAt: '2024-12-05' },
    ],
  },
  {
    id: 2, type: 'COUNTRY', countryCode: 'NZL', countryName: 'New Zealand', flagEmoji: '🇳🇿', cityCount: 3,
    entries: [
      { id: 201, title: 'Milford Sound Cruise', description: 'Cruise through breathtaking fjords with waterfalls.', imageUrl: 'https://picsum.photos/seed/nzl1/400/300', addedAt: '2024-09-20' },
      { id: 202, title: 'Hobbiton Movie Set', description: 'Visit the Shire from Lord of the Rings.', imageUrl: 'https://picsum.photos/seed/nzl2/400/300', addedAt: '2024-10-05' },
      { id: 203, title: 'Queenstown Bungee', description: 'The birthplace of bungee jumping — AJ Hackett\'s original bridge.', addedAt: '2024-10-10' },
    ],
  },
  {
    id: 3, type: 'COUNTRY', countryCode: 'PER', countryName: 'Peru', flagEmoji: '🇵🇪', cityCount: 3,
    note: 'Machu Picchu awaits!',
    entries: [
      { id: 301, title: 'Machu Picchu', description: 'The Lost City of the Incas — a wonder of the world.', imageUrl: 'https://picsum.photos/seed/per1/400/300', addedAt: '2024-08-15' },
      { id: 302, title: 'Rainbow Mountain', description: 'Vinicunca — the colorful mountain of the Andes.', addedAt: '2024-08-20' },
      { id: 303, title: 'Lima Food Tour', description: 'Explore Peru\'s world-class ceviche and culinary scene.', addedAt: '2024-09-01' },
    ],
  },
  {
    id: 4, type: 'CITY', countryCode: 'NOR', countryName: 'Norway', flagEmoji: '🇳🇴', cityName: 'Bergen', cityCount: 2,
    note: 'Northern Lights + fjords',
    entries: [
      { id: 401, title: 'Bryggen Hanseatic Wharf', description: 'The iconic colorful wooden houses of Bergen.', imageUrl: 'https://picsum.photos/seed/nor1/400/300', addedAt: '2024-07-10' },
      { id: 402, title: 'Fløibanen Funicular', description: 'Ride up Mount Fløyen for panoramic views of the city.', addedAt: '2024-07-15' },
    ],
  },
]

/* ══════════════════════ 中国省份/地区 ══════════════════════ */
/** 城市 → 省份映射 */
export const chinaCityToRegion: Record<string, string> = {
  '北京': '北京市',
  '西安': '陕西省',
  '上海': '上海市',
  '杭州': '浙江省',
  '成都': '四川省',
  '重庆': '重庆市',
  '丽江': '云南省',
}

/** 中国已去省份/地区列表（根据 trips 数据推导） */
export const mockChinaRegions = [
  { name: '北京市', cityCount: 1, visitCount: 1 },
  { name: '陕西省', cityCount: 1, visitCount: 1 },
  { name: '上海市', cityCount: 1, visitCount: 1 },
  { name: '浙江省', cityCount: 1, visitCount: 1 },
  { name: '四川省', cityCount: 1, visitCount: 1 },
  { name: '重庆市', cityCount: 1, visitCount: 1 },
  { name: '云南省', cityCount: 1, visitCount: 1 },
]

/* ══════════════════════ 机场坐标 ══════════════════════ */
export const airportCoords: Record<string, { lat: number; lng: number; countryCode: string }> = {
  CDG: { lat: 49.0097, lng: 2.5479, countryCode: 'FRA' },
  ORY: { lat: 48.7233, lng: 2.3794, countryCode: 'FRA' },
  HND: { lat: 35.5494, lng: 139.7798, countryCode: 'JPN' },
  KIX: { lat: 34.4273, lng: 135.2441, countryCode: 'JPN' },
  BKK: { lat: 13.6900, lng: 100.7501, countryCode: 'THA' },
  CNX: { lat: 18.7669, lng: 98.9623, countryCode: 'THA' },
  HKT: { lat: 8.1132, lng: 98.3169, countryCode: 'THA' },
  XIY: { lat: 34.4471, lng: 108.7516, countryCode: 'CHN' },
  PVG: { lat: 31.1443, lng: 121.8083, countryCode: 'CHN' },
  CKG: { lat: 29.7192, lng: 106.6417, countryCode: 'CHN' },
  LJG: { lat: 26.6790, lng: 100.2289, countryCode: 'CHN' },
}
