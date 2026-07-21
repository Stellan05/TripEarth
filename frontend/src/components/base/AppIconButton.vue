<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    icon: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'glass'
    label: string
  }>(),
  { size: 'md', variant: 'default' },
)

defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <button
    :class="['app-icon-btn', `app-icon-btn--${size}`, `app-icon-btn--${variant}`]"
    :aria-label="label"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <AppIcon :name="icon" :size="size === 'sm' ? 16 : size === 'lg' ? 24 : 20" />
  </button>
</template>

<script lang="ts">
import AppIcon from './AppIcon.vue'
export default { components: { AppIcon } }
</script>

<style scoped>
.app-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  color: var(--text-secondary);
  background: transparent;
}

.app-icon-btn:hover  { background: var(--color-card-hover); color: var(--text-primary); }
.app-icon-btn:active { transform: scale(0.95); }

.app-icon-btn--sm  { width: 32px; height: 32px; }
.app-icon-btn--md  { width: 40px; height: 40px; }
.app-icon-btn--lg  { width: 48px; height: 48px; }

.app-icon-btn--glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
}
.app-icon-btn--glass:hover { background: rgba(255, 255, 255, 0.16); }
</style>
