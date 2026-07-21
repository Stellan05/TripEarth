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
}
