/**
 * ViewModeToggle — 右上角模式切换按钮
 *
 * 在 Global（3D 地球）与 Local（平面地图）之间切换。
 * 支持 hover tooltip 提示当前模式及可切换的目标模式。
 */
<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/base/AppIcon.vue'
import { useAppStore } from '@/stores/appStore'
import { useI18n } from '@/composables/useI18n'

const appStore = useAppStore()
const { t } = useI18n()

const isGlobal = computed(() => appStore.viewMode === 'global')

function toggle() {
  appStore.setViewMode(isGlobal.value ? 'local' : 'global')
}
</script>

<template>
  <button
    class="view-mode-toggle"
    :title="isGlobal ? t('home.switchToLocal') : t('home.switchToGlobal')"
    @click="toggle"
  >
    <span class="view-mode-toggle__icon">
      <AppIcon :name="isGlobal ? 'Map' : 'Globe'" :size="18" />
    </span>
    <span class="view-mode-toggle__label">
      {{ isGlobal ? t('home.local') : t('home.global') }}
    </span>
  </button>
</template>

<style scoped>
.view-mode-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--radius-full);
  background: var(--color-card);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-default);
  white-space: nowrap;
}

.view-mode-toggle:hover {
  color: var(--text-primary);
  border-color: rgba(59, 126, 199, 0.3);
  box-shadow: 0 2px 8px rgba(59, 126, 199, 0.1);
}

.view-mode-toggle__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-ocean);
}

.view-mode-toggle__label {
  font-size: var(--text-body-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
