<script setup lang="ts">
/**
 * DayTimelineStrip — 水平滚动天时间线
 * 实心圆（有照片）或空心圆（无照片），连接线 2px
 */
import { computed } from 'vue'
import type { DayInfo } from '@/types/trip'

const props = withDefaults(
  defineProps<{
    days: DayInfo[]
    activeDay?: number
  }>(),
  { activeDay: 0 },
)

const emit = defineEmits<{
  'day-click': [dayIndex: number]
}>()
</script>

<template>
  <div class="day-timeline-strip">
    <div class="day-timeline-strip__track">
      <template v-for="(day, i) in days" :key="day.dayIndex">
        <!-- Day dot -->
        <div
          class="day-timeline-strip__day"
          :class="{
            'day-timeline-strip__day--active': day.dayIndex === activeDay,
            'day-timeline-strip__day--has-photos': day.hasPhotos,
            'day-timeline-strip__day--no-photos': !day.hasPhotos,
          }"
          @click="emit('day-click', day.dayIndex)"
        >
          <!-- Dot -->
          <div class="day-timeline-strip__dot" />

          <!-- Day number -->
          <span class="day-timeline-strip__label">{{ day.dayIndex + 1 }}</span>
        </div>

        <!-- Connector line (not after last) -->
        <div
          v-if="i < days.length - 1"
          class="day-timeline-strip__connector"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.day-timeline-strip {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: var(--space-md) 0;
}

.day-timeline-strip::-webkit-scrollbar {
  display: none;
}

.day-timeline-strip__track {
  display: flex;
  align-items: center;
  width: fit-content;
  min-width: 100%;
  padding: 0 var(--space-md);
  box-sizing: border-box;
}

.day-timeline-strip__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  transition: transform var(--duration-fast) var(--ease-default);
  flex-shrink: 0;
}

.day-timeline-strip__day:hover {
  transform: scale(1.1);
}

.day-timeline-strip__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2.5px solid var(--color-sunset);
  background: transparent;
  transition: all var(--duration-fast) var(--ease-default);
  box-sizing: border-box;
}

.day-timeline-strip__day--has-photos .day-timeline-strip__dot {
  background: var(--color-sunset);
}

.day-timeline-strip__day--active .day-timeline-strip__dot {
  width: 18px;
  height: 18px;
  border-width: 3px;
  box-shadow: 0 0 0 4px rgba(232, 113, 74, 0.15);
}

.day-timeline-strip__label {
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--text-tertiary);
  font-weight: var(--font-weight-medium);
}

.day-timeline-strip__day--active .day-timeline-strip__label {
  color: var(--color-sunset);
}

.day-timeline-strip__connector {
  width: 32px;
  height: 2px;
  background: rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  margin: 0 4px;
  margin-bottom: 20px;
}
</style>
