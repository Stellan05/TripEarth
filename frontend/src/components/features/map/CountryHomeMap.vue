/**
 * CountryHomeMap — 本地模式全屏 Leaflet 地图组件
 *
 * 替换 Globe3D 在首页 Hero 区域的位置。
 * 显示用户所在国家（中国）的城市标记。
 */
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import L from 'leaflet'
import { useMap } from '@/composables/useMap'
import { createCityLabelMarker } from '@/components/features/map/CityMarker'
import { useAppStore } from '@/stores/appStore'

export interface HomeCity {
  id?: number
  name: string
  lat: number
  lng: number
  tripId?: number
}

export interface FlightRoute {
  id: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  airline: string
  flightNo: string
}

const props = withDefaults(
  defineProps<{
    cities: HomeCity[]
    countryCode?: string
    loading?: boolean
    flightRoutes?: FlightRoute[]
    flightPulseTrigger?: number
  }>(),
  { countryCode: '', loading: false, flightRoutes: () => [], flightPulseTrigger: 0 },
)

const emit = defineEmits<{
  'city-click': [city: HomeCity]
}>()

const appStore = useAppStore()
const { map, containerRef, init, fitToBounds, destroy } = useMap()

const internalLoading = ref(true)
const stateError = ref<string | null>(null)
const showLoading = computed(() => props.loading || internalLoading.value)
const zoomLevel = ref(3)

let cityLayer: L.LayerGroup | null = null
let countryLayer: L.GeoJSON | null = null
let flightLayer: L.LayerGroup | null = null
let showFlights = false
let lastRenderZoom = -1

async function addCountryBorder(code: string) {
  if (!map.value) return
  try {
    const r = await fetch('/geojson/countries-110m.json')
    if (!r.ok) return
    const raw = await r.json()
    if (!map.value) return

    const features = raw.features.filter(
      (f: { properties: { ISO_A3: string } }) => {
        const iso = f.properties.ISO_A3?.toUpperCase()
        if (iso === code.toUpperCase()) return true
        // 一个中国原则：CHN 时包含 TWN
        if (code.toUpperCase() === 'CHN' && iso === 'TWN') return true
        return false
      },
    )
    if (!features.length) return

    countryLayer = L.geoJSON(features, {
      style: {
        color: '#E8714A',
        weight: 2,
        opacity: 0.6,
        fillColor: '#E8714A',
        fillOpacity: 0.06,
      },
    }).addTo(map.value)
  } catch { /* ignore */ }
}

function onZoomEnd() { zoomLevel.value = map.value?.getZoom() ?? 3 }

function renderCities(initial = false) {
  if (!map.value) return

  if (cityLayer) {
    cityLayer.clearLayers()
  } else {
    cityLayer = L.layerGroup().addTo(map.value)
  }

  const cities = props.cities
  if (!cities.length) return

  // 标记大小随 zoom 变化: zoom 3→12px, zoom 6→21px, zoom 10→33px
  const zoom = map.value.getZoom()
  const size = Math.round(Math.max(10, Math.min(33, 3 + zoom * 3)))

  for (const city of cities) {
    const m = createCityLabelMarker(city.lat, city.lng, city.name, { visited: true, size })
    m.addTo(cityLayer)
    m.on('click', () => emit('city-click', city))
  }

  if (initial) {
    const latlngs = cities.map((c) => [c.lat, c.lng] as [number, number])
    fitToBounds(latlngs, 80)
  }
}

onMounted(() => {
  try {
    init({ scrollWheelZoom: true, dark: appStore.theme === 'dark' })

    if (map.value) {
      map.value.setMinZoom(3)
      map.value.setView([35, 104], 3)
    }

    if (props.countryCode) {
      addCountryBorder(props.countryCode)
    }

    if (props.cities.length) {
      renderCities(true)
    }

    // zoom 变化时更新 ref → watch 驱动重渲染
    map.value?.on('zoomend', onZoomEnd)

    // 确保过渡动画后重算地图尺寸
    nextTick(() => map.value?.invalidateSize())
    setTimeout(() => map.value?.invalidateSize(), 300)
  } catch (e) {
    stateError.value = (e as Error).message || 'Failed to initialize map'
  } finally {
    internalLoading.value = false
  }
})

// 主题变化时切换瓦片
watch(
  () => appStore.theme,
  () => {
    if (!map.value) return
    // 重建瓦片 — useMap 的 setTileTheme 已处理
    const tiles: L.TileLayer[] = []
    map.value.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) tiles.push(layer)
    })
    tiles.forEach((t) => t.remove())

    const isDark = appStore.theme === 'dark'
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      noWrap: true,
    }).addTo(map.value)
  },
)

