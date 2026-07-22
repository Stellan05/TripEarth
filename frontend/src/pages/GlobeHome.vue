<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatsPanel from '@/components/features/trip/StatsPanel.vue'
import TripMiniCard from '@/components/features/trip/TripMiniCard.vue'
import AppCard from '@/components/base/AppCard.vue'
import AppEmptyState from '@/components/base/AppEmptyState.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import AppDivider from '@/components/base/AppDivider.vue'
import Globe3D from '@/components/features/globe/Globe3D.vue'
import { useI18n } from '@/composables/useI18n'
import { useCountryStore } from '@/stores/countryStore'
import { useTripStore } from '@/stores/tripStore'
import * as statsApi from '@/api/stats'
import type { CountryStatus } from '@/types/country'

const router = useRouter()
const { t } = useI18n()
const countryStore = useCountryStore()
const tripStore = useTripStore()

const loading = ref(true)
const welcomeVisible = ref(false)
const welcomeLeaving = ref(false)
const stats = ref({ countryCount: 0, cityCount: 0, tripCount: 0, flightCount: 0, continentCount: 0 })
const statsHighlight = ref(false)
const statsHighlightWishlist = ref(false)
const pulseTrigger = ref(0)

const allStatuses = computed<CountryStatus[]>(() => {
  try {
    return [
      ...(countryStore.visitedCountries || []),
      ...(countryStore.wishlistCountries || []),
    ]
  } catch { return [] }
})

const wishlistCount = computed(() => {
  try { return (countryStore.wishlistCountries || []).length }
  catch { return 0 }
})

const hasData = computed(() => {
  try { return (tripStore.recentTrips || []).length > 0 }
  catch { return false }
})

function goToTrip(id: number) { router.push(`/trip/${id}`) }
function goToNewTrip() { router.push('/trip/new') }
function goToCountry(code: string, _status?: CountryStatus | null) {
  if (!code) return
  const s = _status || allStatuses.value.find(c => c.code.toLowerCase() === code.toLowerCase())
  if (!s) return
  if (s.status === 'visited' || s.isHome) router.push(`/country/${code.toLowerCase()}`)
  else if (s.status === 'wishlist') router.push('/wishlist')
  // 未去国家：无操作
}
let hoverTimer: ReturnType<typeof setTimeout> | null = null
function onGlobeHover(code: string | null) {
  if (hoverTimer) clearTimeout(hoverTimer)
  if (!code) {
    hoverTimer = setTimeout(() => { statsHighlight.value = false; statsHighlightWishlist.value = false }, 200)
    return
  }
  const s = allStatuses.value.find(c => c.code.toLowerCase() === code.toLowerCase())
  if (!s) { statsHighlight.value = false; statsHighlightWishlist.value = false; return }
  statsHighlight.value = !!(s.status === 'visited' || s.isHome)
  statsHighlightWishlist.value = s.status === 'wishlist'
}

// 统计面板点击 → 联动地球
function onStatsClick(key: string) {
  if (key === 'countries') {
    pulseTrigger.value++
    statsHighlight.value = true
    setTimeout(() => { statsHighlight.value = false }, 3000)
  }
  if (key === 'wishlist') {
    statsHighlightWishlist.value = true
    setTimeout(() => { statsHighlightWishlist.value = false }, 3000)
  }
}
function goToTimeline() { router.push('/timeline') }
function goToMap() { router.push('/') }
function goToNewTripPhotos() { router.push('/trip/new') }

onMounted(async () => {
  try {
    await Promise.all([
      countryStore.fetchVisitedCountries(),
      tripStore.fetchTrips(),
      statsApi.getStats().then(res => { if (res.code === 200) stats.value = res.data }),
    ])
  } catch { /* mock will always succeed */ }
  loading.value = false

  // Welcome animation — plays once per session
  const shown = sessionStorage.getItem('welcome-shown')
  if (!shown) {
    welcomeVisible.value = true
    setTimeout(() => {
      welcomeLeaving.value = true
      setTimeout(() => { welcomeVisible.value = false; welcomeLeaving.value = false }, 800)
    }, 2500)
    sessionStorage.setItem('welcome-shown', 'true')
  }
})
</script>

