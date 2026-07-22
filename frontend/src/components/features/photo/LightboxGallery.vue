<script setup lang="ts">
/**
 * LightboxGallery — 全屏照片浏览
 * 背景 rgba(0,0,0,0.92)，左右导航 + 键盘 ← → ESC + 底部 EXIF 胶囊
 */
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import type { Photo } from '@/types/photo'

const props = withDefaults(
  defineProps<{
    visible: boolean
    photos: Photo[]
    initialIndex?: number
  }>(),
  { initialIndex: 0 },
)

const emit = defineEmits<{
  close: []
  next: []
  prev: []
}>()

const currentIndex = ref(props.initialIndex)

watch(
  () => props.visible,
  (val) => {
    if (val) {
      currentIndex.value = props.initialIndex
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

watch(
  () => props.initialIndex,
  (val) => {
    currentIndex.value = val
  },
)

const currentPhoto = computed(() => props.photos[currentIndex.value])

const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.photos.length - 1)

const imageLoaded = ref(false)

function goNext() {
  if (!hasNext.value) return
  currentIndex.value++
  imageLoaded.value = false
  emit('next')
}

function goPrev() {
  if (!hasPrev.value) return
  currentIndex.value--
  imageLoaded.value = false
  emit('prev')
}

function onKeydown(e: KeyboardEvent) {
  if (!props.visible) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight') goNext()
  if (e.key === 'ArrowLeft') goPrev()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="visible" class="lightbox" @click.self="emit('close')">
        <!-- Close button -->
        <button class="lightbox__close" @click="emit('close')" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <!-- Counter -->
        <div class="lightbox__counter" v-if="photos.length > 1">
          {{ currentIndex + 1 }} / {{ photos.length }}
        </div>

        <!-- Previous button -->
        <button
          v-if="hasPrev"
          class="lightbox__nav lightbox__nav--prev"
          @click="goPrev"
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <!-- Image -->
        <div class="lightbox__image-wrapper">
          <img
            v-if="currentPhoto"
            :src="currentPhoto.url"
            :alt="currentPhoto.caption || 'Photo'"
            class="lightbox__image"
            :class="{ 'lightbox__image--loaded': imageLoaded }"
            @load="imageLoaded = true"
          />
          <div v-if="!imageLoaded && currentPhoto" class="lightbox__spinner" />
        </div>

        <!-- Next button -->
        <button
          v-if="hasNext"
          class="lightbox__nav lightbox__nav--next"
          @click="goNext"
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <!-- Bottom EXIF info -->
        <div v-if="currentPhoto?.caption || currentPhoto?.takenAt" class="lightbox__info">
          <span v-if="currentPhoto?.takenAt" class="lightbox__info-item">{{ currentPhoto.takenAt }}</span>
          <span v-if="currentPhoto?.caption" class="lightbox__info-item lightbox__info-item--caption">{{ currentPhoto.caption }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
  user-select: none;
}

.lightbox__close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background var(--duration-fast);
}

.lightbox__close:hover {
  background: rgba(255, 255, 255, 0.16);
}

.lightbox__counter {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  color: rgba(255, 255, 255, 0.6);
  z-index: 10;
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background var(--duration-fast);
}

.lightbox__nav:hover {
  background: rgba(255, 255, 255, 0.16);
}

.lightbox__nav--prev {
  left: 16px;
}

.lightbox__nav--next {
  right: 16px;
}

.lightbox__image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 64px 80px;
  box-sizing: border-box;
}

.lightbox__image {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.lightbox__image--loaded {
  opacity: 1;
}

.lightbox__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #fff;
  border-radius: 50%;
  animation: lightbox-spin 0.8s linear infinite;
}

@keyframes lightbox-spin {
  to { transform: rotate(360deg); }
}

.lightbox__info {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  backdrop-filter: blur(8px);
}

.lightbox__info-item {
  white-space: nowrap;
}

.lightbox__info-item--caption {
  color: rgba(255, 255, 255, 0.95);
  font-weight: var(--font-weight-medium);
}

/* Transition */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity var(--duration-normal) var(--ease-default);
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