watch(
  () => props.cities,
  () => {
    if (map.value) renderCities()
  },
  { deep: false },
)

// ── 飞行航线 ──
/**
 * 生成贝塞尔曲线点：起始 → 控制点（中点法线偏移）→ 终点
 * offsetRatio 控制弧度方向与大小，正值右偏、负值左偏
 */
function bezierPoints(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  offsetRatio: number,
  steps = 40,
): [number, number][] {
  const midLat = (lat1 + lat2) / 2
  const midLng = (lng1 + lng2) / 2
  // 法线方向（垂直平分线）
  const dx = lng2 - lng1
  const dy = lat2 - lat1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = -dy / len
  const ny = dx / len
  // 控制点：法线偏移，偏移量正比于距离
  const offset = len * offsetRatio
  const cLat = midLat + nx * offset
  const cLng = midLng + ny * offset

  const pts: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    const lat = u * u * lat1 + 2 * u * t * cLat + t * t * lat2
    const lng = u * u * lng1 + 2 * u * t * cLng + t * t * lng2
    pts.push([lat, lng])
  }
  return pts
}

function renderFlights() {
  const m = map.value
  if (!m) return

  // 移除旧 layer 和所有子元素
  if (flightLayer) {
    flightLayer.eachLayer(l => m.removeLayer(l))
    m.removeLayer(flightLayer)
    flightLayer = null
  }

  if (!showFlights || !props.flightRoutes?.length) return

  flightLayer = L.layerGroup().addTo(m)
  const zoom = m.getZoom()
  const lineWeight = Math.max(1.5, Math.min(3.5, 0.5 + zoom * 0.25))

  for (const route of props.flightRoutes) {
    // 每条航线不同弧度：基于 id 取 -0.25 ~ +0.30 之间的值
    const offsetRatio = 0.05 + ((route.id * 137.5) % 0.5) - 0.25
    const pts = bezierPoints(route.startLat, route.startLng, route.endLat, route.endLng, offsetRatio)

    L.polyline(pts, {
      color: '#3B7EC7',
      weight: lineWeight,
      opacity: 0.7,
      dashArray: '6, 4',
    }).addTo(flightLayer)

    // 机场起降点标记
    const airportSize = Math.max(6, Math.min(14, 2 + zoom * 1.2))
    const airportIcon = L.divIcon({
      className: '',
      html: `<div style="width:${airportSize}px;height:${airportSize}px;border-radius:50%;background:#3B7EC7;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
      iconSize: [airportSize, airportSize],
      iconAnchor: [airportSize / 2, airportSize / 2],
    })
    L.marker([route.startLat, route.startLng], { icon: airportIcon, interactive: false }).addTo(flightLayer)
    L.marker([route.endLat, route.endLng], { icon: airportIcon, interactive: false }).addTo(flightLayer)
  }
}

function toggleFlights() {
  if (!map.value) return
  showFlights = !showFlights
  renderFlights()
  lastRenderZoom = map.value.getZoom()
}

// zoom 变化时重算标记大小
watch(zoomLevel, () => {
  if (!map.value) return
  if (props.cities.length) renderCities()
  if (showFlights && map.value.getZoom() !== lastRenderZoom) {
    renderFlights()
    lastRenderZoom = map.value.getZoom()
  }
})

watch(() => props.flightPulseTrigger, () => {
  toggleFlights()
})

onBeforeUnmount(() => {
  if (countryLayer) countryLayer.remove()
  if (flightLayer) flightLayer.remove()
  if (map.value) map.value.off('zoomend', onZoomEnd)
  destroy()
})
</script>

<template>
  <div class="country-home-map" :class="{ 'country-home-map--loading': showLoading }">
    <!-- Map container — always rendered so Leaflet can init -->
    <div ref="containerRef" class="country-home-map__container" />

    <!-- Loading overlay -->
    <div v-if="showLoading" class="country-home-map__overlay">
      <div class="country-home-map__skeleton" />
    </div>

    <!-- Error overlay -->
    <div v-else-if="stateError" class="country-home-map__overlay country-home-map__overlay--info">
      <p class="body-sm text-tertiary">Failed to load map</p>
      <p class="body-xs text-tertiary" style="margin-top: 4px">{{ stateError }}</p>
    </div>
  </div>
</template>

<style scoped>
.country-home-map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  background: transparent;
}

.country-home-map__container {
  width: 100%;
  height: 100%;
  background: var(--color-page, #f5f2ed);
}

:deep(.leaflet-container) {
  background: transparent !important;
}

.country-home-map__overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.country-home-map__overlay--info {
  background: var(--color-card);
}

.country-home-map__skeleton {
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
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

:deep(.leaflet-control-zoom) { display: none; }
</style>
