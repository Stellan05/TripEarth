<script setup lang="ts">
/**
 * PhotoCard — 单张照片（用于 PhotoGrid 和 LightboxGallery）
 * 支持 hover scale(1.02)，lazy loading
 */
import { ref } from 'vue'
import type { Photo } from '@/types/photo'

const props = withDefaults(
  defineProps<{
    photo: Photo
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const emit = defineEmits<{
  click: [photo: Photo]
}>()

const loaded = ref(false)

const aspectRatioStyle = computed(() => {
  if (props.photo.aspectRatio) return { aspectRatio: `${props.photo.aspectRatio}` }
  return {}
})

import { computed } from 'vue'
</script>

<template>
  <div
    class="photo-card"
    :class="`photo-card--${size}`"
    :style="aspectRatioStyle"
    @click="emit('click', photo)"
  >
    <div v-if="!loaded" class="photo-card__skeleton" />
    <img
      :src="photo.url"
      :alt="photo.caption || 'Photo'"
      loading="lazy"
      class="photo-card__img"
      :class="{ 'photo-card__img--loaded': loaded }"
      @load="loaded = true"
    />
  </div>
</template>

<style scoped>
.photo-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-card-hover);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-spring);
}

.photo-card:hover {
  transform: scale(1.02);
}

.photo-card--sm {
  aspect-ratio: 1;
}

.photo-card--md {
  aspect-ratio: 4 / 3;
}

.photo-card--lg {
  aspect-ratio: 16 / 9;
}

.photo-card__skeleton {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    110deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: photo-shimmer 1.5s infinite;
}

@keyframes photo-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.photo-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.photo-card__img--loaded {
  opacity: 1;
}
</style>
