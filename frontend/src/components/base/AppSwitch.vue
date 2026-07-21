<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    disabled?: boolean
    label?: string
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
  <label :class="['app-switch', { 'app-switch--disabled': disabled }]">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      :class="['app-switch__track', { 'app-switch__track--on': modelValue }]"
      @click="toggle"
    >
      <span class="app-switch__thumb" />
    </button>
    <span v-if="label" class="app-switch__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.app-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
}

.app-switch--disabled { opacity: 0.5; cursor: not-allowed; }

.app-switch__track {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: rgba(0, 0, 0, 0.15);
  cursor: inherit;
  transition: background var(--duration-fast) var(--ease-default);
  padding: 0;
}

.app-switch__track--on { background: var(--color-sunset); }

.app-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform var(--duration-fast) var(--ease-spring);
}

.app-switch__track--on .app-switch__thumb { transform: translateX(20px); }

.app-switch__label {
  font-size: var(--text-body-sm);
  color: var(--text-primary);
  user-select: none;
}
</style>
