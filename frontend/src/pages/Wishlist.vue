/**
 * Wishlist — 想去清单页
 *
 * 布局: GridLayout (3 列)
 * 顶部: PageHeader + CategoryToggle
 * 网格: DestinationCard grid
 * 右下: AddFab → 弹出 AppModal 添加目的地
 *
 * 状态: loading / empty / normal
 */
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import GridLayout from '@/components/layout/GridLayout.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import CategoryToggle from '@/components/features/wishlist/CategoryToggle.vue'
import DestinationCard from '@/components/features/wishlist/DestinationCard.vue'
import AddFab from '@/components/features/wishlist/AddFab.vue'
import WishlistDetailModal from '@/components/features/wishlist/WishlistDetailModal.vue'
import AppModal from '@/components/base/AppModal.vue'
import SearchInput from '@/components/shared/SearchInput.vue'
import CountrySelect from '@/components/shared/CountrySelect.vue'
import AppInput from '@/components/base/AppInput.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppSpinner from '@/components/base/AppSpinner.vue'
import AppEmptyState from '@/components/base/AppEmptyState.vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useToast } from '@/composables/useToast'
import type { WishlistItem } from '@/types/wishlist'

const wishlistStore = useWishlistStore()
const { success, error: showError } = useToast()

// ── State ──
const category = ref<string>('countries')
const modalVisible = ref(false)
const newType = ref<'COUNTRY' | 'CITY'>('COUNTRY')
const newCountryCode = ref('')
const newCityName = ref('')
const newNote = ref('')
const submitting = ref(false)
const detailDest = ref<WishlistItem | null>(null)
const detailVisible = ref(false)

// ── Computed ──

const filteredItems = computed<WishlistItem[]>(() => {
  if (category.value === 'cities') {
    return wishlistStore.items.filter((i) => i.type === 'CITY')
  }
  return wishlistStore.items.filter((i) => i.type === 'COUNTRY')
})

// ── Methods ──

function onCategoryChange(val: string) {
  category.value = val
}

function openModal() {
  newType.value = 'COUNTRY'
  newCountryCode.value = ''
  newCityName.value = ''
  newNote.value = ''
  modalVisible.value = true
}

async function submitAdd() {
  if (!newCountryCode.value) return
  submitting.value = true
  try {
    const res = await wishlistStore.addItem({
      type: newType.value,
      countryCode: newCountryCode.value,
      cityName: newType.value === 'CITY' ? newCityName.value : undefined,
      note: newNote.value || undefined,
    })
    if (res.code === 200) {
      success('Destination added to wishlist!')
      modalVisible.value = false
    } else {
      showError(res.message || 'Failed to add destination')
    }
  } catch {
    showError('Failed to add destination')
  } finally {
    submitting.value = false
  }
}

async function removeItem(id: number) {
  try {
    await wishlistStore.removeItem(id)
    success('Removed from wishlist')
  } catch {
    showError('Failed to remove')
  }
}

function openDetail(item: WishlistItem) {
  detailDest.value = item
  detailVisible.value = true
}

function closeDetail() {
  detailVisible.value = false
  detailDest.value = null
}

function onUpdateEntry(itemId: number, entries: import('@/types/wishlist').WishlistEntry[]) {
  const item = wishlistStore.items.find(i => i.id === itemId)
  if (item) {
    item.entries = entries
    item.cityCount = entries.length
  }
}

function onTypeToggle() {
  newType.value = newType.value === 'COUNTRY' ? 'CITY' : 'COUNTRY'
  newCityName.value = ''
}

onMounted(() => {
  wishlistStore.fetchWishlist()
  document.title = 'Wishlist'
})
</script>

<template>
  <div class="wishlist-wrapper">
    <GridLayout :cols="3" gap="var(--card-gap, 20px)">
      <template #header>
        <PageHeader
          title="Dream Destinations"
          subtitle="Places waiting to be explored"
          title-tag="h1"
          title-size="display-lg"
        />

        <div class="wishlist__controls">
          <CategoryToggle
            :model-value="category"
            active-color="forest"
            @change="onCategoryChange"
          />
        </div>
      </template>

      <!-- Loading -->
      <template v-if="wishlistStore.loading && wishlistStore.items.length === 0">
        <div class="wishlist__loading">
          <AppSpinner size="lg" label="Loading wishlist..." />
        </div>
      </template>

      <!-- Empty -->
      <template v-else-if="filteredItems.length === 0">
        <div class="wishlist__empty-full">
          <AppEmptyState
            icon="Bookmark"
            title="Your wishlist is empty"
            description="Start adding places you want to visit!"
          />
        </div>
      </template>

      <!-- Grid -->
      <DestinationCard
        v-for="item in filteredItems"
        :key="item.id"
        :destination="item"
        @click="openDetail(item)"
      />
    </GridLayout>

    <!-- Detail Modal -->
    <WishlistDetailModal
      :destination="detailDest"
      :visible="detailVisible"
      @close="closeDetail"
      @update-entry="onUpdateEntry"
    />

    <!-- Add FAB -->
    <AddFab @click="openModal" />

    <!-- Add Modal -->
    <AppModal
      :visible="modalVisible"
      title="Add Destination"
      width="480px"
      @close="modalVisible = false"
    >
      <div class="wishlist__form">
        <!-- Toggle COUNTRY / CITY -->
        <div class="wishlist__type-toggle">
          <AppButton
            :variant="newType === 'COUNTRY' ? 'primary' : 'ghost'"
            size="sm"
            @click="onTypeToggle"
          >
            Country
          </AppButton>
          <AppButton
            :variant="newType === 'CITY' ? 'primary' : 'ghost'"
            size="sm"
            @click="onTypeToggle"
          >
            City
          </AppButton>
        </div>

        <CountrySelect
          v-model="newCountryCode"
          label="Country *"
          placeholder="Search country..."
          @search="(q) => console.log('search', q)"
        />

        <AppInput
          v-if="newType === 'CITY'"
          v-model="newCityName"
          label="City Name"
          placeholder="Enter city name..."
        />

        <AppInput
          v-model="newNote"
          label="Note (optional)"
          placeholder="Why do you want to go there?"
        />
      </div>

      <template #footer>
        <AppButton variant="ghost" size="md" @click="modalVisible = false">
          Cancel
        </AppButton>
        <AppButton
          variant="primary"
          size="md"
          :loading="submitting"
          :disabled="!newCountryCode"
          @click="submitAdd"
        >
          Add
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.wishlist-wrapper {
  width: 100%;
  min-height: 100vh;
}

<style scoped>
.wishlist__controls {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.wishlist__loading {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: var(--space-3xl) 0;
}

.wishlist__empty-full {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: var(--space-3xl) 0;
}

.wishlist__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.wishlist__type-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
</style>
