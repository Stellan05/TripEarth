<script setup lang="ts">
/**
 * DurationBadge — 天数 Pill 标签
 * 例如 "8 days" / "3 cities"
 */
import AppChip from '@/components/base/AppChip.vue'

withDefaults(
  defineProps<{
    value: number
    unit?: string
    variant?: 'default' | 'pill'
  }>(),
  { unit: 'days', variant: 'pill' },
)
</script>

<template>
  <AppChip :variant="variant" :clickable="false" size="sm">
    {{ value }} {{ unit }}
  </AppChip>
</template>
