<script setup lang="ts">
/**
 * RouteVisual — 路线视觉
 * DEP code → icon → ARR code，水平排列
 */
import AppIcon from '@/components/base/AppIcon.vue'

withDefaults(
  defineProps<{
    depCode: string
    arrCode: string
    depCity?: string
    arrCity?: string
    type?: 'FLIGHT' | 'TRAIN' | 'CAR' | 'OTHER'
    showCities?: boolean
  }>(),
  { type: 'FLIGHT', showCities: false },
)
</script>

<template>
  <div class="route-visual">
    <span class="route-visual__code">{{ depCode }}</span>
    <AppIcon
      :name="type === 'FLIGHT' ? 'ArrowRight' : 'ArrowRight'"
      :size="14"
      color-class=""
      class="route-visual__arrow"
    />
    <span class="route-visual__code">{{ arrCode }}</span>
    <template v-if="showCities">
      <span v-if="depCity || arrCity" class="route-visual__cities">
        <span class="route-visual__city">{{ depCity }}</span>
        <span class="route-visual__sep">→</span>
        <span class="route-visual__city">{{ arrCity }}</span>
      </span>
    </template>
  </div>
</template>

<style scoped>
.route-visual {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.route-visual__code {
  letter-spacing: var(--tracking-wide);
}

.route-visual__arrow {
  color: var(--text-tertiary);
}

.route-visual__cities {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  margin-left: var(--space-xs);
}

.route-visual__sep {
  margin: 0 2px;
  color: var(--text-tertiary);
}
</style>
