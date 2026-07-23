/**
 * 应用全局状态 — 主题、全局加载
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ViewMode = 'global' | 'local'

export const useAppStore = defineStore('app', () => {
  const theme = ref<'light' | 'dark'>('light')
  const loading = ref(false)
  const viewMode = ref<ViewMode>('global')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.body.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  function initTheme() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
      theme.value = saved
      document.body.setAttribute('data-theme', saved)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
    // 确保 DOM 与当前 theme 值同步
    document.body.setAttribute('data-theme', theme.value)
  }

  function setViewMode(mode: ViewMode) {
    viewMode.value = mode
  }

  return { theme, loading, viewMode, toggleTheme, initTheme, setViewMode }
})
