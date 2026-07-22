/**
 * 心愿单状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as wishlistApi from '@/api/wishlist'
import type { WishlistItem } from '@/types/wishlist'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])
  const loading = ref(false)

  async function fetchWishlist(type?: 'COUNTRY' | 'CITY') {
    loading.value = true
    try {
      const res = await wishlistApi.getWishlist(type)
      if (res.code === 200) {
        items.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  async function addItem(data: {
    type: 'COUNTRY' | 'CITY'
    countryCode: string
    cityName?: string
    note?: string
  }) {
    loading.value = true
    try {
      const res = await wishlistApi.addWishlistItem(data)
      if (res.code === 200) {
        await fetchWishlist()
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function removeItem(id: number) {
    loading.value = true
    try {
      const res = await wishlistApi.deleteWishlistItem(id)
      if (res.code === 200) {
        items.value = items.value.filter((i) => i.id !== id)
      }
      return res
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    fetchWishlist,
    addItem,
    removeItem,
  }
})
