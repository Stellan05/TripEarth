/**
 * Globe3D — 全屏交互式 3D 地球
 *
 * 渲染策略：
 *   - 去过国家 → 暖金色填充(78% opacity) + Sunset Orange 轮廓
 *   - 想去国家 → 鼠尾草绿填充(55% opacity) + 柔和绿轮廓
 *   - 用户所在国 → 陶土色填充(85% opacity) 覆盖
 *   - 未去过国家 → 极淡灰色轮廓，无填充
 *   - Hover 国家 → 轮廓加亮 + tooltip 国名
 *   - Click 仅去过/想去国家有效（未去国家不跳转）
 *
 * 一个中国原则：台湾（TWN）映射为 CHN。
 */
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { CountryStatus } from '@/types/country'

const props = defineProps<{
  countryStatuses: CountryStatus[]
  loading?: boolean
  /** 递增时触发已去国家脉冲闪烁 */
  pulseTrigger?: number
}>()

const emit = defineEmits<{
  'country-click': [code: string, status: CountryStatus | null]
  'country-hover': [code: string | null]
  'globe-ready': []
}>()

const containerRef = ref<HTMLElement>()
const internalLoading = ref(true)
const loadError = ref<string | null>(null)

let globe: ReturnType<typeof import('globe.gl').default> | null = null
let ready = false
let destroyed = false
let pulseTimer: ReturnType<typeof setTimeout> | null = null
let pulsePhase = 0 // 0 = 正常, 1 = 脉冲亮, 2 = 脉冲暗

// ===== 状态索引 =====
const statusIdx = ref<Record<string, CountryStatus>>({})
watch(
  () => props.countryStatuses,
  (v) => { const m: Record<string, CountryStatus> = {}; v.forEach(s => { m[s.code.toLowerCase()] = s }); statusIdx.value = m },
  { immediate: true, deep: false },
)

// ===== 一个中国 =====
function norm(iso: string): string { return iso.toUpperCase() === 'TWN' ? 'CHN' : iso }
function gs(iso: string): CountryStatus | undefined { return statusIdx.value[norm(iso).toLowerCase()] }

// ===== 脉冲闪烁状态 =====
let pulseActive = false
let pulseBrightness = 0 // 0~1

type _GF = { properties: { ISO_A3: string; NAME: string } }

function pulseVisitedCountries(g: ReturnType<typeof import('globe.gl').default>) {
  if (pulseTimer) { clearTimeout(pulseTimer); pulseTimer = null }
  pulseActive = true
  pulseBrightness = 1

  // 强制更新颜色
  g.polygonStrokeColor((ff: unknown) => strokeColor(((ff as _GF).properties || {}).ISO_A3 || ''))
  g.polygonCapColor((ff: unknown) => fillColor(((ff as _GF).properties || {}).ISO_A3 || ''))

  // 3 次脉冲（亮→暗→亮→暗→亮→正常），每次 200ms
  const steps = [1, 0.2, 1, 0.2, 1, 0]
  let stepIdx = 0
  function tick() {
    if (stepIdx >= steps.length) {
      pulseActive = false
      pulseBrightness = 0
      g.polygonStrokeColor((ff: unknown) => strokeColor(((ff as _GF).properties || {}).ISO_A3 || ''))
      g.polygonCapColor((ff: unknown) => fillColor(((ff as _GF).properties || {}).ISO_A3 || ''))
      return
    }
    pulseBrightness = steps[stepIdx]
    stepIdx++
    g.polygonStrokeColor((ff: unknown) => strokeColor(((ff as _GF).properties || {}).ISO_A3 || ''))
    g.polygonCapColor((ff: unknown) => fillColor(((ff as _GF).properties || {}).ISO_A3 || ''))
    pulseTimer = setTimeout(tick, 200)
  }
  tick()
}

// ===== 轮廓色 =====
let hoveredCode: string | null = null

// 安全守卫：globe 已销毁时返回默认值，防止 HMR 回调崩溃
function safe(): boolean { return !!globe && ready && !destroyed }

