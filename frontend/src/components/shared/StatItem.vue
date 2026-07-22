<script setup lang="ts">
/**
 * StatItem — 统计数字展示
 * Mono 大数字 + odometer 动画 + 标签文字
 */
import { ref, watch, onMounted } from 'vue'
import { useOdometer } from '@/composables/useOdometer'

const props = withDefaults(
  defineProps<{
    value: number
    label: string
    animate?: boolean
    prefix?: string
    suffix?: string
    duration?: number
  }>(),
  { animate: true, prefix: '', suffix: '', duration: 700 },
)

const { displayValue, rollTo } = useOdometer(props.duration)
const hasAnimated = ref(false)

onMounted(() => {
  if (props.animate && props.value > 0) {
    requestAnimationFrame(() => {
      rollTo(props.value)
      hasAnimated.value = true
    })
  } else {
    displayValue.value = props.value
    hasAnimated.value = true
  }
})

watch(() => props.value, (val) => {
  if (hasAnimated.value) {
    rollTo(val)
  }
})
</script>

<template>
  <div class="stat-item">
    <span class="stat-item__value">
      <template v-if="animate">{{ prefix }}{{ displayValue }}{{ suffix }}</template>
      <template v-else>{{ prefix }}{{ value }}{{ suffix }}</template>
    </span>
    <span class="stat-item__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-item__value {
  font-family: var(--font-mono);
  font-size: var(--text-mono-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  line-height: var(--leading-tight);
}

.stat-item__label {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}
</style>
