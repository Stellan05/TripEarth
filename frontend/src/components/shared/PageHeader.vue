<script setup lang="ts">
/**
 * PageHeader — 页面标题区域
 * BackLink + Newsreader 标题 + Inter 副标题 + meta 插槽
 */
import BackLink from '@/components/shared/BackLink.vue'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    backLabel?: string
    backTo?: string
    titleTag?: 'h1' | 'h2'
    titleSize?: 'display-lg' | 'display-md'
  }>(),
  { titleTag: 'h1', titleSize: 'display-lg' },
)
</script>

<template>
  <header class="page-header">
    <BackLink v-if="backLabel" :label="backLabel" :to="backTo" />
    <component :is="titleTag" class="page-header__title" :class="`text-${titleSize}`">
      {{ title }}
    </component>
    <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    <div v-if="$slots.meta" class="page-header__meta">
      <slot name="meta" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.page-header__title {
  font-family: var(--font-display);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}

.text-display-lg {
  font-size: var(--text-display-lg);
  line-height: var(--leading-snug);
}

.text-display-md {
  font-size: var(--text-display-md);
  line-height: var(--leading-snug);
}

.page-header__subtitle {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-secondary);
  margin: 0;
}

.page-header__meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-top: var(--space-xs);
}
</style>
