/**
 * DayTimelineStrip — 水平滚动天时间线
 *
 * - 第一个「全部」圆点，蓝色，查看所有
 * - 实心圆 = 有照片或手记，空心 = 无内容
 * - 点击动画：选中态缩放 + 高亮
 */
<script setup lang="ts">
import type { DayInfo } from '@/types/trip'

const props = withDefaults(
  defineProps<{
    days: DayInfo[]
    activeDay?: number
  }>(),
  { activeDay: -1 },
)

const emit = defineEmits<{
  'day-click': [dayIndex: number]
}>()
</script>

<template>
  <div class="day-timeline-strip">
    <div class="day-timeline-strip__track">
      <!-- "All" dot -->
      <div
        class="day-timeline-strip__day day-timeline-strip__day--all"
        :class="{ 'day-timeline-strip__day--active': activeDay === -1 }"
        @click="emit('day-click', -1)"
      >
        <div class="day-timeline-strip__dot day-timeline-strip__dot--all">
          <span class="day-timeline-strip__all-icon">*</span>
        </div>
        <span class="day-timeline-strip__label">All</span>
      </div>

      <!-- Connector before days -->
      <div class="day-timeline-strip__connector" />

      <template v-for="(day, i) in days" :key="day.dayIndex">
        <!-- Day dot -->
        <div
          class="day-timeline-strip__day"
          :class="{
            'day-timeline-strip__day--active': day.dayIndex === activeDay,
            'day-timeline-strip__day--has-content': day.hasPhotos || day.hasNotes,
            'day-timeline-strip__day--empty': !day.hasPhotos && !day.hasNotes,
          }"
          @click="emit('day-click', day.dayIndex)"
        >
          <div class="day-timeline-strip__dot" />

          <span class="day-timeline-strip__label">{{ day.dayIndex + 1 }}</span>
        </div>

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

.day-timeline-strip::-webkit-scrollbar { display: none; }

.day-timeline-strip__track {
  display: flex;
  align-items: center;
  width: fit-content;
  min-width: 100%;
  padding: 0 var(--space-md);
  box-sizing: border-box;
}

/* ── Day ── */
.day-timeline-strip__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  transition: transform 250ms var(--ease-spring);
}

.day-timeline-strip__day:hover {
  transform: scale(1.12);
}

.day-timeline-strip__day--active {
  transform: scale(1.15);
}

/* ── Dot ── */
.day-timeline-strip__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2.5px solid var(--text-tertiary);
  background: transparent;
  transition: all 350ms var(--ease-spring);
  box-sizing: border-box;
  position: relative;
}

/* Filled dot (has photos or notes) */
.day-timeline-strip__day--has-content .day-timeline-strip__dot {
  background: var(--color-sunset);
  border-color: var(--color-sunset);
}

/* Empty dot */
.day-timeline-strip__day--empty .day-timeline-strip__dot {
  background: transparent;
  border-color: var(--text-tertiary);
  opacity: 0.45;
}

/* Active dot (pulsing glow + larger) */
.day-timeline-strip__day--active .day-timeline-strip__dot {
  width: 18px;
  height: 18px;
  border-width: 3px;
  box-shadow: 0 0 0 4px rgba(232, 113, 74, 0.15),
              0 0 12px rgba(232, 113, 74, 0.08);
  animation: dot-pop 400ms var(--ease-spring) both;
}

@keyframes dot-pop {
  0%   { transform: scale(0.6); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* Active + empty: different glow */
.day-timeline-strip__day--active.day-timeline-strip__day--empty .day-timeline-strip__dot {
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.06);
}

/* ── All dot (ocean blue) ── */
.day-timeline-strip__dot--all {
  border-color: var(--color-ocean);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-timeline-strip__day--all:hover .day-timeline-strip__dot--all {
  background: var(--color-ocean);
}

.day-timeline-strip__day--all.day-timeline-strip__day--active .day-timeline-strip__dot--all {
  background: var(--color-ocean);
  border-color: var(--color-ocean);
  box-shadow: 0 0 0 4px rgba(59, 126, 199, 0.15);
}

.day-timeline-strip__all-icon {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-ocean);
  line-height: 1;
  font-weight: 600;
}

.day-timeline-strip__day--active .day-timeline-strip__all-icon,
.day-timeline-strip__day--all:hover .day-timeline-strip__all-icon {
  color: white;
}

/* ── Label ── */
.day-timeline-strip__label {
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--text-tertiary);
  font-weight: var(--font-weight-medium);
  transition: color 250ms;
}

.day-timeline-strip__day--active .day-timeline-strip__label {
  color: var(--color-sunset);
}

.day-timeline-strip__day--all.day-timeline-strip__day--active .day-timeline-strip__label {
  color: var(--color-ocean);
}

/* ── Connector ── */
.day-timeline-strip__connector {
  width: 28px;
  height: 2px;
  background: rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  margin: 0 4px;
  margin-bottom: 20px;
}
</style>
