# Travel Atlas — 组件架构蓝图 (Component Architecture Blueprint)

> **版本：** v1.0 | **2026-07-21**  
> **方法论：** Atomic Design + Composition Pattern  
> **原则：** Component First — 不做页面，先建组件库  
> **设计来源：** design.md（新暖白旅行风） + Stitch 项目 (`14698863986216072936`)

---

## 第一阶段：全局分析

### 1.1 页面清单与组件树扫描

对全部 6 个页面做组件拆解，标记重复出现的 UI 模式。

| 页面 | 路由 | 独有元素 | 跨页共享元素 | 状态 |
|------|------|----------|-------------|------|
| TripEditor | `/trip/new`, `/trip/:id/edit` | RouteEditor, PhotoUploader | BackLink, MarkdownEditor, ConfirmDialog, Toast | ✅ v0.1 |
| Timeline | `/timeline` | TimelineTrack, YearFilter, YearGroup | NavPill, TripCard, EmptyState, Spinner | 🔧 骨架 |
| Playground | `/playground` | — | 全组件展示 | ✅ |
| GlobeHome | `/` (v0.2) | Globe3D, StatsHUD, RecentTripStrip | NavPill, TripMiniCard, Spinner, EmptyState | 🔜 v0.2 |
| CountryDetail | `/country/:code` (v0.2) | CountryHeader, CountryMap, TripList | NavPill, PhotoGrid, TripCard, ContextGlobe, Lightbox | 🔜 v0.2 |
| TripDetail | `/trip/:id` (v0.2) | TripHeader, RouteMap, FlightCard, DayTimelineStrip, NotesViewer | NavPill, PhotoGrid, ContextGlobe, Lightbox | 🔜 v0.2 |
| Wishlist | `/wishlist` (v0.2) | DestinationCard, CategoryToggle, AddFab | NavPill, EmptyState, Spinner, Toast | 🔜 v0.2 |

### 1.2 重复 UI 模式识别

通过跨页扫描，识别出以下重复模式：

| 模式 | 出现位置 | 抽象建议 |
|------|----------|----------|
| "卡片 + hover 抬起 + 阴影升级" | 所有卡片类组件 | → **AppCard** 基组件，通过 variant prop 派生 |
| "Pill 选择器（选中/未选切换）" | YearFilter, CategoryToggle, NavPill items | → **AppChip** 组件，支持 active 态 |
| "Back 导航" | CountryDetail, TripDetail, TripEditor | → **BackLink** 分子组件 |
| "照片点击 → 全屏查看" | CountryDetail, TripDetail | → **LightboxGallery** 组件 |
| "数据为空时的占位" | 所有列表页 | → **EmptyState** 组件 |
| "操作反馈通知" | TripEditor, Wishlist | → **Toast** 通知系统 |
| "Loading 指示" | 所有页面 | → **AppSpinner** 组件 |
| "国家/城市 名称 + emoji + 元数据" | CountryHeader, TripCard, DestinationCard | → 提取为 **CountryLabel** / **CityLabel** 分子 |
| "交通方式图标+标签" | RouteEditor, RouteMap, FlightCard | → **TransportIcon** 分子 |
| "天数/城市数 pill" | TripCard, TripMiniCard, CountryHeader | → **MetaBadge** 分子 |
| "路线 DEP→ARR 视觉" | FlightCard, RouteEditor, TripCard | → **RouteVisual** 分子 |
| "照片网格" | CountryDetail, TripDetail | → **PhotoGrid** 组件 |
| "地图 + 标点 + 路线" | CountryDetail, TripDetail | → 提取共享 **useMap** composable，组件各自封装 |
| "浮动导航" | 所有页面 | → **NavPill** 组件 |

### 1.3 交互模式抽象

| 交互 | 实现方式 | 复用 |
|------|----------|------|
| Hover 抬起卡片 | CSS transition + translateY(-2px) + shadow 升级 | AppCard 基类 |
| 点击展开/收起 | Vue `<Transition>` + height auto | DestinationCard, NotesViewer |
| 全屏照片浏览 | Teleport + 键盘事件 + 动画 | LightboxGallery |
| 拖拽排序 | HTML5 drag-and-drop 或 sortablejs | RouteEditor |
| 数字滚动动画 | requestAnimationFrame + easing | StatItem composable |
| Stagger 列表入场 | CSS animation-delay 递增 | useStagger composable |
| 页面过渡 | Vue Router `<transition>` | App.vue 全局 |
| Toast 进出 | 全局事件总线 + 队列管理 | useToast composable |

### 1.4 动画系统分析

所有动画使用 CSS `@keyframes` 或 Vue `<Transition>`：

| 动画 | 复用场景 | 抽象方式 |
|------|----------|----------|
| fade-in-up | 页面入场、卡片入场、照片入场 | CSS class `.animate-fade-in-up` |
| fade-in | Toast、modal 背景 | CSS class `.animate-fade-in` |
| slide-in-right | 面板、侧栏入场 | CSS class `.animate-slide-in-right` |
| slide-in-down | NavPill 入场、Toast 滑入 | CSS class `.animate-slide-in-down` |
| scale-in | Lightbox 展开、modal | CSS class `.animate-scale-in` |
| pulse-glow | 地球选中、loading、标点选中 | CSS class `.animate-pulse-glow` |
| odometer | 数字滚动 | useOdometer composable |
| draw-line | 路线绘制、时间线绘制 | SVG stroke-dasharray 动画 |

**决策：** 不引入第三方动画库。所有动画通过 CSS 类 + composable 实现，复用 style.css 的 `--ease-*` 变量。

### 1.5 布局模式抽象

| 布局 | 页面 | 抽象 | 状态 |
|------|------|------|------|
| Full Bleed（全屏铺满） | GlobeHome（v0.2） | `FullBleedLayout` | 🔜 v0.2 |
| Two Column 7+5（左 7 右 5） | CountryDetail, TripDetail（v0.2） | `TwoColumnLayout` | 🔜 v0.2 |
| Centered Form（8 列居中） | TripEditor | `CenteredFormLayout` | ✅ |
| Full Width List（全宽列表） | Timeline | `FullWidthLayout` | ✅ |
| Grid 3-Column（3 列网格） | Wishlist（v0.2） | `GridLayout` | 🔜 v0.2 |

---

## 第二阶段：组件规划（Atomic Design 拆分）

### Foundation 层

> 注：大部分 Foundation 已在 `style.css` 中实现为 CSS 变量。此处只列需要额外工作或 TypeScript 封装的部分。

| Token Group | 当前状态 | 需要补充 |
|-------------|----------|----------|
| Color Tokens | ✅ `style.css` 完整定义 `:root` + `[data-theme="dark"]` + `@media (prefers-color-scheme)` | 需要导出为 TypeScript 常量供 JS 使用（Globe/Map 着色） |
| Typography | ✅ 字体引入 + 字号 CSS 变量 + 排版 utility class | 无 |
| Spacing | ✅ CSS 变量 | 无 |
| Border Radius | ✅ CSS 变量 | 无 |
| Shadows | ✅ CSS 变量 | 无 |
| Motion / Easing | ✅ CSS 变量 | 需要 composable `useStagger`, `useOdometer` |
| **Icons** | ❌ Lucide Icons 未引入 | 封装 `AppIcon.vue` 统一尺寸/颜色/stroke 管理 |
| **Theme** | ⚠️ CSS 变量就绪，但无 JS 切换 | 需要 `useTheme` composable（localStorage + 系统检测 + 手动切换） |

### Atoms 层（基础原子组件）

共 **15 个**原子组件。无业务语义，纯视觉呈现，无外部依赖（除 Foundation）。