<template>
  <div v-if="loading" class="globe-home__loading">
    <div class="globe-home__loading-spinner" />
    <p class="body-sm text-tertiary">{{ t('home.loading') }}</p>
  </div>

  <div v-else class="globe-home">
    <!-- ═══════ Hero: Globe full viewport ═══════ -->
    <div class="globe-home__hero">
      <Globe3D
        :country-statuses="allStatuses"
        :loading="false"
        :pulse-trigger="pulseTrigger"
        class="globe-home__globe"
        @country-click="goToCountry"
        @country-hover="onGlobeHover"
      />

      <!-- Welcome overlay -->
      <div v-if="welcomeVisible" :class="['globe-home__welcome', { 'globe-home__welcome--leave': welcomeLeaving }]">
        <h1 class="globe-home__welcome-title">{{ t('home.welcome') }}</h1>
        <p class="globe-home__welcome-desc">{{ t('home.today') }}</p>
      </div>

      <!-- Stats sidebar -->
      <div class="globe-home__stats">
        <StatsPanel
          :country-count="stats.countryCount"
          :city-count="stats.cityCount"
          :trip-count="stats.tripCount"
          :flight-count="stats.flightCount ?? 0"
          :wishlist-count="wishlistCount"
          :loading="loading"
          :highlight-visited="statsHighlight"
          :highlight-wishlist="statsHighlightWishlist"
          @stats-click="onStatsClick"
        />
      </div>

      <!-- Quick Actions top-right -->
      <AppCard class="globe-home__quick-actions" variant="default" :hoverable="false" :padding="true">
        <p class="body-xs text-tertiary globe-home__qa-label">{{ t('app.tagline') }}</p>
        <div class="quick-actions__list">
          <button class="quick-action-btn" @click="goToNewTrip">
            <AppIcon name="Plus" :size="16" color-class="text-sunset" />
            <span class="body-sm">{{ t('home.quick.newTrip') }}</span>
          </button>
          <AppDivider />
          <button class="quick-action-btn" @click="goToMap">
            <AppIcon name="MapPin" :size="16" color-class="text-ocean" />
            <span class="body-sm">{{ t('home.quick.browseMap') }}</span>
          </button>
          <AppDivider />
          <button class="quick-action-btn" @click="goToTimeline">
            <AppIcon name="TrendingUp" :size="16" color-class="text-forest" />
            <span class="body-sm">{{ t('home.quick.viewStats') }}</span>
          </button>
          <AppDivider />
          <button class="quick-action-btn" @click="goToNewTripPhotos">
            <AppIcon name="Camera" :size="16" color-class="text-ocean" />
            <span class="body-sm">{{ t('home.quick.uploadPhotos') }}</span>
          </button>
        </div>
      </AppCard>
    </div>

    <!-- ═══════ Transition: globe → below ═══════ -->
    <div class="globe-home__divider-wrap">
      <div class="globe-home__divider" />
      <span class="globe-home__divider-label">Your Journey</span>
    </div>

    <!-- ═══════ Below Hero: Recent Trips ═══════ -->
    <div v-if="hasData" class="globe-home__below">
      <div class="globe-home__below-inner">
        <div class="globe-home__recent-top">
          <h2 class="globe-home__recent-title">{{ t('home.recentTrips') }}</h2>
          <button class="globe-home__recent-link" @click="goToTimeline">
            {{ t('home.viewAll') }}<span class="globe-home__recent-arrow">&rarr;</span>
          </button>
        </div>
        <div class="globe-home__recent-strip">
          <TripMiniCard v-for="trip in tripStore.recentTrips" :key="trip.id" :trip="trip" @click="goToTrip(trip.id)" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!hasData && !loading" class="globe-home__empty-wrap">
      <AppEmptyState icon="Globe" :title="t('home.empty.title')" :description="t('home.empty.desc')" :cta-text="t('home.empty.cta')" @cta-click="goToNewTrip" />
    </div>
  </div>
</template>

<style scoped>
.globe-home {
  width: 100%;
  background: var(--color-page);
}

