# Travel Atlas — Implementation Plan

> **版本：** v1.0 | **2026-07-21**  
> **角色：** Claude Code 执行指南  
> **角色：** Claude Code 执行指南  
> **用法：** 从 Phase 0 开始，一次只做一个 Phase。完成所有 Tasks → 通过 Self Review → 进入下一 Phase。  
> **参考文档：**
> - `design.md` — 视觉规范（颜色、字体、间距、动效）
> - `docs/design-spec.md` — 开发规范（组件变体、网格、断点）
> - `docs/COMPONENT_ARCHITECTURE.md` — 组件架构（62 个组件定义、Props、依赖关系）
> - `docs/DEVELOPMENT_PLAN.md` — 开发计划（架构、DB、API 设计）

---

## 总览

```
Phase 0  →  Foundation Setup          0.5 day  ✅
Phase 1  →  Atom Components           1.5 days ✅
Phase 2  →  Molecule Components       2 days   🔧 部分完成
Phase 3  →  Layout & Navigation       0.5 day  ✅
Phase 4  →  API Layer & Mock Data     0.5 day  ⬜ 未开始
Phase 5  →  Trip Editor Module        2 days   ✅
Phase 6  →  Globe & Map Module        2 days   🔧 部分完成(Globe✅ Map⬜)
                                ────────────
已完成:                              ~6 天

未来版本 Phases 7–12 (Home Page → Polish):
Phase 7–10 → 页面组装 (Home, Country, Trip, Wishlist)
Phase 11   →  Live Data Integration
Phase 12   →  Polish & Quality
```

**依赖关系：**

```
Phase 0 ──→ Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4 (⬜)
                              │                      │
                              ▼                      ▼
                        Phase 5 (TripEditor)    Phase 6 (Globe & Map)
```

> Phase 4-6 可并行开发（互不依赖）。Phase 7-12（页面组装、联调、打磨）为未来版本 v0.2 内容。

---

## Phase 0：Foundation Setup

### Goal

补齐项目缺失的依赖和基础设施。让 `npm run dev` 启动后，主题系统可用、CSS 常量可被 JS 读取、动画 composable 就绪、图标库可用。

### Why

所有后续 Phase 都依赖这些基础：图标需要 lucide-vue-next、组件动效需要 useStagger/useOdometer、主题切换需要 useTheme、地图/地球着色需要 JS 颜色常量。

### Prerequisites

- ✅ Node.js 环境可运行 `npm install`
- ✅ `frontend/` 项目已存在（Vue 3 + Vite + TypeScript）
- ✅ `style.css` 已有完整 CSS 变量定义

### Tasks

| # | Task | 产出文件 | 说明 |
|---|------|----------|------|
| 0.1 | 安装 lucide-vue-next | `package.json` | `npm install lucide-vue-next` |
| 0.2 | 创建 `src/types/common.ts` | `types/common.ts` | `ApiResponse<T>`, `PageResult<T>`, `TransportType` 枚举 |
| 0.3 | 创建 `src/types/country.ts` | `types/country.ts` | `Country`, `CountryStatus`, `CityInfo` 接口 |
| 0.4 | 创建 `src/types/trip.ts` | `types/trip.ts` | `Trip`, `TripDetail`, `TripCity`, `TripRoute`, `Flight` 接口 |
| 0.5 | 创建 `src/types/photo.ts` | `types/photo.ts` | `Photo` 接口 |
| 0.6 | 创建 `src/types/wishlist.ts` | `types/wishlist.ts` | `WishlistItem` 接口 |
| 0.7 | 创建 `src/utils/colors.ts` | `utils/colors.ts` | 从 CSS 变量导出 JS 颜色常量（供 Three.js/Leaflet 使用） |
| 0.8 | 创建 `src/utils/date.ts` | `utils/date.ts` | `formatDate`, `formatDateRange`, `daysBetween` |
| 0.9 | 创建 `src/utils/format.ts` | `utils/format.ts` | `formatNumber`, `formatDuration`, `truncateText` |
| 0.10 | 创建 `src/composables/useTheme.ts` | `composables/useTheme.ts` | 主题切换 + localStorage 持久化 + 系统 `prefers-color-scheme` 检测 + 导出 `isDark`, `toggleTheme` |
| 0.11 | 创建 `src/composables/useStagger.ts` | `composables/useStagger.ts` | `useStagger(count, baseDelay, staggerDelay)` → 返回 `delays[]` 数组 |
| 0.12 | 创建 `src/composables/useOdometer.ts` | `composables/useOdometer.ts` | `useOdometer(targetValue, duration)` → 返回响应式 `displayValue` |
| 0.13 | 创建 `src/composables/useToast.ts` | `composables/useToast.ts` | `useToast()` → 返回 `toasts`, `show(msg, type)`, `dismiss(id)` |
| 0.14 | 下载 GeoJSON 文件 | `public/geojson/countries-110m.json` | 从 Natural Earth 下载 110m 精度国家边界数据（~1.5MB） |
| 0.15 | 创建 `src/utils/geo.ts` | `utils/geo.ts` | `greatCircleInterpolation`, `bboxCenter` |
| 0.16 | 验证启动 | — | `npm run dev` → 无报错，所有文件编译通过 |

### Deliverables

- 6 个 TypeScript 类型文件
- 3 个工具函数文件（colors, date, format, geo）
- 3 个 composable（useTheme, useStagger, useOdometer, useToast）
- 1 个 GeoJSON 静态文件
- 项目启动零报错

### Acceptance Criteria

- [ ] `npm run dev` 启动无 TypeScript 编译错误
- [ ] `useTheme().toggleTheme()` 可切换 `<body data-theme="dark">`
- [ ] `useStagger(5, 100, 60)` 返回 `[100, 160, 220, 280, 340]`
- [ ] `useOdometer(1234, 400)` 在 400ms 内从 0 滚动到 1234
- [ ] `colors.ts` 导出的常量与 `style.css` 变量值一致
- [ ] Lucide 图标可通过 `import { Globe } from 'lucide-vue-next'` 使用
- [ ] GeoJSON 文件可从 `public/geojson/countries-110m.json` 访问

### Risks

| 风险 | 应对 |
|------|------|
| GeoJSON 下载失败或文件损坏 | 使用 TopoJSON 替代（更小），或从 CDN 直接引用 |
| lucide-vue-next 版本与 Vue 3.5 不兼容 | 锁定最新稳定版，查看 CHANGELOG |

### Self Review Checklist

- [ ] 所有 `.ts` 文件通过 `vue-tsc` 类型检查
- [ ] composable 返回值类型完整（无 `any`）
- [ ] `colors.ts` 颜色值与 `design.md` Section 1 一致
- [ ] `useTheme` 处理了 `prefers-color-scheme: dark` 媒体查询
- [ ] 无硬编码颜色字符串（全部从 `colors.ts` 引用）

---

## Phase 1：Atom Components

### Goal

构建全部 15 个基础原子组件。这些组件无业务语义、可跨项目复用。

### Why

Atom 是组件体系的最底层。AppIcon 是所有组件的图标入口，AppButton 是交互入口。必须最先完成。

