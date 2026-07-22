/**
 * App.vue — Application Shell
 *
 * 全局挂载：
 *   - NavPill（顶部浮动导航，所有页面共享）
 *   - Toast（全局通知）
 *   - 页面过渡动画（Vue Router transition）
 */
<script setup lang="ts">
import { computed, ref } from 'vue'
import NavPill from '@/components/layout/NavPill.vue'
import type { NavItem } from '@/components/layout/NavPill.vue'
import Toast from '@/components/base/Toast.vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const navItems = computed<NavItem[]>(() => [
  { label: t('nav.globe'), icon: 'Globe', route: '/' },
  { label: t('nav.timeline'), icon: 'Clock', route: '/timeline' },
  { label: t('nav.wishlist'), icon: 'Bookmark', route: '/wishlist' },
  { label: t('nav.newTrip'), icon: 'Plus', route: '/trip/new' },
])
</script>

<template>
  <NavPill :items="navItems" />

  <router-view v-slot="{ Component, route: r }">
    <transition name="page-slide" mode="out-in">
      <component :is="Component" :key="r.path" />
    </transition>
  </router-view>

  <Toast />
</template>

<style>
/* 页面过渡动画 */
.page-slide-enter-active {
  animation: page-enter 300ms var(--ease-out);
}

.page-slide-leave-active {
  animation: page-leave 200ms var(--ease-in);
}

@keyframes page-enter {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes page-leave {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-8px); }
}
</style>
