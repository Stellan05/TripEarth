<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    date?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)
</script>

<template>
  <span class="city-label" :class="`city-label--${size}`">
    <span class="city-label__name">{{ name }}</span>
    <span v-if="date" class="city-label__date">{{ date }}</span>
  </span>
</template>

<style scoped>
.city-label {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-sm);
  font-family: var(--font-body);
}

.city-label--sm { font-size: var(--text-body-sm); }
.city-label--md { font-size: var(--text-body-md); }
.city-label--lg { font-size: var(--text-body-lg); }

.city-label__name {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.city-label__date {
  font-size: 0.85em;
  color: var(--text-tertiary);
}
</style>
