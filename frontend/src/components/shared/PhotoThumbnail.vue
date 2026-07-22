<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    src: string
    alt?: string
    size?: 'sm' | 'md' | 'lg'
    aspectRatio?: number
  }>(),
  { size: 'md', aspectRatio: 1 },
)

const loaded = ref(false)
</script>

<template>
  <div
    class="photo-thumbnail"
    :class="`photo-thumbnail--${size}`"
    :style="{ aspectRatio: aspectRatio ? `${aspectRatio}` : undefined }"
  >
    <div v-if="!loaded" class="photo-thumbnail__placeholder" />
    <img
      :src="src"
      :alt="alt || 'Photo'"
      :class="['photo-thumbnail__img', { 'photo-thumbnail__img--loaded': loaded }]"
      loading="lazy"
      @load="loaded = true"
    />
  </div>
</template>

<style scoped>
.photo-thumbnail {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-card-hover);
  transition: transform var(--duration-fast) var(--ease-spring),
              box-shadow var(--duration-fast) var(--ease-default);
}

.photo-thumbnail:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-card-hover);
}

.photo-thumbnail--sm { width: 80px; }
.photo-thumbnail--md { width: 120px; }
.photo-thumbnail--lg { width: 180px; }

.photo-thumbnail--sm,
.photo-thumbnail--md,
.photo-thumbnail--lg {
  height: auto;
}

.photo-thumbnail__placeholder {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.photo-thumbnail__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.photo-thumbnail__img--loaded {
  opacity: 1;
}
</style>
