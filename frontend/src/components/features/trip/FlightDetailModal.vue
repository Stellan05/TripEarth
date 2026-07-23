/**
 * FlightDetailModal — 航班详情弹窗
 *
 * Flighty 风格设计：
 * - 预计/实际起降时间并排对比
 * - 彩色状态标签 + 动效
 * - 机型/航司/机场完整信息
 * - 进场动画
 */
<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { Flight } from '@/types/trip'

const props = withDefaults(
  defineProps<{
    flight: Flight | null
    visible: boolean
  }>(),
  {},
)

const emit = defineEmits<{
  close: []
}>()

/* ── 时间格式化 ── */
function fmtTime(iso: string): string {
  if (!iso) return '--:--'
  return iso.slice(11, 16)
}

function fmtDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function calcDuration(minutes?: number, dep?: string, arr?: string): string {
  if (minutes) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }
  if (dep && arr) {
    const diff = new Date(arr).getTime() - new Date(dep).getTime()
    const mins = Math.round(diff / 60000)
    return calcDuration(mins)
  }
  return '--'
}

/* ── 状态颜色与文案 ── */
const statusInfo = computed(() => {
  const status = props.flight?.status || 'scheduled'
  const map: Record<string, { label: string; color: string }> = {
    scheduled: { label: 'Scheduled', color: '#3B7EC7' },
    boarding: { label: 'Boarding', color: '#E8A84A' },
    departed: { label: 'Departed', color: '#E8714A' },
    'in-air': { label: 'In Air', color: '#4A9C7C' },
    landed: { label: 'Landed', color: '#4A9C7C' },
    delayed: { label: 'Delayed', color: '#E84A4A' },
    cancelled: { label: 'Cancelled', color: '#999CA6' },
  }
  return map[status] || map.scheduled
})

/* ── 预计 vs 实际 ── */
const schDep = computed(() => fmtTime(props.flight?.departureTime || ''))
const schArr = computed(() => fmtTime(props.flight?.arrivalTime || ''))
const actDep = computed(() => props.flight?.actualDeparture ? fmtTime(props.flight.actualDeparture) : null)
const actArr = computed(() => props.flight?.actualArrival ? fmtTime(props.flight.actualArrival) : null)

const durationLabel = computed(() => {
  const f = props.flight
  return calcDuration(f?.duration, f?.departureTime, f?.arrivalTime)
})

