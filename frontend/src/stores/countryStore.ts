/**
 * 国家/目的地状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as countriesApi from '@/api/countries'
import type { Country } from '@/types/country'
import type { CountryStatus } from '@/types/country'

export const useCountryStore = defineStore('country', () => {
  const countries = ref<Country[]>([])
  const visitedCountries = ref<CountryStatus[]>([])
  const wishlistCountries = ref<CountryStatus[]>([])
  const loading = ref(false)

  async function fetchCountries(q?: string) {
    loading.value = true
    try {
      const res = await countriesApi.getCountries(q)
      if (res.code === 200) {
        countries.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchVisitedCountries() {
    loading.value = true
    try {
      const res = await countriesApi.getVisitedCountries()
      if (res.code === 200) {
        visitedCountries.value = res.data.visited
        wishlistCountries.value = res.data.wishlist
      }
    } finally {
      loading.value = false
    }
  }

  return {
    countries,
    visitedCountries,
    wishlistCountries,
    loading,
    fetchCountries,
    fetchVisitedCountries,
  }
})
