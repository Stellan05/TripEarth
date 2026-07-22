<script setup lang="ts">
/**
 * MetaBadge — 通用元数据 pill
 * 显示标签和值，例如 "3 cities" / "2 photos"
 */
withDefaults(
  defineProps<{
    value: string | number
    label: string
  }>(),
  {},
)
</script>

<template>
  <span class="meta-badge">
    <span class="meta-badge__value">{{ value }}</span>
    <span class="meta-badge__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.meta-badge {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  white-space: nowrap;
}

.meta-badge__value {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}
</style>
