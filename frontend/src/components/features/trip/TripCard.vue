<script setup lang="ts">
/**
 * TripCard — 旅行列表卡片
 * 使用 AppCard variant='default', hoverable
 * 封面缩略图（渐变色 fallback）+ flagEmoji + 城市/国家/日期信息
 */
import { computed } from 'vue'
import AppCard from '@/components/base/AppCard.vue'
import CityLabel from '@/components/shared/CityLabel.vue'
import CountryLabel from '@/components/shared/CountryLabel.vue'
import MetaBadge from '@/components/shared/MetaBadge.vue'
import DurationBadge from '@/components/shared/DurationBadge.vue'
import { formatDateRange } from '@/utils/date'
import type { Trip } from '@/types/trip'

const props = withDefaults(
  defineProps<{
    trip: Trip
    size?: 'default' | 'compact'
  }>(),
  { size: 'default' },
)

const emit = defineEmits<{
  click: [trip: Trip]
}>()

const dateRange = computed(() => formatDateRange(props.trip.startDate, props.trip.endDate))

const coverStyle = computed(() => {
  if (props.trip.thumbnailUrl) {
    return {
      backgroundImage: `url(${props.trip.thumbnailUrl})`,
      backgroundSize: 'cover' as const,
      backgroundPosition: 'center' as const,
    }
  }
  const hue = (props.trip.countryName?.charCodeAt(0) || 0) * 137.5 % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 30%, 75%), hsl(${hue + 30}, 25%, 60%))`,
  }
})
</script>

<template>
  <AppCard
    variant="default"
    :hoverable="true"
    tag="button"
    class="trip-card"
    :class="`trip-card--${size}`"
    @click="emit('click', trip)"
  >
    <div class="trip-card__cover" :style="coverStyle">
      <span class="trip-card__flag">{{ trip.flagEmoji }}</span>
    </div>
    <div class="trip-card__body">
      <div class="trip-card__header">
        <CityLabel :name="trip.cityName" size="md" />
        <CountryLabel :flag-emoji="trip.flagEmoji" :name="trip.countryName" size="sm" />
      </div>
      <div class="trip-card__meta">
        <span class="trip-card__dates body-sm text-tertiary">{{ dateRange }}</span>
        <div class="trip-card__badges">
          <DurationBadge :value="trip.dayCount" unit="days" />
          <MetaBadge :value="trip.cityCount" label="cities" />
        </div>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.trip-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  border: none;
  width: 100%;
}

.trip-card__cover {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: var(--space-sm);
  box-sizing: border-box;
}

.trip-card--compact .trip-card__cover {
  height: 120px;
}

.trip-card__flag {
  font-size: 32px;
  line-height: 1;
}

.trip-card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.trip-card__header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.trip-card__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.trip-card__dates {
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
}

.trip-card__badges {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}
</style>
