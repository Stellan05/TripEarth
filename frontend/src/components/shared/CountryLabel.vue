<script setup lang="ts">
withDefaults(
  defineProps<{
    flagEmoji?: string
    name: string
    nameCn?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)
</script>

<template>
  <span class="country-label" :class="`country-label--${size}`">
    <span v-if="flagEmoji" class="country-label__flag">{{ flagEmoji }}</span>
    <span class="country-label__name">{{ name }}</span>
    <span v-if="nameCn" class="country-label__name-cn">{{ nameCn }}</span>
  </span>
</template>

<style scoped>
.country-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body);
}

.country-label--sm { font-size: var(--text-body-sm); }
.country-label--md { font-size: var(--text-body-md); }
.country-label--lg { font-size: var(--text-body-lg); }

.country-label__flag {
  line-height: 1;
  flex-shrink: 0;
}

.country-label__name {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.country-label__name-cn {
  font-weight: var(--font-weight-normal);
  color: var(--text-tertiary);
  margin-left: 2px;
}
</style>