| # | 组件 | 文件路径 | 职责一句话 |
|---|------|----------|-----------|
| A01 | **AppIcon** | `components/base/AppIcon.vue` | Lucide 图标统一封装：尺寸(16/20/24/32)、颜色(via text-* class)、stroke(2px) |
| A02 | **AppButton** | `components/base/AppButton.vue` | 按钮：Primary/Secondary/Ghost/Danger 变体 + sm/md/lg 尺寸 + loading/disabled 态 |
| A03 | **AppIconButton** | `components/base/AppIconButton.vue` | 纯图标按钮（无文字），圆形，用于关闭/返回/操作 |
| A04 | **AppChip** | `components/base/AppChip.vue` | 小型标签/Pill：Active/Default/Wishlist/Pill 变体 + closable + clickable |
| A05 | **AppBadge** | `components/base/AppBadge.vue` | 数字角标（红色圆点或数字），用于通知/新内容提示 |
| A06 | **AppDivider** | `components/base/AppDivider.vue` | 分割线：horizontal/vertical，支持 dashed |
| A07 | **AppInput** | `components/base/AppInput.vue` | 文本输入框：底部边框风格 + label + error 态 + prefix/suffix icon 插槽 |
| A08 | **AppTextarea** | `components/base/AppTextarea.vue` | 多行文本输入：底部边框风格 + label + error 态 + 字数计数 |
| A09 | **AppSelect** | `components/base/AppSelect.vue` | 下拉选择器：底部边框风格 + searchable + clearable |
| A10 | **AppSpinner** | `components/base/AppSpinner.vue` | 加载指示器：Sunset Orange pulse 光环 + sm/md/lg 尺寸 |
| A11 | **AppSkeleton** | `components/base/AppSkeleton.vue` | 骨架屏占位：支持 text/card/image/rect 变体 + shimmer 动画 |
| A12 | **AppTooltip** | `components/base/AppTooltip.vue` | 悬浮提示：上/下/左/右 方向 + 卡片样式背景 |
| A13 | **AppProgress** | `components/base/AppProgress.vue` | 进度条：用于文件上传进度，Sunset Orange 填充 |
| A14 | **AppSwitch** | `components/base/AppSwitch.vue` | 开关切换：用于主题切换等布尔操作 |
| A15 | **AppDatePicker** | `components/base/AppDatePicker.vue` | 日期选择器（基于 Element Plus 封装，统一样式） |

### Molecules 层（分子组合组件）

共 **20 个**分子组件。由 Atoms 组合而成，有明确功能语义但无页面级结构。

| # | 组件 | 文件路径 | 依赖 Atoms | 职责一句话 |
|---|------|----------|-----------|-----------|
| M01 | **SearchInput** | `components/shared/SearchInput.vue` | AppInput, AppIcon | 搜索输入框：搜索图标前缀 + 可清除 + 防抖 emit |
| M02 | **DateRangeField** | `components/shared/DateRangeField.vue` | AppDatePicker | 日期范围选择：开始+结束，验证逻辑 |
| M03 | **CountrySelect** | `components/shared/CountrySelect.vue` | AppSelect | 国家搜索下拉：显示国旗+名称，searchable |
| M04 | **TransportIcon** | `components/shared/TransportIcon.vue` | AppIcon | 交通方式图标：FLIGHT(PlaneTakeoff)/TRAIN(Train)/CAR(Car)/OTHER 自动着色 |
| M05 | **DurationBadge** | `components/shared/DurationBadge.vue` | AppChip | "N days" / "N cities" pill 标签 |
| M06 | **MetaBadge** | `components/shared/MetaBadge.vue` | AppChip | 通用元数据 pill（天数、城市数、访问次数） |
| M07 | **StatItem** | `components/shared/StatItem.vue` | (none) | 统计数字展示：Mono 大数字 + odometer 动画 + 标签文字 |
| M08 | **CountryLabel** | `components/shared/CountryLabel.vue` | (none) | 国旗 emoji + 国家名，支持 sm/md/lg 尺寸 |
| M09 | **CityLabel** | `components/shared/CityLabel.vue` | (none) | 城市名 + 日期（次要），用于卡片和列表 |
| M10 | **RouteVisual** | `components/shared/RouteVisual.vue` | TransportIcon | 路线视觉：DEP code → icon → ARR code，水平排列 |
| M11 | **TimeDisplay** | `components/shared/TimeDisplay.vue` | (none) | 时间展示：Mono 字体 + 格式 HH:MM，用于航班卡片 |
| M12 | **EmptyState** | `components/shared/EmptyState.vue` | AppIcon, AppButton | 空状态占位：大图标 + 标题 + 描述 + 可选 CTA 按钮 |
| M13 | **ConfirmAction** | `components/shared/ConfirmAction.vue` | AppButton | 确认/取消 按钮对（水平排列），danger/primary 变体 |
| M14 | **BackLink** | `components/shared/BackLink.vue` | AppIcon | 返回导航："← Back to {label}"，可自定义目标路由 |
| M15 | **PageHeader** | `components/shared/PageHeader.vue` | BackLink | 页面标题区：BackLink + 标题(Newsreader) + 副标题(Inter) |
| M16 | **SectionHeader** | `components/shared/SectionHeader.vue` | AppButton | 区块标题：标签 + 可选右侧操作链接("View all" / "Edit") |
| M17 | **TagGroup** | `components/shared/TagGroup.vue` | AppChip | 水平 Chip 组：统一管理 active 态切换，单选/多选 |
| M18 | **InlineEditor** | `components/shared/InlineEditor.vue` | AppButton, AppTextarea | 内联编辑切换：展示态 + 编辑态（textarea），保存/取消 |
| M19 | **PhotoThumbnail** | `components/shared/PhotoThumbnail.vue` | (none) | 单张照片缩略图：14px 圆角 + hover scale(1.02) + lazy loading |
| M20 | **UploadDropZone** | `components/shared/UploadDropZone.vue` | AppIcon, AppProgress | 拖拽上传区域：虚线边框 + 图标 + 提示文字 + 进度条 |

### Organisms 层（有机体组件）

共 **22 个**有机体组件。可独立运行，有完整功能，跨页面复用。

**导航/布局类：**

| # | 组件 | 文件路径 | 依赖 | 职责一句话 | 状态 |
|---|------|----------|------|-----------|------|
| O01 | **NavPill** | `components/layout/NavPill.vue` | AppChip, AppIcon | 顶部浮动导航：路由项列表 + 选中高亮 + fixed 定位 + z-index | ✅ |

**Globe 地球类：**

| # | 组件 | 文件路径 | 依赖 | 职责一句话 | 状态 |
|---|------|----------|------|-----------|------|
| O02 | **Globe3D** | `components/features/globe/Globe3D.vue` | useGlobe | 全屏 3D 地球：globe.gl + GeoJSON Overlay + 旋转/缩放 + hover/click 交互 | ✅ |
| O03 | **ContextGlobe** | `components/features/globe/ContextGlobe.vue` | useGlobe | 右下角 80x80 小地球：单国家高亮 | ✅ 占位 |

**Map 地图类（待实现）：**

| # | 组件 | 文件路径 | 依赖 | 职责一句话 | 状态 |
|---|------|----------|------|-----------|------|
| O04 | **CountryMap** | `components/features/map/CountryMap.vue` | useMap | 国家页地图：Leaflet + CartoDB 瓦片 + 城市标点 + 路线线 | ⬜ |
| O05 | **RouteMap** | `components/features/map/RouteMap.vue` | useMap, TransportIcon | 旅行路线地图：支持多条路线段 + 交通方式图标 + hover 交互 | ⬜ |
| O06 | **CityMarker** | `components/features/map/CityMarker.vue` | (none) | 城市标点（Leaflet DivIcon 工厂函数）：去过/想去 颜色 + pulse 环 | ⬜ |
| O07 | **RouteLine** | `components/features/map/RouteLine.vue` | (none) | 路线线（Leaflet Polyline 工厂函数）：按交通方式颜色/线型 | ⬜ |

**Trip 旅行类：**

| # | 组件 | 文件路径 | 依赖 | 职责一句话 | 状态 |
|---|------|----------|------|-----------|------|
| O08 | **TripCard** | `components/features/trip/TripCard.vue` | AppCard, CountryLabel, CityLabel, MetaBadge, PhotoThumbnail | 旅行列表卡片：封面 + 城市名 + 日期 + 天数 + 3 张照片缩略 | ⬜ |
| O09 | **TripMiniCard** | `components/features/trip/TripMiniCard.vue` | AppCard, CityLabel | 首页紧凑卡片：120px 封面图 + 城市名 + 日期 + 天数 pill | ⬜ |
| O10 | **FlightCard** | `components/features/trip/FlightCard.vue` | AppCard, TimeDisplay, RouteVisual | 登机牌卡片：蓝色条 + 航班号 + 时间线 + 多卡片堆叠 | ⬜ |
| O11 | **DayTimelineStrip** | `components/features/trip/DayTimelineStrip.vue` | (none) | 天时间线：水平滚动 + 圆点连接 + 有/无照片状态 + 点击跳转 | ⬜ |
| O12 | **RouteEditor** | `components/features/trip/RouteEditor.vue` | TransportIcon, AppButton | 路线编辑器：拖拽排序城市 + 选择交通方式 + 添加/删除城市 | ✅ |
| O13 | **StatsPanel** | `components/features/trip/StatsPanel.vue` | StatItem, AppCard | 统计面板：3-6 个统计数字排列，带入场 odometer 动画 | ⬜ |

**Photo 照片类：**

