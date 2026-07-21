<script setup lang="ts">
/**
 * TwoColumnLayout — 双列布局
 * 用途: CountryDetail (7:5), TripDetail (7:5)
 * 左列可选 sticky（地图固定），右列 scrollable
 */
withDefaults(
  defineProps<{
    leftCols?: number
    rightCols?: number
    gap?: string
    leftSticky?: boolean
  }>(),
  {
    leftCols: 7,
    rightCols: 5,
    gap: 'var(--card-gap, 20px)',
    leftSticky: true,
  },
)
</script>

<template>
  <div
    class="two-col"
    :style="{
      gridTemplateColumns: `${leftCols}fr ${rightCols}fr`,
      gap,
    }"
  >
    <div class="two-col__left" :class="{ 'two-col__left--sticky': leftSticky }">
      <slot name="left" />
    </div>
    <div class="two-col__right">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.two-col {
  display: grid;
  max-width: var(--content-max-width, 1280px);
  margin: 0 auto;
  padding: var(--page-padding);
  min-height: 100vh;
}

.two-col__left--sticky {
  position: sticky;
  top: calc(var(--page-padding) + 60px); /* NavPill height + offset */
  align-self: start;
  max-height: calc(100vh - var(--page-padding) * 2 - 60px);
}

.two-col__right {
  min-width: 0;
}
</style>
