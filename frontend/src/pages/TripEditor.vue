/**
 * TripEditor — 新增/编辑旅行页
 *
 * 布局: CenteredFormLayout
 * - 编辑模式: route.params.id → 预填
 * - 新增模式: 无 id → 空白表单
 *
 * 表单字段:
 *   CountrySelect, 城市输入列表, DateRangeField,
 *   路线编辑 + 交通方式, 可折叠航班表单,
 *   UploadDropZone, InlineEditor (手记), ConfirmAction
 *
 * 状态: loading (编辑模式预填) / submitting (提交中)
 */
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CenteredFormLayout from '@/components/layout/CenteredFormLayout.vue'
import BackLink from '@/components/shared/BackLink.vue'
import CountrySelect from '@/components/shared/CountrySelect.vue'
import AppInput from '@/components/base/AppInput.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import DateRangeField from '@/components/shared/DateRangeField.vue'
import InlineEditor from '@/components/shared/InlineEditor.vue'
import ConfirmAction from '@/components/shared/ConfirmAction.vue'
import RouteEditor from '@/components/features/trip/RouteEditor.vue'
import type { RouteEditorCity, RouteEditorRoute } from '@/components/features/trip/RouteEditor.vue'
import PhotoUploader from '@/components/features/photo/PhotoUploader.vue'
import { useTripStore } from '@/stores/tripStore'
import { useToast } from '@/composables/useToast'
import { daysBetween } from '@/utils/date'
import type { TransportType } from '@/types/common'
import type { Flight, TripCity } from '@/types/trip'
import type { Photo } from '@/types/photo'

const route = useRoute()
const router = useRouter()
const tripStore = useTripStore()
const { success, error: showError } = useToast()

// ── Mode ──
const isEdit = computed(() => !!route.params.id)
const tripId = computed(() => (isEdit.value ? Number(route.params.id) : null))

// ── Form Data ──
const form = reactive({
  countryCode: '',
  startDate: '',
  endDate: '',
  notesMd: '',
})

const cities = reactive<{ name: string }[]>([])
const newCityName = ref('')

/** routes[cityIndex] = transport type between city[index] and city[index+1] */
const routeTransports = reactive<TransportType[]>([])

/** flight info per route index, only used when transport is FLIGHT */
const routeFlights = reactive<Record<number, Flight>>({})

const photos = ref<File[]>([])
const existingPhotos = ref<Photo[]>([])
const uploading = ref(false)
const uploadProgress = ref(0)

// ── RouteEditor computed props ──

const routeEditorCities = computed<RouteEditorCity[]>(() =>
  cities.map((c, i) => ({
    name: c.name,
    lat: 0,
    lng: 0,
    sortOrder: i,
  })),
)

const routeEditorRoutes = computed<RouteEditorRoute[]>(() =>
  routeTransports.map((t, i) => ({
    fromCityIndex: i,
    toCityIndex: i + 1,
    transportType: t,
  })),
)

function onRouteEditorUpdate(newCities: RouteEditorCity[], newRoutes: RouteEditorRoute[]) {
  // Sync cities (reorder + rename)
  cities.splice(0, cities.length, ...newCities.map((c) => ({ name: c.name })))

  // Sync route transports
  routeTransports.splice(0, routeTransports.length, ...newRoutes.map((r) => r.transportType))

  // Clean up stale flight entries
  for (const idx of Object.keys(routeFlights).map(Number)) {
    if (idx >= routeTransports.length || routeTransports[idx] !== 'FLIGHT') {
      delete routeFlights[idx]
      if (showFlightForms.value[idx] !== undefined) {
        showFlightForms.value[idx] = false
      }
    }
  }
}

function onRouteEditorAddCity() {
  addCity()
}

function onRouteEditorRemoveCity(index: number) {
  removeCity(index)
}

// ── Validation Errors ──
const fieldErrors = reactive<Record<string, string>>({})

// ── UI State ──
const loading = ref(isEdit.value)
const submitting = ref(false)
const showFlightForms = ref<Record<number, boolean>>({})

// ── Computed ──

function rebuildRoutes() {
  // Adjust routeTransports array length to match city connections
  const expectedCount = Math.max(0, cities.length - 1)
  while (routeTransports.length < expectedCount) {
    routeTransports.push('FLIGHT')
  }
  while (routeTransports.length > expectedCount) {
    routeTransports.pop()
  }
  // Clean up flights for non-FLIGHT routes
  for (const idx of Object.keys(routeFlights).map(Number)) {
    if (idx >= expectedCount || routeTransports[idx] !== 'FLIGHT') {
      delete routeFlights[idx]
    }
  }
}

watch(
  () => cities.length,
  () => rebuildRoutes(),
)

function addCity() {
  const name = newCityName.value.trim()
  if (!name) return
  cities.push({ name })
  newCityName.value = ''
}