### Prerequisites

- ✅ Phase 0 完成

### Tasks

| # | Task | 产出文件 | 关键 Props |
|---|------|----------|-----------|
| 1.01 | **AppIcon** | `components/base/AppIcon.vue` | `name`, `size:16\|20\|24\|32`, `colorClass`, `strokeWidth` |
| 1.02 | **AppSpinner** | `components/base/AppSpinner.vue` | `size:sm\|md\|lg`, `label` |
| 1.03 | **AppButton** | `components/base/AppButton.vue` | `variant`, `size`, `disabled`, `loading`, `round`, `fullWidth` |
| 1.04 | **AppIconButton** | `components/base/AppIconButton.vue` | `icon`, `size`, `variant`, `label`(aria) |
| 1.05 | **AppChip** | `components/base/AppChip.vue` | `variant:default\|active\|wishlist\|pill`, `closable`, `activeColor: sunset\|forest` |
| 1.06 | **AppInput** | `components/base/AppInput.vue` | `modelValue`, `label`, `error`, `prefixIcon`, `suffixIcon`, `clearable` |
| 1.07 | **AppTextarea** | `components/base/AppTextarea.vue` | `modelValue`, `label`, `rows`, `maxlength`, `showCount`, `error` |
| 1.08 | **AppSelect** | `components/base/AppSelect.vue` | `modelValue`, `options[]`, `searchable`, `clearable`, `error`, `label` |
| 1.09 | **AppDatePicker** | `components/base/AppDatePicker.vue` | `modelValue`, `label`, `placeholder`, `error` |
| 1.10 | **AppBadge** | `components/base/AppBadge.vue` | `count`, `dot`, `max`, `color` |
| 1.11 | **AppDivider** | `components/base/AppDivider.vue` | `direction`, `dashed`, `label` |
| 1.12 | **AppTooltip** | `components/base/AppTooltip.vue` | `text`, `position`, `delay` |
| 1.13 | **AppProgress** | `components/base/AppProgress.vue` | `percentage`, `color`, `showText` |
| 1.14 | **AppSkeleton** | `components/base/AppSkeleton.vue` | `variant: text\|card\|image\|rect`, `width`, `height`, `count` |
| 1.15 | **AppSwitch** | `components/base/AppSwitch.vue` | `modelValue`, `disabled`, `label` |

### Deliverables

- `components/base/` 下 15 个 `.vue` 文件
- 每个组件 `<script setup lang="ts">` + Props 类型定义 + template

### Acceptance Criteria

- [ ] 所有组件可通过 `import { AppX } from '@/components/base/AppX.vue'` 引入
- [ ] AppIcon 是项目中唯一直接 import `lucide-vue-next` 的文件
- [ ] AppButton 4 个变体渲染正确（primary=日落橙, secondary=透明边框, ghost=透明, danger=红色）
- [ ] AppButton loading 态显示 AppSpinner + 禁用点击
- [ ] AppChip 4 个变体渲染正确（active 背景色受 `activeColor` prop 控制）
- [ ] AppInput focus 态 border-bottom 变为 2px Sunset Orange
- [ ] AppInput error 态 border-bottom 变为 Danger 色 + 显示 error 文字
- [ ] AppTooltip 4 个方向定位正确
- [ ] 所有变异体颜色使用 CSS 变量，支持深色主题自动切换
- [ ] 组件内无硬编码业务文案

### Risks

| 风险 | 应对 |
|------|------|
| AppDatePicker 基于 Element Plus 封装，其内部样式难以覆盖 | 使用 `el-config-provider` 注入全局主题 + `:deep()` 覆盖关键样式 |
| AppTooltip 定位计算复杂 | 使用纯 CSS `::after` + `position: absolute` 实现，不引入 floating-ui 依赖 |

### Self Review Checklist

- [ ] 每个组件 Props 类型完整（无 `as any`）
- [ ] 组件文件名以 `App` 前缀，多单词（符合 Vue 规范）
- [ ] 没有组件直接 import `lucide-vue-next`（除 AppIcon）
- [ ] 没有组件包含业务数据（国家名、旅行信息等）
- [ ] 所有颜色值通过 CSS 变量或 `colors.ts` 引用
- [ ] hover/active/disabled/focus 状态视觉完整
- [ ] 符合 `design.md` 对应规范（按钮 → Section 7.1, 输入框 → Section 7.4, Chip → Section 7.3）
- [ ] 符合 `COMPONENT_ARCHITECTURE.md` Atoms 详细规范

---

## Phase 2：Molecule Components

### Goal

构建全部 20 个分子组件。由 Atoms 组合而成，有明确功能语义。

### Why

Molecules 是页面组装的基本单元——EmptyState、BackLink、PageHeader 等在多个页面出现。提前完成它们，页面开发只需做组装。

### Prerequisites

- ✅ Phase 1 完成（所有 Atom 可用）

### Tasks

| # | Task | 产出文件 | 依赖 Atoms |
|---|------|----------|-----------|
| 2.01 | **SearchInput** | `components/shared/SearchInput.vue` | AppInput, AppIcon |
| 2.02 | **DateRangeField** | `components/shared/DateRangeField.vue` | AppDatePicker |
| 2.03 | **CountrySelect** | `components/shared/CountrySelect.vue` | AppSelect |
| 2.04 | **TransportIcon** | `components/shared/TransportIcon.vue` | AppIcon |
| 2.05 | **DurationBadge** | `components/shared/DurationBadge.vue` | AppChip |
| 2.06 | **MetaBadge** | `components/shared/MetaBadge.vue` | AppChip |
| 2.07 | **StatItem** | `components/shared/StatItem.vue` | useOdometer |
| 2.08 | **CountryLabel** | `components/shared/CountryLabel.vue` | 无 |
| 2.09 | **CityLabel** | `components/shared/CityLabel.vue` | 无 |
| 2.10 | **RouteVisual** | `components/shared/RouteVisual.vue` | TransportIcon |
| 2.11 | **TimeDisplay** | `components/shared/TimeDisplay.vue` | 无 |
| 2.12 | **EmptyState** | `components/shared/EmptyState.vue` | AppIcon, AppButton |
| 2.13 | **ConfirmAction** | `components/shared/ConfirmAction.vue` | AppButton |
| 2.14 | **BackLink** | `components/shared/BackLink.vue` | AppIcon |
| 2.15 | **PageHeader** | `components/shared/PageHeader.vue` | BackLink |
| 2.16 | **SectionHeader** | `components/shared/SectionHeader.vue` | AppButton |
| 2.17 | **TagGroup** | `components/shared/TagGroup.vue` | AppChip |
| 2.18 | **InlineEditor** | `components/shared/InlineEditor.vue` | AppButton, AppTextarea |
| 2.19 | **PhotoThumbnail** | `components/shared/PhotoThumbnail.vue` | 无 |
| 2.20 | **UploadDropZone** | `components/shared/UploadDropZone.vue` | AppIcon, AppProgress |

### Deliverables

- `components/shared/` 下 20 个 `.vue` 文件

### Acceptance Criteria

