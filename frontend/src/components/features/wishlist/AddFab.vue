<script setup lang="ts">
/**
 * AddFab — 右下角浮动添加按钮
 * Sunset Orange 背景，白色文字，Pill 风格
 * Fixed 定位 bottom: 32px right: 32px, z-index: 100
 */
import AppButton from '@/components/base/AppButton.vue'
import AppIcon from '@/components/base/AppIcon.vue'

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="add-fab">
    <AppButton variant="primary" size="lg" round @click="emit('click')">
      <template #prefix>
        <AppIcon name="Plus" :size="20" color-class="" />
      </template>
      <span class="add-fab__label">Add Destination</span>
    </AppButton>
  </div>
</template>

<style scoped>
.add-fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 100;
}

@media (max-width: 640px) {
  .add-fab {
    bottom: 16px;
    right: 16px;
  }

  .add-fab__label {
    display: none;
  }
}
</style>
