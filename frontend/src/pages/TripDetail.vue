/**
 * TripDetail — 旅行详情页
 *
 * 布局: TwoColumnLayout (7:5)
 * 左列: RouteMap + DayTimelineStrip + NotesViewer
 * 右列: FlightCard（stacked 效果）+ PhotoGrid
 * 右下角: ContextGlobe
 *
 * 状态: loading / empty / error / normal
 */
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import TwoColumnLayout from '@/components/layout/TwoColumnLayout.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import RouteMap from '@/components/features/map/RouteMap.vue'
import type { PhotoLocation } from '@/components/features/map/RouteMap.vue'
import FlightCard from '@/components/features/trip/FlightCard.vue'
import FlightDetailModal from '@/components/features/trip/FlightDetailModal.vue'
import DayTimelineStrip from '@/components/features/trip/DayTimelineStrip.vue'
import PhotoGrid from '@/components/features/photo/PhotoGrid.vue'
import LightboxGallery from '@/components/features/photo/LightboxGallery.vue'
import NotesViewer from '@/components/features/content/NotesViewer.vue'
import ContextGlobe from '@/components/features/globe/ContextGlobe.vue'
import SectionHeader from '@/components/shared/SectionHeader.vue'
import AppSpinner from '@/components/base/AppSpinner.vue'
import AppEmptyState from '@/components/base/AppEmptyState.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppCard from '@/components/base/AppCard.vue'
import { useTripStore } from '@/stores/tripStore'
import { formatDateRange, daysBetween } from '@/utils/date'
import type { DayInfo } from '@/types/trip'

const route = useRoute()
const tripStore = useTripStore()

const tripId = computed(() => Number(route.params.id))
const currentTrip = computed(() => tripStore.currentTrip)

// ── State ──
const error = ref<string | null>(null)
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)
const activeDay = ref(-1) // -1 = show all
const selectedFlight = ref<import('@/types/trip').Flight | null>(null)
const flightModalVisible = ref(false)
const dayNotes = ref<Record<string, string>>({}) // date -> note text
const editingNoteDay = ref<string | null>(null) // null = trip summary, '2025-01-16' = specific day
const editNoteText = ref('')
const addPhotoModalVisible = ref(false)
const addPhotoDay = ref('')
const addPhotoFiles = ref<File[]>([])

// ── Computed ──

const subtitle = computed(() => {
  const trip = currentTrip.value
  if (!trip) return ''
  const cityName = trip.cities[0]?.name || ''
  const dateRange = formatDateRange(trip.startDate, trip.endDate)
  return `${cityName}, ${trip.countryName} · ${dateRange} · ${trip.dayCount} days`
})

const days = computed<DayInfo[]>(() => {
  const trip = currentTrip.value
  if (!trip) return []
  const start = new Date(trip.startDate)
  const end = new Date(trip.endDate)
  const result: DayInfo[] = []
  const current = new Date(start)
  let dayIndex = 0
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0]
    const hasPhotos = trip.photos?.some((p) => p.takenAt?.startsWith(dateStr)) ?? false
    const hasNotes = trip.notesMd?.length > 0
    result.push({ dayIndex, date: dateStr, hasPhotos, hasNotes })
    current.setDate(current.getDate() + 1)
    dayIndex++
  }
  return result
})

// 按天筛选照片
const filteredPhotos = computed(() => {
  const trip = currentTrip.value
  if (!trip) return []
  if (activeDay.value === -1) return trip.photos
  const dayDate = getDayDate(activeDay.value)
  if (!dayDate) return trip.photos
  return trip.photos.filter((p) => p.takenAt?.startsWith(dayDate))
})

// 获取某天对应的日期字符串
function getDayDate(dayIndex: number): string | null {
  const trip = currentTrip.value
  if (!trip) return null
  const d = new Date(trip.startDate)
  d.setDate(d.getDate() + dayIndex)
  return d.toISOString().split('T')[0]
}

// 照片地点（供 RouteMap 显示）
const photoLocations = computed<PhotoLocation[]>(() => {
  const trip = currentTrip.value
  if (!trip) return []
  return trip.photos
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => {
      const dayIndex = getDayIndexFromDate(p.takenAt || '')
      return { id: p.id, lat: p.lat!, lng: p.lng!, caption: p.caption, dayIndex }
    })
})

