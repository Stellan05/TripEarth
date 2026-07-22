<script setup lang="ts">
/**
 * CategoryToggle — Countries / Cities 分类切换
 * 基于 TagGroup 实现，multiple=false
 */
import TagGroup from '@/components/shared/TagGroup.vue'
import type { TagItem } from '@/components/shared/TagGroup.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    activeColor?: 'sunset' | 'forest'
  }>(),
  { activeColor: 'forest' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const items: TagItem[] = [
  { label: 'Countries', value: 'countries' },
  { label: 'Cities', value: 'cities' },
]

function onChange(val: string | number | (string | number)[]) {
  const v = val as string
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <div class="category-toggle">
    <TagGroup
      :items="items"
      :model-value="modelValue"
      :multiple="false"
      :active-color="activeColor"
      chip-variant="pill"
      size="md"
      @change="onChange"
    />
  </div>
</template>

<style scoped>
.category-toggle {
  display: flex;
}
</style>