function removeCity(index: number) {
  cities.splice(index, 1)
}

function moveCity(from: number, to: number) {
  if (to < 0 || to >= cities.length) return
  const [moved] = cities.splice(from, 1)
  cities.splice(to, 0, moved)
}

function onTransportChange(index: number, type: TransportType) {
  routeTransports[index] = type
  if (type !== 'FLIGHT') {
    delete routeFlights[index]
    showFlightForms.value[index] = false
  } else {
    if (!routeFlights[index]) {
      routeFlights[index] = {
        flightNo: '',
        airline: '',
        aircraft: '',
        departureTime: '',
        arrivalTime: '',
        departureAirport: '',
        arrivalAirport: '',
      }
    }
    showFlightForms.value[index] = true
  }
}

function toggleFlightForm(index: number) {
  if (routeTransports[index] === 'FLIGHT') {
    showFlightForms.value[index] = !showFlightForms.value[index]
  }
}

// ── Validation ──

function validate(): boolean {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])

  if (!form.countryCode) fieldErrors.countryCode = 'Country is required'
  if (cities.length === 0) fieldErrors.cities = 'At least one city is required'
  if (!form.startDate) fieldErrors.startDate = 'Start date is required'
  if (!form.endDate) fieldErrors.endDate = 'End date is required'
  if (form.startDate && form.endDate && form.startDate > form.endDate) {
    fieldErrors.endDate = 'End date must be after start date'
  }

  return Object.keys(fieldErrors).length === 0
}

// ── Submit ──