| # | 组件 | 文件路径 | 依赖 | 职责一句话 | 状态 |
|---|------|----------|------|-----------|------|
| O14 | **PhotoGrid** | `components/features/photo/PhotoGrid.vue` | PhotoThumbnail | 不规则照片网格：CSS Grid dense + gap 8px + 点击 emit | ⬜ |
| O15 | **LightboxGallery** | `components/features/photo/LightboxGallery.vue` | AppIconButton, Teleport | 全屏照片浏览器：暗色背景 + 底部 EXIF 胶囊 + 左右导航 + 键盘支持 | ⬜ |
| O16 | **PhotoUploader** | `components/features/photo/PhotoUploader.vue` | UploadDropZone, PhotoThumbnail, AppButton | 照片上传组件：拖拽/点击上传 + 缩略图预览 + 删除 + 排序 | ✅ |

**Timeline 时间轴类（v0.2）：**

| # | 组件 | 文件路径 | 依赖 | 职责一句话 |
|---|------|----------|------|-----------|
| O17 | **YearFilter** | `components/features/timeline/YearFilter.vue` | TagGroup | 年份筛选 Pill 组：All + 各年份，单选，居中 |
| O18 | **TimelineTrack** | `components/features/timeline/TimelineTrack.vue` | TripCard | 时间轴：左侧竖线 + 圆点 + 月份标签 + 卡片列表 |

**Wishlist 想去清单类（v0.2）：**

| # | 组件 | 文件路径 | 依赖 | 职责一句话 | 状态 |
|---|------|----------|------|-----------|------|
| O19 | **CategoryToggle** | `components/features/wishlist/CategoryToggle.vue` | TagGroup | Countries / Cities 分类切换 Pill | ⬜ |
| O20 | **DestinationCard** | `components/features/wishlist/DestinationCard.vue` | AppCard, CountryLabel, AppChip | 目的地卡片：封面图 + 渐变遮罩 + 国旗 + 城市数 + 展开/收起 | ⬜ |
| O21 | **AddFab** | `components/features/wishlist/AddFab.vue` | AppButton, AppIcon | 右下角 FAB："+ Add Destination" 浮动按钮 | ⬜ |

**Content 内容类：**

| # | 组件 | 文件路径 | 依赖 | 职责一句话 | 状态 |
|---|------|----------|------|-----------|------|
| O22 | **NotesViewer** | `components/features/content/NotesViewer.vue` | InlineEditor | 手记展示/编辑：marked 渲染 + 编辑切换 + 保存 | ✅ |

### Templates 层（页面布局模板）

共 **5 个**布局模板。控制页面级排版结构，通过 slot 注入内容。

| # | 组件 | 文件路径 | 用途 | Slot | 状态 |
|---|------|----------|------|------|------|
| T01 | **FullBleedLayout** | `components/layout/FullBleedLayout.vue` | GlobeHome（v0.2） | default（全屏内容） | ✅ |
| T02 | **TwoColumnLayout** | `components/layout/TwoColumnLayout.vue` | CountryDetail, TripDetail（v0.2） | left, right | ✅ |
| T03 | **CenteredFormLayout** | `components/layout/CenteredFormLayout.vue` | TripEditor | header, form, actions（8 cols 居中） | ✅ |
| T04 | **FullWidthLayout** | `components/layout/FullWidthLayout.vue` | Timeline | header, content（全宽 + 内容限制 max-width） | ✅ |
| T05 | **GridLayout** | `components/layout/GridLayout.vue` | Wishlist（v0.2） | header, content（CSS Grid） | ✅ |

### 通用 Hooks / Composable 层

| # | Composable | 文件路径 | 职责 | 状态 |
|---|-----------|----------|------|------|
| H01 | **useTheme** | `composables/useTheme.ts` | 主题切换：light/dark + localStorage + 系统检测 + body class | ✅ |
| H02 | **useGlobe** | `composables/useGlobe.ts` | 3D 地球生命周期：init/render/destroy/resize/事件绑定 | ✅ |
| H03 | **useMap** | `composables/useMap.ts` | Leaflet 生命周期：init/tiles/markers/polylines/destroy | ⬜ |
| H04 | **useToast** | `composables/useToast.ts` | Toast 通知：全局状态 + 队列管理 + 自动消失 | ✅ |
| H05 | **usePhoto** | `composables/usePhoto.ts` | 照片操作：压缩(canvas resize)/上传/验证 | ⬜ |
| H06 | **useStagger** | `composables/useStagger.ts` | 列表入场 stagger：生成递增 animation-delay | ✅ |
| H07 | **useOdometer** | `composables/useOdometer.ts` | 数字滚动动画：动画帧 + easing，从 0 滚到目标值 | ✅ |
| H08 | **usePagination** | `composables/usePagination.ts` | 分页逻辑：page/pageSize/total + 翻页方法 | ⬜ |
| H09 | **useScrollspy** | `composables/useScrollspy.ts` | 滚动监听：DayTimelineStrip 联动照片区域 | ⬜ |

---

## 第三阶段：组件详细规范

### 3.1 Atoms 详细规范

---

#### A01 — AppIcon

| 属性 | 说明 |
|------|------|
| **职责** | Lucide 图标统一封装。管理尺寸、颜色、stroke 宽度一致性。 |
| **Props** | `name: keyof typeof LucideIcons` (required), `size: 16 \| 20 \| 24 \| 32` (default 20), `colorClass: string` (default 'text-secondary'), `strokeWidth: number` (default 2), `class: string` |
| **Events** | 无（纯展示组件） |
| **Slots** | 无 |
| **State** | 无内部状态 |
| **可复用** | ✅ 全站唯一图标入口 |
| **主题** | ✅ 通过 colorClass 继承 CSS 变量 |
| **响应式** | ❌ MVP 不需要 |
| **依赖** | lucide-vue-next |
| **备注** | 禁止在其他组件中直接 import `lucide-vue-next`。所有图标必须通过 AppIcon 使用。这样未来切换图标库只需改这一个文件。 |

---

#### A02 — AppButton

| 属性 | 说明 |
|------|------|
| **职责** | 统一按钮样式。所有交互均通过此组件。 |
| **Props** | `variant: 'primary' \| 'secondary' \| 'ghost' \| 'danger'` (default 'primary'), `size: 'sm' \| 'md' \| 'lg'` (default 'md'), `disabled: boolean`, `loading: boolean`, `round: boolean` (default true — pill 风格), `fullWidth: boolean`, `type: 'button' \| 'submit'` (default 'button') |
| **Events** | `@click` |
| **Slots** | `default`（按钮文字）, `prefix`（图标前置）, `suffix`（图标后置） |
| **State** | hover / active(scale 0.98) / disabled / loading(替换 content 为 spinner) |
| **可复用** | ✅ |
| **主题** | ✅ 通过 CSS 变量 |
| **响应式** | ❌ |
| **依赖** | AppSpinner (loading 态) |
| **变体对照表：** | |
| Primary | bg=--color-sunset, color=white, hover-bg=--color-sunset-glow + glow shadow |
| Secondary | bg=transparent, border=1px rgba(0,0,0,0.10), color=--text-secondary, hover-bg=--color-card-hover |
| Ghost | bg=transparent, color=--text-secondary, hover-bg=--color-card-hover |
| Danger | bg=--color-danger, color=white, hover-bg=#c43e3e |

---

#### A03 — AppIconButton

| 属性 | 说明 |
|------|------|
| **职责** | 纯图标圆形按钮。用于关闭、返回、工具栏操作。 |
| **Props** | `icon: string` (required), `size: 'sm' \| 'md' \| 'lg'` (default 'md'), `variant: 'default' \| 'glass'`, `label: string` (aria-label, required) |
| **Events** | `@click` |
| **State** | hover(bg 微变) / active(scale 0.95) |
| **可复用** | ✅ |
| **主题** | ✅ |
| **响应式** | ❌ |
| **依赖** | AppIcon |

---

#### A04 — AppChip

| 属性 | 说明 |
|------|------|
| **职责** | 小型标签/Pill。用于筛选、分类、导航项。 |
| **Props** | `variant: 'default' \| 'active' \| 'wishlist' \| 'pill'` (default 'default'), `closable: boolean`, `clickable: boolean` (default true), `size: 'sm' \| 'md'`, `activeColor: string` (默认 'sunset', 可选 'forest' 用于 Wishlist 页面) |
| **Events** | `@click`, `@close` |
| **Slots** | `default`（chip 内容）, `prefix` |
| **State** | default / active / hover |
| **可复用** | ✅ |
| **主题** | ✅ |
| **响应式** | ❌ |
| **依赖** | AppIcon (closable 的 × 图标) |
| **变体：** | |
| default | bg=transparent, color=--text-secondary, hover-color=--text-primary |
| active | bg=var(--active-bg, --color-sunset), color=white |
| wishlist | bg=--color-forest, color=white |
| pill | bg=--color-card + --shadow-card + border, color=--text-primary |

---

#### A05 — AppBadge

