import { ref, onUnmounted } from 'vue'

/** 数字滚动动画 — 从旧值滚到新值 */
export function useOdometer(duration = 400) {
  const displayValue = ref(0)
  let rafId: number | null = null

  function animate(from: number, to: number) {
    if (rafId !== null) cancelAnimationFrame(rafId)

    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      // ease-out 缓动
      const eased = 1 - (1 - progress) * (1 - progress) * (1 - progress)

      displayValue.value = Math.round(from + (to - from) * eased)

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  function rollTo(target: number) {
    animate(displayValue.value, target)
  }

  function reset() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    displayValue.value = 0
  }

  onUnmounted(reset)

  return { displayValue, rollTo, reset }
}
