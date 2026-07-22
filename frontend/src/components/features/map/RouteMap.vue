<script setup lang="ts">
/**
 * RouteMap — 旅行路线 Leaflet 地图组件
 *
 * 显示城市标记 + 路线段（按交通方式分色） + 中点交通图标。
 * Hover 路线时线宽 2px → 4px 并 emit route-hover。
 *
 * Props:
 *   - cities:  TripCity[]   — 途经城市（含经纬度）
 *   - routes:  TripRoute[]  — 路线段（含交通方式）
 *   - flights: Flight[]     — 航班详情（预留）
 *   - loading: 父级数据加载中
 *
 * Emits:
 *   - route-hover(route | null) — 鼠标悬停/离开路线
 *   - city-click(city)          — 点击城市标记
 */
import { ref, computed, watch, onMounted } from 'vue'
import L from 'leaflet'
import { useMap } from '@/composables/useMap'
import { createCityLabelMarker } from './CityMarker'
import { createRouteLine } from './RouteLine'
import { ROUTE_COLORS } from '@/utils/colors'
import type { TripCity, TripRoute, Flight } from '@/types/trip'
import type { TransportType } from '@/types/common'

const props = withDefaults(
  defineProps<{
    cities: TripCity[]
    routes: TripRoute[]
    flights?: Flight[]
    loading?: boolean
  }>(),
  { flights: () => [], loading: false },
)

const emit = defineEmits<{
  'route-hover': [route: TripRoute | null]
  'city-click': [city: TripCity]
}>()

const { map, containerRef, init, fitToBounds } = useMap()

// -------------------------------------------
// State
// -------------------------------------------
const internalLoading = ref(true)
const stateError = ref<string | null>(null)
const showLoading = computed(() => props.loading || internalLoading.value)

let cityLayer: L.LayerGroup | null = null
let routeLayer: L.LayerGroup | null = null
let iconLayer: L.LayerGroup | null = null

// -------------------------------------------
// Helpers
// -------------------------------------------
function getCityLatLng(name: string): [number, number] | null {
  const city = props.cities.find((c) => c.name === name)
  return city ? [city.lat, city.lng] : null
}

/** 根据交通方式生成中点图标（DivIcon） */
function createTransportIcon(type: TransportType): L.DivIcon {
  const label: Record<TransportType, string> = {
    FLIGHT: '✈',
    TRAIN: '🚆',
    CAR: '🚗',
    OTHER: '⇢',
  }
  const color = ROUTE_COLORS[type] || '#999CA6'
  const icon = label[type]

  return L.divIcon({
    className: '',
    html: `<div style="
      width:24px;height:24px;border-radius:50%;
      background:white;border:2px solid ${color};
      display:flex;align-items:center;justify-content:center;
      font-size:11px;line-height:1;
      box-shadow:0 1px 3px rgba(0,0,0,0.2);
      cursor:default;
    ">${icon}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

// -------------------------------------------
// Render
// -------------------------------------------
function renderLayers() {
  if (!map.value) return

  // Clear all layers
  cityLayer?.clearLayers()
  routeLayer?.clearLayers()
  iconLayer?.clearLayers()

  // Init layer groups
  if (!cityLayer) cityLayer = L.layerGroup().addTo(map.value)
  if (!routeLayer) routeLayer = L.layerGroup().addTo(map.value)
  if (!iconLayer) iconLayer = L.layerGroup().addTo(map.value)

  // --- City markers ---
  for (const city of props.cities) {
    const m = createCityLabelMarker(city.lat, city.lng, city.name)
    m.addTo(cityLayer)
    m.on('click', () => emit('city-click', city))
  }

  // --- Route lines with hover ---
  for (const route of props.routes) {
    const from = getCityLatLng(route.fromCityName)
    const to = getCityLatLng(route.toCityName)
    if (!from || !to) continue

    const line = createRouteLine(from, to, {
      transportType: route.transportType,
    })
    line.addTo(routeLayer)

    const origWeight = (line.options.weight as number) || 2
    line.on('mouseover', () => {
      line.setStyle({ weight: 4 })
      emit('route-hover', route)
    })
    line.on('mouseout', () => {
      line.setStyle({ weight: origWeight })
      emit('route-hover', null)
    })

    // Midpoint transport icon
    const midLat = (from[0] + to[0]) / 2
    const midLng = (from[1] + to[1]) / 2
    const iconMarker = L.marker([midLat, midLng], {
      icon: createTransportIcon(route.transportType),
      interactive: false,
    })
    iconLayer.addLayer(iconMarker)
  }

  // --- Fit bounds ---
  const latlngs = props.cities.map((c) => [c.lat, c.lng] as [number, number])
  if (latlngs.length) {
    fitToBounds(latlngs, 60)
  }
}

// -------------------------------------------
// Lifecycle
// -------------------------------------------
onMounted(() => {
  try {
    init({ scrollWheelZoom: false })

    if (props.cities.length) {
      renderLayers()
    }
  } catch (e) {
    stateError.value = (e as Error).message || 'Failed to initialize map'
  } finally {
    internalLoading.value = false
  }
})

watch(
  () => props.cities,
  () => {
    if (map.value) renderLayers()
  },
  { deep: false },
)
</script>

<template>
  <div class="route-map">
    <!-- Map container — always rendered so Leaflet can init -->
    <div ref="containerRef" class="route-map__container" />

    <!-- Loading overlay -->
    <div v-if="showLoading" class="route-map__overlay">
      <div class="route-map__skeleton" />
    </div>

    <!-- Error overlay -->
    <div v-else-if="stateError" class="route-map__overlay route-map__overlay--info">
      <p class="body-sm text-tertiary">Failed to load map</p>
      <p class="body-xs text-tertiary" style="margin-top: 4px">{{ stateError }}</p>
    </div>

    <!-- Empty overlay -->
    <div
      v-else-if="!cities.length"
      class="route-map__overlay route-map__overlay--info"
    >
      <p class="body-sm text-tertiary">No cities to display</p>
    </div>
  </div>
</template>

<style scoped>
/* pulse-marker 全局动画 — 与 CityMarker 共享 */
@keyframes pulse-marker {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.4);
  }
}

.route-map {
  position: relative;
  width: 100%;
  height: 420px;
  border-radius: var(--radius-md);
  overflow: hidden;
  z-index: 1;
}

.route-map__container {
  width: 100%;
  height: 100%;
}

.route-map__overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.route-map__overlay--info {
  background: var(--color-card);
}

.route-map__skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.04) 25%,
    rgba(0, 0, 0, 0.08) 50%,
    rgba(0, 0, 0, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Ensure Leaflet panes don't overlap navigation */
:deep(.leaflet-pane) {
  z-index: 2;
}
</style>
