<script setup lang="ts">
/**
 * CountryMap — 国家页 Leaflet 地图组件
 *
 * Props:
 *   - cities:     城市列表（含经纬度和 visited 状态）
 *   - countryCode: 国家代码（调试 / data attr）
 *   - loading:     父级数据加载中
 *
 * Emits:
 *   - city-click: 点击城市标记
 *
 * 状态:
 *   loading / empty / error / normal
 */
import { ref, computed, watch, onMounted } from 'vue'
import L from 'leaflet'
import { useMap } from '@/composables/useMap'
import { createCityLabelMarker } from './CityMarker'
import { createRouteLine } from './RouteLine'

export interface CountryMapCity {
  name: string
  lat: number
  lng: number
  visited?: boolean
}

const props = withDefaults(
  defineProps<{
    cities: CountryMapCity[]
    countryCode?: string
    loading?: boolean
  }>(),
  { countryCode: '', loading: false },
)

const emit = defineEmits<{
  'city-click': [city: CountryMapCity]
}>()

const { map, containerRef, init, fitToBounds } = useMap()

// -------------------------------------------
// State
// -------------------------------------------
const internalLoading = ref(true)
const stateError = ref<string | null>(null)
const showLoading = computed(() => props.loading || internalLoading.value)

let cityLayer: L.LayerGroup | null = null

// -------------------------------------------
// Render
// -------------------------------------------
function renderCities() {
  if (!map.value) return

  // Clear previous layer group
  if (cityLayer) {
    cityLayer.clearLayers()
  } else {
    cityLayer = L.layerGroup().addTo(map.value)
  }

  const cities = props.cities
  if (!cities.length) return

  // --- City markers ---
  for (const city of cities) {
    const m = createCityLabelMarker(city.lat, city.lng, city.name, {
      visited: city.visited,
    })
    m.addTo(cityLayer)
    m.on('click', () => emit('city-click', city))
  }

  // --- Route lines between consecutive cities ---
  for (let i = 0; i < cities.length - 1; i++) {
    const from = cities[i]
    const to = cities[i + 1]
    const line = createRouteLine([from.lat, from.lng], [to.lat, to.lng], {
      transportType: 'FLIGHT',
    })
    line.addTo(cityLayer)
  }

  // --- Fit bounds ---
  const latlngs = cities.map((c) => [c.lat, c.lng] as [number, number])
  fitToBounds(latlngs, 60)
}

// -------------------------------------------
// Lifecycle
// -------------------------------------------
onMounted(() => {
  try {
    init({ scrollWheelZoom: false })

    if (props.cities.length) {
      renderCities()
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
    if (map.value) renderCities()
  },
  { deep: false },
)
</script>

<template>
  <div
    class="country-map"
    :data-country="countryCode || undefined"
  >
    <!-- Map container — always rendered so Leaflet can init -->
    <div ref="containerRef" class="country-map__container" />

    <!-- Loading overlay -->
    <div v-if="showLoading" class="country-map__overlay">
      <div class="country-map__skeleton" />
    </div>

    <!-- Error overlay -->
    <div v-else-if="stateError" class="country-map__overlay country-map__overlay--info">
      <p class="body-sm text-tertiary">Failed to load map</p>
      <p class="body-xs text-tertiary" style="margin-top: 4px">{{ stateError }}</p>
    </div>

    <!-- Empty overlay -->
    <div
      v-else-if="!cities.length"
      class="country-map__overlay country-map__overlay--info"
    >
      <p class="body-sm text-tertiary">No cities to display</p>
    </div>
  </div>
</template>

<style scoped>
.country-map {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: var(--radius-md);
  overflow: hidden;
  z-index: 1;
}

.country-map__container {
  width: 100%;
  height: 100%;
}

.country-map__overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.country-map__overlay--info {
  background: var(--color-card);
}

.country-map__skeleton {
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

/* Leaflet 默认 z-index 为 400，调整容器层级避免遮挡导航 */
:deep(.leaflet-pane) {
  z-index: 2;
}
</style>