function strokeColor(iso: string): string {
  const s = gs(iso)
  const isHovered = hoveredCode && norm(iso).toLowerCase() === hoveredCode.toLowerCase()

  // Hover 态 — 所有国家都显示高亮
  if (isHovered) {
    if (s?.status === 'visited' || s?.isHome) return '#F08050'
    if (s?.status === 'wishlist') return '#A0D0A0'
    return 'rgba(200, 195, 185, 0.5)'
  }

  if (s && (s.status === 'visited' || s.isHome)) {
    if (pulseActive && pulseBrightness > 0) {
      const r = Math.round(232 + (255 - 232) * pulseBrightness * 0.5)
      const g = Math.round(113 + (255 - 113) * pulseBrightness * 0.5)
      const b = Math.round(74 + (255 - 74) * pulseBrightness * 0.5)
      return `rgba(${r}, ${g}, ${b}, ${0.6 + pulseBrightness * 0.4})`
    }
    return '#E8714A'
  }
  if (s && s.status === 'wishlist') return 'rgba(140, 180, 150, 0.8)'
  return 'rgba(180, 175, 165, 0.15)'
}

// ===== 填充色 — 美丽半透明填充区分国家状态 =====
function fillColor(iso: string): string {
  const s = gs(iso)
  if (!s) return 'rgba(0,0,0,0)' // 未去过 → 透明

  // 用户所在国优先（即使它也在 visited 里）
  if (s.isHome) return 'rgba(219, 215, 215, 0.85)' // 优雅中性灰

  if (s.status === 'visited') {
    const intensity = Math.min(s.visitCount || 1, 8) / 8
    const alpha = 0.45 + intensity * 0.35 // 0.45 ~ 0.80
    // 脉冲时提亮 + 提高透明度
    if (pulseActive && pulseBrightness > 0) {
      const brightR = Math.round(213 + (255 - 213) * pulseBrightness * 0.3)
      const brightG = Math.round(169 + (255 - 169) * pulseBrightness * 0.3)
      const brightB = Math.round(106 + (255 - 106) * pulseBrightness * 0.3)
      return `rgba(${brightR}, ${brightG}, ${brightB}, ${Math.min(alpha + 0.15, 0.9)})`
    }
    return `rgba(213, 169, 106, ${alpha})` // 暖金色
  }

  if (s.status === 'wishlist') return 'rgba(139, 175, 149, 0.55)' // 鼠尾草绿

  return 'rgba(0,0,0,0)'
}

// ===== 海拔 =====
function altitude(): number { return 0.01 }

// ===== 标签 =====
function label(f: Record<string, unknown>): string {
  const props = (f.properties as Record<string, string>) || {}
  const iso = props.ISO_A3 || ''
  if (iso === 'TWN') return 'China'
  return props.NAME || ''
}

// ===== 初始化 =====
async function init() {
  if (!containerRef.value) return
  internalLoading.value = true; loadError.value = null

  try {
    const r = await fetch('/geojson/countries-110m.json')
    if (!r.ok) throw new Error(`GeoJSON: ${r.status}`)
    const raw = await r.json()
    if (!containerRef.value) return; await nextTick()

    const features = (raw as { features: Array<Record<string, unknown>> }).features
    type GF = { properties: { ISO_A3: string; NAME: string } }

    const G = (await import('globe.gl')).default
    const g = G()(containerRef.value)

    g.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')

    g.polygonsData(features)
      .polygonCapColor((f: unknown) => fillColor(((f as GF).properties || {}).ISO_A3 || ''))
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonAltitude(() => altitude())
      .polygonLabel((f: unknown) => label(f as Record<string, unknown>))
      .polygonStrokeColor((f: unknown) => strokeColor(((f as GF).properties || {}).ISO_A3 || ''))
      .polygonsTransitionDuration(200)
      .onPolygonHover((f: unknown | null) => {
        const iso = f ? ((f as GF).properties || {}).ISO_A3 || '' : null
        const niso = iso ? norm(iso) : null
        hoveredCode = niso
        g.polygonStrokeColor((ff: unknown) => strokeColor(((ff as GF).properties || {}).ISO_A3 || ''))
        emit('country-hover', niso || null)
      })
      .onPolygonClick((f: unknown) => {
        const iso = ((f as GF).properties || {}).ISO_A3 || ''
        if (!iso) return
        const status = gs(iso)
        // 仅去过/想去国家可点击，未去国家无响应
        if (!status || (status.status !== 'visited' && status.status !== 'wishlist' && !status.isHome)) return
        // 点击去过国家 → 触发所有去过国家脉冲闪烁
        if (status.status === 'visited' || status.isHome) {
          pulseVisitedCountries(g)
        }
        emit('country-click', norm(iso), status)
      })

    g.controls().autoRotate = true
    g.controls().autoRotateSpeed = 0.25
    g.controls().enableZoom = true
    g.controls().enablePan = false
    g.controls().minDistance = 180
    g.controls().maxDistance = 800
    g.pointOfView({ lat: 25, lng: 30, altitude: 2.2 }, 0)

    const canvas = containerRef.value.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('mouseenter', () => { g.controls().autoRotate = false })
      canvas.addEventListener('mouseleave', () => { g.controls().autoRotate = true })
      canvas.addEventListener('wheel', (e) => {
        if (window.scrollY > 0) e.stopPropagation()
      }, { capture: true, passive: true })
    }

    globe = g; ready = true
    internalLoading.value = false
    emit('globe-ready')
  } catch (e) {
    loadError.value = (e as Error).message || 'Unknown error'
    internalLoading.value = false
  }
}

