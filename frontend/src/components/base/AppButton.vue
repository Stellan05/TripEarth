<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    round?: boolean
    fullWidth?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', size: 'md', round: true, type: 'button' },
)

defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <button
    :class="[
      'app-btn',
      `app-btn--${variant}`,
      `app-btn--${size}`,
      { 'app-btn--round': round, 'app-btn--full': fullWidth, 'app-btn--loading': loading },
    ]"
    :disabled="disabled || loading"
    :type="type"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <AppSpinner v-if="loading" :size="size === 'lg' ? 'md' : 'sm'" />
    <template v-else>
      <span v-if="$slots.prefix" class="app-btn__prefix"><slot name="prefix" /></span>
      <span class="app-btn__text"><slot /></span>
      <span v-if="$slots.suffix" class="app-btn__suffix"><slot name="suffix" /></span>
    </template>
  </button>
</template>

<script lang="ts">
import AppSpinner from './AppSpinner.vue'
export default { components: { AppSpinner } }
</script>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-family: var(--font-body);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  transition: all var(--duration-fast) var(--ease-default);
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
}

.app-btn:active:not(:disabled) { transform: scale(0.98); }

/* Sizes */
.app-btn--sm  { padding: 6px 14px; font-size: var(--text-body-xs); }
.app-btn--md  { padding: 10px 20px; font-size: var(--text-body-sm); }
.app-btn--lg  { padding: 14px 28px; font-size: var(--text-body-md); }

/* Round */
.app-btn--round { border-radius: var(--radius-full); }
.app-btn:not(.app-btn--round) { border-radius: var(--radius-sm); }

/* Full width */
.app-btn--full { width: 100%; }

/* Variants */
.app-btn--primary {
  background: var(--color-sunset);
  color: var(--text-inverse);
}
.app-btn--primary:hover:not(:disabled) {
  background: var(--color-sunset-glow);
  box-shadow: 0 2px 8px rgba(232, 113, 74, 0.3);
}

.app-btn--secondary {
  background: transparent;
  color: var(--text-secondary);
  border-color: rgba(0, 0, 0, 0.10);
}
.app-btn--secondary:hover:not(:disabled) {
  background: var(--color-card-hover);
  color: var(--text-primary);
}

.app-btn--ghost {
  background: transparent;
  color: var(--text-secondary);
}
.app-btn--ghost:hover:not(:disabled) {
  background: var(--color-card-hover);
  color: var(--text-primary);
}

.app-btn--danger {
  background: var(--color-danger);
  color: var(--text-inverse);
}
.app-btn--danger:hover:not(:disabled) { background: #c43e3e; }

/* States */
.app-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.app-btn--loading { cursor: wait; }
</style>
