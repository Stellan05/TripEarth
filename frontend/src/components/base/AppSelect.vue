<script setup lang="ts">
import type { SelectOption } from '@/types/common'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    options: SelectOption[]
    placeholder?: string
    searchable?: boolean
    clearable?: boolean
    error?: string
    label?: string
    disabled?: boolean
  }>(),
  {},
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  search: [query: string]
}>()

const open = ref(false)
const searchQuery = ref('')
const wrapperRef = ref<HTMLElement>()

const displayLabel = computed(() => {
  const opt = props.options.find((o) => o.value === props.modelValue)
  return opt?.label ?? ''
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

function select(opt: SelectOption) {
  emit('update:modelValue', opt.value)
  searchQuery.value = ''
  open.value = false
}

function onSearchFocus() {
  open.value = true
}

function onClickOutside(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    open.value = false
    searchQuery.value = ''
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

import { ref, computed, onMounted, onUnmounted } from 'vue'
</script>

<template>
  <div ref="wrapperRef" :class="['app-select', { 'app-select--error': error, 'app-select--open': open }, disabled ? 'app-select--disabled' : '']">
    <label v-if="label" class="app-select__label">{{ label }}</label>
    <div class="app-select__trigger" @click="!disabled && (open = !open)">
      <input
        v-if="searchable && open"
        v-model="searchQuery"
        class="app-select__search"
        :placeholder="placeholder"
        @focus="onSearchFocus"
        @input="$emit('search', searchQuery)"
      />
      <span v-else class="app-select__value" :class="{ 'app-select__value--placeholder': !displayLabel }">
        {{ displayLabel || placeholder || 'Select...' }}
      </span>
      <span class="app-select__arrow">
        <AppIcon :name="open ? 'ChevronUp' : 'ChevronDown'" :size="16" color-class="text-tertiary" />
      </span>
    </div>
    <Teleport to="body">
      <Transition name="select-drop">
        <div v-if="open" class="app-select__dropdown">
          <div
            v-for="opt in filteredOptions"
            :key="opt.value"
            :class="['app-select__option', { 'app-select__option--selected': opt.value === modelValue }]"
            @click="select(opt)"
          >
            <span v-if="opt.icon" class="app-select__option-icon">{{ opt.icon }}</span>
            {{ opt.label }}
          </div>
          <div v-if="filteredOptions.length === 0" class="app-select__empty">No options found</div>
        </div>
      </Transition>
    </Teleport>
    <span v-if="error" class="app-select__error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import AppIcon from './AppIcon.vue'
export default { components: { AppIcon } }
</script>

<style scoped>
.app-select { position: relative; display: flex; flex-direction: column; gap: var(--space-xs); }
.app-select--disabled { opacity: 0.5; }

.app-select__label { font-size: var(--text-body-sm); color: var(--text-secondary); font-weight: var(--font-weight-medium); }

.app-select__trigger {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-bottom: var(--space-xs);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-default);
}
.app-select--open .app-select__trigger { border-bottom-color: var(--color-sunset); }
.app-select--error .app-select__trigger { border-bottom-color: var(--color-danger); }

.app-select__value { flex: 1; font-size: var(--text-body-md); color: var(--text-primary); }
.app-select__value--placeholder { color: var(--text-tertiary); }

.app-select__search {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-primary);
}

.app-select__arrow { display: flex; align-items: center; margin-left: var(--space-sm); }

.app-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--z-dropdown);
  background: var(--color-card);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-modal);
  margin-top: var(--space-xs);
  max-height: 240px;
  overflow-y: auto;
  padding: var(--space-xs);
}

.app-select__option {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-body-md);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.app-select__option:hover { background: var(--color-card-hover); }
.app-select__option--selected { color: var(--color-sunset); font-weight: var(--font-weight-medium); }

.app-select__empty { padding: 8px 12px; font-size: var(--text-body-sm); color: var(--text-tertiary); }
.app-select__error { font-size: var(--text-body-xs); color: var(--color-danger); }

.select-drop-enter-active { animation: fade-in-down var(--duration-fast) var(--ease-out); }
.select-drop-leave-active { animation: fade-in var(--duration-fast) var(--ease-in) reverse; }
</style>
