/**
 * StatsPanel — 首页统计侧栏
 *
 * 垂直排列，使用设计系统配色，位于 Hero 左侧。
 * 每个 stat 行独立 hover 动画 + 数字 count up。
 */
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useOdometer } from '@/composables/useOdometer'
import { useI18n } from '@/composables/useI18n'
import AppIcon from '@/components/base/AppIcon.vue'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    countryCount: number
    cityCount: number
    tripCount: number
    flightCount?: number
    wishlistCount?: number
    regionsCount?: number
    loading?: boolean
    highlightVisited?: boolean
    highlightWishlist?: boolean
    hideCountries?: boolean
  }>(),
  { highlightVisited: false, highlightWishlist: false, hideCountries: false },
)

const ITEM_META: Record<string, { icon: string; accent: string }> = {
  countries:  { icon: 'Globe',   accent: 'text-sunset' },
  regions:    { icon: 'Map',     accent: 'text-sunset' },
  cities:     { icon: 'MapPin',  accent: 'text-ocean' },
  trips:      { icon: 'Calendar',accent: 'text-forest' },
  flights:    { icon: 'Plane',   accent: 'text-ocean' },
  wishlist:   { icon: 'Heart',   accent: 'text-forest' },
}

const items = computed(() => {
  if (props.hideCountries) {
    return [
      { key: 'cities',   value: props.cityCount, label: t('home.stats.cities') },
      { key: 'trips',    value: props.tripCount, label: t('home.stats.trips') },
      { key: 'flights',  value: props.flightCount ?? 0, label: t('home.stats.flights') },
    ]
  }
  return [
    { key: 'countries', value: props.countryCount, label: t('home.stats.countries') },
    { key: 'cities',   value: props.cityCount, label: t('home.stats.cities') },
    { key: 'trips',    value: props.tripCount, label: t('home.stats.trips') },
    { key: 'flights',  value: props.flightCount ?? 0, label: t('home.stats.flights') },
    { key: 'wishlist', value: props.wishlistCount ?? 0, label: t('home.stats.wishlist') },
  ]
})

const odometers = [useOdometer(700), useOdometer(700), useOdometer(700), useOdometer(700), useOdometer(700)]
const odometerValues = ref<Record<string, number>>({
  countries: 0, cities: 0, trips: 0, flights: 0, wishlist: 0,
})

watch(() => [props.countryCount, props.cityCount, props.tripCount, props.flightCount, props.wishlistCount], (vals) => {
  const keys = ['countries', 'cities', 'trips', 'flights', 'wishlist']
  odometers.forEach((o, i) => {
    if (vals[i] !== undefined) {
      o.rollTo(vals[i] as number)
      odometerValues.value[keys[i]] = vals[i] as number
    }
  })
}, { immediate: true })

// stagger delays — 动态跟随 item 数量
const staggerDelays = computed(() => {
  const base = 100, step = 80
  return items.value.map((_, i) => base + i * step)
})

// icon bounce triggers
const iconBounce = ref(false)
onMounted(() => {
  setTimeout(() => { iconBounce.value = true }, 600)
})


const emit = defineEmits<{
  'stats-click': [key: string]
}>()
</script>

<template>
  <div class="stats-panel">
    <div
      v-for="(item, i) in items"
      :key="item.key"
      class="stats-row"
      :style="{ animationDelay: `${staggerDelays[i]}ms` }"
      :class="{
        'stats-row--visited-highlight': highlightVisited && item.key === 'countries',
        'stats-row--wishlist-highlight': highlightWishlist && item.key === 'wishlist',
        'stats-row--clickable': item.key === 'flights' || (!props.hideCountries && (item.key === 'countries' || item.key === 'wishlist')),
      }"
      @click="emit('stats-click', item.key)"
    >
      <div
        class="stats-row__icon"
        :class="[
          ITEM_META[item.key]?.accent || 'text-tertiary',
          { 'stats-row__icon--bounce': iconBounce },
          { 'stats-row__icon--glow': highlightVisited && item.key === 'countries' },
          { 'stats-row__icon--glow-forest': highlightWishlist && item.key === 'wishlist' },
        ]"
      >
        <AppIcon :name="ITEM_META[item.key]?.icon || 'Circle'" :size="15" />
      </div>
      <div class="stats-row__content">
        <span class="stats-row__value">
          <template v-if="loading">
            <span class="stats-row__skeleton" />
          </template>
          <template v-else>{{ odometerValues[item.key] }}</template>
        </span>
        <span class="stats-row__label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes stats-row-in {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes icon-bounce {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.3); }
  60%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes icon-glow-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232, 113, 74, 0.3); }
  50%      { box-shadow: 0 0 0 8px rgba(232, 113, 74, 0); }
}

@keyframes glow-forest-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 156, 124, 0.3); }
  50%      { box-shadow: 0 0 0 8px rgba(74, 156, 124, 0); }
}

.stats-panel {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 12px 14px;
  min-width: 148px;
  background: var(--color-card);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: var(--radius-sm);
  transition: background 200ms var(--ease-default),
              transform 200ms var(--ease-default);
  animation: stats-row-in 0.4s var(--ease-out) both;
}

.stats-row--clickable {
  cursor: pointer;
}

.stats-row:hover {
  background: var(--color-card-hover);
  transform: translateX(3px);
}

.stats-row--visited-highlight {
  background: rgba(232, 113, 74, 0.08);
  border: 0.5px solid rgba(232, 113, 74, 0.2);
  animation: stats-row-in 0.4s var(--ease-out) both,
             icon-glow-pulse 1.5s ease-in-out 0.3s 3;
}

.stats-row--wishlist-highlight {
  background: rgba(74, 156, 124, 0.08);
  border: 0.5px solid rgba(74, 156, 124, 0.2);
  animation: stats-row-in 0.4s var(--ease-out) both,
             glow-forest-pulse 1.5s ease-in-out 0.3s 3;
}

.stats-row__icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--color-card-hover);
  flex-shrink: 0;
}

.stats-row__icon--bounce {
  animation: icon-bounce 0.5s var(--ease-spring);
}

.stats-row__icon--glow {
  animation: icon-glow-pulse 1.5s ease-in-out infinite;
}

.stats-row__icon--glow-forest {
  animation: glow-forest-pulse 1.5s ease-in-out infinite;
}

.stats-row__content {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.stats-row__value {
  font-family: var(--font-mono);
  font-size: var(--text-mono-md);
  font-weight: 500;
  color: var(--text-primary);
}

.stats-row__label {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-secondary);
  white-space: nowrap;
}

.stats-row__skeleton {
  display: inline-block;
  width: 32px;
  height: 1em;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  animation: shimmer-stats 1.5s infinite;
}

@keyframes shimmer-stats {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.8; }
}
</style>
