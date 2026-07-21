<script setup lang="ts">
/**
 * ContextGlobe — 右下角小地球（80×80）
 * 用途: CountryDetail / TripDetail 页面右下角，高亮当前国家位置
 *
 * Props:
 *   - countryCode: 要聚焦的国家 ISO_A3 代码
 *   - size:         地球尺寸（默认 80）
 *
 * 注意:
 *   Phase 6 仅实现组件壳 + 占位渲染，完整 3D 小地球在 CountryDetail 页面开发时完善。
 *   占位显示：圆形容器 + 当前国家代码 + 暖色背景。
 */

withDefaults(
  defineProps<{
    countryCode?: string
    size?: number
  }>(),
  { size: 80 },
)
</script>

<template>
  <div
    class="context-globe"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :aria-label="`Globe centered on ${countryCode || 'unknown'}`"
  >
    <span class="context-globe__dot" />
    <span v-if="countryCode" class="context-globe__label body-xs">{{ countryCode }}</span>
  </div>
</template>

<style scoped>
.context-globe {
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, var(--map-water, #E8EDF2), var(--map-water-dark, #D0D8E3));
  box-shadow: var(--shadow-card);
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.context-globe__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-sunset);
  position: absolute;
  top: 30%;
  left: 45%;
  box-shadow: 0 0 6px var(--color-sunset-glow);
  animation: pulse-glow 2s infinite;
}

.context-globe__label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-secondary);
  margin-top: 22px;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(1.5); }
}
</style>
