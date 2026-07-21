<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    count?: number
    dot?: boolean
    max?: number
    color?: 'danger' | 'sunset' | 'forest'
  }>(),
  { max: 99, color: 'danger' },
)

const display = computed(() => {
  if (props.dot) return ''
  if (props.count == null) return ''
  return props.count > props.max ? `${props.max}+` : String(props.count)
})

import { computed } from 'vue'
</script>

<template>
  <span v-if="dot || count != null" :class="['app-badge', `app-badge--${color}`]">
    {{ display }}
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  color: white;
}

.app-badge--danger  { background: var(--color-danger); }
.app-badge--sunset  { background: var(--color-sunset); }
.app-badge--forest  { background: var(--color-forest); }
</style>
