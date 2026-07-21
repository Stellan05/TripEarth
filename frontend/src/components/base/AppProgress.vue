<script setup lang="ts">
withDefaults(
  defineProps<{
    percentage: number
    color?: string
    showText?: boolean
  }>(),
  { color: 'sunset' },
)
</script>

<template>
  <div class="app-progress" role="progressbar" :aria-valuenow="percentage" aria-valuemin="0" aria-valuemax="100">
    <div class="app-progress__track">
      <div
        class="app-progress__fill"
        :class="`app-progress__fill--${color}`"
        :style="{ width: `${Math.min(100, Math.max(0, percentage))}%` }"
      />
    </div>
    <span v-if="showText" class="app-progress__text">{{ Math.round(percentage) }}%</span>
  </div>
</template>

<style scoped>
.app-progress { display: flex; align-items: center; gap: var(--space-sm); }

.app-progress__track {
  flex: 1;
  height: 4px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.app-progress__fill {
  height: 100%;
  border-radius: 2px;
  transition: width 300ms var(--ease-out);
}

.app-progress__fill--sunset  { background: var(--color-sunset); }
.app-progress__fill--ocean   { background: var(--color-ocean); }
.app-progress__fill--forest  { background: var(--color-forest); }

.app-progress__text {
  font-size: var(--text-body-xs);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  min-width: 36px;
  text-align: right;
}
</style>
