/**
 * Timeline — 时间轴页
 *
 * 布局: FullWidthLayout
 * 顶部: PageHeader + YearFilter
 * 内容: 按年份分组的时间线，使用 TimelineTrack
 *
 * 状态: loading / empty / normal
 * 使用 useTripStore
 */
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FullWidthLayout from '@/components/layout/FullWidthLayout.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import YearFilter from '@/components/features/timeline/YearFilter.vue'
import TimelineTrack from '@/components/features/timeline/TimelineTrack.vue'
import AppSpinner from '@/components/base/AppSpinner.vue'
import AppEmptyState from '@/components/base/AppEmptyState.vue'
import { useTripStore } from '@/stores/tripStore'
import type { Trip } from '@/types/trip'

const router = useRouter()
const tripStore = useTripStore()

// ── State ──
const activeYear = ref<number | null>(null)

// ── Computed ──

const availableYears = computed<number[]>(() => {
  const years = new Set<number>()
  for (const trip of tripStore.recentTrips) {
    const y = new Date(trip.startDate).getFullYear()
    years.add(y)
  }
  return Array.from(years).sort((a, b) => b - a)
})

interface YearGroup {
  year: number
  trips: Trip[]
}

const yearGroups = computed<YearGroup[]>(() => {
  const yearsToRender = activeYear.value
    ? availableYears.value.filter((y) => y === activeYear.value)
    : availableYears.value

  return yearsToRender.map((year) => {
    const trips = tripStore.recentTrips.filter((trip) => {
      const d = new Date(trip.startDate)
      return d.getFullYear() === year
    })
    return { year, trips }
  })
})

// ── Methods ──

function onYearChange(year: number | null) {
  activeYear.value = year
}

function goToTrip(tripId: number) {
  router.push(`/trip/${tripId}`)
}

function goToNewTrip() {
  router.push('/trip/new')
}

onMounted(async () => {
  await tripStore.fetchTrips()
  document.title = 'Timeline'
})
</script>

<template>
  <FullWidthLayout content-max-width="960px">
    <template #header>
      <PageHeader
        title="Your Travels"
        :subtitle="`${tripStore.recentTrips.length} trips across ${availableYears.length} years`"
        title-tag="h1"
        title-size="display-lg"
      />

      <!-- Year Filter -->
      <div class="timeline__filters">
        <YearFilter
          :years="availableYears"
          :model-value="activeYear"
          @update:model-value="onYearChange"
          @change="onYearChange"
        />
      </div>
    </template>

    <!-- Loading -->
    <div v-if="tripStore.loading && tripStore.recentTrips.length === 0" class="timeline__loading">
      <AppSpinner size="lg" label="Loading trips..." />
    </div>

    <!-- Empty -->
    <div v-else-if="tripStore.recentTrips.length === 0" class="timeline__empty">
      <AppEmptyState
        icon="Clock"
        title="No trips yet"
        description="Start documenting your adventures!"
        cta-text="Plan a Trip"
        @cta-click="goToNewTrip"
      />
    </div>

    <!-- Timeline tracks -->
    <div v-else class="timeline__content">
      <TimelineTrack
        v-for="group in yearGroups"
        :key="group.year"
        :year="group.year"
        :trips="group.trips"
        @trip-click="goToTrip"
      />
    </div>
  </FullWidthLayout>
</template>

<style scoped>
.timeline__filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.timeline__loading {
  display: flex;
  justify-content: center;
  padding: var(--space-3xl) 0;
}

.timeline__empty {
  display: flex;
  justify-content: center;
  padding: var(--space-3xl) 0;
}

.timeline__content {
  position: relative;
}
</style>
