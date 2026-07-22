<script setup lang="ts">
/**
 * SearchInput — 搜索输入框
 * 搜索图标前缀 + 可清除 + 防抖 emit
 */
import { ref, watch } from 'vue'
import AppInput from '@/components/base/AppInput.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    debounce?: number
    disabled?: boolean
  }>(),
  { modelValue: '', placeholder: 'Search...', debounce: 300, disabled: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const inputValue = ref(props.modelValue)
let timer: ReturnType<typeof setTimeout> | null = null

watch(inputValue, (val) => {
  emit('update:modelValue', val)
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    emit('search', val)
  }, props.debounce)
})

watch(() => props.modelValue, (val) => {
  inputValue.value = val
})

function onClear() {
  inputValue.value = ''
  emit('search', '')
}
</script>

<template>
  <div class="search-input">
    <AppInput
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      prefix-icon="Search"
      suffix-icon="X"
      clearable
      @clear="onClear"
    />
  </div>
</template>

<style scoped>
.search-input {
  width: 100%;
}
</style>
