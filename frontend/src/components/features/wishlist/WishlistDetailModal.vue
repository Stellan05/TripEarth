/**
 * WishlistDetailModal — 想去目的地详情弹窗
 *
 * 展示该目的地下的所有地点条目 (timeline 风格)，
 * 支持添加新条目（图片、描述）。
 */
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WishlistItem, WishlistEntry } from '@/types/wishlist'
import AppIcon from '@/components/base/AppIcon.vue'
import AppButton from '@/components/base/AppButton.vue'

const props = withDefaults(
  defineProps<{
    destination: WishlistItem | null
    visible: boolean
  }>(),
  {},
)

const emit = defineEmits<{
  close: []
  'update-entry': [itemId: number, entries: WishlistEntry[]]
}>()

/* ── Entry count matches card bookmark ── */
const entryCount = computed(() => props.destination?.entries?.length || props.destination?.cityCount || 0)

/* ── Add entry form ── */
const showForm = ref(false)
const newTitle = ref('')
const newDesc = ref('')
const newImageUrl = ref('')

function startAdd() {
  showForm.value = true
  newTitle.value = ''
  newDesc.value = ''
  newImageUrl.value = ''
}

function submitEntry() {
  if (!newTitle.value || !props.destination) return
  const entry: WishlistEntry = {
    id: Date.now(),
    title: newTitle.value,
    description: newDesc.value || undefined,
    imageUrl: newImageUrl.value || undefined,
    addedAt: new Date().toISOString().split('T')[0],
  }
  const updated = [...(props.destination.entries || []), entry]
  emit('update-entry', props.destination.id, updated)
  showForm.value = false
}

function removeEntry(entryId: number) {
  if (!props.destination) return
  const updated = (props.destination.entries || []).filter(e => e.id !== entryId)
  emit('update-entry', props.destination.id, updated)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

import { onMounted, onUnmounted } from 'vue'
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible && destination" class="wishlist-detail" @click.self="emit('close')">
        <div class="wishlist-detail__card">
          <!-- ═══ Header ═══ -->
          <div class="wishlist-detail__header">
            <button class="wishlist-detail__back" @click="emit('close')">
              <AppIcon name="ArrowLeft" :size="18" />
            </button>
            <div class="wishlist-detail__header-info">
              <span class="wishlist-detail__flag">{{ destination.flagEmoji }}</span>
              <div>
                <h2 class="wishlist-detail__title">
                  {{ destination.cityName || destination.countryName }}
                </h2>
                <p v-if="destination.cityName" class="wishlist-detail__subtitle">
                  {{ destination.countryName }}
                </p>
              </div>
            </div>
            <span class="wishlist-detail__count">
              <AppIcon name="Bookmark" :size="14" color-class="" />
              {{ entryCount }}
            </span>
          </div>

          <!-- ═══ Note ═══ -->
          <div v-if="destination.note" class="wishlist-detail__note">
            <AppIcon name="FileText" :size="14" color-class="text-forest" />
            <span>{{ destination.note }}</span>
          </div>

          <!-- ═══ Timeline ═══ -->
          <div v-if="destination.entries?.length" class="wishlist-detail__entries">
            <div
              v-for="(entry, i) in destination.entries"
              :key="entry.id"
              class="wishlist-entry"
              :style="{ animationDelay: `${i * 60}ms` }"
            >
              <div class="wishlist-entry__timeline">
                <div class="wishlist-entry__dot" />
                <div v-if="i < (destination.entries?.length || 0) - 1" class="wishlist-entry__line" />
              </div>

              <div class="wishlist-entry__content">
                <!-- Image -->
                <div v-if="entry.imageUrl" class="wishlist-entry__image-wrap">
                  <img :src="entry.imageUrl" :alt="entry.title" class="wishlist-entry__image" loading="lazy" />
                </div>

                <div class="wishlist-entry__body">
                  <div class="wishlist-entry__header">
                    <h3 class="wishlist-entry__title">{{ entry.title }}</h3>
                    <span class="wishlist-entry__date">{{ entry.addedAt }}</span>
                  </div>

                  <p v-if="entry.description" class="wishlist-entry__desc">{{ entry.description }}</p>
                </div>

                <button
                  class="wishlist-entry__remove"
                  @click="removeEntry(entry.id)"
                  aria-label="Remove entry"
                >
                  <AppIcon name="Trash2" :size="13" color-class="" />
                </button>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="wishlist-detail__empty">
            <p class="body-sm text-tertiary">No places added yet.</p>
          </div>

          <!-- ═══ Add form ═══ -->
          <Transition name="slide-up">
            <div v-if="showForm" class="wishlist-detail__form">
              <input
                v-model="newTitle"
                class="wishlist-detail__input"
                placeholder="Place name *"
              />
              <input
                v-model="newImageUrl"
                class="wishlist-detail__input"
                placeholder="Image URL (optional)"
              />
              <textarea
                v-model="newDesc"
                class="wishlist-detail__textarea"
                placeholder="Why do you want to go? (optional)"
                rows="3"
              />
              <div class="wishlist-detail__form-actions">
                <AppButton variant="ghost" size="sm" @click="showForm = false">Cancel</AppButton>
                <AppButton variant="primary" size="sm" :disabled="!newTitle" @click="submitEntry">Add</AppButton>
              </div>
            </div>
          </Transition>

          <!-- ═══ Add button ═══ -->
          <button v-if="!showForm" class="wishlist-detail__add-btn" @click="startAdd">
            <AppIcon name="Plus" :size="16" />
            <span>Add Place</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.wishlist-detail {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal, 500);
  padding: var(--space-lg);
  backdrop-filter: blur(4px);
}

