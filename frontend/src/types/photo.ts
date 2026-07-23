/** 照片 */
export interface Photo {
  id: number
  url: string
  caption?: string
  takenAt?: string
  lat?: number
  lng?: number
  aspectRatio?: number
  sortOrder: number
}
