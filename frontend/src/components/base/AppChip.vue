<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'active' | 'wishlist' | 'pill'
    closable?: boolean
    clickable?: boolean
    size?: 'sm' | 'md'
    activeColor?: 'sunset' | 'forest'
  }>(),
  { variant: 'default', clickable: true, size: 'sm', activeColor: 'sunset' },
)

const emit = defineEmits<{
  click: [e: MouseEvent]
  close: []
}>()
</script>

<template>
  <span
    :class="[
      'app-chip',
      `app-chip--${variant}`,
      `app-chip--${size}`,
      `app-chip--accent-${activeColor}`,
      { 'app-chip--clickable': clickable && variant !== 'active' },
    ]"
    v-bind="$attrs"
    @click="clickable && $emit('click', $event)"
  >
    <span v-if="$slots.prefix" class="app-chip__prefix"><slot name="prefix" /></span>
    <span class="app-chip__text"><slot /></span>
    <button
      v-if="closable"
      class="app-chip__close"
      @click.stop="$emit('close')"
      aria-label="Remove"
    >
      <AppIcon name="X" :size="size === 'sm' ? 12 : 14" />
    </button>
  </span>
</template>

<script lang="ts">
import AppIcon from './AppIcon.vue'
export default { components: { AppIcon } }
</script>

<style scoped>
.app-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  transition: all var(--duration-fast) var(--ease-default);
  user-select: none;
}

.app-chip--sm  { padding: 4px 10px; font-size: var(--text-body-xs); border-radius: var(--radius-sm); }
.app-chip--md  { padding: 6px 16px; font-size: var(--text-body-sm); border-radius: var(--radius-full); }

/* Variants */
.app-chip--default {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid rgba(0, 0, 0, 0.08);
}
.app-chip--clickable:hover { color: var(--text-primary); border-color: rgba(0, 0, 0, 0.16); }

.app-chip--active.app-chip--accent-sunset {
  background: var(--color-sunset);
  color: var(--text-inverse);
  border: 1px solid var(--color-sunset);
}
.app-chip--active.app-chip--accent-forest {
  background: var(--color-forest);
  color: var(--text-inverse);
  border: 1px solid var(--color-forest);
}

.app-chip--wishlist {
  background: var(--color-forest);
  color: var(--text-inverse);
  border: 1px solid var(--color-forest);
}

.app-chip--pill {
  background: var(--color-card);
  color: var(--text-primary);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: var(--shadow-card);
}

.app-chip__prefix,
.app-chip__text { display: inline-flex; align-items: center; }

.app-chip__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  margin-left: 2px;
}
.app-chip__close:hover { opacity: 1; }
</style>
