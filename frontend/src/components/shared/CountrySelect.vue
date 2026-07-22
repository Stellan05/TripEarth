<script setup lang="ts">
/**
 * CountrySelect — 国家搜索下拉
 * 显示国旗+名称，searchable
 */
import { ref, computed } from 'vue'
import type { SelectOption } from '@/types/common'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    error?: string
    disabled?: boolean
    clearable?: boolean
  }>(),
  { placeholder: 'Search country...' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
}>()

const open = ref(false)
const searchQuery = ref('')
const wrapperRef = ref<HTMLElement>()

const countryOptions: SelectOption[] = [
  { value: 'FRA', label: 'France', icon: '🇫🇷' },
  { value: 'JPN', label: 'Japan', icon: '🇯🇵' },
  { value: 'ITA', label: 'Italy', icon: '🇮🇹' },
  { value: 'THA', label: 'Thailand', icon: '🇹🇭' },
  { value: 'ESP', label: 'Spain', icon: '🇪🇸' },
  { value: 'KOR', label: 'South Korea', icon: '🇰🇷' },
  { value: 'GBR', label: 'United Kingdom', icon: '🇬🇧' },
  { value: 'ISL', label: 'Iceland', icon: '🇮🇸' },
  { value: 'NZL', label: 'New Zealand', icon: '🇳🇿' },
  { value: 'PER', label: 'Peru', icon: '🇵🇪' },
  { value: 'MAR', label: 'Morocco', icon: '🇲🇦' },
  { value: 'NOR', label: 'Norway', icon: '🇳🇴' },
  { value: 'USA', label: 'United States', icon: '🇺🇸' },
  { value: 'CAN', label: 'Canada', icon: '🇨🇦' },
  { value: 'AUS', label: 'Australia', icon: '🇦🇺' },
  { value: 'CHN', label: 'China', icon: '🇨🇳' },
  { value: 'DEU', label: 'Germany', icon: '🇩🇪' },
  { value: 'PRT', label: 'Portugal', icon: '🇵🇹' },
  { value: 'NLD', label: 'Netherlands', icon: '🇳🇱' },
  { value: 'CHE', label: 'Switzerland', icon: '🇨🇭' },
  { value: 'GRC', label: 'Greece', icon: '🇬🇷' },
  { value: 'TUR', label: 'Turkey', icon: '🇹🇷' },
  { value: 'VNM', label: 'Vietnam', icon: '🇻🇳' },
  { value: 'SGP', label: 'Singapore', icon: '🇸🇬' },
  { value: 'MYS', label: 'Malaysia', icon: '🇲🇾' },
  { value: 'ARE', label: 'UAE', icon: '🇦🇪' },
  { value: 'EGY', label: 'Egypt', icon: '🇪🇬' },
  { value: 'ZAF', label: 'South Africa', icon: '🇿🇦' },
  { value: 'BRA', label: 'Brazil', icon: '🇧🇷' },
  { value: 'ARG', label: 'Argentina', icon: '🇦🇷' },
]

const displayLabel = computed(() => {
  const opt = countryOptions.find((o) => o.value === props.modelValue)
  return opt ? `${opt.icon || ''} ${opt.label}` : ''
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return countryOptions
  const q = searchQuery.value.toLowerCase()
  return countryOptions.filter(
    (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
  )
})

function select(opt: SelectOption) {
  emit('update:modelValue', opt.value as string)
  searchQuery.value = ''
  open.value = false
}

function toggle() {
  if (!props.disabled) open.value = !open.value
}

function onClickOutside(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    open.value = false
    searchQuery.value = ''
  }
}

import { onMounted, onUnmounted } from 'vue'
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div
    ref="wrapperRef"
    :class="[
      'country-select',
      { 'country-select--open': open, 'country-select--error': !!error, 'country-select--disabled': disabled },
    ]"
  >
    <label v-if="label" class="country-select__label">{{ label }}</label>
    <div class="country-select__trigger" @click="toggle">
      <input
        v-if="open"
        v-model="searchQuery"
        class="country-select__search"
        :placeholder="placeholder"
        autofocus
        @input="$emit('search', searchQuery)"
      />
      <span v-else class="country-select__value" :class="{ 'country-select__value--placeholder': !modelValue }">
        {{ modelValue ? displayLabel : placeholder }}
      </span>
      <span class="country-select__arrow">
        <AppIcon :name="open ? 'ChevronUp' : 'ChevronDown'" :size="16" color-class="text-tertiary" />
      </span>
    </div>
    <Teleport to="body">
      <Transition name="select-drop">
        <div v-if="open" class="country-select__dropdown">
          <div
            v-for="opt in filteredOptions"
            :key="opt.value"
            :class="['country-select__option', { 'country-select__option--selected': opt.value === modelValue }]"
            @click="select(opt)"
          >
            <span class="country-select__option-icon">{{ opt.icon }}</span>
            <span class="country-select__option-label">{{ opt.label }}</span>
          </div>
          <div v-if="filteredOptions.length === 0" class="country-select__empty">
            No countries found
          </div>
        </div>
      </Transition>
    </Teleport>
    <p v-if="error" class="country-select__error">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
export default { components: { AppIcon } }
</script>

<style scoped>
.country-select {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.country-select--disabled {
  opacity: var(--opacity-disabled);
}

.country-select__label {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.country-select__trigger {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-bottom: var(--space-xs);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-default);
  min-height: 24px;
}

.country-select--open .country-select__trigger {
  border-bottom-color: var(--color-sunset);
}

.country-select--error .country-select__trigger {
  border-bottom-color: var(--color-danger);
}

.country-select__value {
  flex: 1;
  font-size: var(--text-body-md);
  color: var(--text-primary);
}

.country-select__value--placeholder {
  color: var(--text-tertiary);
}

.country-select__search {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-primary);
}

.country-select__arrow {
  display: flex;
  align-items: center;
  margin-left: var(--space-sm);
}

.country-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--z-dropdown, 100);
  background: var(--color-card);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-modal);
  margin-top: var(--space-xs);
  max-height: 280px;
  overflow-y: auto;
  padding: var(--space-xs);
}

.country-select__option {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-body-md);
  color: var(--text-primary);
  cursor: pointer;
}

.country-select__option:hover {
  background: var(--color-card-hover);
}

.country-select__option--selected {
  color: var(--color-sunset);
  font-weight: var(--font-weight-medium);
}

.country-select__option-icon {
  font-size: 18px;
  line-height: 1;
}

.country-select__empty {
  padding: 8px 12px;
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
  text-align: center;
}

.country-select__error {
  font-size: var(--text-body-xs);
  color: var(--color-danger);
  margin: 0;
}

.select-drop-enter-active {
  animation: fade-in-down var(--duration-fast) var(--ease-out);
}

.select-drop-leave-active {
  animation: fade-in var(--duration-fast) var(--ease-in) reverse;
}

@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
