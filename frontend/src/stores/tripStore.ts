/**
 * 旅行状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as tripsApi from '@/api/trips'
import type { Trip, TripDetail, TripCreateReq } from '@/types/trip'

export const useTripStore = defineStore('trip', () => {
  const recentTrips = ref<Trip[]>([])
  const currentTrip = ref<TripDetail | null>(null)
  const loading = ref(false)

  async function fetchTrips(limit?: number) {
    loading.value = true
    try {
      const res = await tripsApi.getTrips({ limit })
      if (res.code === 200) {
        recentTrips.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchTripDetail(id: number) {
    loading.value = true
    try {
      const res = await tripsApi.getTripDetail(id)
      if (res.code === 200) {
        currentTrip.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  async function createTrip(data: TripCreateReq) {
    loading.value = true
    try {
      const res = await tripsApi.createTrip(data)
      if (res.code === 200) {
        await fetchTrips()
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function updateTrip(id: number, data: Partial<TripCreateReq>) {
    loading.value = true
    try {
      const res = await tripsApi.updateTrip(id, data)
      if (res.code === 200) {
        await fetchTripDetail(id)
        await fetchTrips()
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function deleteTrip(id: number) {
    loading.value = true
    try {
      const res = await tripsApi.deleteTrip(id)
      if (res.code === 200) {
        recentTrips.value = recentTrips.value.filter((t) => t.id !== id)
        if (currentTrip.value?.id === id) {
          currentTrip.value = null
        }
      }
      return res
    } finally {
      loading.value = false
    }
  }

  return {
    recentTrips,
    currentTrip,
    loading,
    fetchTrips,
    fetchTripDetail,
    createTrip,
    updateTrip,
    deleteTrip,
  }
})
