<script setup lang="ts">
/**
 * RouteEditor — 路线编辑器（拖拽排序城市 + 交通方式选择）
 *
 * Props:
 *   cities: 按 sortOrder 排序的城市列表
 *   routes: 城市间的连接段
 * Events:
 *   @update(cities, routes) — 拖拽排序或交通方式变更时触发
 *   @add-city() — "+ Add City" 按钮点击
 *   @remove-city(index) — 城市删除按钮点击
 *
 * 使用 TransportIcon component from '@/components/shared/TransportIcon.vue'
 */
import { ref, computed } from 'vue'
import AppIcon from '@/components/base/AppIcon.vue'
import TransportIcon from '@/components/shared/TransportIcon.vue'
import type { TransportType } from '@/types/common'

export interface RouteEditorCity {
  name: string
  lat: number
  lng: number
  sortOrder: number
}

export interface RouteEditorRoute {
  fromCityIndex: number
  toCityIndex: number
  transportType: TransportType
}

const props = withDefaults(
  defineProps<{
    cities: RouteEditorCity[]
    routes: RouteEditorRoute[]
  }>(),
  {},
)

const emit = defineEmits<{
  update: [cities: RouteEditorCity[], routes: RouteEditorRoute[]]
  'add-city': []
  'remove-city': [index: number]
}>()

// ── Drag state ──
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// ── Sorted cities ──
const sortedCities = computed(() => {
  return [...props.cities].sort((a, b) => a.sortOrder - b.sortOrder)
})

// ── Transport type between consecutive cities ──
function getTransportType(fromIndex: number, toIndex: number): TransportType {
  const route = props.routes.find(
    (r) => r.fromCityIndex === fromIndex && r.toCityIndex === toIndex,
  )
  return route?.transportType || 'FLIGHT'
}

function setTransportType(routeIdx: number, type: TransportType) {
  const sorted = sortedCities.value
  if (routeIdx < 0 || routeIdx >= sorted.length - 1) return
  const fromCity = sorted[routeIdx]
  const toCity = sorted[routeIdx + 1]

  const newRoutes = props.routes
    .filter(
      (r) =>
        !(r.fromCityIndex === fromCity.sortOrder && r.toCityIndex === toCity.sortOrder),
    )
    .concat({
      fromCityIndex: fromCity.sortOrder,
      toCityIndex: toCity.sortOrder,
      transportType: type,
    })

  emit('update', props.cities, newRoutes)
}

// ── Drag & Drop handlers ──

function onDragStart(index: number, e: DragEvent) {
  dragIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragOver(index: number, e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  dragOverIndex.value = index
}

function onDragLeave() {
  dragOverIndex.value = null
}

function onDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) {
    dragIndex.value = null
    dragOverIndex.value = null
    return
  }

  const sorted = sortedCities.value
  const from = dragIndex.value
  const to = index

  // Reorder cities array
  const newCities = [...props.cities]
  const [movedCity] = newCities.splice(from, 1)
  newCities.splice(to, 0, movedCity)

  // Reassign sortOrder
  const updatedCities = newCities.map((c, i) => ({
    ...c,
    sortOrder: i,
  }))

  // Rebuild routes to match new order
  const updatedRoutes: RouteEditorRoute[] = []
  for (let i = 0; i < updatedCities.length - 1; i++) {
    const existingRoute = props.routes.find(
      (r) =>
        r.fromCityIndex === sorted[i].sortOrder &&
        r.toCityIndex === sorted[i + 1].sortOrder,
    )
    if (existingRoute) {
      updatedRoutes.push({
        fromCityIndex: i,
        toCityIndex: i + 1,
        transportType: existingRoute.transportType,
      })
    } else {
      updatedRoutes.push({
        fromCityIndex: i,
        toCityIndex: i + 1,
        transportType: 'FLIGHT',
      })
    }
  }

  dragIndex.value = null
  dragOverIndex.value = null
  emit('update', updatedCities, updatedRoutes)
}

function onDragEnd() {
  dragIndex.value = null
  dragOverIndex.value = null
}

// ── Transport options ──
const transportOptions: { value: TransportType; label: string }[] = [
  { value: 'FLIGHT', label: 'Flight' },
  { value: 'TRAIN', label: 'Train' },
  { value: 'CAR', label: 'Car' },
  { value: 'OTHER', label: 'Other' },
]
</script>