| 属性 | 说明 |
|------|------|
| **职责** | 数字/红点角标，用于通知提示。 |
| **Props** | `count: number`, `dot: boolean` (仅显示红点), `max: number` (default 99), `color: string` (default 'danger') |
| **Events** | 无 |
| **Slots** | `default`（被标注的父元素） |
| **可复用** | ✅ |
| **依赖** | 无 |

---

#### A06 — AppDivider

| 属性 | 说明 |
|------|------|
| **职责** | 水平/垂直分割线，支持虚线。 |
| **Props** | `direction: 'horizontal' \| 'vertical'` (default 'horizontal'), `dashed: boolean`, `label: string` (居中文字) |
| **可复用** | ✅ |
| **依赖** | 无 |

---

#### A07 — AppInput

| 属性 | 说明 |
|------|------|
| **职责** | 底部边框风格文本输入框。 |
| **Props** | `modelValue: string`, `label: string`, `placeholder: string`, `type: string` (default 'text'), `error: string`, `disabled: boolean`, `prefixIcon: string`, `suffixIcon: string`, `clearable: boolean` |
| **Events** | `@update:modelValue`, `@focus`, `@blur`, `@clear` |
| **Slots** | `prefix`, `suffix` |
| **State** | default / focus (border-bottom 1px→2px + sunset) / error (border-bottom color=danger + error 文字) / disabled |
| **可复用** | ✅ |
| **依赖** | AppIcon |

---

#### A08 — AppTextarea

| 属性 | 说明 |
|------|------|
| **职责** | 多行文本输入。与 AppInput 风格一致。 |
| **Props** | `modelValue: string`, `label: string`, `placeholder: string`, `rows: number` (default 4), `maxlength: number`, `showCount: boolean`, `error: string` |
| **Events** | `@update:modelValue` |
| **State** | 同 AppInput |
| **可复用** | ✅ |
| **依赖** | 无 |

---

#### A09 — AppSelect

| 属性 | 说明 |
|------|------|
| **职责** | 下拉选择器。底部边框风格 + 可搜索。 |
| **Props** | `modelValue: string \| number`, `options: {label, value, icon?}[]`, `placeholder: string`, `searchable: boolean`, `clearable: boolean`, `error: string`, `label: string` |
| **Events** | `@update:modelValue`, `@search` (远程搜索) |
| **State** | 同 AppInput |
| **可复用** | ✅ |
| **依赖** | AppIcon (chevron-down, ×) |

---

#### A10 — AppSpinner

| 属性 | 说明 |
|------|------|
| **职责** | 加载指示器。Sunset Orange pulse 光环动画。 |
| **Props** | `size: 'sm' \| 'md' \| 'lg'` (default 'md'), `label: string` (可选加载文字) |
| **State** | 纯展示，无限循环动画 |
| **可复用** | ✅ |
| **依赖** | 无 |
| **动画** | CSS @keyframes pulse-glow, 1.5s infinite |

---

#### A11 — AppSkeleton

| 属性 | 说明 |
|------|------|
| **职责** | 骨架屏占位。数据加载时的内容占位。 |
| **Props** | `variant: 'text' \| 'card' \| 'image' \| 'rect'`, `width: string`, `height: string`, `count: number` (text 行数) |
| **可复用** | ✅ |
| **依赖** | 无 |
| **动画** | shimmer 渐变移动 |

---

#### A12 — AppTooltip

| 属性 | 说明 |
|------|------|
| **职责** | 悬浮提示浮层。卡片样式。 |
| **Props** | `text: string`, `position: 'top' \| 'bottom' \| 'left' \| 'right'` (default 'top'), `delay: number` (default 300ms) |
| **Slots** | `default`（触发元素） |
| **可复用** | ✅ |
| **依赖** | 无 |
| **实现** | CSS-only 或 轻量 Floating UI |

---

#### A13 — AppProgress

| 属性 | 说明 |
|------|------|
| **职责** | 进度条。文件上传进度展示。 |
| **Props** | `percentage: number` (0-100), `color: string` (default 'sunset'), `showText: boolean` |
| **可复用** | ✅ |
| **依赖** | 无 |

---

#### A14 — AppSwitch

| 属性 | 说明 |
|------|------|
| **职责** | 开关切换。主题切换等布尔操作。 |
| **Props** | `modelValue: boolean`, `disabled: boolean`, `label: string` |
| **Events** | `@update:modelValue` |
| **可复用** | ✅ |
| **依赖** | 无 |

---

### 3.2 Molecules 详细规范（选重点）

---

#### M07 — StatItem

| 属性 | 说明 |
|------|------|
| **职责** | 统计数字 + 标签。支持 odometer 滚动动画。 |
| **Props** | `value: number`, `label: string`, `animate: boolean` (default true), `format: 'number' \| 'distance' \| 'duration'` (default 'number'), `prefix: string`, `suffix: string` |
| **Events** | 无 |
| **State** | animated / static |
| **可复用** | ✅ StatsPanel 中使用，也可独立使用 |
| **依赖** | useOdometer |

---

#### M12 — EmptyState

| 属性 | 说明 |
|------|------|
| **职责** | 数据为空的引导占位。 |
| **Props** | `icon: string` (required), `title: string` (required), `description: string`, `ctaText: string`, `ctaRoute: string` |
| **Events** | `@cta-click` |
| **Slots** | `default`（可替换默认内容为自定义 HTML） |
| **可复用** | ✅ 所有列表页 |
| **依赖** | AppIcon, AppButton |

---

#### M14 — BackLink

| 属性 | 说明 |
|------|------|
| **职责** | 返回导航。← 箭头 + 文字。 |
| **Props** | `to: string \| RouteLocationRaw` (default: router.back()), `label: string` (default 'Back') |
| **Events** | `@click` |
| **可复用** | ✅ CountryDetail, TripDetail, TripEditor |
| **依赖** | AppIcon (ArrowLeft), Vue Router |

---

#### M15 — PageHeader

| 属性 | 说明 |
|------|------|
| **职责** | 页面标题区域。BackLink + 标题 + 副标题/元数据。 |
| **Props** | `title: string` (required), `subtitle: string`, `backTo: {label, to}`, `titleTag: 'h1' \| 'h2'` (default 'h1'), `titleSize: 'display-lg' \| 'display-md'` (default 'display-lg') |
| **Slots** | `meta`（日期、天数等元数据） |
| **可复用** | ✅ CountryDetail, TripDetail |
| **依赖** | BackLink |

---

#### M18 — InlineEditor

| 属性 | 说明 |
|------|------|
| **职责** | 点击切换展示/编辑模式。用于手记、备注等场景。 |
| **Props** | `modelValue: string`, `readonly: boolean` (default true — 展示模式), `placeholder: string`, `rows: number` |
| **Events** | `@update:modelValue`, `@save`, `@cancel` |
| **Slots** | `view` (自定义展示内容), `edit` (自定义编辑内容) |
| **State** | viewing / editing / saving |
| **可复用** | ✅ NotesViewer, Wishlist 城市备注 |
| **依赖** | AppButton, AppTextarea |

---

### 3.3 Organisms 详细规范（选重点）

---

#### O01 — NavPill

| 属性 | 说明 |
|------|------|
| **职责** | 顶部居中浮动导航。全站唯一导航入口。 |
| **Props** | `items: {label, icon, route, activeColor?}[]`, `activeRoute: string` (自动从 router 获取), `position: 'top' \| 'bottom'` (default 'top', v0.2 mobile 用 bottom) |
| **Events** | `@navigate` (路由跳转) |
| **State** | 每个 item: active / inactive |
| **可复用** | ✅ 所有页面共用同一个实例（放在 App.vue 或 layout 中） |
| **实现建议** | 放在 App.vue 中，所有页面自动共享，不用每个页面重复引入 |
| **依赖** | AppChip, AppIcon, Vue Router |

---

#### O02 — Globe3D

| 属性 | 说明 |
|------|------|
| **职责** | 全屏 3D 交互地球。globe.gl polygonsData + 纯色填充 + hover/click。 |
| **Props** | `countries: CountryStatus[]`（{code, status: visited\|wishlist\|unvisited, visitCount}）, `interactive: boolean` (default true), `autoRotate: boolean` (default false), `highlightCountry: string`（高亮国家代码） |
| **Events** | `@country-click(code)`, `@country-hover(code, event)`, `@globe-ready` |
| **State** | loading GeoJSON / idle / rotating to country / hovered country |
| **可复用** | ✅ 仅 GlobeHome 使用（ContextGlobe 独立简化实现） |
| **主题** | ✅ 着色数据来自 Props，颜色来自 CSS 变量（需 composable 读取） |
| **依赖** | useGlobe, Globe.GL / Three.js, public/geojson/countries-110m.json |
| **生命周期关键点** | mounted: init Three.js scene + load geojson → watch props: update colors → beforeUnmount: dispose GPU resources |

---

#### O03 — ContextGlobe

