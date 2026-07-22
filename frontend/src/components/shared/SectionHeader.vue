<script setup lang="ts">
/**
 * SectionHeader — 区块标题
 * 标签 + 可选右侧操作链接
 */
withDefaults(
  defineProps<{
    title: string
    actionLabel?: string
    actionRoute?: string
  }>(),
  {},
)

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="section-header">
    <h3 class="section-header__title">{{ title }}</h3>
    <button
      v-if="actionLabel"
      class="section-header__action"
      @click="$emit('action')"
    >
      {{ actionLabel }}
      <span class="section-header__arrow">&rarr;</span>
    </button>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.section-header__title {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}

.section-header__action {
  border: none;
  background: none;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0;
  transition: color var(--duration-fast);
}

.section-header__action:hover {
  color: var(--text-primary);
}

.section-header__arrow {
  display: inline-block;
  margin-left: 4px;
  transition: transform var(--duration-fast);
}

.section-header__action:hover .section-header__arrow {
  transform: translateX(3px);
}
</style>
