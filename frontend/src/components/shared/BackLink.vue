<script setup lang="ts">
/**
 * BackLink — 返回导航
 * ← 箭头 + 文字。未传 to 时调用 router.back()
 */
import { useRouter } from 'vue-router'
import AppIcon from '@/components/base/AppIcon.vue'

const props = withDefaults(
  defineProps<{
    to?: string
    label?: string
  }>(),
  { label: 'Back' },
)

const router = useRouter()

function onClick() {
  if (props.to) {
    router.push(props.to)
  } else {
    router.back()
  }
}
</script>

<template>
  <button class="back-link" @click="onClick">
    <AppIcon name="ArrowLeft" :size="16" color-class="" />
    <span class="back-link__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-default);
}

.back-link:hover {
  color: var(--text-primary);
  background: var(--color-card-hover);
}
</style>
