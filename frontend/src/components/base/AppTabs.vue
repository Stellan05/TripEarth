<script setup lang="ts">
defineProps<{
  modelValue: string | number
  tabs: { label: string; value: string | number }[]
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<template>
  <div class="app-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="['app-tabs__tab', { 'app-tabs__tab--active': tab.value === modelValue }]"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.app-tabs {
  display: inline-flex;
  gap: var(--space-xs);
  padding: var(--space-xs);
  background: rgba(0, 0, 0, 0.03);
  border-radius: var(--radius-full);
}

.app-tabs__tab {
  padding: 8px 20px;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.app-tabs__tab:hover { color: var(--text-primary); }

.app-tabs__tab--active {
  background: var(--color-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-card);
}
</style>
