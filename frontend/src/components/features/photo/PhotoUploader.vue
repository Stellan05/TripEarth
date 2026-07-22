<script setup lang="ts">
/**
 * PhotoUploader — 照片上传组件（拖拽/点击上传 + 缩略图预览 + 删除）
 *
 * Props:
 *   modelValue: 已选择的 File 列表
 *   maxCount: 最大上传数量上限 (default 20)
 *   maxSize: 单文件最大字节 (default 10MB)
 *   accept: 接受的 MIME 类型
 *   existingPhotos: 已上传到服务器的照片列表
 * Events:
 *   @update:modelValue — 文件列表变化
 *   @upload(files) — 用户选择了文件，可在此触发上传
 *   @remove(index) — 移除了第 index 个文件
 *   @sort — 排序变更（预留）
 *
 * 使用 UploadDropZone from '@/components/shared/UploadDropZone.vue' 作为上传区域
 * 缩略图预览使用 PhotoThumbnail from '@/components/shared/PhotoThumbnail.vue'
 * 状态: idle / dragging / uploading / error
 */
import { ref, computed } from 'vue'
import UploadDropZone from '@/components/shared/UploadDropZone.vue'
import PhotoThumbnail from '@/components/shared/PhotoThumbnail.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import type { Photo } from '@/types/photo'

export type UploadState = 'idle' | 'dragging' | 'uploading' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue?: File[]
    maxCount?: number
    maxSize?: number
    accept?: string
    existingPhotos?: Photo[]
  }>(),
  {
    modelValue: () => [],
    maxCount: 20,
    maxSize: 10 * 1024 * 1024,
    accept: 'image/jpeg,image/png,image/webp,image/heic',
    existingPhotos: () => [],
  },
)

const emit = defineEmits<{
  'update:modelValue': [files: File[]]
  upload: [files: File[]]
  remove: [index: number]
  sort: []
}>()

const uploadState = ref<UploadState>('idle')
const uploadProgress = ref(0)
const errorMessage = ref('')

// ── Computed ──

const remainingCount = computed(() => {
  return props.maxCount! - props.modelValue!.length - props.existingPhotos!.length
})

const canUpload = computed(() => {
  return remainingCount.value > 0
})

// ── Handlers ──

function onFilesSelected(files: File[]) {
  if (!canUpload.value) {
    uploadState.value = 'error'
    errorMessage.value = `Maximum ${props.maxCount} photos allowed`
    return
  }

  // Validate file size
  const oversized = files.filter((f) => f.size > props.maxSize!)
  if (oversized.length > 0) {
    uploadState.value = 'error'
    errorMessage.value = `File too large. Max size: ${(props.maxSize! / 1024 / 1024).toFixed(0)}MB`
    return
  }

  // Limit to remaining count
  const allowed = files.slice(0, remainingCount.value)
  const newFiles = [...props.modelValue!, ...allowed]
  emit('update:modelValue', newFiles)
  emit('upload', allowed)

  uploadState.value = 'uploading'

  // Reset state after brief upload simulation
  setTimeout(() => {
    uploadState.value = 'idle'
  }, 1000)
}

function onRemoveFile(index: number) {
  const updated = props.modelValue!.filter((_, i) => i !== index)
  emit('update:modelValue', updated)
  emit('remove', index)
}

function onRemoveExisting(photoId: number) {
  // Emit a custom event via model update — parent handles the API call
  // For existing photos, we emit remove with a negative index to signal existing
  emit('remove', -(photoId + 1))
}

function onDragStateChange(dragging: boolean) {
  uploadState.value = dragging ? 'dragging' : 'idle'
}

function dismissError() {
  uploadState.value = 'idle'
  errorMessage.value = ''
}

const fileListPreview = computed(() => {
  const existing = props.existingPhotos!.map((p) => ({
    type: 'existing' as const,
    ...p,
  }))
  const local = props.modelValue!.map((f, i) => ({
    type: 'local' as const,
    id: i,
    url: URL.createObjectURL(f),
    caption: f.name,
    originalFile: f,
  }))
  return [...existing, ...local]
})
</script>

<template>
  <div
    class="photo-uploader"
    :class="{
      'photo-uploader--error': uploadState === 'error',
    }"
  >
    <!-- Upload Drop Zone -->
    <UploadDropZone
      :accept="accept"
      :max-size="maxSize"
      :uploading="uploadState === 'uploading'"
      :progress="uploadProgress"
      :disabled="!canUpload"
      @files="onFilesSelected"
      @dragenter="onDragStateChange(true)"
      @dragleave="onDragStateChange(false)"
    />

    <!-- Error message -->
    <div v-if="uploadState === 'error'" class="photo-uploader__error">
      <span class="photo-uploader__error-text">{{ errorMessage }}</span>
      <button class="photo-uploader__dismiss" @click="dismissError" aria-label="Dismiss">
        <AppIcon name="X" :size="14" color-class="" />
      </button>
    </div>

    <!-- Remaining count -->
    <p v-if="canUpload" class="photo-uploader__count text-tertiary body-xs">
      {{ remainingCount }} of {{ maxCount }} remaining
    </p>
    <p v-else class="photo-uploader__count text-tertiary body-xs">
      Maximum {{ maxCount }} photos reached
    </p>

    <!-- Thumbnail preview grid -->
    <div v-if="fileListPreview.length > 0" class="photo-uploader__previews">
      <div
        v-for="(item, i) in fileListPreview"
        :key="item.type === 'existing' ? `existing-${item.id}` : `local-${item.id}`"
        class="photo-uploader__preview-item"
      >
        <PhotoThumbnail
          :src="item.url"
          :alt="item.caption || 'Photo preview'"
          size="sm"
        />

        <!-- Caption -->
        <span v-if="item.caption" class="photo-uploader__caption">{{ item.caption }}</span>

        <!-- Remove button -->
        <button
          class="photo-uploader__remove-btn"
          @click="
            item.type === 'existing'
              ? onRemoveExisting(item.id)
              : onRemoveFile(item.id as number)
          "
          :aria-label="'Remove photo'"
        >
          <AppIcon name="X" :size="12" color-class="" />
        </button>
      </div>
    </div>

    <!-- Drag overlay state hint -->
    <Transition name="fade">
      <div v-if="uploadState === 'dragging'" class="photo-uploader__drag-overlay">
        <AppIcon name="ImagePlus" :size="48" color-class="" :stroke-width="1.5" />
        <p class="photo-uploader__drag-text">Drop photos here</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.photo-uploader {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.photo-uploader--error {
  /* Error state styling handled inline */
}

.photo-uploader__error {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 8px 12px;
  background: rgba(196, 62, 62, 0.08);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(196, 62, 62, 0.15);
}

.photo-uploader__error-text {
  flex: 1;
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--color-danger);
}

.photo-uploader__dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-danger);
  border-radius: 50%;
  transition: background var(--duration-fast);
}

.photo-uploader__dismiss:hover {
  background: rgba(196, 62, 62, 0.1);
}

.photo-uploader__count {
  margin: 0;
  text-align: right;
}

.photo-uploader__previews {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.photo-uploader__preview-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.photo-uploader__caption {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.photo-uploader__remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: var(--color-card);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--duration-fast);
  z-index: 2;
}

.photo-uploader__remove-btn:hover {
  background: var(--color-danger);
  color: var(--text-inverse);
}

/* ── Drag overlay ── */
.photo-uploader__drag-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(245, 242, 237, 0.9);
  border-radius: var(--radius-md);
  z-index: 5;
  gap: var(--space-md);
}

.photo-uploader__drag-text {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-sunset);
  margin: 0;
}

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
