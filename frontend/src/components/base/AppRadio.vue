<script setup lang="ts">
defineProps<{
  modelValue: string | number
  value: string | number
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<template>
  <label :class="['app-radio', { 'app-radio--disabled': disabled }]">
    <input
      type="radio"
      class="app-radio__input"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="$emit('update:modelValue', value)"
    />
    <span class="app-radio__dot" />
    <span v-if="label" class="app-radio__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.app-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  position: relative;
}
.app-radio--disabled { opacity: 0.5; cursor: not-allowed; }

.app-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.app-radio__dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.20);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--duration-fast);
  flex-shrink: 0;
}

.app-radio__dot::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-sunset);
  opacity: 0;
  transform: scale(0);
  transition: all var(--duration-fast) var(--ease-spring);
}

.app-radio__input:checked + .app-radio__dot {
  border-color: var(--color-sunset);
}
.app-radio__input:checked + .app-radio__dot::after {
  opacity: 1;
  transform: scale(1);
}

.app-radio__label {
  font-size: var(--text-body-md);
  color: var(--text-primary);
}
</style>
