/** 照片 */
export interface Photo {
  id: number
  url: string
  caption?: string
  takenAt?: string
  aspectRatio?: number
  sortOrder: number
}