| 属性 | 说明 |
|------|------|
| **职责** | 右下角 80x80 小地球，显示当前位置。 |
| **Props** | `countryCode: string`, `size: number` (default 80) |
| **Events** | 无（或可选 `@click` 跳转首页） |
| **可复用** | ✅ CountryDetail, TripDetail |
| **依赖** | useGlobe (轻量模式：无交互，仅旋转+着色) |

---

#### O10 — FlightCard

| 属性 | 说明 |
|------|------|
| **职责** | 登机牌风格航班卡片。 |
| **Props** | `flight: { flightNo, airline, aircraft, departureTime, arrivalTime, depAirport, arrAirport, depCity, arrCity }`, `isReturn: boolean`, `stackIndex: number` (多卡片堆叠序号), `isStacked: boolean` |
| **Events** | `@click` |
| **State** | default / hover（回正 + 前置）/ stacked（±0.5° 旋转） |
| **可复用** | ✅ TripDetail（可能扩展到 Timeline 的时间线卡片） |
| **依赖** | AppCard(variant='flight'), TimeDisplay, RouteVisual |
| **卡片规格** | 顶部 4px --flight-accent border, padding 16px, 内部 grid 8 行 |

**⚠️ 优化建议：** Stitch 设计中航班卡片内部有独立的"时间线竖线+圆点"，这是 FlightCard 独有的视觉。不要试图把它抽成通用 Timeline 组件。保持 FlightCard 内部自包含。

---

#### O14 — PhotoGrid

| 属性 | 说明 |
|------|------|
| **职责** | CSS Grid dense 不规则照片网格。 |
| **Props** | `photos: Photo[]`（{url, caption?, takenAt?, aspectRatio?}）, `loading: boolean`, `columns: number` (default auto-fill) |
| **Events** | `@photo-click(photo, index)` |
| **State** | loading (骨架屏) / empty (EmptyState) / photos loaded |
| **可复用** | ✅ CountryDetail, TripDetail |
| **依赖** | PhotoThumbnail, AppSkeleton, EmptyState |
| **网格规格** | `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`, `grid-auto-flow: dense`, `gap: 8px` |

---

#### O15 — LightboxGallery

| 属性 | 说明 |
|------|------|
| **职责** | 全屏照片浏览。Teleport 到 body。 |
| **Props** | `visible: boolean`, `photos: Photo[]`, `initialIndex: number` (default 0) |
| **Events** | `@close`, `@next`, `@prev` |
| **State** | opening / open / closing / closed |
| **可复用** | ✅ CountryDetail, TripDetail, Wishlist |
| **依赖** | AppIconButton (close, prev, next), Teleport |
| **键盘** | ← → 导航, Escape 关闭 |
| **动画** | 展开 350ms spring / 关闭 250ms ease-in |
| **EXIF 信息** | 底部居中胶囊：日期 · 城市 · 相机（如有） |

---

#### O16 — PhotoUploader

| 属性 | 说明 |
|------|------|
| **职责** | 拖拽/点击上传 + 缩略图预览 + 删除 + 排序。 |
| **Props** | `modelValue: File[]`, `maxCount: number` (default 20), `maxSize: number` (default 10MB), `accept: string` (default 'image/jpeg,image/png,image/webp'), `existingPhotos: Photo[]` (编辑模式下的已有照片) |
| **Events** | `@update:modelValue`, `@upload`, `@remove`, `@sort` |
| **State** | idle / dragging / uploading (progress) / error / done |
| **可复用** | ✅ TripEditor |
| **依赖** | UploadDropZone, PhotoThumbnail, AppButton, AppProgress, usePhoto |
| **客户端压缩** | 上传前 canvas resize → max 2400px 宽边 |

---

#### O22 — NotesViewer

| 属性 | 说明 |
|------|------|
| **职责** | Markdown 手记展示 + 内联编辑。 |
| **Props** | `content: string`, `editable: boolean` (default false), `placeholder: string` |
| **Events** | `@save(content)`, `@cancel` |
| **State** | viewing / editing / saving |
| **可复用** | ✅ TripDetail (手记), CountryDetail (手记摘要) |
| **依赖** | InlineEditor, marked (渲染) |

---

### 3.4 Templates 详细规范

#### T02 — TwoColumnLayout

| 属性 | 说明 |
|------|------|
| **职责** | 双列布局。左列 sticky（地图），右列 scrollable（信息）。 |
| **Props** | `leftCols: number` (default 7), `rightCols: number` (default 5), `gap: string` (default '20px'), `leftSticky: boolean` (default true) |
| **Slots** | `left`, `right` |
| **可复用** | ✅ CountryDetail (7+5), TripDetail (7+5) |
| **CSS** | 12 列 CSS Grid，`grid-template-columns: {leftCols}fr {rightCols}fr` |

#### T03 — CenteredFormLayout

| 属性 | 说明 |
|------|------|
| **职责** | 表单页布局。8 列居中 + header + actions footer。 |
| **Props** | `title: string`, `backTo: {label, to}`, `maxWidth: string` (default '960px') |
| **Slots** | `header`（表单头）, `default`（表单内容）, `actions`（底部按钮区） |
| **可复用** | ✅ TripEditor |

---

## 第四阶段：组件依赖关系图

依赖方向：**Foundation → Atoms → Molecules → Organisms → Templates → Pages**

```
CSS Variables / Theme (Foundation)
│
├── AppIcon
│
├── AppButton ─────────────── AppSpinner
├── AppIconButton ────────── AppIcon
├── AppChip ──────────────── AppIcon
├── AppInput ─────────────── AppIcon
├── AppTextarea
├── AppSelect ────────────── AppIcon
├── AppDatePicker
├── AppSpinner
├── AppSkeleton
├── AppTooltip
├── AppBadge
├── AppDivider
├── AppProgress
├── AppSwitch
│
├── SearchInput ──────────── AppInput + AppIcon
├── DateRangeField ───────── AppDatePicker
├── CountrySelect ────────── AppSelect
├── TransportIcon ────────── AppIcon
├── DurationBadge ────────── AppChip
├── MetaBadge ────────────── AppChip
├── StatItem ─────────────── useOdometer
├── CountryLabel
├── CityLabel
├── RouteVisual ──────────── TransportIcon
├── TimeDisplay
├── EmptyState ───────────── AppIcon + AppButton
├── ConfirmAction ────────── AppButton
├── BackLink ─────────────── AppIcon
├── PageHeader ───────────── BackLink
├── SectionHeader ────────── AppButton
├── TagGroup ─────────────── AppChip
├── InlineEditor ─────────── AppButton + AppTextarea
├── PhotoThumbnail
├── UploadDropZone ───────── AppIcon + AppProgress
│
├── NavPill ──────────────── AppChip + AppIcon ─────────────────────→ 所有页面
├── Globe3D ──────────────── useGlobe ─────────────────────────────→ GlobeHome
├── ContextGlobe ─────────── useGlobe ─────────────────────────────→ CountryDetail, TripDetail
├── CountryMap ───────────── useMap ───────────────────────────────→ CountryDetail
├── RouteMap ─────────────── useMap + TransportIcon ───────────────→ TripDetail
├── CityMarker ───────────── (Leaflet factory) ────────────────────→ CountryMap, RouteMap
├── RouteLine ────────────── (Leaflet factory) ────────────────────→ CountryMap, RouteMap
├── TripCard ─────────────── PhotoThumbnail + CountryLabel + MetaBadge → CountryDetail, Timeline
├── TripMiniCard ─────────── AppCard + CityLabel ──────────────────→ GlobeHome
├── FlightCard ───────────── AppCard + TimeDisplay + RouteVisual ──→ TripDetail
├── DayTimelineStrip ─────── (none) ───────────────────────────────→ TripDetail
├── RouteEditor ──────────── TransportIcon + AppButton ────────────→ TripEditor
├── StatsPanel ───────────── StatItem + AppCard ───────────────────→ GlobeHome
├── PhotoGrid ────────────── PhotoThumbnail + AppSkeleton + EmptyState → CountryDetail, TripDetail
├── LightboxGallery ──────── AppIconButton + Teleport ─────────────→ CountryDetail, TripDetail
├── PhotoUploader ────────── UploadDropZone + PhotoThumbnail + usePhoto → TripEditor
├── YearFilter ───────────── TagGroup ─────────────────────────────→ Timeline
├── TimelineTrack ────────── TripCard ─────────────────────────────→ Timeline
├── CategoryToggle ───────── TagGroup ─────────────────────────────→ Wishlist
├── DestinationCard ──────── AppCard + CountryLabel + AppChip ──────→ Wishlist
├── AddFab ───────────────── AppButton + AppIcon ──────────────────→ Wishlist
├── NotesViewer ──────────── InlineEditor + marked ─────────────────→ TripDetail, CountryDetail
│
├── FullBleedLayout ────────────────────────────────────────────────→ GlobeHome
├── TwoColumnLayout ────────────────────────────────────────────────→ CountryDetail, TripDetail
├── CenteredFormLayout ─────────────────────────────────────────────→ TripEditor
├── FullWidthLayout ─────────────────────────────────────────────────→ Timeline
├── GridLayout ──────────────────────────────────────────────────────→ Wishlist
│
└── Pages ────────────────── 组装 Templates + Organisms
    ├── GlobeHome:          FullBleedLayout + NavPill + Globe3D + StatsPanel + TripMiniCard[]
    ├── CountryDetail:      TwoColumnLayout + NavPill + PageHeader + CountryMap + PhotoGrid + TripCard[] + ContextGlobe
    ├── TripDetail:         TwoColumnLayout + NavPill + PageHeader + RouteMap + FlightCard[] + DayTimelineStrip + PhotoGrid + NotesViewer + ContextGlobe
    ├── TripEditor:         CenteredFormLayout + BackLink + RouteEditor + PhotoUploader + InlineEditor + ConformAction
    ├── Wishlist:           GridLayout + NavPill + CategoryToggle + DestinationCard[] + AddFab
    └── Timeline:           FullWidthLayout + NavPill + YearFilter + TimelineTrack + TripCard[]
```

