<script setup lang="ts">
/**
 * DestinationCard — 目的地卡片
 * 封面渐变背景 + 国旗 emoji + 国家名 + 书签 + 展开城市列表
 */
import { ref, computed } from 'vue'
import AppCard from '@/components/base/AppCard.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import type { WishlistItem } from '@/types/wishlist'

const props = withDefaults(
  defineProps<{
    destination: WishlistItem
    expanded?: boolean
  }>(),
  { expanded: false },
)

const emit = defineEmits<{
  click: []
  'remove-city': [cityName: string]
  'add-city': [cityName: string]
}>()

const isOpen = ref(props.expanded)

const coverStyle = computed(() => {
  const hue = (props.destination.countryName?.charCodeAt(0) || 0) * 137.5 % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 35%, 80%), hsl(${hue + 40}, 30%, 65%))`,
  }
})

const showCityCount = computed(() => {
  if (props.destination.cityCount && props.destination.cityCount > 0) {
    return props.destination.cityCount
  }
  return null
})

// Mock cities for display in expanded mode
const mockCities = computed(() => {
  if (props.destination.type === 'CITY') return []
  if (props.destination.cityCount && props.destination.cityCount > 0) {
    return [`City 1`, `City 2`].slice(0, props.destination.cityCount)
  }
  return []
})

function toggleExpand() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <AppCard
    variant="destination"
    :hoverable="true"
    tag="button"
    class="destination-card"
    @click="emit('click')"
  >
    <!-- Cover -->
    <div class="destination-card__cover" :style="coverStyle">
      <span class="destination-card__flag">{{ destination.flagEmoji }}</span>
      <div v-if="showCityCount" class="destination-card__bookmark">
        <AppIcon name="Bookmark" :size="16" color-class="" />
        <span class="destination-card__bookmark-count">{{ showCityCount }}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="destination-card__body">
      <h3 class="destination-card__name">{{ destination.countryName }}</h3>

      <!-- Expand toggle -->
      <button
        v-if="destination.type === 'COUNTRY'"
        class="destination-card__expand-btn"
        @click.stop="toggleExpand"
      >
        <span v-if="isOpen">Less</span>
        <span v-else>More</span>
        <AppIcon
          :name="isOpen ? 'ChevronUp' : 'ChevronDown'"
          :size="14"
          color-class=""
        />
      </button>

      <!-- Expanded city list -->
      <Transition name="city-expand">
        <div v-if="isOpen" class="destination-card__cities">
          <div
            v-for="city in mockCities"
            :key="city"
            class="destination-card__city-row"
          >
            <span class="destination-card__city-name">{{ city }}</span>
            <button
              class="destination-card__city-remove"
              @click.stop="emit('remove-city', city)"
              aria-label="Remove city"
            >
              <AppIcon name="X" :size="12" color-class="" />
            </button>
          </div>

          <button
            class="destination-card__add-city"
            @click.stop="emit('add-city', destination.countryName)"
          >
            <AppIcon name="Plus" :size="14" color-class="" />
            <span>Add city</span>
          </button>
        </div>
      </Transition>
    </div>
  </AppCard>
</template>

<style scoped>
.destination-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  border: none;
  width: 100%;
}

.destination-card__cover {
  width: 100%;
  height: 140px;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-md);
  box-sizing: border-box;
}

.destination-card__flag {
  font-size: 48px;
  line-height: 1;
}

.destination-card__bookmark {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-full);
  color: #fff;
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  font-weight: var(--font-weight-medium);
}

.destination-card__bookmark-count {
  line-height: 1;
}

.destination-card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.destination-card__name {
  font-family: var(--font-display);
  font-size: var(--text-display-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}

.destination-card__expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0;
  transition: color var(--duration-fast);
}

.destination-card__expand-btn:hover {
  color: var(--text-primary);
}

.destination-card__cities {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

.destination-card__city-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.destination-card__city-name {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-primary);
}

.destination-card__city-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 50%;
  transition: all var(--duration-fast);
}

.destination-card__city-remove:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-danger);
}

.destination-card__add-city {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--color-forest);
  cursor: pointer;
  padding: 6px 0;
  font-weight: var(--font-weight-medium);
  transition: opacity var(--duration-fast);
}

.destination-card__add-city:hover {
  opacity: 0.75;
}

/* Expand transition */
.city-expand-enter-active,
.city-expand-leave-active {
  transition: all 300ms ease;
  max-height: 300px;
}

.city-expand-enter-from,
.city-expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