/* ── 进场 stagger ── */
const showContent = computed(() => props.visible && !!props.flight)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="flight-modal">
      <div v-if="visible && flight" class="flight-modal" @click.self="emit('close')">
        <div class="flight-modal__card">
          <!-- ═══ Header: airline + flight no ═══ -->
          <div class="flight-modal__header">
            <div class="flight-modal__airline-row">
              <div class="flight-modal__airline-info">
                <span class="flight-modal__airline-name">{{ flight.airline }}</span>
                <span class="flight-modal__flight-no">{{ flight.flightNo }}</span>
              </div>
              <span class="flight-modal__status" :style="{ color: statusInfo.color }">
                <span class="flight-modal__status-dot" :style="{ background: statusInfo.color }" />
                {{ statusInfo.label }}
              </span>
            </div>
            <div class="flight-modal__date">{{ fmtDate(flight.departureTime) }}</div>
          </div>

          <!-- ═══ Route: big codes ═══ -->
          <div class="flight-modal__route">
            <div class="flight-modal__airport-group">
              <span class="flight-modal__airport-code-big">{{ flight.departureAirport }}</span>
              <span class="flight-modal__city-name">{{ flight.departureCity || flight.departureAirport }}</span>
            </div>

            <div class="flight-modal__route-line-wrap">
              <div class="flight-modal__route-line">
                <div class="flight-modal__route-dot flight-modal__route-dot--start" />
                <div class="flight-modal__route-bar" />
                <div class="flight-modal__route-dot flight-modal__route-dot--end" />
              </div>
              <div class="flight-modal__duration-label">{{ durationLabel }}</div>
            </div>

            <div class="flight-modal__airport-group flight-modal__airport-group--right">
              <span class="flight-modal__airport-code-big">{{ flight.arrivalAirport }}</span>
              <span class="flight-modal__city-name">{{ flight.arrivalCity || flight.arrivalAirport }}</span>
            </div>
          </div>

          <!-- ═══ Timeline: scheduled vs actual ═══ -->
          <div class="flight-modal__timeline">
            <div class="flight-modal__timeline-header">
              <span class="flight-modal__tl-label">Scheduled</span>
              <span v-if="actDep || actArr" class="flight-modal__tl-label flight-modal__tl-label--actual">Actual</span>
            </div>

            <!-- Departure -->
            <div class="flight-modal__tl-row">
              <div class="flight-modal__tl-label-col">
                <span class="flight-modal__tl-type">Departure</span>
              </div>
              <div class="flight-modal__tl-time-col">
                <div class="flight-modal__tl-time-block">
                  <span class="flight-modal__tl-time">{{ schDep }}</span>
                  <span class="flight-modal__tl-airport">{{ flight.departureAirport }}</span>
                </div>
                <div v-if="actDep" class="flight-modal__tl-time-block flight-modal__tl-time-block--actual">
                  <span class="flight-modal__tl-time--actual">{{ actDep }}</span>
                  <span v-if="actDep !== schDep" class="flight-modal__tl-delta">
                    {{ actDep > schDep ? '+' : '' }}{{ Math.round((new Date('2000-01-01T' + actDep).getTime() - new Date('2000-01-01T' + schDep).getTime()) / 60000) }}m
                  </span>
                </div>
              </div>
            </div>

            <!-- Arrival -->
            <div class="flight-modal__tl-row">
              <div class="flight-modal__tl-label-col">
                <span class="flight-modal__tl-type">Arrival</span>
              </div>
              <div class="flight-modal__tl-time-col">
                <div class="flight-modal__tl-time-block">
                  <span class="flight-modal__tl-time">{{ schArr }}</span>
                  <span class="flight-modal__tl-airport">{{ flight.arrivalAirport }}</span>
                </div>
                <div v-if="actArr" class="flight-modal__tl-time-block flight-modal__tl-time-block--actual">
                  <span class="flight-modal__tl-time--actual">{{ actArr }}</span>
                  <span v-if="actArr !== schArr" class="flight-modal__tl-delta">
                    {{ actArr > schArr ? '+' : '' }}{{ Math.round((new Date('2000-01-01T' + actArr).getTime() - new Date('2000-01-01T' + schArr).getTime()) / 60000) }}m
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ═══ Details grid ═══ -->
          <div class="flight-modal__details">
            <div class="flight-modal__detail-item">
              <span class="flight-modal__detail-label">Aircraft</span>
              <span class="flight-modal__detail-value">{{ flight.aircraft || '—' }}</span>
            </div>
            <div v-if="flight.terminal" class="flight-modal__detail-item">
              <span class="flight-modal__detail-label">Terminal</span>
              <span class="flight-modal__detail-value">{{ flight.terminal }}</span>
            </div>
            <div v-if="flight.gate" class="flight-modal__detail-item">
              <span class="flight-modal__detail-label">Gate</span>
              <span class="flight-modal__detail-value flight-modal__gate">{{ flight.gate }}</span>
            </div>
            <div class="flight-modal__detail-item">
              <span class="flight-modal__detail-label">Duration</span>
              <span class="flight-modal__detail-value">{{ durationLabel }}</span>
            </div>
          </div>

          <!-- ═══ Close button ═══ -->
          <button class="flight-modal__close" @click="emit('close')">
            Close
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.flight-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal, 500);
  padding: var(--space-lg);
  backdrop-filter: blur(4px);
}

