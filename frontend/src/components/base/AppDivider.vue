<script setup lang="ts">
withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    dashed?: boolean
    label?: string
  }>(),
  { direction: 'horizontal' },
)
</script>

<template>
  <div
    v-if="!label"
    :class="['app-divider', `app-divider--${direction}`, { 'app-divider--dashed': dashed }]"
    role="separator"
  />
  <div
    v-else
    :class="['app-divider', 'app-divider--with-label', { 'app-divider--dashed': dashed }]"
    role="separator"
  >
    <span class="app-divider__line" />
    <span class="app-divider__label">{{ label }}</span>
    <span class="app-divider__line" />
  </div>
</template>

<style scoped>
.app-divider { border: none; }

.app-divider--horizontal {
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.app-divider--vertical {
  width: 0;
  height: 100%;
  min-height: 1em;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
}
.app-divider--dashed.app-divider--horizontal { border-top-style: dashed; }
.app-divider--dashed.app-divider--vertical   { border-left-style: dashed; }

.app-divider--with-label {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  border: none;
}
.app-divider__line {
  flex: 1;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.app-divider--dashed .app-divider__line { border-top-style: dashed; }
.app-divider__label {
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
  white-space: nowrap;
}
</style>
