/** 想去清单条目（国家/城市下的具体地点） */
export interface WishlistEntry {
  id: number
  title: string
  description?: string
  imageUrl?: string
  addedAt: string
}

/** 想去清单项 */
export interface WishlistItem {
  id: number
  type: 'COUNTRY' | 'CITY'
  countryCode: string
  countryName: string
  flagEmoji?: string
  cityName?: string
  note?: string
  cityCount?: number
  entries?: WishlistEntry[]
}