async function onSubmit() {
  if (!validate()) return

  submitting.value = true
  try {
    const req = {
      countryCode: form.countryCode,
      startDate: form.startDate,
      endDate: form.endDate,
      cities: cities.map((c, i) => ({
        name: c.name,
        lat: 0,
        lng: 0,
        sortOrder: i,
      })),
      routes: routeTransports.map((transport, i) => ({
        fromCityIndex: i,
        toCityIndex: i + 1,
        transportType: transport,
        flight: transport === 'FLIGHT' ? (routeFlights[i] || null) : null,
      })),
      notesMd: form.notesMd || undefined,
    }

    let res
    if (isEdit.value && tripId.value) {
      res = await tripStore.updateTrip(tripId.value, req)
    } else {
      res = await tripStore.createTrip(req)
    }

    if (res.code === 200) {
      success(isEdit.value ? 'Trip updated!' : 'Trip created!')
      router.push('/')
    } else {
      showError(res.message || 'Failed to save trip')
    }
  } catch {
    showError('Failed to save trip')
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  router.push('/')
}

// ── Edit Mode: Load data ──

onMounted(async () => {
  document.title = isEdit.value ? 'Edit Trip' : 'New Trip'

  if (isEdit.value && tripId.value) {
    await tripStore.fetchTripDetail(tripId.value)
    const trip = tripStore.currentTrip
    if (trip) {
      form.countryCode = trip.countryCode
      form.startDate = trip.startDate
      form.endDate = trip.endDate
      form.notesMd = trip.notesMd || ''

      trip.cities.forEach((c) => cities.push({ name: c.name }))

      rebuildRoutes()

      // Set transport types from existing routes
      trip.routes.forEach((r, i) => {
        if (i < routeTransports.length) {
          routeTransports[i] = r.transportType
          if (r.transportType === 'FLIGHT' && r.flight) {
            routeFlights[i] = { ...r.flight }
            showFlightForms.value[i] = true
          }
        }
      })

      // Load existing photos
      if (trip.photos?.length) {
        existingPhotos.value = trip.photos
      }
    }
    loading.value = false
  }

  document.title = isEdit.value ? `Edit Trip · ${form.countryCode || ''}` : 'New Trip'
})
</script>

<template>
  <div class="trip-editor">
    <CenteredFormLayout max-width="720px">
      <template #header>
        <BackLink to="/" label="Back" />
        <h1 class="display-lg trip-editor__title">
          {{ isEdit ? 'Edit Trip' : 'New Trip' }}
        </h1>
      </template>

      <!-- Loading (edit mode) -->
      <div v-if="loading" class="trip-editor__loading">
        <!-- skeleton placeholders -->
        <div class="trip-editor__skeleton" />
        <div class="trip-editor__skeleton" style="width: 70%" />
        <div class="trip-editor__skeleton" style="width: 50%" />
      </div>

      <!-- Form -->
      <template v-else>
        <!-- Country -->
        <CountrySelect
          v-model="form.countryCode"
          label="Country *"
          :error="fieldErrors.countryCode"
          placeholder="Search country..."
        />

        <!-- Cities + Routes -->
        <div class="trip-editor__field">
          <label class="trip-editor__label">Cities *</label>
          <p v-if="fieldErrors.cities" class="trip-editor__error">{{ fieldErrors.cities }}</p>
          <RouteEditor
            :cities="routeEditorCities"
            :routes="routeEditorRoutes"
            @update="onRouteEditorUpdate"
            @add-city="onRouteEditorAddCity"
            @remove-city="onRouteEditorRemoveCity"
          />
        </div>

        <!-- Flight forms (kept separate from RouteEditor) -->
        <div
          v-for="(transport, i) in routeTransports"
          :key="'flight-' + i"
          class="trip-editor__field"
        >
          <div v-if="transport === 'FLIGHT'" class="trip-editor__flight-block">
            <div class="trip-editor__flight-header">
              <span class="body-sm text-secondary">
                {{ cities[i]?.name || '?' }}
                <span class="text-tertiary">&rarr;</span>
                {{ cities[i + 1]?.name || '?' }}
              </span>
              <button
                class="trip-editor__flight-toggle"
                @click="showFlightForms.value[i] = !showFlightForms.value[i]"
              >
                <AppIcon name="Plane" :size="14" color-class="text-ocean" />
                <span class="body-xs">{{ showFlightForms[i] ? 'Hide' : 'Flight Info' }}</span>
              </button>
            </div>

            <!-- Collapsible Flight Form -->
            <div v-if="showFlightForms[i]" class="trip-editor__flight-form">
              <div class="trip-editor__flight-grid">
                <AppInput v-model="routeFlights[i].flightNo" label="Flight No" placeholder="e.g. AF1234" />
                <AppInput v-model="routeFlights[i].airline" label="Airline" placeholder="e.g. Air France" />
                <AppInput v-model="routeFlights[i].aircraft" label="Aircraft" placeholder="e.g. A320" />
                <AppInput v-model="routeFlights[i].departureAirport" label="Dep Airport" placeholder="e.g. CDG" />
                <AppInput v-model="routeFlights[i].arrivalAirport" label="Arr Airport" placeholder="e.g. ORY" />
                <AppInput v-model="routeFlights[i].departureTime" label="Departure" placeholder="2024-10-12T10:00" />
                <AppInput v-model="routeFlights[i].arrivalTime" label="Arrival" placeholder="2024-10-12T11:30" />
              </div>
            </div>
          </div>
        </div>

        <!-- Dates -->
        <div class="trip-editor__field">
          <DateRangeField
            :start-date="form.startDate"
            :end-date="form.endDate"
            start-label="Start Date *"
            end-label="End Date *"
            :start-error="fieldErrors.startDate"
            :end-error="fieldErrors.endDate"
            @update:start-date="form.startDate = $event"
            @update:end-date="form.endDate = $event"
          />
        </div>

        <!-- Photos -->
        <div class="trip-editor__field">
          <label class="trip-editor__label">Photos</label>
          <PhotoUploader
            v-model="photos"
            :max-count="20"
            :max-size="10 * 1024 * 1024"
            :existing-photos="existingPhotos"
            @upload="(fs: File[]) => { uploading.value = true; /* handle upload */ }"
          />
        </div>

        <!-- Notes -->
        <div class="trip-editor__field">
          <label class="trip-editor__label">Notes (Markdown)</label>
          <InlineEditor
            v-model="form.notesMd"
            :readonly="false"
            placeholder="Write your travel notes in Markdown..."
            :rows="8"
          />
        </div>
      </template>

      <!-- Actions -->
      <template #actions>
        <ConfirmAction
          confirm-text="Save Trip"
          cancel-text="Cancel"
          variant="primary"
          :confirm-loading="submitting"
          :disabled="loading"
          @confirm="onSubmit"
          @cancel="onCancel"
        />
      </template>
    </CenteredFormLayout>
  </div>
</template>

<style scoped>
.trip-editor {
  width: 100%;
}

.trip-editor__title {
  margin-top: var(--space-sm);
  margin-bottom: 0;
}

.trip-editor__loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-xl) 0;
}

.trip-editor__skeleton {
  height: 24px;
  background: var(--color-card-hover);
  border-radius: var(--radius-sm);
  animation: editor-shimmer 1.5s infinite;
}

@keyframes editor-shimmer {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.8; }
}

.trip-editor__field {
  margin-bottom: var(--space-lg);
}

.trip-editor__label {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}

.trip-editor__error {
  font-size: var(--text-body-xs);
  color: var(--color-danger);
  margin: var(--space-xs) 0 0;
}

.trip-editor__flight-block {
  padding: var(--space-md);
  background: var(--color-card-hover);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.04);
  margin-bottom: var(--space-md);
}

.trip-editor__flight-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.trip-editor__flight-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast);
}

.trip-editor__flight-toggle:hover {
  background: rgba(0, 0, 0, 0.04);
}

.trip-editor__flight-form {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.trip-editor__flight-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}
</style>
