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

let cityLayer: L.LayerGroup | null = null
let countryLayer: L.GeoJSON | null = null
let flightLayer: L.LayerGroup | null = null
let showFlights = false

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

function renderCities() {
  if (!map.value) return

  if (cityLayer) {
    cityLayer.clearLayers()
  } else {
    cityLayer = L.layerGroup().addTo(map.value)
  }

  const cities = props.cities
  if (!cities.length) return

  for (const city of cities) {
    const m = createCityLabelMarker(city.lat, city.lng, city.name, { visited: true })
    m.addTo(cityLayer)
    m.on('click', () => emit('city-click', city))
  }

  const latlngs = cities.map((c) => [c.lat, c.lng] as [number, number])
  fitToBounds(latlngs, 80)
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
      renderCities()
    }

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
function toggleFlights() {
  if (!map.value) return
  showFlights = !showFlights

  if (flightLayer) {
    flightLayer.clearLayers()
    flightLayer.remove()
    flightLayer = null
  }

  if (!showFlights || !props.flightRoutes?.length) return

  flightLayer = L.layerGroup().addTo(map.value)
  for (const route of props.flightRoutes) {
    const line = L.polyline(
      [[route.startLat, route.startLng], [route.endLat, route.endLng]],
      {
        color: '#3B7EC7',
        weight: 2.5,
        opacity: 0.7,
        dashArray: '6, 4',
      },
    ).addTo(flightLayer)

    // 中点标注
    const midLat = (route.startLat + route.endLat) / 2
    const midLng = (route.startLng + route.endLng) / 2
    L.marker([midLat, midLng], {
      icon: L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;border-radius:50%;background:white;border:2px solid #3B7EC7;display:flex;align-items:center;justify-content:center;font-size:10px;box-shadow:0 1px 4px rgba(0,0,0,0.2);">✈</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
      interactive: false,
    }).addTo(flightLayer)
  }
}

watch(() => props.flightPulseTrigger, () => {
  toggleFlights()
})

onBeforeUnmount(() => {
  if (countryLayer) countryLayer.remove()
  if (flightLayer) flightLayer.remove()
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
  background: transparent;
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

:deep(.leaflet-marker-pane) { z-index: 5 !important; }
:deep(.leaflet-control-zoom) { display: none; }
</style>
