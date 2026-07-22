<script setup lang="ts">
/**
 * PhotoGrid — 不规则照片网格（CSS Grid dense）
 * 支持 loading skeleton 和 empty 态
 */
import { computed } from 'vue'
import PhotoCard from '@/components/features/photo/PhotoCard.vue'
import AppEmptyState from '@/components/base/AppEmptyState.vue'
import type { Photo } from '@/types/photo'

const props = withDefaults(
  defineProps<{
    photos: Photo[]
    loading?: boolean
    columns?: number
  }>(),
  { loading: false, columns: 0 },
)

const emit = defineEmits<{
  'photo-click': [photo: Photo, index: number]
}>()

const gridStyle = computed(() => {
  if (props.columns > 0) {
    return { gridTemplateColumns: `repeat(${props.columns}, 1fr)` }
  }
  return {}
})
</script>

<template>
  <div class="photo-grid-wrapper">
    <!-- Loading skeleton -->
    <div v-if="loading" class="photo-grid photo-grid--loading" :style="gridStyle">
      <div
        v-for="i in 12"
        :key="i"
        class="photo-grid__skeleton"
        :class="`photo-grid__skeleton--${(i % 5) + 1}`"
      />
    </div>

    <!-- Empty state -->
    <AppEmptyState
      v-else-if="!photos.length"
      icon="Image"
      title="No photos yet"
      description="Photos will appear here once you add them to your trip."
    />

    <!-- Photo grid -->
    <div
      v-else
      class="photo-grid"
      :style="gridStyle"
    >
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="photo-grid__item"
      >
        <PhotoCard
          :photo="photo"
          size="md"
          @click="emit('photo-click', photo, index)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-grid-wrapper {
  width: 100%;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-auto-flow: dense;
  gap: 8px;
}

.photo-grid__skeleton {
  aspect-ratio: 1;
  background: var(--color-card-hover);
  border-radius: var(--radius-md);
  background-image: linear-gradient(
    110deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: photo-grid-shimmer 1.5s infinite;
}

.photo-grid__skeleton--1 { aspect-ratio: 1; }
.photo-grid__skeleton--2 { aspect-ratio: 4 / 3; }
.photo-grid__skeleton--3 { aspect-ratio: 3 / 2; }
.photo-grid__skeleton--4 { aspect-ratio: 1; grid-row: span 2; }
.photo-grid__skeleton--5 { aspect-ratio: 16 / 9; }

@keyframes photo-grid-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.photo-grid__item {
  overflow: hidden;
  border-radius: var(--radius-md);
}

.photo-grid--loading {
  min-height: 200px;
}
</style>
