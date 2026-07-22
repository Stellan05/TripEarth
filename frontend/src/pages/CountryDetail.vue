/**
 * CountryDetail — 国家详情页
 *
 * 布局: TwoColumnLayout (7:5)
 * 左列: CountryMap（城市标记 + 路线）
 * 右列: PhotoGrid + TripCard 列表
 * 右下角: ContextGlobe 小地球
 *
 * 状态: loading / empty / error / normal
 */
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TwoColumnLayout from '@/components/layout/TwoColumnLayout.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import CountryMap from '@/components/features/map/CountryMap.vue'
import type { CountryMapCity } from '@/components/features/map/CountryMap.vue'
import PhotoGrid from '@/components/features/photo/PhotoGrid.vue'
import LightboxGallery from '@/components/features/photo/LightboxGallery.vue'
import ContextGlobe from '@/components/features/globe/ContextGlobe.vue'
import TripCard from '@/components/features/trip/TripCard.vue'
import AppSpinner from '@/components/base/AppSpinner.vue'
import AppEmptyState from '@/components/base/AppEmptyState.vue'
import AppButton from '@/components/base/AppButton.vue'
import SectionHeader from '@/components/shared/SectionHeader.vue'
import { useCountryStore } from '@/stores/countryStore'
import * as countriesApi from '@/api/countries'
import type { Photo } from '@/types/photo'
import type { Trip } from '@/types/trip'

const route = useRoute()
const router = useRouter()
const countryStore = useCountryStore()

const countryCode = computed(() => (route.params.code as string).toUpperCase())

// ── State ──
const loading = ref(true)
const error = ref<string | null>(null)

interface CountryDetailData {
  code: string
  name: string
  flagEmoji: string
  continent: string
  tripCount: number
  cityCount: number
  firstVisit: string | null
  lastVisit: string | null
}

const countryDetail = ref<CountryDetailData | null>(null)
const cities = ref<{ id: number; name: string; lat: number; lng: number; visitCount: number; lastVisit: string | null }[]>([])
const trips = ref<Trip[]>([])
const photos = ref<Photo[]>([])

const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

// ── Computed ──

const mapCities = computed<CountryMapCity[]>(() =>
  cities.value.map((c) => ({
    name: c.name,
    lat: c.lat,
    lng: c.lng,
    visited: true,
  })),
)

const subtitle = computed(() => {
  if (!countryDetail.value) return ''
  const parts: string[] = []
  const tc = countryDetail.value.tripCount
  const cc = cities.value.length || countryDetail.value.cityCount
  parts.push(`${tc} trip${tc !== 1 ? 's' : ''}`)
  parts.push(`${cc} cit${cc !== 1 ? 'ies' : 'y'}`)
  if (countryDetail.value.firstVisit && countryDetail.value.lastVisit) {
    const fy = countryDetail.value.firstVisit.slice(0, 4)
    const ly = countryDetail.value.lastVisit.slice(0, 4)
    if (fy !== ly) {
      parts.push(`${fy}–${ly}`)
    } else {
      parts.push(fy)
    }
  }
  return parts.join(' · ')
})

// ── Data Loading ──

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [detailRes, citiesRes, tripsRes, photosRes] = await Promise.all([
      countriesApi.getCountryDetail(countryCode.value),
      countriesApi.getCountryCities(countryCode.value),
      countriesApi.getCountryTrips(countryCode.value),
      countriesApi.getCountryPhotos(countryCode.value),
    ])

    if (detailRes.code === 200 && detailRes.data) {
      countryDetail.value = detailRes.data
    } else {
      error.value = 'Country not found'
      return
    }

    if (citiesRes.code === 200) {
      cities.value = citiesRes.data
    }
    if (tripsRes.code === 200) {
      trips.value = tripsRes.data.records
    }
    if (photosRes.code === 200) {
      photos.value = photosRes.data.records
    }
  } catch (e) {
    error.value = 'Failed to load country data'
  } finally {
    loading.value = false
  }
}

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxVisible.value = true
}

function goToTrip(id: number) {
  router.push(`/trip/${id}`)
}

function retry() {
  loadData()
}

onMounted(() => {
  loadData()
  document.title = countryCode.value ? `Country · ${countryCode.value}` : 'Country Detail'
})
</script>

<template>
  <div class="country-detail-wrapper">
    <!-- Loading -->
    <div v-if="loading" class="country-detail__loading">
      <AppSpinner size="lg" label="Loading country..." />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="country-detail__center">
      <AppEmptyState icon="AlertCircle" :title="error" description="Please try again.">
        <AppButton variant="primary" size="md" @click="retry">Retry</AppButton>
      </AppEmptyState>
    </div>

    <!-- Empty -->
    <div v-else-if="!countryDetail" class="country-detail__center">
      <AppEmptyState icon="MapPin" title="Country not found" description="The country you are looking for does not exist." />
    </div>

    <!-- Normal Content -->
    <TwoColumnLayout v-else :left-cols="7" :right-cols="5" gap="var(--card-gap, 24px)" :left-sticky="true">
      <template #left>
        <PageHeader
          :title="countryDetail.name"
          :subtitle="subtitle"
          back-to="/"
          back-label="Back to Globe"
        >
          <template #meta>
            <span class="country-detail__flag">{{ countryDetail.flagEmoji }}</span>
            <span class="body-sm text-secondary">{{ countryDetail.continent }}</span>
          </template>
        </PageHeader>

        <!-- Map -->
        <CountryMap
          :cities="mapCities"
          :country-code="countryCode"
          :loading="loading"
          @city-click="(city) => console.log('City:', city)"
        />
      </template>

      <template #right>
        <!-- Photos -->
        <div class="country-detail__section">
          <SectionHeader title="Photos" />
          <PhotoGrid
            :photos="photos"
            :loading="loading"
            @photo-click="openLightbox"
          />
        </div>

        <!-- Trips -->
        <div class="country-detail__section">
          <SectionHeader title="Trips" />
          <div v-if="trips.length === 0" class="country-detail__empty-hint body-sm text-tertiary">
            No trips recorded for this country yet.
          </div>
          <div v-else class="country-detail__trips">
            <TripCard
              v-for="trip in trips"
              :key="trip.id"
              :trip="trip"
              size="compact"
              @click="goToTrip(trip.id)"
            />
          </div>
        </div>
      </template>
    </TwoColumnLayout>

    <!-- ContextGlobe -->
    <ContextGlobe v-if="countryDetail" :country-code="countryCode" :size="80" />

    <!-- Lightbox -->
    <LightboxGallery
      :visible="lightboxVisible"
      :photos="photos"
      :initial-index="lightboxIndex"
      @close="lightboxVisible = false"
    />
  </div>
</template>

<style scoped>
.country-detail-wrapper {
  width: 100%;
  min-height: 100vh;
}

.country-detail__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.country-detail__center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--page-padding);
  padding-top: calc(var(--page-padding) + 60px);
}

.country-detail__flag {
  font-size: 28px;
  line-height: 1;
}

.country-detail__meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.country-detail__section {
  margin-bottom: var(--space-xl);
}

.country-detail__trips {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.country-detail__empty-hint {
  text-align: center;
  padding: var(--space-xl) 0;
}
</style>