.flight-modal__card {
  width: 100%;
  max-width: 440px;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  overflow: hidden;
  animation: flight-card-in 400ms var(--ease-spring) both;
}

@keyframes flight-card-in {
  from { opacity: 0; transform: translateY(24px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── Header ── */
.flight-modal__header {
  padding: var(--space-lg) var(--space-lg) var(--space-md);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.flight-modal__airline-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xs);
}

.flight-modal__airline-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.flight-modal__airline-name {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.flight-modal__flight-no {
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  color: var(--text-secondary);
  letter-spacing: 0.06em;
}

.flight-modal__status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  font-weight: var(--font-weight-medium);
}

.flight-modal__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(1.3); }
}

.flight-modal__date {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
}

/* ── Route ── */
.flight-modal__route {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-page);
  position: relative;
  overflow: hidden;
}

.flight-modal__route::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(to right, var(--color-sunset), transparent 60%);
  opacity: 0.15;
}

.flight-modal__airport-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.flight-modal__airport-group--right {
  align-items: flex-end;
  text-align: right;
}

.flight-modal__airport-code-big {
  font-family: var(--font-mono);
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.08em;
  line-height: 1.1;
}

.flight-modal__city-name {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flight-modal__route-line-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  min-width: 60px;
}

.flight-modal__route-line {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  position: relative;
}

.flight-modal__route-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  z-index: 1;
}

.flight-modal__route-dot--start {
  background: var(--color-sunset);
  box-shadow: 0 0 0 3px rgba(232, 113, 74, 0.2);
}

.flight-modal__route-dot--end {
  background: var(--color-forest);
  box-shadow: 0 0 0 3px rgba(74, 156, 124, 0.2);
}

.flight-modal__route-bar {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, var(--color-sunset), var(--color-forest));
  position: relative;
}

.flight-modal__route-bar::after {
  content: '✈';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  font-size: 10px;
  color: var(--text-tertiary);
  opacity: 0.4;
}

.flight-modal__duration-label {
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--text-tertiary);
  letter-spacing: 0.02em;
}

/* ── Timeline ── */
.flight-modal__timeline {
  padding: var(--space-md) var(--space-lg);
}

.flight-modal__timeline-header {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.flight-modal__tl-label {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex: 1;
}

.flight-modal__tl-label--actual {
  text-align: right;
  color: var(--color-forest);
}

.flight-modal__tl-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
}

.flight-modal__tl-label-col {
  min-width: 72px;
}

.flight-modal__tl-type {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
}

.flight-modal__tl-time-col {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
}

.flight-modal__tl-time-block {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.flight-modal__tl-time-block--actual {
  justify-content: flex-end;
}

.flight-modal__tl-time {
  font-family: var(--font-mono);
  font-size: var(--text-mono-md);
  font-weight: 500;
  color: var(--text-primary);
}

.flight-modal__tl-time--actual {
  font-family: var(--font-mono);
  font-size: var(--text-mono-md);
  font-weight: 500;
  color: var(--color-forest);
}

.flight-modal__tl-airport {
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--text-tertiary);
}

.flight-modal__tl-delta {
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--color-sunset);
  font-weight: 500;
}

/* ── Details grid ── */
.flight-modal__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: var(--color-page);
}

.flight-modal__detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-sm) 0;
}

.flight-modal__detail-label {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.flight-modal__detail-value {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.flight-modal__gate {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--color-ocean);
}

/* ── Close ── */
.flight-modal__close {
  display: block;
  width: 100%;
  padding: var(--space-md);
  border: none;
  background: var(--color-card);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 150ms, color 150ms;
}

.flight-modal__close:hover {
  background: var(--color-card-hover);
  color: var(--text-primary);
}

/* ── Transition ── */
.flight-modal-enter-active,
.flight-modal-leave-active {
  transition: opacity 250ms var(--ease-out);
}

.flight-modal-enter-from,
.flight-modal-leave-to {
  opacity: 0;
}
</style>
