<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import AppIcon from './AppIcon.vue'

const { toasts, dismiss, ICON_MAP } = useToast()
</script>

<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast-item', `toast-item--${toast.type}`]"
        @click="dismiss(toast.id)"
      >
        <AppIcon :name="ICON_MAP[toast.type]" :size="16" :color-class="`toast-item__icon--${toast.type}`" />
        <span class="toast-item__message">{{ toast.message }}</span>
        <button class="toast-item__close" @click.stop="dismiss(toast.id)" aria-label="Close">
          <AppIcon name="X" :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 20px;
  border-radius: var(--radius-full);
  background: var(--color-card);
  box-shadow: var(--shadow-modal);
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-size: var(--text-body-sm);
  color: var(--text-primary);
  cursor: pointer;
  pointer-events: auto;
  min-width: 200px;
  max-width: 480px;
}

.toast-item__icon--success { color: var(--color-forest); }
.toast-item__icon--error   { color: var(--color-danger); }
.toast-item__icon--info    { color: var(--color-ocean); }

.toast-item__message { flex: 1; }

.toast-item__close {
  display: flex;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-tertiary);
  padding: 0;
}
.toast-item__close:hover { color: var(--text-secondary); }

.toast-enter-active { animation: fade-in-down var(--duration-normal) var(--ease-out); }
.toast-leave-active { animation: fade-in var(--duration-normal) var(--ease-in) reverse; position: absolute; }
.toast-move { transition: transform var(--duration-normal) var(--ease-out); }
</style>
