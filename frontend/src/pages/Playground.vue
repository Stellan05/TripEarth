<script setup lang="ts">
/**
 * Component Showcase — 基础组件展示页
 * 路由: /playground
 * 用途: 开发和验收所有基础组件
 */

import { ref } from 'vue'
import AppButton from '@/components/base/AppButton.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import AppIconButton from '@/components/base/AppIconButton.vue'
import AppChip from '@/components/base/AppChip.vue'
import AppBadge from '@/components/base/AppBadge.vue'
import AppDivider from '@/components/base/AppDivider.vue'
import AppInput from '@/components/base/AppInput.vue'
import AppTextarea from '@/components/base/AppTextarea.vue'
import AppSelect from '@/components/base/AppSelect.vue'
import AppCheckbox from '@/components/base/AppCheckbox.vue'
import AppRadio from '@/components/base/AppRadio.vue'
import AppSwitch from '@/components/base/AppSwitch.vue'
import AppCard from '@/components/base/AppCard.vue'
import AppSkeleton from '@/components/base/AppSkeleton.vue'
import AppSpinner from '@/components/base/AppSpinner.vue'
import AppProgress from '@/components/base/AppProgress.vue'
import AppTooltip from '@/components/base/AppTooltip.vue'
import AppModal from '@/components/base/AppModal.vue'
import AppEmptyState from '@/components/base/AppEmptyState.vue'
import AppTabs from '@/components/base/AppTabs.vue'
import AppPagination from '@/components/base/AppPagination.vue'
import Toast from '@/components/base/Toast.vue'
import FullBleedLayout from '@/components/layout/FullBleedLayout.vue'
import TwoColumnLayout from '@/components/layout/TwoColumnLayout.vue'
import CenteredFormLayout from '@/components/layout/CenteredFormLayout.vue'
import FullWidthLayout from '@/components/layout/FullWidthLayout.vue'
import GridLayout from '@/components/layout/GridLayout.vue'
import { useToast } from '@/composables/useToast'
import type { SelectOption } from '@/types/common'

const toast = useToast()

/* --- demo state --- */
const inputVal = ref('')
const textareaVal = ref('')
const selectVal = ref<number>(1)
const checked = ref(false)
const radio = ref('a')
const switched = ref(false)
const modalOpen = ref(false)
const activeTab = ref('buttons')
const progress = ref(65)

const selectOptions: SelectOption[] = [
  { label: 'France', value: 1, icon: '🇫🇷' },
  { label: 'Japan', value: 2, icon: '🇯🇵' },
  { label: 'Thailand', value: 3, icon: '🇹🇭' },
  { label: 'Iceland', value: 4, icon: '🇮🇸' },
]

const sectionTabs = [
  { label: 'Forms', value: 'forms' },
  { label: 'Display', value: 'display' },
  { label: 'Feedback', value: 'feedback' },
  { label: 'Navigation', value: 'nav' },
  { label: 'Layouts', value: 'layouts' },
]

function showToast(type: 'success' | 'error' | 'info') {
  toast.show(`This is a ${type} notification`, type)
}
</script>