- [ ] EmptyState 在有/无 ctaText prop 时分别渲染（带按钮 / 纯文字）
- [ ] CountrySelect 输入文字后 300ms debounce 触发 `@search` 事件
- [ ] TransportIcon 根据 `type: FLIGHT\|TRAIN\|CAR\|OTHER` 渲染不同图标和颜色
- [ ] RouteVisual 渲染 `PVG ──✈── CDG` 格式路线
- [ ] StatItem 在 `animate=true` 时数字从 0 滚动到目标值
- [ ] StatItem 在 `animate=false` 时直接显示目标值
- [ ] BackLink 未传 `to` prop 时调用 `router.back()`
- [ ] PageHeader 包含 BackLink + Newsreader 标题 + Inter 副标题 + meta 插槽
- [ ] TagGroup 支持 `multiple=false`（单选）和 `multiple=true`（多选）
- [ ] InlineEditor 展示态点击 → 切换为编辑态 → Save/Cancel → 回到展示态
- [ ] PhotoThumbnail hover 时 scale(1.02) + 阴影出现
- [ ] UploadDropZone 拖入文件时边框变 Sunset Orange + 背景变亮

### Risks

| 风险 | 应对 |
|------|------|
| InlineEditor 的 textarea 高度自适应问题 | 使用 `ref` 监听输入内容高度，或固定 rows prop |
| CountrySelect 的国家列表数据来源 | Phase 2 阶段使用 mock 静态列表，Phase 11 切换为 API |

### Self Review Checklist

- [ ] 每个组件依赖的 Atoms 只通过 import 引用（不重复实现）
- [ ] Props 包含所有 COMPONENT_ARCHITECTURE.md 中列出的参数
- [ ] Events 命名使用 kebab-case（`@search`, `@photo-click`）
- [ ] 组件内无硬编码颜色（全部 CSS 变量）
- [ ] 符合 `design.md` 对应规范
- [ ] 符合 `COMPONENT_ARCHITECTURE.md` Molecules 详细规范

---

## Phase 3：Layout Templates & Navigation

### Goal

构建 5 个布局模板 + NavPill 导航组件。完成页面骨架。

### Why

布局模板定义了所有页面的排版规则。NavPill 是全站唯一导航入口。完成后，页面只需选 layout + 填 slot 即可。

### Prerequisites

- ✅ Phase 2 完成（BackLink, AppChip 可用）

### Tasks

| # | Task | 产出文件 | 说明 |
|---|------|----------|------|
| 3.01 | **FullBleedLayout** | `components/layout/FullBleedLayout.vue` | 全屏铺满，无 padding。slot: `default` |
| 3.02 | **TwoColumnLayout** | `components/layout/TwoColumnLayout.vue` | 双列 CSS Grid。props: `leftCols`, `rightCols`, `gap`, `leftSticky`。slots: `left`, `right` |
| 3.03 | **CenteredFormLayout** | `components/layout/CenteredFormLayout.vue` | 8 列居中表单。props: `title`, `backTo`, `maxWidth`。slots: `header`, `default`, `actions` |
| 3.04 | **FullWidthLayout** | `components/layout/FullWidthLayout.vue` | 全宽列表。slots: `header`, `default` |
| 3.05 | **GridLayout** | `components/layout/GridLayout.vue` | CSS Grid。props: `cols`, `gap`。slots: `header`, `default` |
| 3.06 | **NavPill** | `components/layout/NavPill.vue` | 顶部居中浮动导航。props: `items`(route+icon+label), `activeColor`。fixed 定位 + z-index |

### Deliverables

- `components/layout/` 下 6 个 `.vue` 文件

### Acceptance Criteria

- [ ] TwoColumnLayout `leftCols=7, rightCols=5` 渲染 7:5 比例网格
- [ ] TwoColumnLayout `leftSticky=true` 时左列 `position: sticky; top: 0`
- [ ] CenteredFormLayout 内容区最大宽度 960px，居中
- [ ] GridLayout `cols=3, gap=20px` 渲染 3 列 20px 间距网格
- [ ] NavPill 固定在视口顶部居中（`position: fixed; top: 16px; left: 50%; transform: translateX(-50%)`）
- [ ] NavPill 当前路由对应 item 高亮（bg=activeColor 10% opacity + border）
- [ ] NavPill `activeColor='forest'` 时高亮色为 Forest Green（Wishlist 页使用）
- [ ] 所有布局支持深色主题自动切换
- [ ] NavPill 在 `position='bottom'` 时固定到底部（为 v0.2 mobile 预留）

### Risks

| 风险 | 应对 |
|------|------|
| NavPill fixed 定位可能被 Leaflet/Three.js 全屏 canvas 遮挡 | z-index 设置 1000+，高于地图/地球容器 |
| TwoColumnLayout 在小屏幕（<1280px）下表现不佳 | MVP 只适配 1280px+，不做响应式 |

### Self Review Checklist

- [ ] 所有 layout 使用 `<slot>` 而非硬编码内容
- [ ] NavPill items 数据结构为 `{ label, icon, route, activeColor? }[]`
- [ ] NavPill 使用 `useRouter().currentRoute` 自动判断 active 态
- [ ] 无业务逻辑在 layout 中
- [ ] 符合 `COMPONENT_ARCHITECTURE.md` Templates 详细规范

---

## Phase 4：API Layer & Mock Data

### Goal

建立 Axios 客户端 + 6 个 API 模块 + 4 个 Pinia Store + mock 数据。

### Why

页面需要数据。先建好 API 层和 Store 层，返回 mock 数据，页面就能独立开发和测试。Phase 11 替换为真实 HTTP 调用时只需改 API 模块。

### Prerequisites

- ✅ Phase 0 完成（TypeScript 类型已定义）

### Tasks

| # | Task | 产出文件 | 说明 |
|---|------|----------|------|
| 4.01 | Axios 客户端 | `api/client.ts` | `baseURL='/api'`, `timeout=10000`, 请求/响应拦截器, 401→登录页(v0.2) |
| 4.02 | 国家 API | `api/countries.ts` | `getCountries()`, `getVisitedCountries()`, `getCountryDetail(code)`, `getCountryCities(code)`, `getCountryTrips(code)`, `getCountryPhotos(code)` |
| 4.03 | 旅行 API | `api/trips.ts` | `getTrips()`, `getTripDetail(id)`, `createTrip(data)`, `updateTrip(id,data)`, `deleteTrip(id)` |
| 4.04 | 照片 API | `api/photos.ts` | `getTripPhotos(tripId)`, `uploadPhotos(tripId, files)`, `updatePhoto(id, data)`, `deletePhoto(id)` |
| 4.05 | 想去 API | `api/wishlist.ts` | `getWishlist(type?)`, `addWishlistItem(data)`, `deleteWishlistItem(id)` |
| 4.06 | 统计 API | `api/stats.ts` | `getStats()` |
| 4.07 | **Mock 数据** | `api/mock/data.ts` | 3 条示例旅行（Paris, Tokyo, Bangkok）+ 配套城市、路线、航班、照片 |
| 4.08 | Mock 开关 | `api/mock/index.ts` | 每个 API 函数优先尝试真实请求，失败或 mock 模式时返回 mock 数据 |
| 4.09 | App Store | `stores/appStore.ts` | `theme`, `toggleTheme()`, `toastQueue` |
| 4.10 | Country Store | `stores/countryStore.ts` | `countries`, `visitedCountries`, `fetchVisitedCountries()` |
| 4.11 | Trip Store | `stores/tripStore.ts` | `recentTrips`, `currentTrip`, `fetchTrips()`, `fetchTripDetail(id)` |
| 4.12 | Wishlist Store | `stores/wishlistStore.ts` | `items`, `fetchWishlist()`, `addItem()`, `removeItem()` |

