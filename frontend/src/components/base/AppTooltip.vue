<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    delay?: number
  }>(),
  { position: 'top', delay: 300 },
)
</script>

<template>
  <div class="app-tooltip" :class="`app-tooltip--${position}`">
    <slot />
    <span
      class="app-tooltip__tip"
      :style="{ transitionDelay: `${delay}ms` }"
      role="tooltip"
    >{{ text }}</span>
  </div>
</template>

<style scoped>
.app-tooltip {
  position: relative;
  display: inline-flex;
}

.app-tooltip__tip {
  position: absolute;
  padding: 6px 12px;
  background: var(--text-primary);
  color: var(--text-inverse);
  font-size: var(--text-body-xs);
  font-family: var(--font-body);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-default);
  z-index: var(--z-tooltip);
}

.app-tooltip:hover .app-tooltip__tip { opacity: 1; }

.app-tooltip--top .app-tooltip__tip    { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
.app-tooltip--bottom .app-tooltip__tip { top: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
.app-tooltip--left .app-tooltip__tip   { right: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
.app-tooltip--right .app-tooltip__tip  { left: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
</style>