.wishlist-detail__card {
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  overflow-y: auto;
  animation: detail-in 350ms var(--ease-spring) both;
}

@keyframes detail-in {
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── Header ── */
.wishlist-detail__header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  background: var(--color-card);
  z-index: 2;
}

.wishlist-detail__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  border: none;
  background: var(--color-card-hover);
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 150ms;
  flex-shrink: 0;
}

.wishlist-detail__back:hover {
  background: rgba(0, 0, 0, 0.08);
  color: var(--text-primary);
}

.wishlist-detail__header-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
  min-width: 0;
}

.wishlist-detail__flag {
  font-size: 32px;
  line-height: 1;
}

.wishlist-detail__title {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wishlist-detail__subtitle {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-tertiary);
  margin: 0;
}

.wishlist-detail__count {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(74, 156, 124, 0.1);
  color: var(--color-forest);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  font-weight: 600;
  white-space: nowrap;
}

/* ── Note ── */
.wishlist-detail__note {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  margin: 0 var(--space-lg);
  margin-top: var(--space-sm);
  background: rgba(74, 156, 124, 0.06);
  border-radius: var(--radius-sm);
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
}

/* ── Timeline ── */
.wishlist-detail__entries {
  padding: var(--space-lg);
  padding-top: var(--space-md);
}

.wishlist-entry {
  display: flex;
  gap: var(--space-md);
  animation: entry-in 400ms var(--ease-out) both;
}

@keyframes entry-in {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

.wishlist-entry__timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12px;
  flex-shrink: 0;
  padding-top: 4px;
}

.wishlist-entry__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-forest);
  border: 2px solid rgba(74, 156, 124, 0.25);
  flex-shrink: 0;
}

.wishlist-entry__line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, rgba(74, 156, 124, 0.2), transparent);
  min-height: 20px;
}

.wishlist-entry__content {
  flex: 1;
  display: flex;
  gap: var(--space-sm);
  padding-bottom: var(--space-lg);
  min-width: 0;
}

.wishlist-entry__image-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
}

.wishlist-entry__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wishlist-entry__body {
  flex: 1;
  min-width: 0;
}

.wishlist-entry__header {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  margin-bottom: 4px;
}

.wishlist-entry__title {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}

.wishlist-entry__date {
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--text-tertiary);
  white-space: nowrap;
}

.wishlist-entry__desc {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.wishlist-entry__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0;
  transition: all 150ms;
}

.wishlist-entry:hover .wishlist-entry__remove {
  opacity: 1;
}

.wishlist-entry__remove:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-danger);
}

/* ── Empty ── */
.wishlist-detail__empty {
  padding: var(--space-3xl) var(--space-lg);
  text-align: center;
}

/* ── Add form ── */
.wishlist-detail__form {
  padding: var(--space-lg);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.wishlist-detail__input,
.wishlist-detail__textarea {
  width: 100%;
  padding: 10px 12px;
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-primary);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-sm);
  outline: none;
  background: var(--color-card);
  box-sizing: border-box;
}

.wishlist-detail__input:focus,
.wishlist-detail__textarea:focus {
  border-color: var(--color-forest);
}

.wishlist-detail__textarea {
  resize: vertical;
}

.wishlist-detail__form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}

/* ── Add button ── */
.wishlist-detail__add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: var(--space-md);
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: var(--color-card);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-forest);
  cursor: pointer;
  transition: background 150ms;
  position: sticky;
  bottom: 0;
}

.wishlist-detail__add-btn:hover {
  background: rgba(74, 156, 124, 0.04);
}

/* ── Transitions ── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms var(--ease-out);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 250ms var(--ease-out);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
