<script setup lang="ts">
/**
 * TransportIcon — 交通方式图标
 * FLIGHT → PlaneTakeoff Ocean | TRAIN → Train Forest | CAR → Car Tertiary | OTHER → MapPin Tertiary
 */
import { computed } from 'vue'
import AppIcon from '@/components/base/AppIcon.vue'

const props = withDefaults(
  defineProps<{
    type: 'FLIGHT' | 'TRAIN' | 'CAR' | 'OTHER'
    size?: 16 | 20 | 24
    showLabel?: boolean
  }>(),
  { size: 20, showLabel: false },
)

const iconMap: Record<string, string> = {
  FLIGHT: 'PlaneTakeoff',
  TRAIN: 'Train',
  CAR: 'Car',
  OTHER: 'MapPin',
}

const colorMap: Record<string, string> = {
  FLIGHT: 'text-ocean',
  TRAIN: 'text-forest',
  CAR: 'text-tertiary',
  OTHER: 'text-tertiary',
}

const labelMap: Record<string, string> = {
  FLIGHT: 'Flight',
  TRAIN: 'Train',
  CAR: 'Car',
  OTHER: 'Other',
}

const iconName = computed(() => iconMap[props.type] || 'MapPin')
const colorClass = computed(() => colorMap[props.type] || 'text-tertiary')
const label = computed(() => labelMap[props.type] || '')
</script>

<template>
  <span class="transport-icon" :class="colorClass">
    <AppIcon :name="iconName" :size="size" :color-class="colorClass" />
    <span v-if="showLabel" class="transport-icon__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.transport-icon {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  white-space: nowrap;
}

.transport-icon__label {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  font-weight: var(--font-weight-medium);
}
</style>
