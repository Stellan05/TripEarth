<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    type?: string
    error?: string
    disabled?: boolean
    prefixIcon?: string
    suffixIcon?: string
    clearable?: boolean
  }>(),
  { type: 'text' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [e: FocusEvent]
  blur: [e: FocusEvent]
  clear: []
}>()

const focused = ref(false)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

import { ref } from 'vue'
</script>

<template>
  <div :class="['app-input', { 'app-input--focused': focused, 'app-input--error': error, 'app-input--disabled': disabled }]">
    <label v-if="label" class="app-input__label">{{ label }}</label>
    <div class="app-input__wrap">
      <span v-if="prefixIcon" class="app-input__icon app-input__icon--prefix">
        <AppIcon :name="prefixIcon" :size="16" color-class="text-tertiary" />
      </span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="app-input__field"
        v-bind="$attrs"
        @input="onInput"
        @focus="focused = true; $emit('focus', $event)"
        @blur="focused = false; $emit('blur', $event)"
      />
      <button v-if="clearable && modelValue" class="app-input__clear" @click="$emit('clear'); $emit('update:modelValue', '')" aria-label="Clear">
        <AppIcon name="X" :size="14" />
      </button>
      <span v-if="suffixIcon && !(clearable && modelValue)" class="app-input__icon app-input__icon--suffix">
        <AppIcon :name="suffixIcon" :size="16" color-class="text-tertiary" />
      </span>
    </div>
    <span v-if="error" class="app-input__error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import AppIcon from './AppIcon.vue'
export default { components: { AppIcon } }
</script>

<style scoped>
.app-input { display: flex; flex-direction: column; gap: var(--space-xs); }

.app-input__label {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.app-input__wrap {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  transition: border-color var(--duration-fast) var(--ease-default);
  padding-bottom: var(--space-xs);
}

.app-input--focused .app-input__wrap { border-bottom: 2px solid var(--color-sunset); padding-bottom: 3px; }
.app-input--error .app-input__wrap   { border-bottom-color: var(--color-danger); }
.app-input--disabled .app-input__wrap { opacity: 0.5; }

.app-input__icon {
  display: flex;
  align-items: center;
  margin-right: var(--space-sm);
}

.app-input__field {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-primary);
  line-height: 1.5;
  width: 100%;
}

.app-input__field::placeholder { color: var(--text-tertiary); }
.app-input__field:disabled { cursor: not-allowed; }

.app-input__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-tertiary);
  padding: 0;
  margin-left: var(--space-xs);
}
.app-input__clear:hover { color: var(--text-secondary); }

.app-input__error {
  font-size: var(--text-body-xs);
  color: var(--color-danger);
}
</style>