<template>
  <div class="showcase">
    <!-- Header -->
    <header class="showcase__header">
      <h1 class="display-lg">Component Library</h1>
      <p class="showcase__subtitle body-lg text-secondary">
        Phase 2 — Base UI Components &middot; Travel Atlas
      </p>
    </header>

    <!-- Content tabs -->
    <div class="showcase__tabs">
      <AppTabs v-model="activeTab" :tabs="sectionTabs" />
    </div>

    <!-- ═══════════════════════════════ FORMS ═══════════════════════════════ -->
    <template v-if="activeTab === 'forms'">
      <section class="showcase__section">
        <h2 class="display-sm">AppButton</h2>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
          <AppButton variant="primary">Primary</AppButton>
          <AppButton variant="secondary">Secondary</AppButton>
          <AppButton variant="ghost">Ghost</AppButton>
          <AppButton variant="danger">Danger</AppButton>
          <AppButton variant="primary" size="sm">Small</AppButton>
          <AppButton variant="primary" size="lg">Large</AppButton>
          <AppButton variant="primary" disabled>Disabled</AppButton>
          <AppButton variant="primary" loading>Loading</AppButton>
          <AppButton variant="primary">
            <template #prefix><AppIcon name="Plus" :size="16" /></template>
            With Icon
          </AppButton>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppIconButton</h2>
        <div style="display:flex;gap:12px;align-items:center">
          <AppIconButton icon="Heart" size="sm" label="Like" />
          <AppIconButton icon="Heart" size="md" label="Like" />
          <AppIconButton icon="Heart" size="lg" label="Like" />
          <AppIconButton icon="X" size="md" label="Close" variant="glass" />
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppInput</h2>
        <div style="max-width:400px;display:flex;flex-direction:column;gap:24px">
          <AppInput v-model="inputVal" label="Country name" placeholder="Enter country..." />
          <AppInput v-model="inputVal" label="With icon" prefix-icon="Search" placeholder="Search..." clearable />
          <AppInput v-model="inputVal" label="With error" error="This field is required" />
          <AppInput v-model="inputVal" label="Disabled" disabled placeholder="Can't edit" />
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppTextarea</h2>
        <div style="max-width:400px">
          <AppTextarea v-model="textareaVal" label="Notes" placeholder="Write your thoughts..." :rows="3" :maxlength="500" show-count />
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppSelect</h2>
        <div style="max-width:400px">
          <AppSelect v-model="selectVal" label="Country" :options="selectOptions" placeholder="Select a country..." clearable />
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppCheckbox</h2>
        <div style="display:flex;gap:16px;align-items:center">
          <AppCheckbox v-model="checked" label="I agree to terms" />
          <AppCheckbox :model-value="true" label="Checked" />
          <AppCheckbox :model-value="true" label="Disabled" disabled />
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppRadio</h2>
        <div style="display:flex;gap:16px;align-items:center">
          <AppRadio v-model="radio" value="a" label="Option A" />
          <AppRadio v-model="radio" value="b" label="Option B" />
          <AppRadio v-model="radio" value="c" label="Option C" />
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppSwitch</h2>
        <div style="display:flex;gap:16px;align-items:center">
          <AppSwitch v-model="switched" label="Dark mode" />
          <AppSwitch :model-value="true" label="On" />
          <AppSwitch :model-value="false" label="Off" />
          <AppSwitch :model-value="true" label="Disabled" disabled />
        </div>
      </section>
    </template>

    <!-- ═══════════════════════════════ DISPLAY ═══════════════════════════════ -->
    <template v-if="activeTab === 'display'">
      <section class="showcase__section">
        <h2 class="display-sm">AppCard</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
          <AppCard variant="default" hoverable><div style="padding:8px"><strong>Default Card</strong><p class="body-sm text-secondary mt-sm">Hover me to lift</p></div></AppCard>
          <AppCard variant="photo" hoverable>
            <div style="height:160px;background:linear-gradient(135deg,#F0E8D8,#E8C9A0);display:flex;align-items:center;justify-content:center;color:#6B6E77">Photo Card</div>
          </AppCard>
          <AppCard variant="flight"><div style="padding:8px"><strong>Flight Card</strong><p class="body-sm text-secondary mt-sm">Boarding pass style</p></div></AppCard>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppBadge</h2>
        <div style="display:flex;gap:16px;align-items:center">
          <AppBadge :count="5" color="danger" />
          <AppBadge :count="99" />
          <AppBadge :count="150" color="sunset" />
          <AppBadge dot color="forest" />
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppChip</h2>
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
          <AppChip variant="default">Default</AppChip>
          <AppChip variant="active" active-color="sunset">Active</AppChip>
          <AppChip variant="active" active-color="forest">Forest</AppChip>
          <AppChip variant="wishlist">Wishlist</AppChip>
          <AppChip variant="pill">Pill</AppChip>
          <AppChip variant="pill" closable @close="() => {}">Closable</AppChip>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppDivider</h2>
        <div style="display:flex;flex-direction:column;gap:16px">
          <AppDivider />
          <AppDivider dashed />
          <AppDivider label="or continue with" />
          <div style="display:flex;height:60px">
            <span>Left</span>
            <AppDivider direction="vertical" />
            <span>Right</span>
          </div>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppSkeleton</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
          <div>
            <AppSkeleton variant="text" :count="4" />
          </div>
          <AppSkeleton variant="card" height="140px" />
          <AppSkeleton variant="image" width="140px" />
        </div>
      </section>
    </template>

    <!-- ═══════════════════════════════ FEEDBACK ═══════════════════════════════ -->
    <template v-if="activeTab === 'feedback'">
      <section class="showcase__section">
        <h2 class="display-sm">AppSpinner</h2>
        <div style="display:flex;gap:24px;align-items:center">
          <AppSpinner size="sm" />
          <AppSpinner size="md" />
          <AppSpinner size="lg" />
          <AppSpinner size="md" label="Loading..." />
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppProgress</h2>
        <div style="max-width:400px;display:flex;flex-direction:column;gap:16px">
          <AppProgress :percentage="0" show-text />
          <AppProgress :percentage="progress" show-text />
          <AppProgress :percentage="100" show-text color="forest" />
        </div>
        <button class="btn btn-secondary mt-md" @click="progress = progress >= 100 ? 0 : progress + 10">Advance</button>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppTooltip</h2>
        <div style="display:flex;gap:24px;align-items:center;padding:40px 0">
          <AppTooltip text="Top tooltip" position="top"><span class="body-sm">Hover top</span></AppTooltip>
          <AppTooltip text="Bottom tooltip" position="bottom"><span class="body-sm">Hover bottom</span></AppTooltip>
          <AppTooltip text="Left tooltip" position="left"><span class="body-sm">Hover left</span></AppTooltip>
          <AppTooltip text="Right tooltip" position="right"><span class="body-sm">Hover right</span></AppTooltip>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppModal</h2>
        <AppButton variant="secondary" @click="modalOpen = true">Open Modal</AppButton>
        <AppModal :visible="modalOpen" title="Confirm Action" @close="modalOpen = false">
          <p class="body-md text-secondary">Are you sure you want to continue? This action cannot be undone.</p>
          <template #footer>
            <AppButton variant="ghost" @click="modalOpen = false">Cancel</AppButton>
            <AppButton variant="danger" @click="modalOpen = false">Delete</AppButton>
          </template>
        </AppModal>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppEmptyState</h2>
        <AppEmptyState
          icon="MapPin"
          title="No trips yet"
          description="Start your travel journal by adding your first trip."
          cta-text="Add First Trip"
        />
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">Toast</h2>
        <div style="display:flex;gap:12px">
          <AppButton variant="primary" @click="showToast('success')">Success</AppButton>
          <AppButton variant="danger" @click="showToast('error')">Error</AppButton>
          <AppButton variant="secondary" @click="showToast('info')">Info</AppButton>
        </div>
        <Toast />
      </section>
    </template>

    <!-- ═══════════════════════════════ NAVIGATION ═══════════════════════════════ -->
    <template v-if="activeTab === 'nav'">
      <section class="showcase__section">
        <h2 class="display-sm">AppTabs</h2>
        <AppTabs v-model="activeTab" :tabs="sectionTabs" />
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">AppPagination</h2>
        <AppPagination :current="3" :total="120" @update:current="() => {}" />
        <p class="body-sm text-secondary mt-sm">3 of 6 pages, 120 total items</p>
      </section>
    </template>

    <!-- ═══════════════════════════════ LAYOUTS ═══════════════════════════════ -->
    <template v-if="activeTab === 'layouts'">
      <section class="showcase__section">
        <h2 class="display-sm">FullBleedLayout</h2>
        <p class="body-sm text-secondary mb-md">Full-screen immersive layout — used for GlobeHome</p>
        <div class="layout-demo layout-demo--bleed">
          <FullBleedLayout>
            <div class="demo-content demo-content--bleed">Full Bleed Content</div>
          </FullBleedLayout>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">TwoColumnLayout (7:5)</h2>
        <p class="body-sm text-secondary mb-md">Left sticky map + right scrollable panel</p>
        <div class="layout-demo layout-demo--tall">
          <TwoColumnLayout :left-cols="7" :right-cols="5">
            <template #left>
              <div class="demo-content demo-content--map">
                <AppIcon name="Map" :size="40" color-class="text-tertiary" />
                <span class="body-sm text-tertiary">Map Panel (sticky)</span>
              </div>
            </template>
            <template #right>
              <div class="demo-right-stack">
                <AppCard variant="default"><strong>Photo Grid</strong><p class="body-sm text-secondary mt-sm">8 photos</p></AppCard>
                <AppCard variant="default"><strong>Trip List</strong><p class="body-sm text-secondary mt-sm">3 trips</p></AppCard>
                <AppCard variant="default"><strong>Notes</strong><p class="body-sm text-secondary mt-sm">2 notes</p></AppCard>
              </div>
            </template>
          </TwoColumnLayout>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">CenteredFormLayout</h2>
        <p class="body-sm text-secondary mb-md">Form layout — 8 cols centered — used for TripEditor</p>
        <div class="layout-demo layout-demo--tall">
          <CenteredFormLayout max-width="760px">
            <template #header>
              <h3 class="display-sm">New Trip</h3>
            </template>
            <div style="display:flex;flex-direction:column;gap:16px">
              <AppSelect :model-value="1" :options="selectOptions" label="Country" placeholder="Select country" />
              <AppInput model-value="Tokyo" label="City" placeholder="City name" />
              <AppInput model-value="Oct 12 – Oct 19, 2024" label="Dates" />
            </div>
            <template #actions>
              <AppButton variant="ghost">Cancel</AppButton>
              <AppButton variant="primary">Save Trip</AppButton>
            </template>
          </CenteredFormLayout>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">FullWidthLayout</h2>
        <p class="body-sm text-secondary mb-md">Full-width list layout — used for Timeline</p>
        <div class="layout-demo layout-demo--tall">
          <FullWidthLayout>
            <template #header>
              <h3 class="display-sm">Timeline</h3>
            </template>
            <div class="demo-list">
              <AppCard v-for="i in 4" :key="i" variant="default"><strong>Timeline item {{ i }}</strong></AppCard>
            </div>
          </FullWidthLayout>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">GridLayout (3 cols)</h2>
        <p class="body-sm text-secondary mb-md">3-column grid — used for Wishlist</p>
        <div class="layout-demo layout-demo--tall">
          <GridLayout :cols="3">
            <template #header>
              <h3 class="display-sm">Dream Destinations</h3>
            </template>
            <AppCard v-for="i in 6" :key="i" variant="destination">
              <div style="height:160px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--map-land),var(--map-land-visited))">
                <span style="font-size:40px">{{ ['🇮🇸','🇳🇿','🇵🇪','🇯🇵','🇲🇦','🇳🇴'][i-1] }}</span>
              </div>
              <div class="p-md">
                <strong>{{ ['Iceland','New Zealand','Peru','Japan','Morocco','Norway'][i-1] }}</strong>
                <p class="body-sm text-secondary">{{ Math.floor(Math.random() * 10) + 1 }} saved cities</p>
              </div>
            </AppCard>
          </GridLayout>
        </div>
      </section>

      <AppDivider />

      <section class="showcase__section">
        <h2 class="display-sm">NavPill (visible in header)</h2>
        <p class="body-sm text-secondary mb-md">
          The NavPill is mounted globally in App.vue and visible on this page.<br />
          Hover/click the items above to see active-state and routing behavior.
        </p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.showcase {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--page-padding);
}

.showcase__header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.showcase__subtitle {
  margin-top: var(--space-sm);
}

.showcase__tabs {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-2xl);
}

.showcase__section {
  margin: var(--space-xl) 0;
}

.showcase__section h2 {
  margin-bottom: var(--space-lg);
}

.mt-sm { margin-top: var(--space-sm); }
.mt-md { margin-top: var(--space-md); }
.mb-md { margin-bottom: var(--space-md); }
.p-md  { padding: var(--space-md); }

/* Layout demo containers */
.layout-demo {
  border: 1px dashed rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.layout-demo--bleed {
  height: 200px;
}

.layout-demo--tall {
  height: 400px;
  overflow: auto;
}

.demo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--color-page);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  gap: var(--space-sm);
}

.demo-content--bleed {
  background: linear-gradient(135deg, var(--map-water), var(--map-water-dark));
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
}

.demo-content--map {
  height: 100%;
  border-radius: var(--radius-md);
  background: var(--color-page);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.demo-right-stack {
  display: flex;
  flex-direction: column;
  gap: var(--card-gap);
}

.demo-list {
  display: flex;
  flex-direction: column;
  gap: var(--card-gap);
}
</style>
