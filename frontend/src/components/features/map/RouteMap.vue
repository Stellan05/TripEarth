/**
 * RouteMap — 旅行路线 Leaflet 地图组件
 *
 * 显示城市标记 + 路线段 + 照片位置标记。
 * 支持按天筛选：选中某天时高亮对应照片位置并淡化其他标记。
 */
<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import L from 'leaflet'
import { useMap } from '@/composables/useMap'
import { createCityLabelMarker } from './CityMarker'
import { createRouteLine } from './RouteLine'
import { ROUTE_COLORS } from '@/utils/colors'
import type { TripCity, TripRoute, Flight } from '@/types/trip'
import type { TransportType } from '@/types/common'

export interface PhotoLocation {
  id: number
  lat: number
  lng: number
  caption?: string
  dayIndex: number
}

const props = withDefaults(
  defineProps<{
    cities: TripCity[]
    routes: TripRoute[]
    flights?: Flight[]
    photoLocations?: PhotoLocation[]
    activeDay?: number
    loading?: boolean
  }>(),
  { flights: () => [], photoLocations: () => [], activeDay: -1, loading: false },
)

const emit = defineEmits<{
  'route-hover': [route: TripRoute | null]
  'city-click': [city: TripCity]
}>()

const { map, containerRef, init, fitToBounds } = useMap()

const internalLoading = ref(true)
const stateError = ref<string | null>(null)
const showLoading = computed(() => props.loading || internalLoading.value)

let cityLayer: L.LayerGroup | null = null
let routeLayer: L.LayerGroup | null = null
let iconLayer: L.LayerGroup | null = null
let photoLayer: L.LayerGroup | null = null

function getCityLatLng(name: string): [number, number] | null {
  const city = props.cities.find((c) => c.name === name)
  return city ? [city.lat, city.lng] : null
}

function createTransportIcon(type: TransportType): L.DivIcon {
  const label: Record<TransportType, string> = {
    FLIGHT: '✈', TRAIN: '🚆', CAR: '🚗', OTHER: '⇢',
  }
  const color = ROUTE_COLORS[type] || '#999CA6'
  const icon = label[type]
  return L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:white;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:11px;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,0.2);cursor:default;">${icon}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

/** 照片位置标记 — 相机图标风格 + 醒目配色 */
function createPhotoMarker(
  lat: number, lng: number, caption: string | undefined, isActive: boolean,
): L.Marker {
  const color = isActive ? '#E8714A' : '#bbb'
  const opacity = isActive ? 1 : 0.3
  const scale = isActive ? 1 : 0.7

  const icon = L.divIcon({
    className: 'photo-marker',
    html: `<div style="
      width:28px;height:28px;
      border-radius:50%;
      background:white;
      border:2px solid ${color};
      display:flex;align-items:center;justify-content:center;
      font-size:13px;
      box-shadow:0 2px 6px rgba(0,0,0,0.18);
      opacity:${opacity};
      transform:scale(${scale});
      transition:all 400ms var(--ease-spring);
      cursor:pointer;
    ">📷</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })

  const marker = L.marker([lat, lng], { icon })
  if (caption) {
    marker.bindTooltip(caption, { direction: 'top', offset: L.point(0, -12) })
  }
  return marker
}

function renderLayers() {
  if (!map.value) return

  cityLayer?.clearLayers()
  routeLayer?.clearLayers()
  iconLayer?.clearLayers()
  photoLayer?.clearLayers()

  if (!cityLayer) cityLayer = L.layerGroup().addTo(map.value)
  if (!routeLayer) routeLayer = L.layerGroup().addTo(map.value)
  if (!iconLayer) iconLayer = L.layerGroup().addTo(map.value)
  if (!photoLayer) photoLayer = L.layerGroup().addTo(map.value)

  // --- City markers ---
  for (const city of props.cities) {
    const m = createCityLabelMarker(city.lat, city.lng, city.name)
    m.addTo(cityLayer)
    m.on('click', () => emit('city-click', city))
  }

  // --- Route lines ---
  for (const route of props.routes) {
    const from = getCityLatLng(route.fromCityName)
    const to = getCityLatLng(route.toCityName)
    if (!from || !to) continue

    const line = createRouteLine(from, to, { transportType: route.transportType })
    line.addTo(routeLayer)

    const origWeight = (line.options.weight as number) || 2
    line.on('mouseover', () => { line.setStyle({ weight: 4 }); emit('route-hover', route) })
    line.on('mouseout', () => { line.setStyle({ weight: origWeight }); emit('route-hover', null) })

    const midLat = (from[0] + to[0]) / 2
    const midLng = (from[1] + to[1]) / 2
    const iconMarker = L.marker([midLat, midLng], {
      icon: createTransportIcon(route.transportType),
      interactive: false,
    })
    iconLayer.addLayer(iconMarker)
  }

  // --- Photo location markers ---
  for (const photo of props.photoLocations) {
    const isActive = props.activeDay === -1 || photo.dayIndex === props.activeDay
    const m = createPhotoMarker(photo.lat, photo.lng, photo.caption, isActive)
    m.addTo(photoLayer)
  }

  // --- Fit bounds ---
  const cityLatlngs = props.cities.map((c) => [c.lat, c.lng] as [number, number])
  const photoLatlngs = props.photoLocations
    .filter(p => props.activeDay === -1 || p.dayIndex === props.activeDay)
    .map(p => [p.lat, p.lng] as [number, number])
  const allLatlngs = [...cityLatlngs, ...photoLatlngs]
  if (allLatlngs.length) {
    fitToBounds(allLatlngs, 60)
  }
}

function ensureSize() {
  if (map.value) map.value.invalidateSize()
}

onMounted(() => {
  try {
    init({ scrollWheelZoom: false })
    if (props.cities.length || props.photoLocations.length) {
      renderLayers()
    }
    nextTick(() => ensureSize())
    setTimeout(() => ensureSize(), 300)
  } catch (e) {
    stateError.value = (e as Error).message || 'Failed to initialize map'
  } finally {
    internalLoading.value = false
  }
})

watch(
  () => [props.cities, props.routes, props.photoLocations],
  () => { if (map.value) renderLayers() },
  { deep: false },
)

watch(
  () => props.activeDay,
  () => { if (map.value) renderLayers() },
)
</script>

<template>
  <div class="route-map">
    <div ref="containerRef" class="route-map__container" />

    <div v-if="showLoading" class="route-map__overlay">
      <div class="route-map__skeleton" />
    </div>

    <div v-else-if="stateError" class="route-map__overlay route-map__overlay--info">
      <p class="body-sm text-tertiary">Failed to load map</p>
      <p class="body-xs text-tertiary" style="margin-top: 4px">{{ stateError }}</p>
    </div>

    <div v-else-if="!cities.length && !photoLocations.length" class="route-map__overlay route-map__overlay--info">
      <p class="body-sm text-tertiary">No cities to display</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-marker {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(1.4); }
}

@keyframes photo-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(1.6); }
}

.route-map {
  position: relative;
  width: 100%;
  height: 420px;
  border-radius: var(--radius-md);
  overflow: hidden;
  z-index: 1;
}

.route-map__container { width: 100%; height: 100%; }

.route-map__overlay {
  position: absolute; inset: 0; z-index: 5;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  pointer-events: none;
}

.route-map__overlay--info { background: var(--color-card); }

.route-map__skeleton {
  width: 100%; height: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

:deep(.leaflet-marker-pane) { z-index: 5 !important; }
</style>
