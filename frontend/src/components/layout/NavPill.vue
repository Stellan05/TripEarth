<script setup lang="ts">
/**
 * NavPill — 顶部居中浮动导航
 * Props: items = [{ label, icon, route, activeColor? }]
 * 自动从 router.currentRoute 判断 active 态
 */
import { useRouter, useRoute } from 'vue-router'
import AppIcon from '@/components/base/AppIcon.vue'

export interface NavItem {
  label: string
  icon: string
  route: string
  activeColor?: 'sunset' | 'forest'
}

const props = withDefaults(
  defineProps<{
    items: NavItem[]
  }>(),
  {},
)

const router = useRouter()
const route = useRoute()

function isActive(item: NavItem): boolean {
  if (item.route === '/') return route.path === '/'
  return route.path.startsWith(item.route)
}

function navigate(item: NavItem) {
  router.push(item.route)
}
</script>

<template>
  <nav class="nav-pill" aria-label="Main navigation">
    <button
      v-for="item in items"
      :key="item.route"
      :class="[
        'nav-pill__item',
        {
          'nav-pill__item--active': isActive(item),
          [`nav-pill__item--active-${item.activeColor || 'sunset'}`]: isActive(item),
        },
      ]"
      @click="navigate(item)"
    >
      <AppIcon :name="item.icon" :size="18" />
      <span class="nav-pill__label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.nav-pill {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-sticky, 200);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: var(--radius-full);
  background: var(--color-card);
  box-shadow: var(--shadow-card);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.nav-pill__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  white-space: nowrap;
}

.nav-pill__item:hover { color: var(--text-primary); }

.nav-pill__item--active-sunset {
  background: rgba(232, 113, 74, 0.1);
  color: var(--color-sunset);
  border: 0.5px solid rgba(232, 113, 74, 0.4);
}

.nav-pill__item--active-forest {
  background: rgba(74, 156, 124, 0.1);
  color: var(--color-forest);
  border: 0.5px solid rgba(74, 156, 124, 0.4);
}

.nav-pill__label {
  font-size: var(--text-body-sm);
}
</style>
