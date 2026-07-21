<script setup lang="ts">
/**
 * AppIcon — 全站图标统一入口
 *
 * 规则：项目中禁止直接 import 'lucide-vue-next'。
 *       所有图标必须通过此组件使用。
 *       未来切换图标库只需改这一个文件。
 */
import * as LucideIcons from 'lucide-vue-next'
import type { FunctionalComponent, SVGAttributes } from 'vue'

type LucideIcon = FunctionalComponent<SVGAttributes>

const props = withDefaults(
  defineProps<{
    /** Lucide 图标名 */
    name: string
    /** 图标尺寸 */
    size?: 16 | 20 | 24 | 32
    /** 颜色（使用 text-* utility class 或 CSS var） */
    colorClass?: string
    /** Stroke 宽度 */
    strokeWidth?: number
  }>(),
  {
    size: 20,
    colorClass: '',
    strokeWidth: 2,
  },
)

const icons = LucideIcons as Record<string, LucideIcon>
const IconComponent = icons[props.name] as LucideIcon | undefined
</script>

<template>
  <component
    :is="IconComponent"
    v-if="IconComponent"
    :size="size"
    :stroke-width="strokeWidth"
    :class="colorClass"
    class="app-icon"
  />
  <span v-else class="app-icon--missing" :style="{ width: `${size}px`, height: `${size}px` }" />
</template>

<style scoped>
.app-icon {
  flex-shrink: 0;
  display: block;
}

.app-icon--missing {
  display: inline-block;
  border-radius: 2px;
  background: var(--text-tertiary);
  opacity: 0.3;
}
</style>
