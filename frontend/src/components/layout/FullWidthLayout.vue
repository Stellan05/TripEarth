<script setup lang="ts">
/**
 * FullWidthLayout — 全宽列表布局
 * 用途: Timeline (v0.2)
 * Slots: header, default (内容区，居中 + max-width)
 */
withDefaults(
  defineProps<{
    contentMaxWidth?: string
  }>(),
  {
    contentMaxWidth: 'var(--content-max-width, 1280px)',
  },
)
</script>

<template>
  <div class="full-width">
    <header v-if="$slots.header" class="full-width__header">
      <slot name="header" />
    </header>

    <main class="full-width__content" :style="{ maxWidth: contentMaxWidth }">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.full-width {
  min-height: 100vh;
  padding: var(--page-padding);
  padding-top: calc(var(--page-padding) + 60px);
}

.full-width__header {
  max-width: var(--content-max-width, 1280px);
  margin: 0 auto var(--space-2xl);
}

.full-width__content {
  margin: 0 auto;
}
</style>
