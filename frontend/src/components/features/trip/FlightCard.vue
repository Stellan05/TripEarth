<script setup lang="ts">
/**
 * FlightCard — 登机牌风格航班卡片
 * 顶部 4px var(--flight-accent) border + 航司/航班号 + RouteVisual + 时间线 + 时长 + 经停
 */
import { computed } from 'vue'
import AppCard from '@/components/base/AppCard.vue'
import RouteVisual from '@/components/shared/RouteVisual.vue'
import TimeDisplay from '@/components/shared/TimeDisplay.vue'
import type { Flight } from '@/types/trip'

const props = withDefaults(
  defineProps<{
    flight: Flight
    stackIndex?: number
    stacked?: boolean
  }>(),
  { stackIndex: 0, stacked: false },
)

const emit = defineEmits<{
  click: []
}>()

const rotateStyle = computed(() => {
  if (!props.stacked) return {}
  const deg = props.stackIndex % 2 === 0 ? 0.5 : -0.5
  return {
    transform: `rotate(${deg}deg)`,
  }
})

const depTime = computed(() => props.flight.departureTime?.slice(0, 5) || '')
const arrTime = computed(() => props.flight.arrivalTime?.slice(0, 5) || '')

const depAirport = computed(() => props.flight.departureAirport || '')
const arrAirport = computed(() => props.flight.arrivalAirport || '')
</script>

<template>
  <AppCard
    variant="flight"
    :hoverable="true"
    tag="button"
    class="flight-card"
    :style="rotateStyle"
    @click="emit('click')"
  >
    <div class="flight-card__header">
      <div class="flight-card__airline">
        <span class="flight-card__airline-name">{{ flight.airline }}</span>
        <span class="flight-card__flight-no">{{ flight.flightNo }}</span>
      </div>
      <span v-if="flight.aircraft" class="flight-card__aircraft text-tertiary">{{ flight.aircraft }}</span>
    </div>

    <div class="flight-card__route">
      <RouteVisual
        :dep-code="depAirport"
        :arr-code="arrAirport"
        type="FLIGHT"
      />
    </div>

    <!-- Timeline -->
    <div class="flight-card__timeline">
      <div class="flight-card__timeline-col">
        <TimeDisplay :time="depTime" :mono="true" />
        <span class="flight-card__airport-code">{{ depAirport }}</span>
      </div>

      <div class="flight-card__timeline-line">
        <div class="flight-card__dot flight-card__dot--start" />
        <div class="flight-card__line" />
        <div class="flight-card__dot flight-card__dot--end" />
      </div>

      <div class="flight-card__timeline-col flight-card__timeline-col--right">
        <TimeDisplay :time="arrTime" :mono="true" />
        <span class="flight-card__airport-code">{{ arrAirport }}</span>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.flight-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  cursor: pointer;
  text-align: left;
  border: none;
  width: 100%;
  transition: transform var(--duration-fast) var(--ease-spring);
}

.flight-card:hover {
  transform: rotate(0deg) !important;
}

.flight-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flight-card__airline {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.flight-card__airline-name {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.flight-card__flight-no {
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-wide);
}

.flight-card__aircraft {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
}

.flight-card__route {
  display: flex;
  align-items: center;
}

.flight-card__timeline {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.flight-card__timeline-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 60px;
}

.flight-card__timeline-col--right {
  align-items: flex-end;
  text-align: right;
}

.flight-card__airport-code {
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--text-tertiary);
  letter-spacing: var(--tracking-wide);
}

.flight-card__timeline-line {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  height: 24px;
}

.flight-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--flight-accent);
  z-index: 1;
  flex-shrink: 0;
}

.flight-card__dot--start {
  background: var(--flight-accent);
}

.flight-card__dot--end {
  background: var(--flight-accent);
}

.flight-card__line {
  flex: 1;
  height: 2px;
  background: var(--flight-divider);
  position: relative;
}

.flight-card__line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--flight-accent) 0%,
    var(--flight-accent) 30%,
    transparent 30%
  );
  background-size: 12px 100%;
}
</style>