<template>
  <div class="route-editor">
    <!-- City List -->
    <div class="route-editor__cities">
      <div
        v-for="(city, i) in sortedCities"
        :key="city.sortOrder"
        :class="[
          'route-editor__city-row',
          {
            'route-editor__city-row--dragging': dragIndex === i,
            'route-editor__city-row--drag-over': dragOverIndex === i,
          },
        ]"
        :draggable="true"
        @dragstart="onDragStart(i, $event)"
        @dragover="onDragOver(i, $event)"
        @dragleave="onDragLeave"
        @drop="onDrop(i)"
        @dragend="onDragEnd"
      >
        <!-- Drag handle -->
        <span class="route-editor__drag-handle" title="Drag to reorder">
          <AppIcon name="GripVertical" :size="14" color-class="text-tertiary" />
        </span>

        <!-- City index -->
        <span class="route-editor__city-index body-xs text-tertiary">{{ i + 1 }}</span>

        <!-- City name -->
        <span class="route-editor__city-name">{{ city.name }}</span>

        <!-- Remove button -->
        <button
          class="route-editor__city-remove"
          @click="emit('remove-city', i)"
          :aria-label="'Remove ' + city.name"
          title="Remove city"
        >
          <AppIcon name="X" :size="14" color-class="text-tertiary" />
        </button>
      </div>
    </div>

    <!-- Transport between cities -->
    <div v-if="sortedCities.length >= 2" class="route-editor__routes">
      <div
        v-for="(city, i) in sortedCities"
        :key="'route-' + i"
        class="route-editor__route-segment"
      >
        <!-- Transport selector between city[i] and city[i+1] -->
        <div v-if="i < sortedCities.length - 1" class="route-editor__transport">
          <div class="route-editor__transport-line" />
          <div class="route-editor__transport-selector">
            <TransportIcon
              :type="getTransportType(city.sortOrder, sortedCities[i + 1].sortOrder)"
              :size="20"
              :show-label="true"
            />
            <select
              :value="getTransportType(city.sortOrder, sortedCities[i + 1].sortOrder)"
              class="route-editor__select"
              @change="
                setTransportType(
                  i,
                  ($event.target as HTMLSelectElement).value as TransportType,
                )
              "
            >
              <option
                v-for="opt in transportOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Add City button -->
    <button class="route-editor__add-btn" @click="emit('add-city')">
      <AppIcon name="Plus" :size="16" color-class="" />
      <span>Add City</span>
    </button>
  </div>
</template>

<style scoped>
.route-editor {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* ── City rows ── */
.route-editor__cities {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.route-editor__city-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 8px 12px;
  background: var(--color-card-hover);
  border-radius: var(--radius-sm);
  cursor: grab;
  transition: background var(--duration-fast), box-shadow var(--duration-fast);
  user-select: none;
}

.route-editor__city-row:hover {
  background: var(--color-card);
}

.route-editor__city-row--dragging {
  opacity: 0.5;
  background: var(--color-card);
}

.route-editor__city-row--drag-over {
  box-shadow: 0 2px 0 var(--color-sunset);
}

.route-editor__drag-handle {
  display: flex;
  align-items: center;
  cursor: grab;
  color: var(--text-tertiary);
  opacity: 0.5;
  transition: opacity var(--duration-fast);
}

.route-editor__city-row:hover .route-editor__drag-handle {
  opacity: 1;
}

.route-editor__city-index {
  font-family: var(--font-mono);
  min-width: 16px;
}

.route-editor__city-name {
  flex: 1;
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-primary);
}

.route-editor__city-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  transition: all var(--duration-fast);
}

.route-editor__city-remove:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-danger);
}

/* ── Transport segments ── */
.route-editor__routes {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding-left: 28px;
}

.route-editor__route-segment {
  position: relative;
}

.route-editor__transport {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 6px 0;
}

.route-editor__transport-line {
  width: 2px;
  height: 24px;
  background: var(--text-tertiary);
  opacity: 0.15;
  margin-left: 7px;
  flex-shrink: 0;
}

.route-editor__transport-selector {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  background: var(--color-card);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: border-color var(--duration-fast);
}

.route-editor__transport-selector:hover {
  border-color: var(--text-tertiary);
}

.route-editor__select {
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-secondary);
  cursor: pointer;
  outline: none;
  padding: 2px 4px;
  border-radius: var(--radius-xs);
  transition: color var(--duration-fast);
}

.route-editor__select:hover {
  color: var(--text-primary);
}

.route-editor__select:focus {
  color: var(--text-primary);
}

/* ── Add button ── */
.route-editor__add-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  border: 2px dashed rgba(0, 0, 0, 0.1);
  background: transparent;
  border-radius: var(--radius-sm);
  padding: 10px 16px;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--duration-fast);
  margin-top: var(--space-xs);
}

.route-editor__add-btn:hover {
  border-color: var(--color-sunset);
  color: var(--color-sunset);
  background: rgba(232, 113, 74, 0.04);
}
</style>
