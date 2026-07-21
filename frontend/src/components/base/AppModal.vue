<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    visible: boolean
    title?: string
    width?: string
    closable?: boolean
  }>(),
  { width: '480px', closable: true },
)

const emit = defineEmits<{
  close: []
  confirm: []
}>()

function onBackdropClick() {
  if (props.closable) emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closable) emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

import { onMounted, onUnmounted } from 'vue'
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="app-modal" @click.self="onBackdropClick">
        <div class="app-modal__panel" :style="{ maxWidth: width }">
          <div v-if="title || closable" class="app-modal__header">
            <h2 v-if="title" class="app-modal__title">{{ title }}</h2>
            <AppIconButton
              v-if="closable"
              icon="X"
              size="sm"
              label="Close"
              class="app-modal__close"
              @click="$emit('close')"
            />
          </div>
          <div class="app-modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="app-modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import AppIconButton from './AppIconButton.vue'
export default { components: { AppIconButton } }
</script>

<style scoped>
.app-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-xl);
}

.app-modal__panel {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
}

.app-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-lg) 0;
}

.app-modal__title {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.app-modal__close {
  margin-left: auto;
}

.app-modal__body {
  padding: var(--space-lg);
  overflow-y: auto;
  flex: 1;
}

.app-modal__footer {
  padding: 0 var(--space-lg) var(--space-lg);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}

.modal-enter-active { animation: scale-in var(--duration-slow) var(--ease-spring); }
.modal-leave-active { animation: fade-in var(--duration-normal) var(--ease-in) reverse; }
</style>
