<script setup lang="ts">
/**
 * DateRangeField — 日期范围选择
 * 开始+结束日期，验证逻辑
 */
import { computed } from 'vue'
import AppDatePicker from '@/components/base/AppDatePicker.vue'

const props = withDefaults(
  defineProps<{
    startDate: string
    endDate: string
    startLabel?: string
    endLabel?: string
    startError?: string
    endError?: string
    disabled?: boolean
  }>(),
  { startLabel: 'Start Date', endLabel: 'End Date' },
)

const emit = defineEmits<{
  'update:startDate': [value: string]
  'update:endDate': [value: string]
}>()

const dateError = computed(() => {
  if (props.startDate && props.endDate && props.startDate > props.endDate) {
    return 'End date must be after start date'
  }
  return ''
})
</script>

<template>
  <div class="date-range-field">
    <div class="date-range-field__row">
      <AppDatePicker
        :model-value="startDate"
        type="date"
        :label="startLabel"
        :placeholder="'Select start date'"
        :error="startError"
        :disabled="disabled"
        @update:model-value="$emit('update:startDate', $event as string)"
      />
      <span class="date-range-field__sep">{{ '→' }}</span>
      <AppDatePicker
        :model-value="endDate"
        type="date"
        :label="endLabel"
        :placeholder="'Select end date'"
        :error="endError || dateError"
        :disabled="disabled"
        :min-date="startDate || undefined"
        @update:model-value="$emit('update:endDate', $event as string)"
      />
    </div>
  </div>
</template>

<style scoped>
.date-range-field {
  width: 100%;
}

.date-range-field__row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
}

.date-range-field__sep {
  padding-top: 28px;
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-tertiary);
  flex-shrink: 0;
}
</style>
