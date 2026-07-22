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
        id: 1, flightNo: 'AF1234', airline: 'Air France', aircraft: 'A320',
        departureTime: '2024-10-12T10:00:00', arrivalTime: '2024-10-12T11:30:00',
        departureAirport: 'CDG', arrivalAirport: 'ORY',
      },
    ],
    notesMd: '# France Trip 2024\n\nA wonderful journey through France, starting in Paris, then Lyon, and ending in Marseille.',
    photos: [
      { id: 1, url: 'https://picsum.photos/seed/fra1/800/600', caption: 'Eiffel Tower', takenAt: '2024-10-12T14:00:00', aspectRatio: 1.333, sortOrder: 0 },
      { id: 2, url: 'https://picsum.photos/seed/fra2/800/600', caption: 'Lyon Old Town', takenAt: '2024-10-14T10:00:00', aspectRatio: 1.333, sortOrder: 1 },
      { id: 3, url: 'https://picsum.photos/seed/fra3/800/600', caption: 'Marseille Port', takenAt: '2024-10-16T16:00:00', aspectRatio: 1.333, sortOrder: 2 },
      { id: 4, url: 'https://picsum.photos/seed/fra4/800/600', caption: 'Lyon Food Market', takenAt: '2024-10-15T09:00:00', aspectRatio: 1.333, sortOrder: 3 },
      { id: 5, url: 'https://picsum.photos/seed/fra5/800/600', caption: 'Seine River', takenAt: '2024-10-13T18:00:00', aspectRatio: 1.500, sortOrder: 4 },
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
        id: 2, flightNo: 'NH123', airline: 'ANA', aircraft: 'B787',
        departureTime: '2025-03-15T08:00:00', arrivalTime: '2025-03-15T12:00:00',
        departureAirport: 'HND', arrivalAirport: 'KIX',
      },
    ],
    notesMd: '# Japan Spring Trip 2025\n\nCherry blossoms and amazing food in Tokyo and Osaka.',
    photos: [
      { id: 6,  url: 'https://picsum.photos/seed/jpn1/800/600', caption: 'Shibuya Crossing',  takenAt: '2025-03-15T15:00:00', aspectRatio: 1.333, sortOrder: 0 },
      { id: 7,  url: 'https://picsum.photos/seed/jpn2/800/600', caption: 'Cherry Blossoms',   takenAt: '2025-03-16T09:00:00', aspectRatio: 1.333, sortOrder: 1 },
      { id: 8,  url: 'https://picsum.photos/seed/jpn3/800/600', caption: 'Osaka Castle',     takenAt: '2025-03-18T11:00:00', aspectRatio: 1.333, sortOrder: 2 },
      { id: 9,  url: 'https://picsum.photos/seed/jpn4/800/600', caption: 'Tsukiji Market',   takenAt: '2025-03-17T07:00:00', aspectRatio: 1.333, sortOrder: 3 },
      { id: 10, url: 'https://picsum.photos/seed/jpn5/800/600', caption: 'Dotonbori Night',  takenAt: '2025-03-19T20:00:00', aspectRatio: 1.500, sortOrder: 4 },
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
        id: 3, flightNo: 'TG123', airline: 'Thai Airways', aircraft: 'B777',
        departureTime: '2024-03-10T08:00:00', arrivalTime: '2024-03-10T09:30:00',
        departureAirport: 'BKK', arrivalAirport: 'CNX',
      },
      {
        id: 4, flightNo: 'TG456', airline: 'Thai Airways', aircraft: 'A330',
        departureTime: '2024-03-12T14:00:00', arrivalTime: '2024-03-12T15:30:00',
        departureAirport: 'CNX', arrivalAirport: 'HKT',
      },
    ],
    notesMd: '# Thailand Adventure 2024\n\nFrom Bangkok temples to Chiang Mai mountains and Phuket beaches.',
    photos: [
      { id: 11, url: 'https://picsum.photos/seed/tha1/800/600', caption: 'Wat Arun',        takenAt: '2024-03-08T16:00:00', aspectRatio: 1.333, sortOrder: 0 },
      { id: 12, url: 'https://picsum.photos/seed/tha2/800/600', caption: 'Chiang Mai Temple', takenAt: '2024-03-10T10:00:00', aspectRatio: 1.333, sortOrder: 1 },
      { id: 13, url: 'https://picsum.photos/seed/tha3/800/600', caption: 'Phi Phi Island',   takenAt: '2024-03-13T12:00:00', aspectRatio: 1.500, sortOrder: 2 },
      { id: 14, url: 'https://picsum.photos/seed/tha4/800/600', caption: 'Street Food',      takenAt: '2024-03-09T19:00:00', aspectRatio: 1.333, sortOrder: 3 },
      { id: 15, url: 'https://picsum.photos/seed/tha5/800/600', caption: 'Night Market',     takenAt: '2024-03-11T20:00:00', aspectRatio: 1.333, sortOrder: 4 },
    ],
  }
}

export const mockTripDetails: TripDetail[] = [
  buildTrip1Detail(),
  buildTrip2Detail(),
  buildTrip3Detail(),
]

/* ══════════════════════ Stats ══════════════════════ */
export const mockStats: Stats = {
  countryCount: 7,
  cityCount: 23,
  tripCount: 12,
  totalDays: 45,
  flightCount: 8,
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
  { id: 1, type: 'COUNTRY', countryCode: 'ISL', countryName: 'Iceland',     flagEmoji: '🇮🇸', cityCount: 12 },
  { id: 2, type: 'COUNTRY', countryCode: 'NZL', countryName: 'New Zealand', flagEmoji: '🇳🇿', cityCount: 8 },
  { id: 3, type: 'COUNTRY', countryCode: 'PER', countryName: 'Peru',        flagEmoji: '🇵🇪', cityCount: 5, note: 'Machu Picchu awaits!' },
  { id: 4, type: 'CITY',    countryCode: 'NOR', countryName: 'Norway',      flagEmoji: '🇳🇴', cityName: 'Bergen', note: 'Northern Lights + fjords' },
]
