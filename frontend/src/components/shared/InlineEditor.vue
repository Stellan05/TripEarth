<script setup lang="ts">
/**
 * InlineEditor — 内联编辑切换
 * 展示态点击 → 切换为编辑态（textarea）→ Save/Cancel → 回到展示态
 */
import { ref } from 'vue'
import AppButton from '@/components/base/AppButton.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    readonly?: boolean
    placeholder?: string
    rows?: number
  }>(),
  { readonly: true, placeholder: 'Type something...', rows: 4 },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  save: [value: string]
  cancel: []
}>()

const editing = ref(false)
const editContent = ref('')

function startEdit() {
  editContent.value = props.modelValue
  editing.value = true
}

function onSave() {
  emit('update:modelValue', editContent.value)
  emit('save', editContent.value)
  editing.value = false
}

function onCancel() {
  editing.value = false
  emit('cancel')
}
</script>

<template>
  <div class="inline-editor">
    <!-- Viewing mode -->
    <div v-if="!editing || readonly" class="inline-editor__view" @click="startEdit">
      <slot name="view">
        <p class="inline-editor__content">{{ modelValue || placeholder }}</p>
      </slot>
      <AppButton v-if="!readonly" variant="ghost" size="sm" class="inline-editor__edit-btn">
        Edit
      </AppButton>
    </div>

    <!-- Editing mode -->
    <div v-if="editing && !readonly" class="inline-editor__edit">
      <textarea
        v-model="editContent"
        class="inline-editor__textarea"
        :placeholder="placeholder"
        :rows="rows"
      />
      <div class="inline-editor__actions">
        <AppButton variant="ghost" size="sm" @click="onCancel">Cancel</AppButton>
        <AppButton variant="primary" size="sm" @click="onSave">Save</AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inline-editor {
  width: 100%;
}

.inline-editor__view {
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast);
}

.inline-editor__view:hover {
  background: var(--color-card-hover);
}

.inline-editor__content {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-primary);
  line-height: var(--leading-relaxed);
  margin: 0;
  white-space: pre-wrap;
}

.inline-editor__edit-btn {
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  opacity: 0;
  transition: opacity var(--duration-fast);
}

.inline-editor__view:hover .inline-editor__edit-btn {
  opacity: 1;
}

.inline-editor__textarea {
  width: 100%;
  padding: var(--space-sm);
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-primary);
  background: var(--color-card);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-sm);
  resize: vertical;
  outline: none;
  transition: border-color var(--duration-fast);
  box-sizing: border-box;
}

.inline-editor__textarea:focus {
  border-color: var(--color-sunset);
}

.inline-editor__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}
</style>
