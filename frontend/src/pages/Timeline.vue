<script setup lang="ts">
/**
 * 时间轴页
 * 设计规范：design.md §8 & §13
 *
 * 组件层级：
 *   Timeline
 *   ├── YearFilter（年份筛选 Pill 组）
 *   ├── TimelineList（垂直滚动列表）
 *   │   └── YearGroup ×N
 *   │       ├── YearLabel（年份大标题）
 *   │       └── TripCard ×N（时间线卡片）
 *   ├── TimelineLine（左侧竖线 + 圆点）
 *   └── ScrollProgress（滚动进度指示）
 */
</script>

<template>
  <div class="page timeline-page">
    <h1 class="display-lg">Timeline</h1>
  </div>
</template>

<style scoped>
.timeline-page {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
