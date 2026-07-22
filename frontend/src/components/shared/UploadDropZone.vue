<script setup lang="ts">
/**
 * UploadDropZone — 拖拽上传区域
 * 虚线边框 + 图标 + 提示文字 + 进度条
 */
import { ref } from 'vue'
import AppIcon from '@/components/base/AppIcon.vue'
import AppProgress from '@/components/base/AppProgress.vue'

withDefaults(
  defineProps<{
    accept?: string
    maxSize?: number
    uploading?: boolean
    progress?: number
    disabled?: boolean
  }>(),
  { accept: 'image/jpeg,image/png,image/webp', maxSize: 10 * 1024 * 1024, uploading: false, progress: 0, disabled: false },
)

const emit = defineEmits<{
  files: [files: File[]]
}>()

const dragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function onDragEnter(e: DragEvent) {
  e.preventDefault()
  if (!props.disabled) dragging.value = true
}

function onDragLeave() {
  dragging.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  if (props.disabled) return
  if (e.dataTransfer?.files) {
    const valid = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (valid.length) emit('files', valid)
  }
}

function onClick() {
  if (props.disabled) return
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    emit('files', Array.from(target.files))
    target.value = ''
  }
}
</script>

<template>
  <div
    class="upload-dropzone"
    :class="{ 'upload-dropzone--dragging': dragging, 'upload-dropzone--disabled': disabled }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    @click="onClick"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-label="'Upload files'"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      multiple
      hidden
      @change="onFileChange"
    />

    <div class="upload-dropzone__content">
      <AppIcon name="ImagePlus" :size="32" color-class="text-tertiary" :stroke-width="1.5" />
      <p class="upload-dropzone__text">
        {{ dragging ? 'Drop files here' : 'Drag & drop photos or click to upload' }}
      </p>
      <p class="upload-dropzone__hint">JPG, PNG, WebP &middot; Max 10MB each</p>
    </div>

    <div v-if="uploading" class="upload-dropzone__progress">
      <AppProgress :percentage="progress" color="sunset" show-text />
    </div>
  </div>
</template>

<style scoped>
.upload-dropzone {
  position: relative;
  border: 2px dashed var(--text-tertiary);
  border-radius: var(--radius-md);
  background: var(--color-card-hover);
  padding: var(--space-2xl) var(--space-xl);
  text-align: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.upload-dropzone:hover:not(.upload-dropzone--disabled) {
  border-color: var(--color-sunset);
  background: var(--color-card);
}

.upload-dropzone--dragging {
  border-color: var(--color-sunset) !important;
  background: var(--color-card) !important;
}

.upload-dropzone--disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.upload-dropzone__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.upload-dropzone__text {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  margin: 0;
}

.upload-dropzone__hint {
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  margin: 0;
}

.upload-dropzone__progress {
  margin-top: var(--space-md);
}
</style>
