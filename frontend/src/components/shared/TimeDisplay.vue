<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    time: string
    format?: 'time' | 'datetime'
    mono?: boolean
  }>(),
  { format: 'time', mono: true },
)

const display = computed(() => {
  if (props.format === 'datetime') return props.time
  return props.time.slice(0, 5)
})
</script>

<template>
  <span class="time-display" :class="{ 'time-display--mono': mono }">{{ display }}</span>
</template>

<style scoped>
.time-display {
  font-size: var(--text-body-md);
  color: var(--text-primary);
  white-space: nowrap;
}

.time-display--mono {
  font-family: var(--font-mono);
  font-weight: var(--font-weight-medium);
}
</style>
