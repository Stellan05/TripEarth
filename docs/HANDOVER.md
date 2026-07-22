# Travel Atlas — 项目交接文档

> **更新日期：** 2026-07-23
> **GitHub：** https://github.com/Stellan05/TripEarth.git
> **最新提交：** `a33b70a` — p6完成存档

---

## 项目状态总览

纯前端项目（Vue 3 + TypeScript + Vite），尚无后端。所有数据使用 Mock Data。

### 当前版本完成的 Phase

| Phase | 内容 | 状态 |
|-------|------|------|
| Phase 0 | Foundation（types, utils, composables, GeoJSON） | ✅ |
| Phase 1 | Atom 组件（AppButton, AppCard, AppInput … 16 个，含 AppDatePicker） | ✅ |
| Phase 2 | Molecule 组件（20 个 shared 组件） | ✅ |
| Phase 3 | Layout 模板 + NavPill（6 个 layout 组件） | ✅ |
| Phase 4 | API Layer & Mock Data + Pinia Stores（12 个文件） | ✅ |
| Phase 5 | TripEditor 页面 | ✅ |
| Phase 6 | Globe3D 地球 + Leaflet 地图全套组件 | ✅ |
| Phase 7 | GlobeHome 首页（完整实现，数据来自 stores） | ✅ |
| Phase 8 | CountryDetail 页面（完整实现） | ✅ |
| Phase 9 | TripDetail 页面（完整实现） | ✅ |
| Phase 10 | Wishlist 页面（完整实现） | ✅ |
| Phase 11 | Live Data Integration | ⬜ 未开始（需后端就绪） |
| Phase 12 | Polish & Quality | 🔧 进行中 |

### 已交付的核心功能

1. **Globe3D 地球** (`components/features/globe/Globe3D.vue`)
   - globe.gl + Three.js 渲染
   - 去过国家 → 暖金色半透明填充 + Sunset Orange 轮廓（次数越多越深）
   - 想去国家 → 鼠尾草绿半透明填充 + 柔和绿轮廓
   - 用户所在国 → 中性灰填充覆盖
   - 未去过 → 极淡灰色轮廓，透明填充
   - 点击去过国家 → 全部去过国家脉冲闪烁 3 次
   - 点击统计面板「已去国家」→ 联动触发脉冲
   - Hover 轮廓高亮 + 显示国名（台湾映射为 China，hover/click 随大陆）
   - 鼠标进入地球停止自转，离开恢复
   - 滚轮缩放（页面顶部时缩放，下滑后滚动页面）

2. **Home 首页** (`pages/GlobeHome.vue`)
   - Hero 区域 70vh，Globe3D 居中
   - 左侧 Stats 面板（5 项统计，带 stagger 入场动画 + 图标弹跳）
   - 右上角 Quick Actions（新增旅行/浏览地图/查看统计/新增旅行）
   - Stats 面板联动：悬停地球国家 → 对应行高亮发光脉冲
   - 点击已去国家行 → 地球全部去过国家闪烁
   - 点击收藏行 → 森林绿高亮 3 秒
   - Welcome 动画（800ms 淡入 → 2.5s 停留 → 800ms blur 淡出）
   - Recent Trips 区域 + "Your Journey" 装饰分割线
   - 数据来源：countryStore + tripStore + statsApi
   - 响应式：1024px 适配，768px 隐藏 Stats 和 QA

3. **StatsPanel** (`components/features/trip/StatsPanel.vue`)
   - 交互式统计卡片，支持点击 + 悬停联动
   - 入场 stagger 滑入动画
   - 图标弹跳动效
   - 行级 hover translateX(3px)
   - visited/wishlist 高亮态（不同色系发光脉冲）

4. **CountryDetail** (`pages/CountryDetail.vue`)
   - TwoColumnLayout 7:5
   - 左列：PageHeader + CountryMap（Leaflet + CityMarker + RouteLine）
   - 右列：PhotoGrid + TripCard 列表
   - 右下角 ContextGlobe
   - LightboxGallery 照片全屏浏览
   - Loading/Empty/Error 状态完整

5. **TripDetail** (`pages/TripDetail.vue`)
   - TwoColumnLayout 7:5
   - 左列：RouteMap + DayTimelineStrip + NotesViewer
   - 右列：FlightCard 堆叠 + PhotoGrid
   - 右下角 ContextGlobe + LightboxGallery
   - Markdown 手记渲染（marked v18）
   - Loading/Empty/Error 状态完整

6. **TripEditor** (`pages/TripEditor.vue`)
   - CenteredFormLayout 表单
   - CountrySelect + 动态城市列表 + DateRangeField
   - RouteEditor（路线编辑 + 交通方式选择）
   - 可折叠航班表单 + PhotoUploader
   - Markdown 手记（InlineEditor）
   - 新增/编辑双模式
   - 表单验证 + Toast 通知

7. **Wishlist** (`pages/Wishlist.vue`)
   - GridLayout 3 列
   - PageHeader + CategoryToggle
   - DestinationCard 网格（展开/收起城市列表）
   - AddFab + 搜索添加浮层（AppModal）
   - Forest Green 主题色

8. **Timeline** (`pages/Timeline.vue`)
   - FullWidthLayout + YearFilter（年份筛选）
   - TimelineTrack（年份分组 + 月份时间线）
   - TripCard 列表 + 加载/空状态

### Leaflet 地图组件

| 文件 | 说明 |
|------|------|
| `composables/useMap.ts` | Leaflet 生命周期（init/fitBounds/marker/polyline/destroy） |
| `components/features/map/CountryMap.vue` | 国家页地图 |
| `components/features/map/RouteMap.vue` | 旅行路线地图 |
| `components/features/map/CityMarker.ts` | DivIcon 工厂（visited/wishlist 分色） |
| `components/features/map/RouteLine.ts` | Polyline 工厂（FLIGHT/TRAIN/CAR 分色分线型） |