**循环依赖检查：** ✅ 无循环依赖。所有依赖方向从上到下。

---

## 第五阶段：推荐开发顺序

按依赖关系自底向上开发，确保每个阶段完成时都有可见成果。

### Phase 0：Foundation 补全（0.5 天）

> 大部分已完成，仅需补充 TypeScript 侧和缺失依赖

| # | Task | 产出 |
|---|------|------|
| 0.1 | 安装 lucide-vue-next，配置全局 | `npm install lucide-vue-next` |
| 0.2 | 创建 `composables/useTheme.ts` | 主题切换 + localStorage 持久化 + 系统检测 |
| 0.3 | 创建 `utils/colors.ts` | 导出 CSS 变量值为 JS 常量（供 Globe/Map 使用） |
| 0.4 | 验证 style.css 所有 Token 在新版设计中正确 | 确认无旧 VisionOS 残留值 |

**完成标准：** `npm run dev` 启动正常，Lucide 图标可用，主题切换可用。

### Phase 1：Atoms 组件库（1.5 天）

**顺序：** 按被依赖程度排序——先做被依赖最多的。

```
Day 1:
  P1.01  AppIcon.vue           ← 几乎所有组件都依赖它，必须先做
  P1.02  AppSpinner.vue        ← Button loading 态需要
  P1.03  AppButton.vue         ← 被大量组件依赖
  P1.04  AppIconButton.vue     ← 依赖 AppIcon
  P1.05  AppChip.vue           ← NavPill, TagGroup, Filter 需要

Day 2:
  P1.06  AppInput.vue          ← 依赖 AppIcon
  P1.07  AppTextarea.vue       ← inline editor 需要
  P1.08  AppSelect.vue         ← CountrySelect 需要
  P1.09  AppBadge.vue           ← 独立，简单
  P1.10  AppDivider.vue         ← 独立，简单
  P1.11  AppProgress.vue        ← PhotoUploader 需要
  P1.12  AppTooltip.vue         ← Globe hover, map marker 需要
  P1.13  AppSkeleton.vue        ← 列表页 loading 态
  P1.14  AppSwitch.vue          ← 独立，简单
  P1.15  AppDatePicker.vue      ← DateRangeField 需要
```

**完成标准：** 所有 15 个 Atom 组件文件存在 + Props/Events 完整 + Storybook 可展示（可选但推荐）。

### Phase 2：Composables 基础（1 天）

| # | Task | 说明 |
|---|------|------|
| P2.01 | `useStagger.ts` | stagger 延迟生成器（列表入场动画） |
| P2.02 | `useOdometer.ts` | 数字滚动动画 |
| P2.03 | `useToast.ts` | Toast 全局状态 + 队列 |
| P2.04 | `useTheme.ts` | 已在 Phase 0 完成 |
| P2.05 | `usePagination.ts` | 分页逻辑 |

**完成标准：** 每个 composable 可独立单元测试。

### Phase 3：Molecules 组件库（2 天）

| # | Task | 依赖 |
|---|------|------|
| P3.01 | EmptyState.vue | AppIcon, AppButton |
| P3.02 | BackLink.vue | AppIcon |
| P3.03 | TransportIcon.vue | AppIcon |
| P3.04 | DurationBadge.vue | AppChip |
| P3.05 | MetaBadge.vue | AppChip |
| P3.06 | CountryLabel.vue | 无 |
| P3.07 | CityLabel.vue | 无 |
| P3.08 | TimeDisplay.vue | 无 |
| P3.09 | RouteVisual.vue | TransportIcon |
| P3.10 | StatItem.vue | useOdometer |
| P3.11 | SearchInput.vue | AppInput, AppIcon |
| P3.12 | CountrySelect.vue | AppSelect |
| P3.13 | DateRangeField.vue | AppDatePicker |
| P3.14 | ConfirmAction.vue | AppButton |
| P3.15 | PageHeader.vue | BackLink |
| P3.16 | SectionHeader.vue | AppButton |
| P3.17 | TagGroup.vue | AppChip |
| P3.18 | PhotoThumbnail.vue | 无 |
| P3.19 | UploadDropZone.vue | AppIcon, AppProgress |
| P3.20 | InlineEditor.vue | AppButton, AppTextarea |

**完成标准：** 所有 molecule 组件可用，能独立在页面中展示。

### Phase 4：Organisms — 核心业务组件（3 天）

| # | Task | 复用页面 |
|---|------|----------|
| P4.01 | NavPill.vue | **所有页面** |
| P4.02 | TripCard.vue | CountryDetail, Timeline |
| P4.03 | TripMiniCard.vue | GlobeHome |
| P4.04 | FlightCard.vue | TripDetail |
| P4.05 | StatsPanel.vue | GlobeHome |
| P4.06 | DayTimelineStrip.vue | TripDetail |
| P4.07 | PhotoGrid.vue | CountryDetail, TripDetail |
| P4.08 | PhotoUploader.vue | TripEditor |
| P4.09 | RouteEditor.vue | TripEditor |
| P4.10 | DestinationCard.vue | Wishlist |
| P4.11 | CategoryToggle.vue | Wishlist |
| P4.12 | AddFab.vue | Wishlist |
| P4.13 | NotesViewer.vue | TripDetail |
| P4.14 | LightboxGallery.vue | CountryDetail, TripDetail |
| P4.15 | YearFilter.vue | Timeline (v0.2) |
| P4.16 | TimelineTrack.vue | Timeline (v0.2) |

**完成标准：** 每个 organism 可独立在测试页面中交互展示。

### Phase 5：地图 & 地球模块（2 天）

| # | Task | 说明 |
|---|------|------|
| P5.01 | `useGlobe.ts` | Three.js 场景生命周期 |
| P5.02 | `useMap.ts` | Leaflet 生命周期 |
| P5.03 | Globe3D.vue | 全屏 3D 地球 |
| P5.04 | ContextGlobe.vue | 右下角小地球 |
| P5.05 | CountryMap.vue | 国家页地图 |
| P5.06 | RouteMap.vue | 旅行路线地图 |
| P5.07 | CityMarker.ts | Leaflet DivIcon 工厂 |
| P5.08 | RouteLine.ts | Leaflet Polyline 工厂 |
| P5.09 | `public/geojson/countries-110m.json` | 下载并放置 GeoJSON 数据 |

**完成标准：** 地球可旋转缩放 hover click，地图可显示标点+路线。

### Phase 6：Templates 布局（0.5 天）

| # | Task |
|---|------|
| P6.01 | FullBleedLayout.vue |
| P6.02 | TwoColumnLayout.vue |
| P6.03 | CenteredFormLayout.vue |
| P6.04 | FullWidthLayout.vue |
| P6.05 | GridLayout.vue |

**完成标准：** 每个 layout 可加载示例内容正常展示。

### Phase 7：Pages 组装（2 天）

| # | 页面 | 使用组件 |
|---|------|----------|
| P7.01 | TripEditor.vue | CenteredFormLayout + PageHeader + RouteEditor + PhotoUploader + InlineEditor + ConfirmAction + Toast |
| P7.02 | GlobeHome.vue | FullBleedLayout + NavPill + Globe3D + StatsPanel + TripMiniCard[] |
| P7.03 | CountryDetail.vue | TwoColumnLayout + NavPill + PageHeader + CountryMap + PhotoGrid + TripCard[] + ContextGlobe + LightboxGallery |
| P7.04 | TripDetail.vue | TwoColumnLayout + NavPill + PageHeader + RouteMap + FlightCard[] + DayTimelineStrip + PhotoGrid + NotesViewer + ContextGlobe + LightboxGallery |
| P7.05 | Wishlist.vue | GridLayout + NavPill + CategoryToggle + DestinationCard[] + AddFab + Toast |
| P7.06 | App.vue 更新 | 添加 NavPill + Toast container + page transition |