### Deliverables

- `api/` 下 7 个文件
- `stores/` 下 4 个文件
- Mock 数据包含 3 条完整旅行（可渲染所有页面）

### Acceptance Criteria

- [ ] `api/client.ts` 导出的 Axios 实例可正常发起请求
- [ ] 所有 API 函数返回类型为 `Promise<ApiResponse<T>>`
- [ ] Mock 模式下所有 API 调用返回合理数据（延迟 200-400ms 模拟网络）
- [ ] `countryStore.fetchVisitedCountries()` 返回 `{ visited: [...], wishlist: [...] }` 数据结构
- [ ] `tripStore.fetchTripDetail(1)` 返回包含城市、路线、航班的完整旅行对象
- [ ] Store 使用 Pinia `defineStore` + Composition API 风格
- [ ] Mock 数据覆盖：去过国家 3 个（FRA, JPN, THA）、想去国家 4 个（ISL, NZL, PER, MAR）

### Risks

| 风险 | 应对 |
|------|------|
| Mock 数据过于简单，无法暴露真实数据问题 | 构造边界数据：空照片的旅行、多航班的旅行、想去但无城市的国家 |

### Self Review Checklist

- [ ] API 函数签名与 `DEVELOPMENT_PLAN.md` Section 6 接口清单一致
- [ ] Store 的 state 类型全部推导正确（无 `any`）
- [ ] Mock 数据日期使用 `2024-10-12` 等真实日期（非 `new Date()`）
- [ ] 无 store 直接操作 DOM
- [ ] 无 store 直接引用 router

---

## Phase 5：Trip Editor Module

### Goal

构建 TripEditor 页面及其专属 Organism 组件（RouteEditor, PhotoUploader）。TripEditor 是数据录入入口，其他页面依赖其产出的数据。

### Why

TripEditor 优先开发的原因：
1. 其他页面需要旅行数据才能展示
2. 它是唯一的数据录入入口
3. 它依赖的组件（表单、上传、路线编辑）其他页面用不到，可以独立开发

### Prerequisites

- ✅ Phase 2 完成（AppInput, AppSelect, AppButton, InlineEditor 等可用）
- ✅ Phase 3 完成（CenteredFormLayout, NavPill 可用）
- ✅ Phase 4 完成（tripStore, countryStore, Mock 数据可用）

### Tasks

| # | Task | 产出文件 | 说明 |
|---|------|----------|------|
| 5.01 | **RouteEditor** | `components/features/trip/RouteEditor.vue` | 城市列表拖拽排序 + 交通方式选择（FLIGHT/TRAIN/CAR/OTHER）+ 添加/删除城市 |
| 5.02 | **PhotoUploader** | `components/features/photo/PhotoUploader.vue` | 拖拽/点击上传 + 缩略图预览 + 删除 + 客户端压缩(2400px) + 进度条 |
| 5.03 | **NotesViewer** | `components/features/content/NotesViewer.vue` | 基于 InlineEditor，marked 渲染 Markdown + 编辑切换 + 保存 |
| 5.04 | **TripEditor 页面** | `pages/TripEditor.vue` | 组装 CenteredFormLayout + CountrySelect + DateRangeField + city inputs + RouteEditor + FlightInfo 表单 + PhotoUploader + NotesViewer + ConfirmAction |
| 5.05 | 表单验证 | 在 TripEditor.vue 中 | 国家必选、至少 1 个城市、日期范围合法、照片格式/大小验证 |
| 5.06 | 编辑模式 | 在 TripEditor.vue 中 | URL `/trip/:id/edit` → 从 tripStore 加载已有数据 → 预填所有字段 |

### Deliverables

- `components/features/trip/RouteEditor.vue`
- `components/features/photo/PhotoUploader.vue`
- `components/features/content/NotesViewer.vue`
- `pages/TripEditor.vue`（覆盖 `/trip/new` 和 `/trip/:id/edit`）

### Acceptance Criteria

- [ ] RouteEditor 可拖拽城市调整顺序
- [ ] RouteEditor 每段路线可选择交通方式（下拉：飞机/火车/汽车/其他）
- [ ] RouteEditor 至少 2 个城市才显示路线编辑区
- [ ] PhotoUploader 拖入 JPG/PNG/WebP → 显示缩略图预览
- [ ] PhotoUploader 文件超过 10MB → 显示 error 提示
- [ ] PhotoUploader 上传后照片可点击 × 删除
- [ ] NotesViewer 展示态渲染 Markdown（标题、加粗、列表）
- [ ] NotesViewer 点击 Edit → 切换为 textarea → Save → 回到展示态
- [ ] TripEditor 新增模式：所有字段为空，标题显示 "New Trip"
- [ ] TripEditor 编辑模式：所有字段预填已有数据，标题显示 "Edit Trip"
- [ ] 表单提交时校验失败 → 显示 error 提示，不跳转
- [ ] 表单提交成功 → Toast "Trip saved" → 路由跳转到 TripDetail

### Risks

| 风险 | 应对 |
|------|------|
| HTML5 拖拽排序在 Vue 中难处理 | 使用 `@dragstart`/`@dragover`/`@drop` 原生事件，或安装 `sortablejs` |
| 照片压缩 canvas 操作耗性能 | 在 Web Worker 中执行压缩，或限制同时压缩数量为 1 |
| Flight info 表单字段多，布局复杂 | 使用可折叠区域（"+ Add flight" 按钮），默认收起 |

### Self Review Checklist

- [ ] RouteEditor 使用 v-model 双向绑定城市/路线数据
- [ ] PhotoUploader 在组件卸载时释放未上传的 blob URL
- [ ] TripEditor 编辑和新增共用同一个组件（通过 `route.params.id` 判断模式）
- [ ] 表单验证错误信息使用 AppInput 的 `error` prop 非 alert
- [ ] 提交按钮在 loading 时禁用
- [ ] 符合 `DEVELOPMENT_SPEC.md` TripEditor 页面规范

---

## Phase 6：Globe & Map Module

### Goal

构建 3D 地球和 2D 地图所有组件及 composable。

### Why

地球是首页核心，地图是国家/旅行详情核心。两者都依赖第三方库（Globe.GL / Leaflet），需要独立封装以隔离复杂性。

### Prerequisites

- ✅ Phase 1 完成（AppSpinner 可用）
- ✅ Phase 0 完成（GeoJSON 文件已放置、colors.ts 可用）
- ✅ 已安装 `globe.gl` 和 `leaflet`（package.json 已有）