### 20 个 Molecule 组件

| 组件 | 用途 |
|------|------|
| SearchInput | 搜索框 + 防抖 |
| DateRangeField | 日期范围选择 + 验证 |
| CountrySelect | 国家下拉搜索（30 国） |
| TransportIcon | 交通方式图标（FLIGHT/TRAIN/CAR/OTHER） |
| DurationBadge | 天数 pill 标签 |
| MetaBadge | 通用元数据 pill |
| StatItem | 统计数字 + odometer 动画 |
| CountryLabel | 国旗 + 国家名 |
| CityLabel | 城市名 + 日期 |
| RouteVisual | 路线视觉：PVG→CDG |
| TimeDisplay | Mono 字体时间 |
| EmptyState | 空状态占位 |
| ConfirmAction | 确认/取消按钮对 |
| BackLink | ← 返回导航 |
| PageHeader | 页面标题区 |
| SectionHeader | 区块标题 + 操作链接 |
| TagGroup | Chip 按钮组（单选/多选） |
| InlineEditor | 内联编辑切换 |
| PhotoThumbnail | 照片缩略图 + hover 放大 |
| UploadDropZone | 拖拽上传区域 + 进度条 |

### 设计系统

设计规范在 `design.md` 中有完整定义。核心 Token：

#### Colors
```
Page Background:  #F5F2ED (暖米白)
Card Background:  #FFFFFF
Sunset Orange:    #E8714A (主强调色)
Ocean Blue:       #3B7EC7 (路线/链接)
Forest Green:     #4A9C7C (收藏/想去)
```

#### Fonts
```
Display:    Newsreader (衬线)
Body:       Inter
Mono:       JetBrains Mono
```

#### 设计方向
- Polarsteps 的旅行叙事 + Apple Maps 的克制 + Flighty 的精致排版
- 暖白旅行风（非暗黑/玻璃风格）

---

## 数据层（Mock）

| 层 | 文件 | 说明 |
|----|------|------|
| API | `api/client.ts` | Axios 实例（baseURL /api, timeout 10s） |
| API | `api/countries.ts` | 国家 6 个接口 |
| API | `api/trips.ts` | 旅行 5 个接口 |
| API | `api/photos.ts` | 照片 4 个接口 |
| API | `api/wishlist.ts` | 清单 3 个接口 |
| API | `api/stats.ts` | 统计 1 个接口 |
| Mock | `api/mock/data.ts` | 30 国 + 3 条旅行 + 4 条想去 |
| Mock | `api/mock/index.ts` | 200-400ms 延迟模拟 |
| Store | `stores/appStore.ts` | 主题切换 + localStorage |
| Store | `stores/countryStore.ts` | 国家数据 + 访问状态 |
| Store | `stores/tripStore.ts` | 旅行 CRUD |
| Store | `stores/wishlistStore.ts` | 想去清单 CRUD |

## 交互增强

- 点击「已去国家」统计行 → 地球全部去过国家暖金色脉冲闪烁 3 次
- 悬停地球国家 → 统计面板对应行发光脉冲
- 统计面板入场 stagger 滑入 + 图标弹跳
- "Your Journey" 装饰分割线
- Hero → Below 微渐变背景
- 所有页面 loading/empty/error 状态完整

---

## 已知未完成 / 待办

### 数据与后端
1. **Phase 11 联调** — 将 `useMock = true` 切换为真实后端调用
2. **后端项目** — Spring Boot + Java 21 + MySQL（`backend/` 目录为空）

### 质量优化
3. **深色主题巡检** — 新页面深色模式适配检查
4. **Globe3D HMR 警告** — 开发模式下组件更新警告（仅开发环境，生产正常）
5. **照片上传** — 客户端压缩 + 上传进度

### 后续功能（v0.2+）
6. **后端全栈开发** — Spring Boot + MySQL + Redis
7. **用户系统** — 注册/登录/JWT
8. **社交功能** — 好友/分享

---

## 启动方式

```bash
cd frontend
npm install   # 已安装
npm run dev   # Vite 开发服务器 → http://localhost:3000
```

## 目录结构

```
frontend/src/
├── api/        # 6 个 API 模块 + mock 数据
├── stores/     # 4 个 Pinia Stores
├── types/      # 5 个类型文件
├── utils/      # 4 个工具文件
├── composables/ # 7 个 composable
├── components/
│   ├── base/   # 16 个 Atom 组件
│   ├── shared/ # 20 个 Molecule 组件
│   ├── features/ # 20+ 个 Organism 组件
│   │   ├── globe/   # Globe3D, ContextGlobe
│   │   ├── map/     # CountryMap, RouteMap, CityMarker, RouteLine
│   │   ├── trip/    # StatsPanel, TripCard, TripMiniCard, FlightCard, DayTimelineStrip
│   │   ├── photo/   # PhotoGrid, LightboxGallery, PhotoCard, PhotoUploader
│   │   ├── wishlist/ # DestinationCard, CategoryToggle, AddFab
│   │   ├── timeline/ # YearFilter, TimelineTrack
│   │   └── content/  # NotesViewer
│   └── layout/ # 5 个 Layout + NavPill
└── pages/     # 7 个页面（全部接入 stores）
```

---

## 后续开发建议

1. **Phase 11** — 创建后端 Spring Boot 项目，替换 mock 数据为真实 API
2. **Phase 12** — 深色主题巡检 + 性能优化 + 边界状态完善
3. 如需新增功能，按 `docs/IMPLEMENTATION_PLAN.md` 继续推进
