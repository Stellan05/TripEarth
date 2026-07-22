<script setup lang="ts">
/**
 * NotesViewer — 手记展示/编辑
 * 展示态：marked 渲染 Markdown
 * 编辑态：切换到 InlineEditor
 */
import { ref, watch } from 'vue'
import { marked } from 'marked'
import InlineEditor from '@/components/shared/InlineEditor.vue'
import AppButton from '@/components/base/AppButton.vue'

const props = withDefaults(
  defineProps<{
    content: string
    editable?: boolean
  }>(),
  { editable: false },
)

const emit = defineEmits<{
  save: [content: string]
}>()

const isEditing = ref(false)
const editContent = ref('')
const renderedHtml = ref('')

watch(() => props.content, async (val) => {
  if (!val) { renderedHtml.value = ''; return }
  try {
    renderedHtml.value = await marked.parse(val)
  } catch {
    renderedHtml.value = val
  }
}, { immediate: true })

function startEdit() {
  editContent.value = props.content
  isEditing.value = true
}

function onSave(value: string) {
  emit('save', value)
  isEditing.value = false
}

function onCancelEdit() {
  isEditing.value = false
}
</script>

<template>
  <div class="notes-viewer">
    <!-- Editing mode -->
    <div v-if="isEditing" class="notes-viewer__edit">
      <InlineEditor
        :model-value="editContent"
        :readonly="false"
        placeholder="Write your notes in Markdown..."
        :rows="12"
        @save="onSave"
        @cancel="onCancelEdit"
      />
    </div>

    <!-- Viewing mode -->
    <div v-else class="notes-viewer__view">
      <!-- Markdown rendered content -->
      <div
        v-if="content"
        class="notes-viewer__content"
        v-html="renderedHtml || content"
      />

      <!-- Empty state -->
      <p v-else class="notes-viewer__empty">No notes yet.</p>

      <!-- Edit button -->
      <AppButton
        v-if="editable && !isEditing"
        variant="ghost"
        size="sm"
        class="notes-viewer__edit-btn"
        @click="startEdit"
      >
        Edit
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.notes-viewer {
  position: relative;
  width: 100%;
}

.notes-viewer__view {
  position: relative;
}

.notes-viewer__content {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-primary);
  line-height: var(--leading-relaxed);
}

.notes-viewer__content :deep(h1),
.notes-viewer__content :deep(h2),
.notes-viewer__content :deep(h3) {
  font-family: var(--font-display);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.notes-viewer__content :deep(h1) { font-size: var(--text-display-md); }
.notes-viewer__content :deep(h2) { font-size: var(--text-display-sm); }
.notes-viewer__content :deep(h3) { font-size: var(--text-body-lg); }

.notes-viewer__content :deep(p) {
  margin: 0.75em 0;
}

.notes-viewer__content :deep(ul),
.notes-viewer__content :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.notes-viewer__content :deep(li) {
  margin: 0.25em 0;
}

.notes-viewer__content :deep(blockquote) {
  border-left: 3px solid var(--color-sunset);
  padding-left: var(--space-md);
  margin: 1em 0;
  color: var(--text-secondary);
  font-style: italic;
}

.notes-viewer__content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--color-card-hover);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}

.notes-viewer__content :deep(pre) {
  background: var(--color-card-hover);
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  margin: 1em 0;
}

.notes-viewer__content :deep(pre code) {
  background: none;
  padding: 0;
}

.notes-viewer__content :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-sm);
  margin: 1em 0;
}

.notes-viewer__content :deep(a) {
  color: var(--color-ocean);
  text-decoration: none;
}

.notes-viewer__content :deep(a:hover) {
  text-decoration: underline;
}

.notes-viewer__empty {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--text-tertiary);
  font-style: italic;
  margin: 0;
}

.notes-viewer__edit-btn {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  transition: opacity var(--duration-fast);
}

.notes-viewer__view:hover .notes-viewer__edit-btn {
  opacity: 1;
}
</style>
