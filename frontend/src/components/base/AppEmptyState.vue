<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title: string
    description?: string
    ctaText?: string
  }>(),
  { icon: 'Inbox' },
)

const emit = defineEmits<{
  'cta-click': []
}>()
</script>

<template>
  <div class="app-empty">
    <div class="app-empty__icon">
      <AppIcon :name="icon" :size="48" color-class="text-tertiary" :stroke-width="1.5" />
    </div>
    <h3 class="app-empty__title">{{ title }}</h3>
    <p v-if="description" class="app-empty__desc">{{ description }}</p>
    <slot>
      <AppButton v-if="ctaText" variant="primary" size="md" @click="$emit('cta-click')">
        {{ ctaText }}
      </AppButton>
    </slot>
  </div>
</template>

<script lang="ts">
import AppIcon from './AppIcon.vue'
import AppButton from './AppButton.vue'
export default { components: { AppIcon, AppButton } }
</script>

<style scoped>
.app-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
  gap: var(--space-md);
}

.app-empty__icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.03);
  margin-bottom: var(--space-sm);
}

.app-empty__title {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.app-empty__desc {
  font-size: var(--text-body-md);
  color: var(--text-secondary);
  max-width: 360px;
  line-height: var(--leading-loose);
}
</style>