### Tasks

| # | Task | 产出文件 | 说明 |
|---|------|----------|------|
| 6.01 | **useGlobe** | `composables/useGlobe.ts` | Globe.GL 初始化 + GeoJSON 加载 + resize + destroy |
| 6.02 | **Globe3D** | `components/features/globe/Globe3D.vue` | 全屏 3D 地球：Globe.GL polygonsData + `countries` prop 驱动着色 + hover 浮起 + click 路由 + tooltip |
| 6.03 | **ContextGlobe** | `components/features/globe/ContextGlobe.vue` | 80x80 小地球：`countryCode` prop 高亮单国家 + 自动旋转（慢速） |
| 6.04 | **useMap** | `composables/useMap.ts` | Leaflet 初始化 + CartoDB 瓦片 + markers + polylines + destroy |
| 6.05 | **CityMarker** | `components/features/map/CityMarker.ts` | Leaflet DivIcon 工厂函数：visited→Sunset Orange 圆+pulse, wishlist→Forest Green 圆 |
| 6.06 | **RouteLine** | `components/features/map/RouteLine.ts` | Leaflet Polyline 工厂函数：FLIGHT→Ocean 实线 2px, TRAIN→Forest 虚线, CAR→Tertiary 虚线 |
| 6.07 | **CountryMap** | `components/features/map/CountryMap.vue` | 国家页地图：Leaflet + CartoDB Positron 瓦片 + CityMarker×N + RouteLine×N + fitBounds |
| 6.08 | **RouteMap** | `components/features/map/RouteMap.vue` | 旅行路线地图：基于 CountryMap + TransportIcon mid-point + hover 线宽变化 |

### Deliverables

- `composables/useGlobe.ts`
- `composables/useMap.ts`
- `components/features/globe/` 下 2 个 `.vue` 文件
- `components/features/map/` 下 4 个文件（2 `.vue` + 2 `.ts` 工厂）

### Acceptance Criteria

- [ ] Globe3D 加载蓝色大理石纹理 → 加载 GeoJSON → 按 `countries` prop 着色
- [ ] Globe3D 拖拽旋转、惯性旋转、滚轮缩放（1.0x–3.0x）
- [ ] Globe3D hover 国家 → 边缘 2px Sunset Orange 发光 + tooltip 显示国名+次数
- [ ] Globe3D click 去过国家 → Camera flyTo 居中 → emit `@country-click(code)`（父组件路由跳转）
- [ ] Globe3D 组件 `onUnmounted` 释放 Three.js 资源（scene.dispose + renderer.dispose）
- [ ] ContextGlobe 80x80 尺寸，不可交互，自动旋转
- [ ] CountryMap 加载 CartoDB Positron 瓦片（非默认 OSM）
- [ ] CountryMap 城市标点颜色：visited=Sunset Orange, wishlist=Forest Green
- [ ] CountryMap 路线按交通方式分色（见 design.md Section 7.2）
- [ ] RouteMap hover 路线 → 线宽 2px→4px + tooltip
- [ ] useMap 在 `onUnmounted` 调用 `map.remove()` 释放 Leaflet 实例

### Risks

| 风险 | 应对 |
|------|------|
| Globe.GL API 与设计需求不匹配（如着色方式限制）| 退化到 Three.js 原生实现（手动解析 GeoJSON → 多边形着色）|
| Globe3D 在页面切换时 GPU 内存未释放 | composable `onUnmounted` 中强制 `renderer.dispose()` + `scene.traverse()` 释放所有 Three.js 资源 |
| Leaflet CSS z-index 与 NavPill fixed 定位冲突 | NavPill z-index: 1000, Leaflet z-index: 默认(400) |
| CartoDB 瓦片服务不稳定 | 备选：Stadia Maps Alidade Smooth（同样浅色风格）或 OpenStreetMap HOT |

### Self Review Checklist

- [ ] useGlobe 返回 `{ init, destroy, resize, flyToCountry }`
- [ ] useMap 返回 `{ init, destroy, fitToBounds, addMarker, addPolyline }`
- [ ] Globe3D 不接收 route/router 参数（路由跳转通过 emit 给父组件）
- [ ] CityMarker.ts / RouteLine.ts 导出的工厂函数返回 Leaflet Layer 对象
- [ ] 地图瓦片 URL 支持深色/浅色切换（浅色=Positron, 深色=Dark Matter）
- [ ] 无 Three.js/Leaflet 对象泄漏（`onUnmounted` 验证）
- [ ] 符合 `design.md` Section 6（Globe）和 Section 7（Map）

---

## Phase 7：Home Page（未来版本 v0.2）

### Goal

构建 GlobeHome 页面及其专属 Organism 组件。

### Why

首页是用户第一眼看到的页面，也是从 TripEditor 录入数据后的第一个验证节点。地球交互 + 统计 + 最近旅行三大模块必须在首页协同工作。

### Prerequisites

- ✅ Phase 3 完成（FullBleedLayout, NavPill）
- ✅ Phase 6 完成（Globe3D）
- ✅ Phase 4 完成（countryStore, tripStore, Mock 数据）

### Tasks

| # | Task | 产出文件 | 说明 |
|---|------|----------|------|
| 7.01 | **StatsPanel** | `components/features/trip/StatsPanel.vue` | 统计面板：StatItem×3（Countries, Cities, Trips）+ odometer 动画 |
| 7.02 | **TripMiniCard** | `components/features/trip/TripMiniCard.vue` | 紧凑卡片：120px 封面图 + 城市名(Newsreader 24px) + 日期 + 天数 pill |
| 7.03 | **GlobeHome 页面** | `pages/GlobeHome.vue` | 组装 FullBleedLayout + NavPill + Globe3D + StatsPanel + TripMiniCard[] 水平滚动 |

### Deliverables

- `components/features/trip/StatsPanel.vue`
- `components/features/trip/TripMiniCard.vue`
- `pages/GlobeHome.vue`

### Acceptance Criteria

- [ ] Globe3D 从 `countryStore.visitedCountries` 获取着色数据
- [ ] StatsPanel 在页面加载时数字从 0 滚动到目标值（odometer 动画）
- [ ] TripMiniCard 封面图填满顶部 120px，底部圆角 14px 14px 0 0
- [ ] TripMiniCard hover → 封面 scale(1.03) + 卡片 translateY(-2px)
- [ ] 最近旅行水平滚动（`overflow-x: auto` + 隐藏滚动条）
- [ ] 无旅行数据时显示 EmptyState（"还没有旅行记录" + "开始第一次旅行" CTA）
- [ ] 地球加载中显示 AppSpinner 覆盖层
- [ ] Click 去过国家 → router.push(`/country/${code}`)
- [ ] Click 想去国家 → router.push(`/wishlist`)
- [ ] 页面入场动画序列：地球淡入(800ms) → Stats 滑入(300ms) → NavPill 下落(300ms) → TripMiniCard stagger(每张 80ms)

### Risks

| 风险 | 应对 |
|------|------|
| StatsPanel odometer 动画在页面不可见时仍在运行 | 使用 IntersectionObserver 暂停/恢复动画 |
| Globe3D 和 StatsPanel 的入场动画时序错乱 | 使用 `onMounted` 中 `setTimeout` 链控制，或 Vue `<Transition>` 的 `@after-enter` 事件 |

