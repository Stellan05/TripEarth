/**
 * TripDetail — 旅行详情页
 *
 * 布局: TwoColumnLayout (7:5)
 * 左列: RouteMap + DayTimelineStrip + NotesViewer
 * 右列: FlightCard（stacked 效果）+ PhotoGrid
 * 右下角: ContextGlobe
 *
 * 状态: loading / empty / error / normal
 */
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import TwoColumnLayout from '@/components/layout/TwoColumnLayout.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import RouteMap from '@/components/features/map/RouteMap.vue'
import FlightCard from '@/components/features/trip/FlightCard.vue'
import DayTimelineStrip from '@/components/features/trip/DayTimelineStrip.vue'
import PhotoGrid from '@/components/features/photo/PhotoGrid.vue'
import LightboxGallery from '@/components/features/photo/LightboxGallery.vue'
import NotesViewer from '@/components/features/content/NotesViewer.vue'
import ContextGlobe from '@/components/features/globe/ContextGlobe.vue'
import SectionHeader from '@/components/shared/SectionHeader.vue'
import AppSpinner from '@/components/base/AppSpinner.vue'
import AppEmptyState from '@/components/base/AppEmptyState.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppCard from '@/components/base/AppCard.vue'
import { useTripStore } from '@/stores/tripStore'
import { formatDateRange, daysBetween } from '@/utils/date'
import type { DayInfo } from '@/types/trip'

const route = useRoute()
const tripStore = useTripStore()

const tripId = computed(() => Number(route.params.id))
const currentTrip = computed(() => tripStore.currentTrip)

// ── State ──
const error = ref<string | null>(null)
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)
const activeDay = ref(0)

// ── Computed ──

const subtitle = computed(() => {
  const trip = currentTrip.value
  if (!trip) return ''
  const cityName = trip.cities[0]?.name || ''
  const dateRange = formatDateRange(trip.startDate, trip.endDate)
  return `${cityName}, ${trip.countryName} · ${dateRange} · ${trip.dayCount} days`
})

const days = computed<DayInfo[]>(() => {
  const trip = currentTrip.value
  if (!trip) return []
  const start = new Date(trip.startDate)
  const end = new Date(trip.endDate)
  const result: DayInfo[] = []
  const current = new Date(start)
  let dayIndex = 0
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0]
    const hasPhotos = trip.photos?.some((p) => p.takenAt?.startsWith(dateStr)) ?? false
    result.push({ dayIndex, date: dateStr, hasPhotos })
    current.setDate(current.getDate() + 1)
    dayIndex++
  }
  return result
})

// ── Data Loading ──

async function loadData() {
  error.value = null
  try {
    await tripStore.fetchTripDetail(tripId.value)
  } catch (e) {
    error.value = 'Failed to load trip'
  }
}

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxVisible.value = true
}

function onDayClick(dayIndex: number) {
  activeDay.value = dayIndex
}

onMounted(() => {
  loadData()
  document.title = 'Trip Detail'
})

watch(currentTrip, (trip) => {
  if (trip) {
    document.title = `${trip.cities[0]?.name || 'Trip'} · ${trip.countryName}`
  }
}, { immediate: false })
</script>

<template>
  <div class="trip-detail-wrapper">
    <!-- Loading -->
    <div v-if="tripStore.loading && !currentTrip" class="trip-detail__loading">
      <AppSpinner size="lg" label="Loading trip..." />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="trip-detail__center">
      <AppEmptyState icon="AlertCircle" :title="error" description="Please try again.">
        <AppButton variant="primary" size="md" @click="loadData">Retry</AppButton>
      </AppEmptyState>
    </div>

    <!-- Empty / Not Found -->
    <div v-else-if="!currentTrip" class="trip-detail__center">
      <AppEmptyState icon="Calendar" title="Trip not found" description="The trip you are looking for does not exist." />
    </div>

    <!-- Normal Content -->
    <TwoColumnLayout v-else :left-cols="7" :right-cols="5" gap="var(--card-gap, 24px)" :left-sticky="true">
      <template #left>
        <PageHeader
          :title="`${currentTrip.cities[0]?.name || 'Unknown'}, ${currentTrip.countryName}`"
          :subtitle="subtitle"
          back-to="/"
          back-label="Back to Globe"
        >
          <template #meta>
            <span class="trip-detail__flag">{{ currentTrip.flagEmoji }}</span>
          </template>
        </PageHeader>

        <!-- Route Map -->
        <RouteMap
          :cities="currentTrip.cities"
          :routes="currentTrip.routes"
          :flights="currentTrip.flights"
          :loading="tripStore.loading"
        />

        <!-- Day Timeline -->
        <div class="trip-detail__section">
          <SectionHeader title="Days" />
          <AppCard variant="default" :hoverable="false" padding>
            <DayTimelineStrip
              :days="days"
              :active-day="activeDay"
              @day-click="onDayClick"
            />
          </AppCard>
        </div>

        <!-- Notes -->
        <div class="trip-detail__section">
          <SectionHeader title="Notes" />
          <AppCard variant="default" :hoverable="false" padding>
            <NotesViewer
              :content="currentTrip.notesMd || ''"
              :editable="false"
            />
          </AppCard>
        </div>
      </template>

      <template #right>
        <!-- Flights -->
        <div class="trip-detail__section">
          <SectionHeader title="Flights" />
          <div v-if="currentTrip.flights.length === 0" class="trip-detail__empty-hint body-sm text-tertiary">
            No flights recorded for this trip.
          </div>
          <div v-else class="trip-detail__flights">
            <FlightCard
              v-for="(flight, i) in currentTrip.flights"
              :key="flight.id || i"
              :flight="flight"
              :stacked="currentTrip.flights.length > 1"
              :stack-index="i"
              @click="() => {}"
            />
          </div>
        </div>

        <!-- Photos -->
        <div class="trip-detail__section">
          <SectionHeader title="Photos" />
          <PhotoGrid
            :photos="currentTrip.photos"
            :loading="tripStore.loading"
            @photo-click="openLightbox"
          />
        </div>
      </template>
    </TwoColumnLayout>

    <!-- ContextGlobe -->
    <ContextGlobe v-if="currentTrip" :country-code="currentTrip.countryCode" :size="80" />

    <!-- Lightbox -->
    <LightboxGallery
      :visible="lightboxVisible"
      :photos="currentTrip?.photos || []"
      :initial-index="lightboxIndex"
      @close="lightboxVisible = false"
    />
  </div>
</template>

<style scoped>
.trip-detail__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.trip-detail__center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--page-padding);
  padding-top: calc(var(--page-padding) + 60px);
}

.trip-detail__flag {
  font-size: 28px;
  line-height: 1;
}

.trip-detail__section {
  margin-bottom: var(--space-xl);
}

.trip-detail__flights {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.trip-detail__empty-hint {
  text-align: center;
  padding: var(--space-xl) 0;
}
</style>
