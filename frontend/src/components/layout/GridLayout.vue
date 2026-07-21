<script setup lang="ts">
/**
 * GridLayout — 网格布局
 * 用途: Wishlist (3 列目的地卡片网格)
 * Props: cols (列数), gap (间距)
 * Slots: header, default (网格内容)
 */
withDefaults(
  defineProps<{
    cols?: number
    gap?: string
  }>(),
  {
    cols: 3,
    gap: 'var(--card-gap, 20px)',
  },
)
</script>

<template>
  <div class="grid-layout">
    <header v-if="$slots.header" class="grid-layout__header">
      <slot name="header" />
    </header>

    <main
      class="grid-layout__grid"
      :style="{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
      }"
    >
      <slot />
    </main>
  </div>
</template>

<style scoped>
.grid-layout {
  min-height: 100vh;
  padding: var(--page-padding);
  padding-top: calc(var(--page-padding) + 60px);
}

.grid-layout__header {
  max-width: var(--content-max-width, 1280px);
  margin: 0 auto var(--space-2xl);
}

.grid-layout__grid {
  display: grid;
  max-width: var(--content-max-width, 1280px);
  margin: 0 auto;
}
</style>
