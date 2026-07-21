<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatsPanel from '@/components/features/trip/StatsPanel.vue'
import TripMiniCard from '@/components/features/trip/TripMiniCard.vue'
import AppCard from '@/components/base/AppCard.vue'
import AppEmptyState from '@/components/base/AppEmptyState.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import AppDivider from '@/components/base/AppDivider.vue'
import Globe3D from '@/components/features/globe/Globe3D.vue'
import { useI18n } from '@/composables/useI18n'
import { daysBetween } from '@/utils/date'
import type { Trip } from '@/types/trip'
import type { CountryStatus } from '@/types/country'

const router = useRouter()
const { t } = useI18n()

const loading = ref(true)
const welcomeVisible = ref(false)
const welcomeLeaving = ref(false)

const mockTrips: Trip[] = [
  { id: 1, countryCode: 'FRA', countryName: 'France', flagEmoji: '🇫🇷', cityName: 'Paris', startDate: '2024-10-12', endDate: '2024-10-19', dayCount: daysBetween('2024-10-12', '2024-10-19'), cityCount: 3 },
  { id: 2, countryCode: 'JPN', countryName: 'Japan', flagEmoji: '🇯🇵', cityName: 'Tokyo', startDate: '2025-03-15', endDate: '2025-03-22', dayCount: daysBetween('2025-03-15', '2025-03-22'), cityCount: 2 },
  { id: 3, countryCode: 'ITA', countryName: 'Italy', flagEmoji: '🇮🇹', cityName: 'Rome', startDate: '2024-07-05', endDate: '2024-07-10', dayCount: daysBetween('2024-07-05', '2024-07-10'), cityCount: 2 },
  { id: 4, countryCode: 'THA', countryName: 'Thailand', flagEmoji: '🇹🇭', cityName: 'Bangkok', startDate: '2024-03-08', endDate: '2024-03-15', dayCount: daysBetween('2024-03-08', '2024-03-15'), cityCount: 3 },
  { id: 5, countryCode: 'ESP', countryName: 'Spain', flagEmoji: '🇪🇸', cityName: 'Barcelona', startDate: '2023-08-10', endDate: '2023-08-16', dayCount: daysBetween('2023-08-10', '2023-08-16'), cityCount: 2 },
  { id: 6, countryCode: 'KOR', countryName: 'South Korea', flagEmoji: '🇰🇷', cityName: 'Seoul', startDate: '2023-05-01', endDate: '2023-05-05', dayCount: daysBetween('2023-05-01', '2023-05-05'), cityCount: 1 },
]

const mockVisitedCountries: CountryStatus[] = [
  { code: 'FRA', name: 'France',       status: 'visited', visitCount: 3, lastVisit: '2024-10-12', heartCount: 2, hasNotes: true },
  { code: 'JPN', name: 'Japan',        status: 'visited', visitCount: 5, lastVisit: '2025-03-15', heartCount: 3, hasNotes: true },
  { code: 'ITA', name: 'Italy',        status: 'visited', visitCount: 2, lastVisit: '2024-07-05', hasNotes: true },
  { code: 'THA', name: 'Thailand',     status: 'visited', visitCount: 1, lastVisit: '2024-03-08' },
  { code: 'ESP', name: 'Spain',        status: 'visited', visitCount: 1, lastVisit: '2023-08-10', heartCount: 1 },
  { code: 'KOR', name: 'South Korea',  status: 'visited', visitCount: 1, lastVisit: '2023-05-01' },
  { code: 'GBR', name: 'United Kingdom', status: 'visited', visitCount: 2, lastVisit: '2024-12-20', heartCount: 1 },
  { code: 'ISL', name: 'Iceland',      status: 'wishlist', citiesCount: 12 },
  { code: 'NZL', name: 'New Zealand',  status: 'wishlist', citiesCount: 8 },
  { code: 'PER', name: 'Peru',         status: 'wishlist', citiesCount: 5 },
  { code: 'MAR', name: 'Morocco',      status: 'wishlist', citiesCount: 4 },
  { code: 'NOR', name: 'Norway',       status: 'wishlist', citiesCount: 6 },
  { code: 'CHN', name: 'China',        status: 'visited', visitCount: 8, isHome: true, hasNotes: true, heartCount: 5 },
]

const mockWishlist = mockVisitedCountries.filter(c => c.status === 'wishlist')
const hasData = mockTrips.length > 0

function goToTrip(id: number) { router.push(`/trip/${id}`) }
function goToNewTrip() { router.push('/trip/new') }
function goToCountry(code: string, _status?: CountryStatus | null) {
  if (!code) return
  const s = _status || mockVisitedCountries.find(c => c.code.toLowerCase() === code.toLowerCase())
  if (s?.status === 'visited') router.push(`/country/${code.toLowerCase()}`)
  else router.push('/wishlist')
}
function goToTimeline() { router.push('/timeline') }
function goToMap() { router.push('/') }
function goToPhotos() { router.push('/timeline') }

onMounted(() => {
  setTimeout(() => { loading.value = false }, 800)

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
        :country-statuses="mockVisitedCountries"
        :loading="false"
        class="globe-home__globe"
        @country-click="goToCountry"
      />

      <!-- Welcome overlay -->
      <div v-if="welcomeVisible" :class="['globe-home__welcome', { 'globe-home__welcome--leave': welcomeLeaving }]">
        <h1 class="globe-home__welcome-title">{{ t('home.welcome') }}</h1>
        <p class="globe-home__welcome-desc">{{ t('home.today') }}</p>
      </div>

      <!-- Stats sidebar -->
      <div class="globe-home__stats">
        <StatsPanel
          :country-count="7"
          :city-count="23"
          :trip-count="12"
          :flight-count="8"
          :wishlist-count="mockWishlist.length"
          :loading="false"
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
          <button class="quick-action-btn" @click="goToPhotos">
            <AppIcon name="Camera" :size="16" color-class="text-ocean" />
            <span class="body-sm">{{ t('home.quick.uploadPhotos') }}</span>
          </button>
        </div>
      </AppCard>
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
          <TripMiniCard v-for="trip in mockTrips" :key="trip.id" :trip="trip" @click="goToTrip(trip.id)" />
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
  padding: var(--space-2xl) var(--page-padding) var(--space-3xl);
  background: var(--color-page);
}
.globe-home__below-inner {
  max-width: var(--content-max-width, 1280px);
  margin: 0 auto;
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
  padding-bottom: var(--space-sm);
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
