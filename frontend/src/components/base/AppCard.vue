<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    variant?: 'default' | 'photo' | 'flight' | 'destination'
    hoverable?: boolean
    padding?: boolean
    tag?: string
  }>(),
  { variant: 'default', hoverable: true, padding: true, tag: 'div' },
)
</script>

<template>
  <component
    :is="tag"
    :class="[
      'app-card',
      `app-card--${variant}`,
      { 'app-card--hoverable': hoverable, 'app-card--no-padding': !padding },
    ]"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-card {
  background: var(--color-card);
  border-radius: var(--radius-md);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: var(--card-padding);
  transition: box-shadow var(--duration-normal) var(--ease-default),
              transform var(--duration-normal) var(--ease-default);
}

.app-card--no-padding { padding: 0; }

.app-card--hoverable:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.app-card--photo {
  padding: 0;
  border: none;
  box-shadow: none;
}

.app-card--photo.app-card--hoverable:hover {
  box-shadow: var(--shadow-card-hover);
  transform: scale(1.02);
}

.app-card--flight {
  border-top: 4px solid var(--flight-accent);
  padding: var(--card-padding);
}

.app-card--destination {
  padding: 0;
  border: none;
  overflow: hidden;
}
</style>
