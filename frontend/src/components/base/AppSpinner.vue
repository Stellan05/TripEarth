<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    label?: string
  }>(),
  { size: 'md' },
)
</script>

<template>
  <div class="app-spinner" :class="`app-spinner--${size}`" role="status" :aria-label="label || 'Loading'">
    <div class="app-spinner__ring" />
    <span v-if="label" class="app-spinner__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.app-spinner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.app-spinner__ring {
  border-radius: 50%;
  border: 2px solid var(--text-tertiary);
  border-top-color: var(--color-sunset);
  animation: spin 0.8s linear infinite;
}

.app-spinner--sm .app-spinner__ring { width: 16px; height: 16px; }
.app-spinner--md .app-spinner__ring { width: 24px; height: 24px; }
.app-spinner--lg .app-spinner__ring { width: 40px; height: 40px; }

.app-spinner__label {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