### Self Review Checklist

- [ ] Globe3D 的 `@country-click` 事件正确处理三种状态（visited→Country, wishlist→Wishlist, unvisited→无操作）
- [ ] StatsPanel 数据来自 `statsStore`（非硬编码）
- [ ] TripMiniCard 封面图使用 `object-fit: cover`
- [ ] 符合 `design.md` Section 13（页面结构）和 Section 5.2（TripMiniCard）
- [ ] 符合 `DEVELOPMENT_SPEC.md` GlobeHome 页面规范

---

## Phase 8：Country Detail Page（未来版本 v0.2）

### Goal

构建 CountryDetail 页面。地图 + 城市标点 + 路线 + 照片墙 + 旅行列表。

### Why

从首页点击国家后到达的页面。数据流依赖 tripEditor（数据来源）和 GlobeHome（跳转入 口）。

### Prerequisites

- ✅ Phase 3 完成（TwoColumnLayout, NavPill）
- ✅ Phase 6 完成（CountryMap）
- ✅ Phase 2 完成（PageHeader, PhotoThumbnail, TripCard 所需的 Molecules）
- ✅ Phase 4 完成（countryStore, tripStore）

### Tasks

| # | Task | 产出文件 | 说明 |
|---|------|----------|------|
| 8.01 | **TripCard** | `components/features/trip/TripCard.vue` | 旅行列表卡片：封面缩略图 + CityLabel + 日期 + MetaBadge + 3 张照片 |
| 8.02 | **PhotoGrid** | `components/features/photo/PhotoGrid.vue` | CSS Grid dense 照片网格：`grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))` + `gap: 8px` |
| 8.03 | **LightboxGallery** | `components/features/photo/LightboxGallery.vue` | 全屏照片浏览：Teleport + 暗色背景 + EXIF 胶囊 + 左右导航 + ESC 关闭 |
| 8.04 | **CountryDetail 页面** | `pages/CountryDetail.vue` | 组装 TwoColumnLayout(7+5) + NavPill + PageHeader + CountryMap + PhotoGrid + TripCard[] + LightboxGallery + ContextGlobe |

### Deliverables

- `components/features/trip/TripCard.vue`
- `components/features/photo/PhotoGrid.vue`
- `components/features/photo/LightboxGallery.vue`
- `pages/CountryDetail.vue`

### Acceptance Criteria

- [ ] 国家名 Newsreader Display LG (40px) + 国旗 emoji
- [ ] 副标题 "N trips · N cities · YYYY–YYYY"
- [ ] 左列 CountryMap sticky 定位（右侧滚动时地图固定）
- [ ] 城市标点 hover → tooltip 显示城市名 + 去过日期
- [ ] Click 城市标点 → 地图 pan + zoom
- [ ] PhotoGrid 图片多种宽高比混合排列（3:2/1:1/2:3）
- [ ] Click 照片 → LightboxGallery 全屏展开（350ms spring 动画）
- [ ] LightboxGallery 底部 EXIF 胶囊显示日期·城市·相机
- [ ] LightboxGallery 支持 ← → 键盘导航 + ESC 关闭
- [ ] Click TripCard → router.push(`/trip/${id}`)
- [ ] 右下角 ContextGlobe 高亮当前国家
- [ ] 无旅行数据时显示 EmptyState
- [ ] 国家代码无效（404）→ Error 状态 + "返回首页"按钮
- [ ] 页面入场动画序列（design.md Section 11.4 或 design-spec.md Section 10.3）

### Risks

| 风险 | 应对 |
|------|------|
| LightboxGallery 展开/关闭动画从网格位置计算复杂 | Phase 8 先用简单的中心展开动画（不追踪原位置），Phase 12 再优化 |
| CountryMap fitBounds 在无城市数据时行为未定义 | 设置 fallback：无城市时 fitBounds 到国家边界，无边界时 zoom=5, center=[48,2] |

### Self Review Checklist

- [ ] PhotoGrid 的 gap 为 `--photo-grid-gap`（8px）
- [ ] PhotoCard 无阴影无边框（`border-radius: 14px`）
- [ ] LightboxGallery 使用 `<Teleport to="body">`
- [ ] LightboxGallery visible=false 时 DOM 不渲染（v-if, 非 v-show）
- [ ] TripCard 的 `@click` 事件冒泡不被子元素阻止
- [ ] CountryMap 在 `onUnmounted` 调用 `map.remove()`
- [ ] 符合 `design.md` Section 13（Country 页结构）
- [ ] 符合 `DEVELOPMENT_SPEC.md` CountryDetail 页面规范

---

## Phase 9：Trip Detail Page（未来版本 v0.2）

### Goal

构建 TripDetail 页面。路线地图 + 航班卡片 + 天时间线 + 照片画廊 + 手记。

### Why

旅行详情是信息密度最高的页面，依赖 FlightCard（本项目标志性组件）和 DayTimelineStrip。

### Prerequisites

- ✅ Phase 3 完成（TwoColumnLayout, NavPill）
- ✅ Phase 6 完成（RouteMap）
- ✅ Phase 2 完成（PageHeader, RouteVisual, TimeDisplay 等）
- ✅ Phase 8 完成（PhotoGrid, LightboxGallery — 从 Phase 8 复用）
- ✅ Phase 4 完成（tripStore）

### Tasks

| # | Task | 产出文件 | 说明 |
|---|------|----------|------|
| 9.01 | **FlightCard** | `components/features/trip/FlightCard.vue` | 登机牌风格：顶部 4px 蓝色条 + 航司/航班号 + 机型 + RouteVisual + TimeDisplay 时间线 + 时长 + 经停 |
| 9.02 | **DayTimelineStrip** | `components/features/trip/DayTimelineStrip.vue` | 水平滚动天时间线：DayDot（实心=有照片/空心=无） + 连接线 + 点击跳转 |
| 9.03 | **TripDetail 页面** | `pages/TripDetail.vue` | 组装 TwoColumnLayout(7+5) + NavPill + PageHeader + RouteMap + FlightCard[] + DayTimelineStrip + PhotoGrid + NotesViewer + LightboxGallery + ContextGlobe |

### Deliverables

- `components/features/trip/FlightCard.vue`
- `components/features/trip/DayTimelineStrip.vue`
- `pages/TripDetail.vue`

### Acceptance Criteria

