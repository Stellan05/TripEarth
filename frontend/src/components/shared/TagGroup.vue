<script setup lang="ts">
/**
 * TagGroup — 水平 Chip 组
 * 统一管理 active 态切换，支持单选/多选
 */
import AppChip from '@/components/base/AppChip.vue'

export interface TagItem {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    items: TagItem[]
    modelValue: string | number | (string | number)[]
    multiple?: boolean
    size?: 'sm' | 'md'
    activeColor?: 'sunset' | 'forest'
    chipVariant?: 'default' | 'pill'
  }>(),
  { multiple: false, size: 'md', activeColor: 'sunset', chipVariant: 'default' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]]
  change: [value: string | number | (string | number)[]]
}>()

function isSelected(item: TagItem): boolean {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(item.value)
  }
  return props.modelValue === item.value
}

function select(item: TagItem) {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const next = props.modelValue.includes(item.value)
      ? props.modelValue.filter((v) => v !== item.value)
      : [...props.modelValue, item.value]
    emit('update:modelValue', next)
    emit('change', next)
  } else {
    const next = props.modelValue === item.value ? '' : item.value
    emit('update:modelValue', next)
    emit('change', next)
  }
}
</script>

<template>
  <div class="tag-group" role="group">
    <AppChip
      v-for="item in items"
      :key="item.value"
      :variant="isSelected(item) ? 'active' : chipVariant"
      :active-color="activeColor"
      :size="size"
      :clickable="true"
      @click="select(item)"
    >
      {{ item.label }}
    </AppChip>
  </div>
</template>

<style scoped>
.tag-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
}
</style>
