<script setup lang="ts">
/**
 * FullBleedLayout — 全屏铺满布局
 * 用途: GlobeHome（3D 地球全屏沉浸，v0.2）
 * 注入临时样式使 html/body 全屏无滚动。
 */
import { onMounted, onBeforeUnmount } from 'vue'

let styleEl: HTMLStyleElement | null = null

onMounted(() => {
  styleEl = document.createElement('style')
  styleEl.textContent = 'html,body,#app{width:100%;height:100%}'
  document.head.appendChild(styleEl)
})

onBeforeUnmount(() => {
  if (styleEl) {
    document.head.removeChild(styleEl)
    styleEl = null
  }
})
</script>

<template>
  <div class="full-bleed">
    <slot />
  </div>
</template>

<style scoped>
.full-bleed {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
