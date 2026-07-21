import { computed, ref, watch } from 'vue'

const THEME_KEY = 'travel-atlas-theme'

export type Theme = 'light' | 'dark'

const currentTheme = ref<Theme>(loadTheme())
let initialized = false
let mediaQuery: MediaQueryList | null = null

function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch { /* localStorage blocked */ }

  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    return mq.matches ? 'dark' : 'light'
  }

  return 'light'
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark')
  } else {
    root.removeAttribute('data-theme')
  }
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch { /* quota exceeded */ }
}

/** 使用主题 — 应用级别调用一次即可 */
export function useTheme() {
  if (!initialized) {
    initialized = true
    applyTheme(currentTheme.value)

    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored) return // 用户手动设置过，不跟随系统
      currentTheme.value = e.matches ? 'dark' : 'light'
    })
  }

  const isDark = computed(() => currentTheme.value === 'dark')

  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(theme: Theme) {
    currentTheme.value = theme
  }

  watch(currentTheme, applyTheme)

  return { currentTheme, isDark, toggleTheme, setTheme }
}
