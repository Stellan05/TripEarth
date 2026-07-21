<script setup lang="ts">
/**
 * TripMiniCard — 首页紧凑旅行卡片
 */
import { computed } from 'vue'
import AppCard from '@/components/base/AppCard.vue'
import { formatDateRange } from '@/utils/date'
import type { Trip } from '@/types/trip'

const props = defineProps<{ trip: Trip }>()
const emit = defineEmits<{ click: [trip: Trip] }>()

const dateRange = computed(() => formatDateRange(props.trip.startDate, props.trip.endDate))
const coverStyle = computed(() => {
  if (props.trip.thumbnailUrl) return { backgroundImage: `url(${props.trip.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  const hue = (props.trip.countryName?.charCodeAt(0) || 0) * 137.5 % 360
  return { background: `linear-gradient(135deg, hsl(${hue},30%,75%), hsl(${hue+30},25%,60%))` }
})
</script>

<template>
  <AppCard variant="default" :hoverable="true" :padding="false" tag="button" style="cursor:pointer;text-align:left;border:none;width:220px;flex-shrink:0" @click="emit('click', trip)">
    <div class="trip-mini__cover" :style="coverStyle"><span class="trip-mini__flag">{{ trip.flagEmoji }}</span></div>
    <div class="trip-mini__info">
      <p class="trip-mini__city display-sm">{{ trip.cityName }}</p>
      <p class="body-sm text-secondary" style="margin-top:2px">{{ trip.countryName }}</p>
      <div class="trip-mini__meta">
        <span class="body-xs text-tertiary">{{ dateRange }}</span>
        <span class="body-xs" style="color:var(--color-sunset);font-weight:var(--font-weight-medium)">{{ trip.dayCount }} 天</span>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.trip-mini { width: 220px; flex-shrink: 0; overflow: hidden; border-radius: var(--radius-md); }
.trip-mini__cover { width: 100%; height: 120px; position: relative; display: flex; align-items: flex-start; justify-content: flex-end; padding: var(--space-sm); }
.trip-mini__flag { font-size: 28px; }
.trip-mini__info { padding: 14px 16px; }
.trip-mini__city { margin: 0; }
.trip-mini__meta { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
</style>
