<script setup lang="ts">
/**
 * CenteredFormLayout — 居中表单布局
 * 用途: TripEditor (新增/编辑旅行)
 * Slots: header, default (表单主体), actions (底部按钮)
 */
withDefaults(
  defineProps<{
    maxWidth?: string
  }>(),
  {
    maxWidth: '960px',
  },
)
</script>

<template>
  <div class="centered-form">
    <div class="centered-form__inner" :style="{ maxWidth }">
      <header v-if="$slots.header" class="centered-form__header">
        <slot name="header" />
      </header>

      <main class="centered-form__body">
        <slot />
      </main>

      <footer v-if="$slots.actions" class="centered-form__actions">
        <slot name="actions" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.centered-form {
  min-height: 100vh;
  padding: var(--page-padding);
  padding-top: calc(var(--page-padding) + 60px); /* NavPill offset */
  display: flex;
  justify-content: center;
}

.centered-form__inner {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.centered-form__header {
  margin-bottom: var(--space-2xl);
}

.centered-form__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
}

.centered-form__actions {
  margin-top: var(--space-2xl);
  padding-top: var(--space-lg);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
}
</style>
