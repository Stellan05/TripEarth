<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    disabled?: boolean
  }>(),
  {},
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <label :class="['app-checkbox', { 'app-checkbox--disabled': disabled }]">
    <span :class="['app-checkbox__box', { 'app-checkbox__box--checked': modelValue }]" @click="toggle">
      <AppIcon v-if="modelValue" name="Check" :size="14" color-class="text-inverse" />
    </span>
    <span v-if="label" class="app-checkbox__label">{{ label }}</span>
  </label>
</template>

<script lang="ts">
import AppIcon from './AppIcon.vue'
export default { components: { AppIcon } }
</script>

<style scoped>
.app-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
}
.app-checkbox--disabled { opacity: 0.5; cursor: not-allowed; }

.app-checkbox__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  border: 2px solid rgba(0, 0, 0, 0.20);
  transition: all var(--duration-fast) var(--ease-default);
}

.app-checkbox__box--checked {
  background: var(--color-sunset);
  border-color: var(--color-sunset);
}

.app-checkbox__label {
  font-size: var(--text-body-md);
  color: var(--text-primary);
}
</style>
