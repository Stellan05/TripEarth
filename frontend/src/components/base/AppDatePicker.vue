<script setup lang="ts">
/**
 * AppDatePicker — 日期选择器
 * 基于 Element Plus ElDatePicker 封装，统一样式
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue: string | number | Date | [string, string] | [Date, Date] | null
    label?: string
    placeholder?: string
    error?: string
    type?: 'date' | 'daterange'
    startPlaceholder?: string
    endPlaceholder?: string
    disabled?: boolean
    clearable?: boolean
  }>(),
  { type: 'date', clearable: true },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | Date | [string, string] | [Date, Date] | null]
}>()

function onChange(val: string | number | Date | [string, string] | [Date, Date] | null) {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="app-datepicker" :class="{ 'app-datepicker--error': !!error }">
    <label v-if="label" class="app-datepicker__label">{{ label }}</label>
    <ElDatePicker
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :disabled="disabled"
      :clearable="clearable"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      class="app-datepicker__picker"
      @update:model-value="onChange"
      v-bind="$attrs"
    />
    <p v-if="error" class="app-datepicker__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.app-datepicker {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.app-datepicker__label {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.app-datepicker__picker {
  width: 100%;
}

.app-datepicker :deep(.el-input__wrapper) {
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08) inset;
  background: transparent;
  transition: box-shadow var(--duration-fast) var(--ease-default);
}

.app-datepicker :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.16) inset;
}

.app-datepicker :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px var(--color-sunset) inset;
}

.app-datepicker :deep(.el-input__inner) {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-primary);
}

.app-datepicker--error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--color-danger) inset;
}

.app-datepicker--error :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px var(--color-danger) inset;
}

.app-datepicker__error {
  font-size: var(--text-body-xs);
  color: var(--color-danger);
  margin: 0;
}
</style>