**完成标准：** 所有页面路由可访问 + 组件正确渲染。

### Phase 8：API 集成 + 数据流（2 天）

| # | Task |
|---|------|
| P8.01 | `api/client.ts` — Axios 实例 + 拦截器 |
| P8.02 | `stores/appStore.ts` — 主题 + 全局状态 |
| P8.03 | `stores/countryStore.ts` — 国家数据 |
| P8.04 | `stores/tripStore.ts` — 旅行数据 |
| P8.05 | `stores/wishlistStore.ts` — 想去数据 |
| P8.06 | 各页面接入真实 API（替换 mock 数据） |
| P8.07 | 确认全流程：TripEditor → GlobeHome → CountryDetail → TripDetail → Wishlist |

### Phase 9：打磨（1 天）

| # | Task |
|---|------|
| P9.01 | 所有页面 Loading / Empty / Error 状态补全 |
| P9.02 | 页面入场动画序列完整 |
| P9.03 | 深色主题全组件检查 |
| P9.04 | 性能检查（GPU 释放、懒加载、路由拆分） |

---

## 第六阶段：最终输出

### 6.1 全部组件清单（共 62 个）

| 层级 | 数量 | 组件列表 |
|------|------|----------|
| **Foundation** | 2 | Theme(useTheme), Color Constants(utils/colors.ts) |
| **Composables** | 7 | useTheme, useGlobe, useMap, useToast, usePhoto, useStagger, useOdometer, usePagination, useScrollspy |
| **Atoms** | 15 | AppIcon, AppButton, AppIconButton, AppChip, AppBadge, AppDivider, AppInput, AppTextarea, AppSelect, AppSpinner, AppSkeleton, AppTooltip, AppProgress, AppSwitch, AppDatePicker |
| **Molecules** | 20 | SearchInput, DateRangeField, CountrySelect, TransportIcon, DurationBadge, MetaBadge, StatItem, CountryLabel, CityLabel, RouteVisual, TimeDisplay, EmptyState, ConfirmAction, BackLink, PageHeader, SectionHeader, TagGroup, InlineEditor, PhotoThumbnail, UploadDropZone |
| **Organisms** | 20 | NavPill, Globe3D, ContextGlobe, CountryMap, RouteMap, CityMarker, RouteLine, TripCard, TripMiniCard, FlightCard, DayTimelineStrip, RouteEditor, StatsPanel, PhotoGrid, LightboxGallery, PhotoUploader, YearFilter, TimelineTrack, CategoryToggle, DestinationCard, AddFab, NotesViewer |
| **Templates** | 5 | FullBleedLayout, TwoColumnLayout, CenteredFormLayout, FullWidthLayout, GridLayout |
| **Pages** | 6 | GlobeHome, CountryDetail, TripDetail, TripEditor, Wishlist, Timeline(v0.2) |

### 6.2 组件复用矩阵

```
                    GlobeHome  CountryDetail  TripDetail  TripEditor  Wishlist  Timeline
NavPill                 ✅          ✅            ✅           ✅         ✅         ✅
AppButton               ✅          ✅            ✅           ✅         ✅         ✅
AppCard                 ✅          ✅            ✅           ✅         ✅         ✅
EmptyState              ✅          ✅            ✅           ✅         ✅         ✅
AppSpinner              ✅          ✅            ✅           ✅         ✅         ✅
LightboxGallery          -          ✅            ✅           -          -          -
PhotoGrid                -          ✅            ✅           -          -          -
TripCard                 -          ✅             -           -          -          ✅
TripMiniCard            ✅           -             -           -          -          -
ContextGlobe             -          ✅            ✅           -          -          -
PageHeader               -          ✅            ✅          ✅          -          -
FlightCard               -           -            ✅           -          -          -
DayTimelineStrip         -           -            ✅           -          -          -
RouteEditor              -           -             -          ✅          -          -
PhotoUploader            -           -             -          ✅          -          -
NotesViewer              -           -            ✅           -          -          -
DestinationCard          -           -             -           -          ✅          -
CategoryToggle           -           -             -           -          ✅          -
AddFab                   -           -             -           -          ✅          -
YearFilter               -           -             -           -          -          ✅
TimelineTrack            -           -             -           -          -          ✅
StatsPanel              ✅           -             -           -          -          -
Globe3D                 ✅           -             -           -          -          -
CountryMap                -        ✅              -           -          -          -
RouteMap                  -          -            ✅           -          -          -
```

### 6.3 推荐目录结构

```
frontend/src/
├── main.ts
├── App.vue                          # NavPill + Toast container + <router-view>
├── style.css                        # 已存在，Foundation CSS 变量
│
├── router/
│   └── index.ts
│
├── api/                             # Axios 请求（Phase 8 开始填充）
│   ├── client.ts
│   ├── countries.ts
│   ├── trips.ts
│   ├── photos.ts
│   ├── wishlist.ts
│   └── stats.ts
│
├── types/                           # TypeScript 类型
│   ├── country.ts
│   ├── trip.ts
│   ├── photo.ts
│   ├── wishlist.ts
│   └── common.ts
│
├── utils/                           # 纯函数工具
│   ├── colors.ts                    # JS 颜色常量（从 CSS 变量导出）
│   ├── date.ts
│   ├── geo.ts
│   └── format.ts
│
├── composables/                     # 可复用逻辑
│   ├── useTheme.ts
│   ├── useGlobe.ts
│   ├── useMap.ts
│   ├── useToast.ts
│   ├── usePhoto.ts
│   ├── useStagger.ts
│   ├── useOdometer.ts
│   ├── usePagination.ts
│   └── useScrollspy.ts
│
├── stores/                          # Pinia
│   ├── appStore.ts
│   ├── countryStore.ts
│   ├── tripStore.ts
│   └── wishlistStore.ts
│
├── components/
│   ├── base/                        # ═══ Atoms 层 ═══
│   │   ├── AppIcon.vue
│   │   ├── AppButton.vue
│   │   ├── AppIconButton.vue
│   │   ├── AppChip.vue
│   │   ├── AppBadge.vue
│   │   ├── AppDivider.vue
│   │   ├── AppInput.vue
│   │   ├── AppTextarea.vue
│   │   ├── AppSelect.vue
│   │   ├── AppSpinner.vue
│   │   ├── AppSkeleton.vue
│   │   ├── AppTooltip.vue
│   │   ├── AppProgress.vue
│   │   ├── AppSwitch.vue
│   │   └── AppDatePicker.vue
│   │
│   ├── shared/                      # ═══ Molecules 层 ═══
│   │   ├── SearchInput.vue
│   │   ├── DateRangeField.vue
│   │   ├── CountrySelect.vue
│   │   ├── TransportIcon.vue
│   │   ├── DurationBadge.vue
│   │   ├── MetaBadge.vue
│   │   ├── StatItem.vue
│   │   ├── CountryLabel.vue
│   │   ├── CityLabel.vue
│   │   ├── RouteVisual.vue
│   │   ├── TimeDisplay.vue
│   │   ├── EmptyState.vue
│   │   ├── ConfirmAction.vue
│   │   ├── BackLink.vue
│   │   ├── PageHeader.vue
│   │   ├── SectionHeader.vue
│   │   ├── TagGroup.vue
│   │   ├── InlineEditor.vue
│   │   ├── PhotoThumbnail.vue
│   │   └── UploadDropZone.vue
│   │
│   ├── features/                    # ═══ Organisms 层 ═══
│   │   ├── globe/
│   │   │   ├── Globe3D.vue
│   │   │   ├── ContextGlobe.vue
│   │   │   └── GlobeTooltip.ts      # (辅助模块)
│   │   │
│   │   ├── map/
│   │   │   ├── CountryMap.vue
│   │   │   ├── RouteMap.vue
│   │   │   ├── CityMarker.ts        # (Leaflet DivIcon 工厂)
│   │   │   └── RouteLine.ts         # (Leaflet Polyline 工厂)
│   │   │
│   │   ├── trip/
│   │   │   ├── TripCard.vue
│   │   │   ├── TripMiniCard.vue
│   │   │   ├── FlightCard.vue
│   │   │   ├── DayTimelineStrip.vue
│   │   │   ├── RouteEditor.vue
│   │   │   └── StatsPanel.vue
│   │   │
│   │   ├── photo/
│   │   │   ├── PhotoGrid.vue
│   │   │   ├── LightboxGallery.vue
│   │   │   └── PhotoUploader.vue
│   │   │
│   │   ├── timeline/
│   │   │   ├── YearFilter.vue
│   │   │   └── TimelineTrack.vue
│   │   │
│   │   ├── wishlist/
│   │   │   ├── DestinationCard.vue
│   │   │   ├── CategoryToggle.vue
│   │   │   └── AddFab.vue
│   │   │
│   │   └── content/
│   │       └── NotesViewer.vue
│   │
│   └── layout/                      # ═══ Templates 层 ═══
│       ├── FullBleedLayout.vue
│       ├── TwoColumnLayout.vue
│       ├── CenteredFormLayout.vue
│       ├── FullWidthLayout.vue
│       ├── GridLayout.vue
│       └── NavPill.vue              # 虽然属 Organism，但它也是全局布局的一部分
│
└── pages/                           # ═══ Pages 层 ═══
    ├── GlobeHome.vue
    ├── CountryDetail.vue
    ├── TripDetail.vue
    ├── TripEditor.vue
    ├── Wishlist.vue
    └── Timeline.vue
```