- [ ] FlightCard 顶部 4px `--flight-accent` 蓝色条
- [ ] 航司名 Inter 14px Secondary + 航班号 Mono 18px Primary + 机型 Inter 12px Tertiary
- [ ] RouteVisual 渲染 `PVG ──✈── CDG` + 城市名
- [ ] 时间线竖线 + Ocean Blue 圆点 + 起飞/降落时间 Mono 20px
- [ ] 时长居中 Mono 16px + 经停信息 Inter 12px
- [ ] 多航班堆叠：每张卡片微旋转 ±0.5°（奇数/偶数交替），hover 回正
- [ ] DayTimelineStrip DayDot 有照片=实心 Sunset Orange、无照片=空心 Tertiary
- [ ] Click DayDot → 页面平滑滚动到对应日期的照片区域
- [ ] RouteMap 路线按交通方式分色（FLIGHT=Ocean 实线, TRAIN=Forest 虚线, CAR=Tertiary 虚线）
- [ ] Hover 路线 → 线宽 2→4px + tooltip
- [ ] NotesViewer 展示 Markdown 手记 + 内联编辑
- [ ] 右下角 ContextGlobe 显示旅行路线在球面上
- [ ] 旅行不存在（404）→ Error 状态 + "返回"按钮

### Risks

| 风险 | 应对 |
|------|------|
| FlightCard 堆叠旋转在 z-index 层叠时出现遮挡 | hover 时动态设置 `z-index: 10`，其他卡片 `z-index: 1` |
| DayTimelineStrip 天数过多（30+天）导致水平滚动过长 | 限制初始显示 7 天，箭头按钮滚动 |
| RouteMap 路线段过多（10+段）时地图标注混乱 | 使用 Leaflet featureGroup 统一管理，hover 时只高亮当前段 |

### Self Review Checklist

- [ ] FlightCard 的 `stackIndex` prop 控制 `rotate(${index % 2 === 0 ? '+' : '-'}0.5deg)`
- [ ] FlightCard hover 时 `transform: rotate(0deg) scale(1.02) + z-index: 10`
- [ ] DayTimelineStrip 使用 `useScrollspy` 联动当前可视照片区域
- [ ] NotesViewer 复用 Phase 5 的组件，不重复实现
- [ ] RouteMap 复用 Phase 6 的 RouteLine/CityMarker 工厂函数
- [ ] 符合 `design.md` Section 9（FlightCard）和 Section 13（Trip 页）
- [ ] 符合 `DEVELOPMENT_SPEC.md` TripDetail 页面规范

---

## Phase 10：Wishlist Page（未来版本 v0.2）

### Goal

构建 Wishlist 页面。目的地卡片网格 + 分类切换 + 卡片展开/收起。

### Why

想去清单是独立模块，不依赖其他页面（仅依赖 Phase 4 的 wishlistStore）。可以最后开发。

### Prerequisites

- ✅ Phase 3 完成（GridLayout, NavPill）
- ✅ Phase 2 完成（PageHeader, CountryLabel, TagGroup 等）
- ✅ Phase 4 完成（wishlistStore）

### Tasks

| # | Task | 产出文件 | 说明 |
|---|------|----------|------|
| 10.01 | **CategoryToggle** | `components/features/wishlist/CategoryToggle.vue` | Countries/Cities 切换 Pill（基于 TagGroup, multiple=false） |
| 10.02 | **DestinationCard** | `components/features/wishlist/DestinationCard.vue` | 封面渐变 + 国旗 emoji 48px + 国家名 Newsreader 28px + 书签按钮 + 城市数 + 展开/收起 |
| 10.03 | **AddFab** | `components/features/wishlist/AddFab.vue` | 右下角浮动按钮 "+ Add Destination"，Forest Green 风格 |
| 10.04 | 搜索添加浮层 | 在 Wishlist.vue 中 | BaseModal + SearchInput + 国家/城市搜索结果 + 添加按钮 |
| 10.05 | **Wishlist 页面** | `pages/Wishlist.vue` | 组装 GridLayout(cols=3) + NavPill(activeColor='forest') + CategoryToggle + DestinationCard[] + AddFab + 搜索浮层 |

### Deliverables

- `components/features/wishlist/CategoryToggle.vue`
- `components/features/wishlist/DestinationCard.vue`
- `components/features/wishlist/AddFab.vue`
- `pages/Wishlist.vue`

### Acceptance Criteria

- [ ] PageHeader 标题 "Dream Destinations" Forest Green + 副标题 "Places waiting to be explored"
- [ ] NavPill `activeColor='forest'` — Wishlist 页选中态为 Forest Green
- [ ] CategoryToggle 切换 Countries/Cities → 过滤卡片列表
- [ ] DestinationCard 封面区域：渐变背景 + 国旗 emoji 48px
- [ ] DestinationCard 右上角书签按钮显示已保存城市数
- [ ] Click DestinationCard → 展开城市列表（height auto 300ms 动画）
- [ ] 展开态显示城市名 + 备注 + × 删除按钮
- [ ] 展开态底部 "+ Add city" → 内联输入框
- [ ] Click AddFab → BaseModal 搜索浮层（输入国家名 → 搜索结果 → 点击添加）
- [ ] 添加成功后 Toast "Destination added"
- [ ] 空列表时显示 EmptyState（"还没有想去的地方"）
- [ ] 页面入场：卡片 grid stagger 浮入（每行 60ms delay）

### Risks

| 风险 | 应对 |
|------|------|
| 卡片展开/收起动画 height auto 无法 transition | 使用 `max-height` trick 或 Vue `<Transition>` + 测量实际高度 |
| 搜索添加浮层的国家数据来源 | Phase 10 使用 `countryStore.countries` 静态列表，Phase 11 接入搜索 API |

### Self Review Checklist

- [ ] DestinationCard 展开/收起动画流畅（不闪动）
- [ ] AddFab 不遮挡最后一张卡片（卡片网格底部留 80px padding）
- [ ] Wishlist 页面所有 accent 色使用 Forest Green（非 Sunset Orange）
- [ ] 搜索浮层关闭时清空输入
- [ ] 符合 `design.md` Section 13（Wishlist 页结构）
- [ ] 符合 `DEVELOPMENT_SPEC.md` Wishlist 页面规范

---

## Phase 11：Live Data Integration（未来版本 v0.2）

### Goal

将 mock 数据替换为真实后端 API 调用。

### Why

Phase 4-10 使用 mock 数据独立开发。此 Phase 切换到真实后端，完成前后端联调。

### Prerequisites

- ✅ Phase 5-10 完成（所有页面可用 mock 数据正常渲染）
- ✅ 后端 Spring Boot 项目已创建（`backend/`）
- ✅ 后端 API 接口已实现（参考 `DEVELOPMENT_PLAN.md` 接口清单）
- ✅ 数据库已建表并有种子数据

### Tasks

| # | Task | 说明 |
|---|------|------|
| 11.01 | 验证后端 CORS 配置 | 确认 `localhost:3000` 被允许 |
| 11.02 | 移除 `api/mock/` 开关 | 所有 API 函数改为直接调用 `api/client.ts` |
| 11.03 | 联调国家接口 | C1→C6 全部通过 |
| 11.04 | 联调旅行接口 | T1→T5 全部通过 |
| 11.05 | 联调照片接口 | P1→P4 + 上传功能 |
| 11.06 | 联调想去清单接口 | W1→W3 |
| 11.07 | 联调统计接口 | S1 |
| 11.08 | 文件上传路径验证 | 确认 `uploads/` 目录可访问、照片 URL 正确 |
| 11.09 | 错误处理完善 | 网络错误 → Toast "网络异常，请重试"，401/500 → 对应提示 |
| 11.10 | 端到端流程测试 | TripEditor 创建 → Home 显示 → Country 详情 → Trip 详情 → Wishlist 添加 |

