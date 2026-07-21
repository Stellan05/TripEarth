/**
 * StatsPanel — 首页统计侧栏
 *
 * 垂直排列，使用设计系统配色，位于 Hero 左侧。
 * 每个 stat 行独立 hover 动画 + 数字 count up。
 */
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useOdometer } from '@/composables/useOdometer'
import { useI18n } from '@/composables/useI18n'
import AppIcon from '@/components/base/AppIcon.vue'

const { t } = useI18n()

const props = defineProps<{
  countryCount: number
  cityCount: number
  tripCount: number
  flightCount?: number
  wishlistCount?: number
  loading?: boolean
}>()

const ITEM_META: Record<string, { icon: string; accent: string }> = {
  countries:  { icon: 'Globe',   accent: 'text-sunset' },
  cities:     { icon: 'MapPin',  accent: 'text-ocean' },
  trips:      { icon: 'Calendar',accent: 'text-forest' },
  flights:    { icon: 'Plane',   accent: 'text-ocean' },
  wishlist:   { icon: 'Heart',   accent: 'text-forest' },
}

const items = computed(() => [
  { key: 'countries', value: props.countryCount, label: t('home.stats.countries') },
  { key: 'cities',   value: props.cityCount, label: t('home.stats.cities') },
  { key: 'trips',    value: props.tripCount, label: t('home.stats.trips') },
  { key: 'flights',  value: props.flightCount ?? 0, label: t('home.stats.flights') },
  { key: 'wishlist', value: props.wishlistCount ?? 0, label: t('home.stats.wishlist') },
])

const odometers = [useOdometer(700), useOdometer(700), useOdometer(700), useOdometer(700), useOdometer(700)]
watch(() => [props.countryCount, props.cityCount, props.tripCount, props.flightCount, props.wishlistCount], (vals) => {
  odometers.forEach((o, i) => { if (vals[i] !== undefined) o.rollTo(vals[i] as number) })
}, { immediate: true })
</script>

<template>
  <div class="stats-panel">
    <div
      v-for="(item, i) in items"
      :key="item.key"
      class="stats-row"
    >
      <div class="stats-row__icon" :class="ITEM_META[item.key]?.accent || 'text-tertiary'">
        <AppIcon :name="ITEM_META[item.key]?.icon || 'Circle'" :size="15" />
      </div>
      <div class="stats-row__content">
        <span class="stats-row__value">
          <template v-if="loading">
            <span class="stats-row__skeleton" />
          </template>
          <template v-else>{{ odometers[i].displayValue }}</template>
        </span>
        <span class="stats-row__label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  cursor: default;
}

.stats-row:hover {
  background: var(--color-card-hover);
  transform: translateX(3px);
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