// 从日期字符串计算 dayIndex
function getDayIndexFromDate(dateStr: string): number {
  const trip = currentTrip.value
  if (!trip) return 0
  const tripStart = new Date(trip.startDate)
  const photoDate = new Date(dateStr)
  const diff = Math.round((photoDate.getTime() - tripStart.getTime()) / 86400000)
  return diff >= 0 ? diff : 0
}

// 当天标签
const dayLabel = computed(() => {
  if (activeDay.value === -1) return ''
  const date = getDayDate(activeDay.value)
  return `Day ${activeDay.value + 1}${date ? ` · ${date}` : ''}`
})

// ── Data Loading ──

async function loadData() {
  error.value = null
  try {
    await tripStore.fetchTripDetail(tripId.value)
  } catch (e) {
    error.value = 'Failed to load trip'
  }
}

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxVisible.value = true
}

function openFlightDetail(flight: import('@/types/trip').Flight) {
  selectedFlight.value = flight
  flightModalVisible.value = true
}

function closeFlightDetail() {
  flightModalVisible.value = false
}

function onDayClick(dayIndex: number) {
  activeDay.value = dayIndex
}

// ── 添加手记 ──
const currentDayDate = computed(() => activeDay.value === -1 ? '' : getDayDate(activeDay.value))

function startAddNote() {
  // All 模式 → 旅行总结 (editingNoteDay = null)
  // 选中某天 → 该天手记
  editingNoteDay.value = activeDay.value === -1 ? null : (currentDayDate.value || null)
  editNoteText.value = editingNoteDay.value ? (dayNotes.value[editingNoteDay.value] || '') : ''
}

const noteEditorTitle = computed(() => {
  if (editingNoteDay.value === null) return 'Trip Summary Note'
  if (editingNoteDay.value) return `Note for ${editingNoteDay.value}`
  return ''
})

function saveDayNote() {
  if (editingNoteDay.value === null) {
    // 保存为旅行总结 — 更新 currentTrip.notesMd
    if (currentTrip.value) {
      currentTrip.value.notesMd = editNoteText.value
    }
  } else if (editingNoteDay.value) {
    dayNotes.value[editingNoteDay.value] = editNoteText.value
  }
  editingNoteDay.value = null
  editNoteText.value = ''
}

function cancelDayNote() {
  editingNoteDay.value = null
  editNoteText.value = ''
}

// ── 添加照片 ──
function startAddPhoto() {
  addPhotoDay.value = currentDayDate.value || new Date().toISOString().split('T')[0]
  addPhotoFiles.value = []
  addPhotoModalVisible.value = true
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) {
    addPhotoFiles.value = Array.from(input.files)
  }
}

function confirmAddPhoto() {
  if (!addPhotoFiles.value.length) return
  for (let i = 0; i < addPhotoFiles.value.length; i++) {
    const file = addPhotoFiles.value[i]
    const newPhoto = {
      id: Date.now() + i,
      url: URL.createObjectURL(file),
      caption: file.name.replace(/\.[^.]+$/, '') || undefined,
      takenAt: addPhotoDay.value || undefined,
      aspectRatio: 1.333,
      sortOrder: (currentTrip.value?.photos?.length || 0) + i,
    }
    currentTrip.value?.photos.push(newPhoto as any)
  }
  addPhotoModalVisible.value = false
  addPhotoFiles.value = []
}

onMounted(() => {
  loadData()
  document.title = 'Trip Detail'
})

watch(currentTrip, (trip) => {
  if (trip) {
    document.title = `${trip.cities[0]?.name || 'Trip'} · ${trip.countryName}`
  }
}, { immediate: false })
</script>