watch(
  () => props.countryStatuses,
  () => {
    if (!globe || !ready) return
    try {
      globe.polygonStrokeColor((f: unknown) =>
        strokeColor(((f as { properties: { ISO_A3: string } }).properties || {}).ISO_A3 || ''),
      )
      globe.polygonCapColor((f: unknown) =>
        fillColor(((f as { properties: { ISO_A3: string } }).properties || {}).ISO_A3 || ''),
      )
    } catch { /* globe may be disposed during navigation */ }
  },
  { deep: true },
)

// 外部触发脉冲（统计面板点击已去国家触发）
watch(() => props.pulseTrigger, () => {
  if (globe && ready && !destroyed) {
    pulseVisitedCountries(globe as unknown as ReturnType<typeof import('globe.gl').default>)
  }
})

onMounted(init)

onBeforeUnmount(() => {
  if (pulseTimer) clearTimeout(pulseTimer)
  if (globe) {
    try {
      const sc = (globe as unknown as { scene?: () => { traverse: (fn: (c: unknown) => void) => void } }).scene
      if (sc) sc().traverse((c: unknown) => {
        const o = c as { geometry?: { dispose: () => void }; material?: { dispose: () => void } | Array<{ dispose: () => void }> }
        if (o.geometry?.dispose) o.geometry.dispose()
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m?.dispose?.())
          else if (o.material.dispose) o.material.dispose()
        }
      })
      ;(globe as unknown as { _destructor?: () => void })._destructor?.()
    } catch { /* ignore */ }
    globe = null
  }
})
</script>

<template>
  <div ref="containerRef" class="globe-3d" :class="{ 'globe-3d--loading': internalLoading }">
    <div v-if="internalLoading" class="globe-3d__mask">
      <div class="globe-spinner" />
      <p class="body-sm text-secondary" style="margin-top:12px">Loading Earth…</p>
    </div>
    <div v-else-if="loadError" class="globe-3d__mask">
      <AppIcon name="AlertCircle" :size="32" color-class="text-tertiary" />
      <p class="body-md text-secondary" style="margin-top:8px">Failed to load globe</p>
      <p class="body-xs text-tertiary" style="margin-top:4px">{{ loadError }}</p>
      <AppButton variant="secondary" size="sm" style="margin-top:12px" @click="init()">Retry</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import AppButton from '@/components/base/AppButton.vue'
export default { components: { AppIcon, AppButton } }
</script>

<style scoped>
.globe-3d { width: 100%; height: 100%; position: relative; background: var(--color-page); overflow: hidden; }
.globe-3d--loading { display: flex; align-items: center; justify-content: center; }
.globe-3d__mask { position: absolute; inset: 0; z-index: 5; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--color-page); }
.globe-spinner { width: 48px; height: 48px; border-radius: 50%; border: 3px solid var(--text-tertiary); border-top-color: var(--color-sunset); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
:deep(canvas) { display: block; width: 100% !important; height: 100% !important; }
</style>
