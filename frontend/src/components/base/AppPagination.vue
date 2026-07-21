<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    current: number
    total: number
    pageSize?: number
  }>(),
  { pageSize: 20 },
)

const emit = defineEmits<{
  'update:current': [page: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const visiblePages = computed(() => {
  const pages: (number | 'ellipsis')[] = []
  const tp = totalPages.value
  if (tp <= 7) {
    for (let i = 1; i <= tp; i++) pages.push(i)
    return pages
  }
  pages.push(1)
  if (props.current > 3) pages.push('ellipsis')
  for (let i = Math.max(2, props.current - 1); i <= Math.min(tp - 1, props.current + 1); i++) pages.push(i)
  if (props.current < tp - 2) pages.push('ellipsis')
  pages.push(tp)
  return pages
})

import { computed } from 'vue'
</script>

<template>
  <div v-if="totalPages > 1" class="app-pagination">
    <button :disabled="current <= 1" class="app-pagination__btn" @click="$emit('update:current', current - 1)">
      <AppIcon name="ChevronLeft" :size="16" />
    </button>

    <template v-for="p in visiblePages" :key="p">
      <span v-if="p === 'ellipsis'" class="app-pagination__ellipsis">…</span>
      <button
        v-else
        :class="['app-pagination__num', { 'app-pagination__num--active': p === current }]"
        @click="$emit('update:current', p)"
      >{{ p }}</button>
    </template>

    <button :disabled="current >= totalPages" class="app-pagination__btn" @click="$emit('update:current', current + 1)">
      <AppIcon name="ChevronRight" :size="16" />
    </button>
  </div>
</template>

<script lang="ts">
import AppIcon from './AppIcon.vue'
export default { components: { AppIcon } }
</script>

<style scoped>
.app-pagination {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.app-pagination__btn,
.app-pagination__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: var(--color-card);
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.app-pagination__btn:hover:not(:disabled),
.app-pagination__num:hover { background: var(--color-card-hover); color: var(--text-primary); }

.app-pagination__num--active {
  background: var(--color-sunset);
  color: var(--text-inverse);
  border-color: var(--color-sunset);
}
.app-pagination__num--active:hover { background: var(--color-sunset-glow); color: var(--text-inverse); }

.app-pagination__btn:disabled { opacity: 0.3; cursor: not-allowed; }

.app-pagination__ellipsis {
  width: 36px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: var(--text-body-sm);
}
</style>
