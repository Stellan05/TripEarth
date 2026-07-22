<script setup lang="ts">
/**
 * TimelineTrack — 时间轴组件
 *
 * Props:
 *   year: 年份
 *   trips: 该年份内的旅行列表
 * Events:
 *   @trip-click(tripId)
 *
 * 左侧显示年份大标题 (Newsreader 48px, text-tertiary 0.12 opacity)
 * 左侧竖线 2px var(--text-tertiary) 30% opacity
 * 每个旅行: 月份标签 + 圆点 (Sunset Orange 12px) + TripCard
 * 使用 TripCard from '@/components/features/trip/TripCard.vue'
 */
import { computed } from 'vue'
import TripCard from '@/components/features/trip/TripCard.vue'
import type { Trip } from '@/types/trip'

const props = withDefaults(
  defineProps<{
    year: number
    trips: Trip[]
  }>(),
  {},
)

const emit = defineEmits<{
  'trip-click': [tripId: number]
}>()

interface MonthGroup {
  month: number
  label: string
  trips: Trip[]
}

const monthGroups = computed<MonthGroup[]>(() => {
  const monthMap = new Map<number, Trip[]>()
  for (const trip of props.trips) {
    const d = new Date(trip.startDate)
    const m = d.getMonth()
    if (!monthMap.has(m)) monthMap.set(m, [])
    monthMap.get(m)!.push(trip)
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([month, trips]) => ({
      month,
      label: new Date(props.year, month).toLocaleDateString('en-US', { month: 'long' }),
      trips,
    }))
})

function onTripClick(trip: Trip) {
  emit('trip-click', trip.id)
}
</script>

<template>
  <div class="timeline-track">
    <!-- Year header -->
    <div class="timeline-track__year-col">
      <h2 class="timeline-track__year-text">{{ year }}</h2>
    </div>

    <!-- Timeline content -->
    <div class="timeline-track__content">
      <!-- Vertical line -->
      <div class="timeline-track__line" />

      <!-- Month groups -->
      <div v-for="mg in monthGroups" :key="mg.month" class="timeline-track__month-group">
        <!-- Month marker -->
        <div class="timeline-track__month-marker">
          <div class="timeline-track__dot" />
          <span class="timeline-track__month-label">{{ mg.label }}</span>
        </div>

        <!-- Trip cards -->
        <div class="timeline-track__trips">
          <TripCard
            v-for="trip in mg.trips"
            :key="trip.id"
            :trip="trip"
            size="compact"
            @click="onTripClick(trip)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-track {
  display: flex;
  gap: var(--space-2xl);
  margin-bottom: var(--space-2xl);
  position: relative;
}

/* ── Year column ── */
.timeline-track__year-col {
  min-width: 80px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-start;
  padding-top: 4px;
}

.timeline-track__year-text {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: var(--font-weight-medium);
  color: var(--text-tertiary);
  opacity: 0.12;
  margin: 0;
  line-height: 1;
  user-select: none;
}

/* ── Content area ── */
.timeline-track__content {
  flex: 1;
  position: relative;
  padding-left: var(--space-xl);
}

/* ── Vertical line ── */
.timeline-track__line {
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 0;
  width: 2px;
  background: var(--text-tertiary);
  opacity: 0.3;
}

/* ── Month group ── */
.timeline-track__month-group {
  position: relative;
  margin-bottom: var(--space-lg);
}

.timeline-track__month-marker {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  position: relative;
}

.timeline-track__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-sunset);
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(232, 113, 74, 0.15);
  position: relative;
  z-index: 1;
  margin-left: calc(-1 * (var(--space-xl) + 5px));
}

.timeline-track__month-label {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  white-space: nowrap;
}

/* ── Trips ── */
.timeline-track__trips {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding-left: calc(var(--space-xl) - 5px);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .timeline-track {
    gap: var(--space-md);
  }

  .timeline-track__year-col {
    min-width: 50px;
  }

  .timeline-track__year-text {
    font-size: 32px;
  }

  .timeline-track__content {
    padding-left: var(--space-md);
  }

  .timeline-track__dot {
    margin-left: calc(-1 * (var(--space-md) + 5px));
    width: 10px;
    height: 10px;
  }

  .timeline-track__trips {
    padding-left: calc(var(--space-md) - 3px);
  }
}
</style>