<template>
  <div class="trip-detail-wrapper">
    <!-- Loading -->
    <div v-if="tripStore.loading && !currentTrip" class="trip-detail__loading">
      <AppSpinner size="lg" label="Loading trip..." />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="trip-detail__center">
      <AppEmptyState icon="AlertCircle" :title="error" description="Please try again.">
        <AppButton variant="primary" size="md" @click="loadData">Retry</AppButton>
      </AppEmptyState>
    </div>

    <!-- Empty / Not Found -->
    <div v-else-if="!currentTrip" class="trip-detail__center">
      <AppEmptyState icon="Calendar" title="Trip not found" description="The trip you are looking for does not exist." />
    </div>

    <!-- Normal Content -->
    <TwoColumnLayout v-else :left-cols="7" :right-cols="5" gap="var(--card-gap, 24px)" :left-sticky="true">
      <template #left>
        <PageHeader
          :title="`${currentTrip.cities[0]?.name || 'Unknown'}, ${currentTrip.countryName}`"
          :subtitle="subtitle"
          back-to="/"
          back-label="Back to Globe"
        >
          <template #meta>
            <span class="trip-detail__flag">{{ currentTrip.flagEmoji }}</span>
          </template>
        </PageHeader>

        <!-- Route Map -->
        <RouteMap
          :cities="currentTrip.cities"
          :routes="currentTrip.routes"
          :flights="currentTrip.flights"
          :photo-locations="photoLocations"
          :active-day="activeDay"
          :loading="tripStore.loading"
        />

        <!-- Day Timeline -->
        <div class="trip-detail__section">
          <SectionHeader title="Days" />
          <AppCard variant="default" :hoverable="false" padding>
            <DayTimelineStrip
              :days="days"
              :active-day="activeDay"
              @day-click="onDayClick"
            />
          </AppCard>
        </div>

        <!-- Notes -->
        <div class="trip-detail__section">
          <SectionHeader :title="dayLabel || 'Notes'" />
          <AppCard variant="default" :hoverable="false" padding>
            <div v-if="dayLabel" class="trip-detail__day-hint body-xs text-tertiary">
              {{ dayLabel }}
              <button class="trip-detail__day-add-link" @click="startAddNote">+ Add Note</button>
            </div>
            <div v-else class="trip-detail__day-hint body-xs text-tertiary" style="text-align:right;">
              <button class="trip-detail__day-add-link" @click="startAddNote">+ Add Note</button>
            </div>

            <div v-if="editingNoteDay !== null && editingNoteDay !== undefined" class="trip-detail__note-editor">
              <p class="body-xs text-secondary" style="margin-bottom:8px;">
                {{ editingNoteDay === null ? 'Trip Summary Note' : `Note for ${editingNoteDay}` }}
              </p>
              <textarea
                v-model="editNoteText"
                class="trip-detail__note-textarea"
                :placeholder="editingNoteDay === null ? 'Write a summary of this trip...' : 'Write your notes for this day in Markdown...'"
                rows="6"
              />
              <div class="trip-detail__note-actions">
                <AppButton variant="ghost" size="sm" @click="cancelDayNote">Cancel</AppButton>
                <AppButton variant="primary" size="sm" @click="saveDayNote">Save</AppButton>
              </div>
            </div>

            <NotesViewer
              v-else
              :content="currentTrip.notesMd || ''"
              :editable="false"
            />
          </AppCard>
        </div>
      </template>

      <template #right>
        <!-- Flights -->
        <div class="trip-detail__section">
          <SectionHeader title="Flights" />
          <div v-if="currentTrip.flights.length === 0" class="trip-detail__empty-hint body-sm text-tertiary">
            No flights recorded for this trip.
          </div>
          <div v-else class="trip-detail__flights">
            <FlightCard
              v-for="(flight, i) in currentTrip.flights"
              :key="flight.id || i"
              :flight="flight"
              :stacked="currentTrip.flights.length > 1"
              :stack-index="i"
              @click="openFlightDetail(flight)"
            />
          </div>
        </div>

        <!-- Photos -->
        <div class="trip-detail__section">
          <div class="trip-detail__section-header-row">
            <SectionHeader title="Photos" />
            <button class="trip-detail__add-btn" @click="startAddPhoto">
              <AppIcon name="Plus" :size="14" color-class="text-ocean" />
              <span class="body-xs">Add Photo</span>
            </button>
          </div>
          <PhotoGrid
            :photos="filteredPhotos"
            :loading="tripStore.loading"
            @photo-click="openLightbox"
          />
        </div>
      </template>
    </TwoColumnLayout>

    <!-- ContextGlobe -->
    <ContextGlobe v-if="currentTrip" :country-code="currentTrip.countryCode" :size="80" />

    <!-- Lightbox -->
    <LightboxGallery
      :visible="lightboxVisible"
      :photos="filteredPhotos"
      :initial-index="lightboxIndex"
      @close="lightboxVisible = false"
    />

    <!-- Flight Detail Modal -->
    <FlightDetailModal
      :flight="selectedFlight"
      :visible="flightModalVisible"
      @close="closeFlightDetail"
    />

    <!-- Add Photo Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="addPhotoModalVisible" class="trip-detail__photo-modal" @click.self="addPhotoModalVisible = false">
          <div class="trip-detail__photo-modal-panel">
            <div class="trip-detail__photo-modal-header">
              <h3>Add Photo</h3>
              <button class="trip-detail__photo-modal-close" @click="addPhotoModalVisible = false">✕</button>
            </div>
            <div class="trip-detail__photo-modal-body">
              <div class="trip-detail__photo-field">
                <label class="body-xs text-secondary">Date <span class="text-tertiary">(optional — auto-filled)</span></label>
                <input v-model="addPhotoDay" type="date" class="trip-detail__photo-input" />
              </div>
              <div class="trip-detail__photo-field">
                <label class="body-xs text-secondary">Choose Images *</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  class="trip-detail__file-input"
                  @change="handleFileSelect"
                />
                <span v-if="addPhotoFiles.length" class="body-xs text-secondary" style="margin-top:4px;">
                  {{ addPhotoFiles.length }} file(s) selected
                </span>
              </div>
            </div>
            <div class="trip-detail__photo-modal-footer">
              <AppButton variant="ghost" size="sm" @click="addPhotoModalVisible = false">Cancel</AppButton>
              <AppButton variant="primary" size="sm" :disabled="!addPhotoFiles.length" @click="confirmAddPhoto">Add Photo</AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.trip-detail__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.trip-detail__center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--page-padding);
  padding-top: calc(var(--page-padding) + 60px);
}

