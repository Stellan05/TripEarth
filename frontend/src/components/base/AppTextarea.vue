<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    rows?: number
    maxlength?: number
    showCount?: boolean
    error?: string
  }>(),
  { rows: 4 },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const focused = ref(false)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}

import { ref } from 'vue'
</script>

<template>
  <div :class="['app-textarea', { 'app-textarea--focused': focused, 'app-textarea--error': error }]">
    <label v-if="label" class="app-textarea__label">{{ label }}</label>
    <div class="app-textarea__wrap">
      <textarea
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        :maxlength="maxlength"
        class="app-textarea__field"
        v-bind="$attrs"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>
    <div class="app-textarea__footer">
      <span v-if="error" class="app-textarea__error">{{ error }}</span>
      <span v-else />
      <span v-if="showCount && maxlength" class="app-textarea__count">{{ modelValue.length }} / {{ maxlength }}</span>
    </div>
  </div>
</template>

<style scoped>
.app-textarea { display: flex; flex-direction: column; gap: var(--space-xs); }

.app-textarea__label {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.app-textarea__wrap {
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  transition: border-color var(--duration-fast) var(--ease-default);
  padding-bottom: var(--space-xs);
}

.app-textarea--focused .app-textarea__wrap { border-bottom: 2px solid var(--color-sunset); padding-bottom: 3px; }
.app-textarea--error .app-textarea__wrap   { border-bottom-color: var(--color-danger); }

.app-textarea__field {
  width: 100%;
  border: none;
  background: none;
  outline: none;
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-primary);
  line-height: var(--leading-loose);
  resize: vertical;
}

.app-textarea__field::placeholder { color: var(--text-tertiary); }

.app-textarea__footer {
  display: flex;
  justify-content: space-between;
}

.app-textarea__error {
  font-size: var(--text-body-xs);
  color: var(--color-danger);
}

.app-textarea__count {
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  margin-left: auto;
}
</style>
