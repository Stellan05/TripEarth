<script setup lang="ts">
/**
 * 新增/编辑旅行页
 * 设计规范：design.md §13
 *
 * 组件层级：
 *   TripEditor
 *   ├── FormHeader（返回、标题）
 *   ├── TripForm（国家、城市、日期、标题）
 *   ├── RouteEditor（城市连线 + 交通方式选择）
 *   ├── PhotoUpload（拖拽上传区域）
 *   └── FlightEditor（航班信息表单）
 */
</script>

<template>
  <div class="page trip-editor">
    <h1 class="display-lg">Trip Editor</h1>
  </div>
</template>

<style scoped>
.trip-editor {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