/* Loading */
.globe-home__loading {
  position: fixed; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: var(--space-md);
  background: var(--color-page);
  z-index: 100;
}
.globe-home__loading-spinner {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 2px solid var(--text-tertiary);
  border-top-color: var(--color-sunset);
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ═══════════════════════════════════════════
   Hero — Globe 独占全屏视口
   ═══════════════════════════════════════════ */
.globe-home__hero {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 440px;
  overflow: hidden;
  background: var(--color-page);
}
.globe-home__globe {
  position: absolute;
  inset: 0;
}

/* ────── Welcome ────── */
.globe-home__welcome {
  position: absolute; inset: 0; z-index: 10;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  pointer-events: none;
  animation: welcome-in 800ms var(--ease-out) both;
}
.globe-home__welcome--leave {
  animation: welcome-out 800ms var(--ease-in) both;
}
.globe-home__welcome-title {
  font-family: var(--font-display);
  font-size: clamp(var(--text-display-md), 4vw, var(--text-display-xl));
  font-weight: 600;
  color: var(--text-primary);
  text-shadow: 0 2px 12px rgba(0,0,0,0.08);
  margin-bottom: var(--space-sm);
  line-height: 1.1;
}
.globe-home__welcome-desc {
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  color: var(--text-secondary);
  text-shadow: 0 1px 6px rgba(0,0,0,0.05);
}
@keyframes welcome-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes welcome-out {
  from { opacity: 1; filter: blur(0) scale(1); }
  to   { opacity: 0; filter: blur(8px) scale(0.95); }
}

/* ────── Stats sidebar ────── */
.globe-home__stats {
  position: absolute;
  top: 50%;
  left: max(16px, calc((100% - 1280px) / 2 + 16px));
  transform: translateY(-50%);
  z-index: 5;
  animation: stats-in 0.6s var(--ease-out) 0.3s both;
}
@keyframes stats-in {
  from { opacity: 0; transform: translateY(-50%) translateX(-16px); }
  to   { opacity: 1; transform: translateY(-50%) translateX(0); }
}

/* ────── Quick Actions top-right ────── */
.globe-home__quick-actions {
  position: absolute;
  top: 50%;
  right: max(16px, calc((100% - 1280px) / 2 + 16px));
  transform: translateY(-50%);
  z-index: 5;
  animation: qa-in 0.5s var(--ease-out) 0.5s both;
}
.globe-home__qa-label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}
@keyframes qa-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.quick-actions__list {
  display: flex; flex-direction: column; gap: 2px;
}
.quick-action-btn {
  display: flex; align-items: center;
  gap: var(--space-sm);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: none; background: transparent;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-body);
  text-align: left;
  white-space: nowrap;
  transition: background 150ms;
}
.quick-action-btn:hover { background: var(--color-card-hover); }

/* ═══════════════════════════════════════════
   Below Hero — Recent Trips
   ═══════════════════════════════════════════ */
.globe-home__below {
  padding: var(--space-xl) var(--page-padding) var(--space-3xl);
  background: linear-gradient(180deg, var(--color-page) 0%, var(--color-card-hover) 100%);
}
.globe-home__below-inner {
  max-width: var(--content-max-width, 1280px);
  margin: 0 auto;
  animation: below-in 0.6s var(--ease-out) 0.4s both;
}
@keyframes below-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.globe-home__recent-top {
  display: flex; align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}
.globe-home__recent-title {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}
.globe-home__recent-link {
  border: none; background: none;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
  cursor: pointer; padding: 0;
  transition: color 150ms;
}
.globe-home__recent-link:hover { color: var(--text-primary); }
.globe-home__recent-arrow {
  display: inline-block;
  margin-left: 4px;
  transition: transform 150ms;
}
.globe-home__recent-link:hover .globe-home__recent-arrow { transform: translateX(3px); }
.globe-home__recent-strip {
  display: flex; gap: var(--card-gap, 20px);
  overflow-x: auto;
  padding: var(--space-sm) var(--space-xs) var(--space-sm);
  scroll-behavior: smooth;
}
.globe-home__recent-strip::-webkit-scrollbar { height: 4px; }
.globe-home__recent-strip::-webkit-scrollbar-track { background: transparent; }
.globe-home__recent-strip::-webkit-scrollbar-thumb { background: var(--text-tertiary); border-radius: 2px; }

/* Empty */
.globe-home__empty-wrap {
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh;
}

/* ────── Hero → Below divider ────── */
.globe-home__divider-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl) var(--page-padding) var(--space-sm);
  position: relative;
}
.globe-home__divider {
  flex: 1;
  max-width: 320px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-sunset), transparent);
  opacity: 0.2;
}
.globe-home__divider-label {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 1024px) {
  .globe-home__stats { left: 16px; }
  .globe-home__quick-actions { right: 16px; }
}
@media (max-width: 768px) {
  .globe-home__stats { display: none; }
  .globe-home__quick-actions { display: none; }
  .globe-home__hero { height: 70vh; min-height: 400px; }
  .globe-home__below { padding: var(--space-xl) var(--space-md); }
  .globe-home__recent-title { font-size: var(--text-body-lg); }
}
</style>
