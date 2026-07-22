<script setup lang="ts">
/**
 * ConfirmAction — 确认/取消按钮对
 */
import AppButton from '@/components/base/AppButton.vue'

withDefaults(
  defineProps<{
    confirmText?: string
    cancelText?: string
    variant?: 'primary' | 'danger'
    confirmLoading?: boolean
    disabled?: boolean
  }>(),
  { confirmText: 'Save', cancelText: 'Cancel', variant: 'primary', confirmLoading: false, disabled: false },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div class="confirm-action">
    <AppButton variant="ghost" size="md" :disabled="disabled" @click="$emit('cancel')">
      {{ cancelText }}
    </AppButton>
    <AppButton :variant="variant" size="md" :loading="confirmLoading" :disabled="disabled" @click="$emit('confirm')">
      {{ confirmText }}
    </AppButton>
  </div>
</template>

<style scoped>
.confirm-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-sm);
}
</style>
