/**
 * DestinationCard — 目的地卡片
 * 封面渐变背景 + 国旗 emoji + 国家名 + 收藏计数
 * 点击可打开详情弹窗
 */
<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '@/components/base/AppCard.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import type { WishlistItem } from '@/types/wishlist'

const props = withDefaults(
  defineProps<{
    destination: WishlistItem
  }>(),
  {},
)

const emit = defineEmits<{
  click: []
}>()

const coverStyle = computed(() => {
  const hue = (props.destination.countryName?.charCodeAt(0) || 0) * 137.5 % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 35%, 80%), hsl(${hue + 40}, 30%, 65%))`,
  }
})

const entryCount = computed(() => {
  return props.destination.entries?.length || props.destination.cityCount || 0
})
</script>

<template>
  <AppCard
    variant="destination"
    :hoverable="true"
    tag="button"
    class="destination-card"
    @click="emit('click')"
  >
    <div class="destination-card__cover" :style="coverStyle">
      <span class="destination-card__flag">{{ destination.flagEmoji }}</span>
      <div class="destination-card__bookmark">
        <AppIcon name="Bookmark" :size="16" color-class="" />
        <span class="destination-card__bookmark-count">{{ entryCount }}</span>
      </div>
    </div>

    <div class="destination-card__body">
      <h3 class="destination-card__name">{{ destination.cityName || destination.countryName }}</h3>
      <p v-if="destination.cityName" class="destination-card__subtitle">{{ destination.countryName }}</p>
      <p v-if="destination.note" class="destination-card__note">{{ destination.note }}</p>
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
  gap: 4px;
}

.destination-card__name {
  font-family: var(--font-display);
  font-size: var(--text-display-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}

.destination-card__subtitle {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  margin: 0;
}

.destination-card__note {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
}
</style>
