<script setup lang="ts">
/**
 * YearFilter — 年份筛选 Pill 组
 *
 * Props:
 *   years: 可选年份列表
 *   modelValue: 当前选中的年份 (null = All)
 * Events:
 *   @update:modelValue, @change
 *
 * 基于 TagGroup from '@/components/shared/TagGroup.vue'
 * 第一项 "All"，后面按年份排序（降序）
 */
import { computed } from 'vue'
import TagGroup from '@/components/shared/TagGroup.vue'
import type { TagItem } from '@/components/shared/TagGroup.vue'

const props = withDefaults(
  defineProps<{
    years: number[]
    modelValue: number | null
  }>(),
  {},
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  change: [value: number | null]
}>()

const items = computed<TagItem[]>(() => [
  { label: 'All', value: 'all' },
  ...props.years
    .slice()
    .sort((a, b) => b - a)
    .map((y) => ({ label: String(y), value: String(y) })),
])

function onChange(val: string | number | (string | number)[]) {
  const v = val as string
  if (v === 'all') {
    emit('update:modelValue', null)
    emit('change', null)
  } else {
    const year = Number(v)
    emit('update:modelValue', year)
    emit('change', year)
  }
}
</script>

<template>
  <div class="year-filter">
    <TagGroup
      :items="items"
      :model-value="modelValue === null ? 'all' : String(modelValue)"
      :multiple="false"
      active-color="sunset"
      chip-variant="pill"
      size="md"
      @change="onChange"
    />
  </div>
</template>

<style scoped>
.year-filter {
  display: flex;
}
</style>
