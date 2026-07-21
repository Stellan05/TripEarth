<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'text' | 'card' | 'image' | 'rect'
    width?: string
    height?: string
    count?: number
  }>(),
  { variant: 'text', width: '100%', height: '1em', count: 1 },
)
</script>

<template>
  <template v-for="i in count" :key="i">
    <div
      v-if="variant === 'text'"
      class="app-skeleton app-skeleton--text"
      :style="{ width, height, animationDelay: `${(i - 1) * 100}ms` }"
    />
    <div
      v-else-if="variant === 'card'"
      class="app-skeleton app-skeleton--card"
      :style="{ width, height: height || '200px', animationDelay: `${(i - 1) * 100}ms` }"
    />
    <div
      v-else-if="variant === 'image'"
      class="app-skeleton app-skeleton--image"
      :style="{ width, height: height || width, animationDelay: `${(i - 1) * 100}ms` }"
    />
    <div
      v-else
      class="app-skeleton app-skeleton--rect"
      :style="{ width, height, animationDelay: `${(i - 1) * 100}ms` }"
    />
  </template>
</template>

<style scoped>
.app-skeleton {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 25%, rgba(0, 0, 0, 0.08) 50%, rgba(0, 0, 0, 0.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

.app-skeleton--text {
  height: 1em;
  margin-bottom: 0.5em;
  border-radius: 0.25em;
}
.app-skeleton--text:last-child { width: 60%; }

.app-skeleton--card {
  border-radius: var(--radius-md);
}

.app-skeleton--image {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