### Deliverables

- 删除 `api/mock/` 目录或通过环境变量切换
- 全流程可用真实数据

### Acceptance Criteria

- [ ] TripEditor 创建旅行 → 保存成功 → 路由跳转到 TripDetail 并显示刚创建的数据
- [ ] GlobeHome 地球着色反映数据库中实际访问状态
- [ ] CountryDetail 显示该国家的正确旅行列表
- [ ] TripDetail 航班卡片正确渲染
- [ ] 照片上传 → 显示上传后的 URL（`/uploads/tripId/uuid.jpg`）
- [ ] 想去清单增删正常
- [ ] 统计数据与实际数据一致
- [ ] 所有 API 调用有错误处理（非 crash）

### Risks

| 风险 | 应对 |
|------|------|
| 后端接口字段名与前端 TypeScript 类型不一致 | 联调前先对比 `types/` 文件和 Controller 返回的 JSON |
| 文件上传路径 `uploads/` 在前后端路径解析不一致 | 后端配置 Spring Boot 静态资源映射 `file:./uploads/` → `/uploads/**` |
| 处理大量真实照片时性能下降 | 确保后端分页返回照片，前端懒加载 |

### Self Review Checklist

- [ ] 前端 `api/` 目录中无 mock 数据残留
- [ ] 所有 API 调用使用 `try/catch` 或响应拦截器处理错误
- [ ] 照片上传前客户端压缩仍然生效
- [ ] 无跨域报错（CORS 配置正确）

---

## Phase 12：Polish & Quality（未来版本 v0.2）

### Goal

全项目质量检查：边界状态、动画、深色主题、性能、代码规范。

### Why

最后一道关卡，确保所有状态完整，所有规范符合。

### Prerequisites

- ✅ Phase 11 完成（全流程可运行）

### Tasks

| # | Task | 说明 |
|---|------|------|
| 12.01 | Loading 状态 | 每个页面有对应的 Loading 展示（骨架屏或 Spinner） |
| 12.02 | Empty 状态 | 每个列表/网格有空状态引导（EmptyState + CTA） |
| 12.03 | Error 状态 | API 失败时显示错误信息 + 重试按钮（非白屏） |
| 12.04 | 深色主题巡检 | 所有页面在 `[data-theme="dark"]` 下视觉正确 |
| 12.05 | 入场动画完整性 | 每页按 design-spec.md Section 10.3 序列验证 |
| 12.06 | Globe3D GPU 释放 | 离开首页 → viewer.destroy() → Performance Monitor 确认 GPU 内存下降 |
| 12.07 | Leaflet 地图释放 | 离开地图页 → 确认无残留 DOM 节点 |
| 12.08 | 照片懒加载 | PhotoThumbnail 使用 IntersectionObserver 懒加载 |
| 12.09 | 路由懒加载 | 确认所有页面使用 `() => import()` 动态导入 |
| 12.10 | TypeScript 零 any | `vue-tsc --noEmit` 无 `any` 类型错误 |
| 12.11 | Console 零报错 | 全流程走一遍 → DevTools Console 无 error/warning |
| 12.12 | 命名规范检查 | 对照 COMPONENT_ARCHITECTURE.md Section 6.4 检查所有文件/组件命名 |

### Deliverables

- 所有页面 Loading / Empty / Error 状态完整
- 零 Console 报错
- TypeScript strict 模式通过

### Acceptance Criteria

- [ ] 断开网络 → 页面显示 Error 状态而非白屏
- [ ] 后端返回空数组 → 列表显示 EmptyState 而非空卡片
- [ ] 深色模式切换 → 所有组件颜色即时变化（无残留浅色）
- [ ] 首页 → Country → Trip → Home 来回 10 次 → 内存无持续增长
- [ ] `vue-tsc --noEmit` 零错误
- [ ] 无人工 `// @ts-ignore` 或 `as any` 注释

### Self Review Checklist

- [ ] 全流程走通：创建旅行 → 首页查看 → 国家详情 → 旅行详情 → 想去清单
- [ ] 深色/浅色分别截图对比 `design.md` 期望
- [ ] 代码无 `console.log` 调试残留
- [ ] 符合 `CLAUDE.md` Code Style 规范
- [ ] 符合 `design.md` 全部视觉规范

---

## Appendix A：每 Phase 通用 Self Review 清单

> 当前基线到 Phase 6。Phase 7–12 尚未开始。

以下检查项在每个 Phase 结束时都必须通过：

```
□ TypeScript 编译：vue-tsc --noEmit 无新增错误
□ 组件复用：新增组件是否与已有组件重复？查看 COMPONENT_ARCHITECTURE.md 组件清单
□ 硬编码颜色：所有颜色值是否通过 CSS 变量或 colors.ts 引用？
□ 硬编码文案：所有用户可见文案是否应该提取？（MVP 阶段允许临时硬编码）
□ 命名规范：文件名、组件名、Props、Events 是否符合 COMPONENT_ARCHITECTURE.md Section 6.4？
□ Props 类型：所有 Props 是否有显式 TypeScript 类型？
□ 依赖方向：是否存在低层组件 import 高层组件的情况？（检查 COMPONENT_ARCHITECTURE.md Section 4 依赖图）
□ 无业务耦合：base/ 和 shared/ 组件不引用 stores 或 API
□ 性能：组件 onUnmounted 是否正确清理（事件监听、定时器、Three.js/Leaflet 实例）
```

## Appendix B：Phase 间依赖速查表

```
Phase 0  ← 无依赖
Phase 1  ← Phase 0
Phase 2  ← Phase 1
Phase 3  ← Phase 2
Phase 4  ← Phase 0
Phase 5  ← Phase 2 + Phase 3 + Phase 4 (⬜)
Phase 6  ← Phase 1 + Phase 0
Phase 7–12 ← 未来版本 v0.2
```

## Appendix C：文件变更总览

> 当前基线到 Phase 6。Phase 7–12 文件尚未创建。

| Phase | 新增文件 | 修改文件 |
|-------|----------|----------|
| 0 | 6 types + 4 utils + 4 composables + 1 geojson = **15 files** | package.json |
| 1 | 15 base/ components = **15 files** | 无 |
| 2 | 20 shared/ components = **20 files**（部分完成） | 无 |
| 3 | 5 layout/ + NavPill = **6 files** | 无 |
| 4 | 7 api/ + 4 stores/ = **11 files**（未开始） | 无 |
| 5 | 3 features/ + 1 page = **4 files** | 无 |
| 6 | 2 composables + 2 globe + 4 map = **8 files**（Globe ✅, Map 🔧） | 无 |

---

> **最后更新：** 2026-07-21  
> **当前状态：** Phase 0–5 完成，Phase 6 部分完成（Globe 3D ✅，Map 待补充）  
> **当前可用的页面：** TripEditor（新增/编辑旅行）、Timeline（骨架）、Playground（组件展示）  
> **下一阶段：** 完成 Phase 6 剩余地图组件 → 进入 Phase 7–12
