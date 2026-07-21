import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

const ICON_MAP: Record<ToastType, string> = {
  success: 'CheckCircle2',
  error: 'AlertCircle',
  info: 'Info',
}

const DURATION = 3000

/** Toast 全局通知 — 可在任何组件中调用 */
export function useToast() {
  function show(message: string, type: ToastType = 'info') {
    const id = nextId++
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      dismiss(id)
    }, DURATION)
  }

  function dismiss(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      toasts.value.splice(idx, 1)
    }
  }

  function success(message: string) {
    show(message, 'success')
  }

  function error(message: string) {
    show(message, 'error')
  }

  function info(message: string) {
    show(message, 'info')
  }

  return { toasts, show, dismiss, success, error, info, ICON_MAP }
}