.trip-detail__flag {
  font-size: 28px;
  line-height: 1;
}

.trip-detail__section {
  margin-bottom: var(--space-xl);
}

.trip-detail__flights {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.trip-detail__empty-hint {
  text-align: center;
  padding: var(--space-xl) 0;
}

.trip-detail__day-hint {
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ── Section actions ── */
.trip-detail__section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xs);
}

.trip-detail__add-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid rgba(59, 126, 199, 0.2);
  border-radius: var(--radius-full);
  background: transparent;
  cursor: pointer;
  color: var(--color-ocean);
  transition: all 150ms;
}

.trip-detail__add-btn:hover {
  background: rgba(59, 126, 199, 0.06);
  border-color: rgba(59, 126, 199, 0.4);
}

.trip-detail__day-add-link {
  border: none;
  background: none;
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--color-ocean);
  cursor: pointer;
  padding: 0;
}

.trip-detail__day-add-link:hover {
  text-decoration: underline;
}

/* ── Note editor ── */
.trip-detail__note-editor {
  padding: var(--space-sm) 0;
}

.trip-detail__note-textarea {
  width: 100%;
  padding: var(--space-sm);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-primary);
  background: var(--color-card);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-sm);
  resize: vertical;
  outline: none;
  box-sizing: border-box;
}

.trip-detail__note-textarea:focus {
  border-color: var(--color-sunset);
}

.trip-detail__note-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

/* ── Add Photo Modal ── */
.trip-detail__photo-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal, 500);
  padding: var(--space-lg);
}

.trip-detail__photo-modal-panel {
  width: 100%;
  max-width: 420px;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  overflow: hidden;
}

.trip-detail__photo-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.trip-detail__photo-modal-header h3 {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}

.trip-detail__photo-modal-close {
  border: none;
  background: none;
  font-size: 18px;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 4px;
}

.trip-detail__photo-modal-body {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.trip-detail__photo-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.trip-detail__photo-input {
  padding: 8px 10px;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-primary);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-sm);
  outline: none;
  background: var(--color-card);
}

.trip-detail__photo-input:focus {
  border-color: var(--color-ocean);
}

.trip-detail__photo-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
}

.trip-detail__file-input {
  padding: 8px 0;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-primary);
}

.trip-detail__photo-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* Modal transition */
.modal-enter-active { animation: scale-in 300ms var(--ease-spring); }
.modal-leave-active { animation: fade-in 200ms var(--ease-in) reverse; }

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