### 6.4 命名规范

| 类别 | 规范 | 示例 |
|------|------|------|
| **组件文件** | PascalCase.vue，多单词（Vue 官方要求） | `AppButton.vue`, `TripCard.vue`, `FlightCard.vue` |
| **Atom 组件** | 前缀 `App` | `AppButton`, `AppIcon`, `AppChip` |
| **Molecule 组件** | 描述性名称，无前缀 | `SearchInput`, `EmptyState`, `CountryLabel` |
| **Organism 组件** | 领域语义名称 | `Globe3D`, `FlightCard`, `PhotoGrid` |
| **Layout 组件** | 后缀 `Layout` | `TwoColumnLayout`, `FullBleedLayout` |
| **Composable** | camelCase，`use` 前缀 | `useTheme`, `useGlobe`, `useToast` |
| **Store** | camelCase，`Store` 后缀 | `appStore`, `tripStore` |
| **类型文件** | camelCase.ts | `country.ts`, `trip.ts` |
| **API 文件** | camelCase.ts | `countries.ts`, `trips.ts` |
| **Props 命名** | camelCase | `modelValue`, `flightNo`, `countryCode` |
| **Events 命名** | kebab-case | `@country-click`, `@photo-click` |
| **CSS class** | kebab-case 或 BEM | `.nav-pill`, `.flight-card__route` |

### 6.5 优先开发 vs 后续扩展

| 优先级 | 组件 | 理由 |
|--------|------|------|
| **立即** | AppIcon, AppButton, AppSpinner, AppInput, AppChip | 几乎所有组件都依赖 |
| **立即** | EmptyState, BackLink, PageHeader | 页面骨架必需 |
| **立即** | NavPill | 所有页面需要导航 |
| **立即** | useTheme, useStagger | 全局基础设施 |
| **高** | PhotoThumbnail, PhotoGrid, LightboxGallery | 核心照片体验 |
| **高** | TripCard, TripMiniCard | 多页面使用 |
| **高** | useGlobe, Globe3D, ContextGlobe | 核心差异化功能 |
| **高** | useMap, CountryMap, RouteMap | 地图核心功能 |
| **高** | FlightCard | 特色组件（旅行详情核心） |
| **中** | RouteEditor, PhotoUploader | 仅 TripEditor 使用 |
| **中** | StatsPanel, DayTimelineStrip | 单页面使用 |
| **中** | DestinationCard, CategoryToggle, AddFab | 仅 Wishlist 使用 |
| **低(v0.2)** | YearFilter, TimelineTrack | Timeline 页面 |
| **低(v0.2)** | AppSkeleton | 加载优化（可用 Spinner 替代） |
| **低(v0.2)** | useScrollspy | 联动滚动功能 |

### 6.6 页面与组件对应关系（组装表）

#### GlobeHome.vue
```
FullBleedLayout
  ├── Globe3D（:countries, @country-click → router.push）
  ├── NavPill（:activeRoute）
  ├── StatsPanel（:stats）
  ├── RecentTripStrip（:trips）
  │   └── TripMiniCard × N
  └── AppSpinner / EmptyState（条件渲染）
```

#### CountryDetail.vue
```
TwoColumnLayout（leftCols=7, rightCols=5）
  ├── left:
  │   └── CountryMap（:cities, :routes, :countryCode）
  ├── right:
  │   ├── PageHeader（:title, :subtitle, :backTo）
  │   ├── PhotoGrid（:photos, @photo-click → LightboxGallery）
  │   └── TripCard × N（@click → router.push）
  ├── ContextGlobe（:countryCode）
  └── LightboxGallery（:visible, :photos, :initialIndex）
```

#### TripDetail.vue
```
TwoColumnLayout（leftCols=7, rightCols=5）
  ├── left:
  │   └── RouteMap（:cities, :routes）
  ├── right:
  │   ├── FlightCard × N（stacked）
  ├── DayTimelineStrip（:days, @day-click）
  ├── PhotoGrid（:photos, @photo-click → LightboxGallery）
  ├── NotesViewer（:content, :editable, @save）
  └── LightboxGallery + ContextGlobe
```

#### TripEditor.vue
```
CenteredFormLayout（:title, :backTo）
  ├── header: PageHeader
  ├── form:
  │   ├── CountrySelect + DateRangeField
  │   ├── AppInput × N（城市输入）
  │   ├── RouteEditor（:cities, :routes, @update）
  │   └── PhotoUploader（v-model, @upload）
  ├── content:
  │   └── InlineEditor（Markdown 手记）
  └── actions:
      └── ConfirmAction（Cancel + Save）
```

#### Wishlist.vue
```
GridLayout（cols=3）
  ├── PageHeader（"Dream Destinations"）
  ├── CategoryToggle（:active, @change）
  ├── DestinationCard × N（@click-expand, @bookmark）
  └── AddFab（@click → modal 搜索浮层）
```

### 6.7 设计优化建议

基于对 Stitch 设计稿的分析，提出以下优化建议：

| # | 问题 | 建议 | 原因 |
|---|------|------|------|
| **S1** | NavPill 在 Wishlist 页用 Forest Green，其他页用 Sunset Orange——不一致 | NavPill 增加 `activeColor` prop | 保持 NavPill 统一组件，通过参数切换颜色而非创建两个 NavPill |
| **S2** | GlobeHome 有 "QuickActions" 面板（旧设计），新设计中已弱化 | 移除 QuickActions 独立面板，操作并入 NavPill | 减少用户认知负担，导航和快捷操作合并 |
| **S3** | TripCard 在 CountryDetail 和 Timeline 中布局不同——前者水平排列，后者垂直时间线 | TripCard 做成一个组件，内部 layout 由父容器控制 | TripCard 本身应该是内容组件，不决定自己的外部布局方式 |
| **S4** | PhotoThumbnail 作为独立分子组件，hove r时 scale(1.02)+shadow | 从 AppCard 继承 hover 模式但用 variant='photo' | 避免照片卡片有阴影默认态，保持"照片是第一公民"原则 |
| **S5** | 旧 UI spec 的 "玻璃面板 blur" 已废弃，但可能残留参考 | 严格执行 design.md（新暖白旅行风），旧 spec 仅保留页面结构参考 | 避免开发者混淆两套设计系统 |
| **S6** | FlightCard 的多航班堆叠效果（±0.5° 旋转）是纯视觉 | 封装为 FlightCard 内部实现，通过 `stackIndex` prop 计算 transform | 父组件不需要知道堆叠逻辑，单一职责 |
| **S7** | CityMarker 和 RouteLine 作为 Leaflet 地图元素，不是 Vue 组件 | 实现为 TypeScript 工厂函数而非 .vue 文件 | 它们是 Leaflet 层的对象，不需要 Vue 响应式系统 |
| **S8** | ContextGlobe 在 CountryDetail 和 TripDetail 中使用方式相同 | 复用同一个组件，通过 prop `size` 调整 | 避免两个几乎相同的 Globe 实现 |
| **S9** | MarkdownEditor 和 NotesViewer 都涉及 Markdown | 分离为 InlineEditor（编辑容器） + marked 渲染 | 编辑容器可复用于多种内容类型（手记、备注、城市备注） |
| **S10** | Toast 在多个页面使用，不应每个页面单独引入 | 提升到 App.vue 层级，通过 composable `useToast()` 全局调用 | 单一 Toast 容器，避免多个 Toast 堆叠 |

---

> **最后更新：** 2026-07-21  
> **总组件数：** 62 个（15 Atoms + 20 Molecules + 22 Organisms + 5 Templates）  
> **预计总工时：** ~14 天（2 周）  
> **下一步：** 从 Phase 0 开始安装依赖，然后按 Phase 1→9 顺序执行  
> **此文档替代：** 所有零散的组件设计讨论。开发时以本文档为唯一组件设计参考。
