# Travel Atlas — 项目交接文档

> **更新日期：** 2026-07-25
> **GitHub：** https://github.com/Stellan05/TripEarth.git
> **最新提交：** `Phase 12 增强 — 航线分离、贝塞尔曲线弧、标记 zoom 响应、z-index 修复`

---

## 项目状态总览

纯前端项目（Vue 3 + TypeScript + Vite），尚无后端。所有数据使用 Mock Data。

### 当前版本完成的功能模块

| 模块 | 内容 | 状态 |
|-------|------|------|
| 基础框架 | types, utils, composables, GeoJSON, routing | ✅ |
| Atom 组件 | 16 个（AppButton, AppCard, AppInput …） | ✅ |
| Molecule 组件 | 20 个 shared 组件 | ✅ |
| Layout 模板 | 6 个 layout 组件 + NavPill | ✅ |
| API & Mock | 6 个 API 模块 + Pinia Stores + Mock 数据 | ✅ |
| TripEditor | 新增/编辑旅行表单 | ✅ |
| Globe3D | 3D 地球 + 国家着色 + 脉冲 + 飞行弧线 | ✅ |
| **GlobeHome** | **全球/本地双模式 + 航线联动** | ✅ |
| CountryDetail | 国家详情 + Leaflet 地图 | ✅ |
| TripDetail | **增强版：航班弹窗 + 天筛选 + 添加手记/照片** | ✅ |
| Wishlist | **详情弹窗 + Timeline 条目** | ✅ |
| Timeline | 年份筛选 + 时间线卡片 | ✅ |
| 后端 | Spring Boot + Java 21 + MySQL（backend/ 空目录） | ⬜ |

---

## 已交付的核心功能

### 1. Globe3D 地球 (`components/features/globe/Globe3D.vue`)

- globe.gl + Three.js 渲染
- 去过国家 → 暖金色半透明填充 + Sunset Orange 轮廓（次数越多越深）
- 想去国家 → 鼠尾草绿半透明填充 + 柔和绿轮廓
- 用户所在国 → 中性灰填充覆盖
- 未去过 → 极淡灰色轮廓，透明填充
- 点击去过国家 → 全部去过国家脉冲闪烁 3 次
- 点击统计面板「已去国家」→ 联动触发脉冲
- Hover 轮廓高亮 + 显示国名（台湾映射为 China）
- 鼠标进入地球停止自转，离开恢复
- **3D 飞行弧线**：点击统计面板「飞行次数」切换显示，0.7 弧高，Sunset Orange→Ocean Blue 渐变，虚线流动动画
- **仅国际航线**：显示跨洲长距离航线（PEK→JFK, LHR→NRT, LAX→SYD 等），国内航线仅在 Local 模式显示

### 2. GlobeHome 首页 (`pages/GlobeHome.vue`)

#### Global 模式
- Hero 区域 70vh，Globe3D 居中
- 左侧 Stats 面板（5 项统计，stagger 入场动画 + 图标弹跳）
- 右上角 Quick Actions
- Stats 面板联动：悬停地球国家 → 对应行高亮
- 点击已去国家行 → 脉冲闪烁
- Welcome 动画 + Recent Trips + "Your Journey" 分割线

#### Local 模式
- 右上角 ViewModeToggle 切换
- **CountryHomeMap** 替换 Globe3D：Leaflet 全屏地图
- 国家边界高亮（GeoJSON），含台湾
- 显示本国城市标记（中国城市含坐标），**标记大小随 zoom 缩放**
- **本地飞行航线**：**贝塞尔曲线弧**（每条航线弧度不同）+ 虚线 + **起降端点标记**
- 航线数据分离：**Globe3D 仅展示国际航线**，CountryHomeMap 仅展示国内航线
- StatsPanel 适配（隐藏已去国家/收藏目的地）
- NavPill 联动：「地球」↔「地图」

### 3. StatsPanel (`components/features/trip/StatsPanel.vue`)

- 交互式统计卡片，支持点击 + 悬停联动
- 入场 stagger 滑入 + 图标弹跳
- **飞行次数可点击**（两模式都支持）
- **hideCountries 模式**：本地模式只显示「已去城市」「旅行次数」「飞行次数」
- `regionsCount` prop 支持已去地区统计
- 修复了 odometer 响应性 bug

### 4. ViewModeToggle (`components/features/globe/ViewModeToggle.vue`)

- 右上角浮动切换按钮
- Globe ↔ Map 图标切换
- 中英文 i18n 支持

### 5. CountryHomeMap (`components/features/map/CountryHomeMap.vue`)

- 全屏 Leaflet 地图组件
- GeoJSON 国家边界高亮
- 城市标记（visited 风格），**20px 起，随 zoom 缩放（3→12px ~ 10→33px）**
- 深色/浅色瓦片跟随主题
- **飞行航线贝塞尔曲线弧**：每条航线弧度随机偏移（-0.20 ~ +0.30），虚线样式
- **起降端点标记**：蓝色圆点，随 zoom 缩放
- **航显 toggle**：统计面板「飞行次数」点击切换

### 6. CountryDetail (`pages/CountryDetail.vue`)

- TwoColumnLayout 7:5
- 左列：PageHeader + CountryMap（Leaflet + CityMarker + RouteLine）
- 右列：PhotoGrid + TripCard 列表
- 右下角 ContextGlobe
- LightboxGallery 照片全屏浏览
- Loading/Empty/Error 状态完整

### 7. TripDetail (`pages/TripDetail.vue`) — 增强版

- TwoColumnLayout 7:5
- 左列：RouteMap + DayTimelineStrip + NotesViewer
- 右列：FlightCard 堆叠 + PhotoGrid
- 右下角 ContextGlobe + LightboxGallery

#### 新增功能
- **FlightDetailModal**：Flighty 风格航班详情弹窗（预计/实际起降 + 机型 + 登机口 + 状态）
- **DayTimelineStrip 增强**："All" 圆点 + 实心/空心区分内容 + dot-pop 动画
- **按天筛选**：选中某天 → 地图高亮该天照片位置 + 照片网格过滤 + Notes 标签联动
- **RouteMap 照片位置**：相机 SVG 图标标记（32px），随 zoom 缩放（22~48px），活跃天脉冲高亮
- **添加手记**：All 模式为旅行总结，选中天为该天手记
- **添加照片**：文件上传弹窗，自动填入当前日期

### 8. TripEditor (`pages/TripEditor.vue`)

- CenteredFormLayout 表单
- CountrySelect + 动态城市列表 + DateRangeField
- RouteEditor + 航班表单 + PhotoUploader
- Markdown 手记 + 新增/编辑双模式
- 表单验证 + Toast 通知

### 9. Wishlist (`pages/Wishlist.vue`) — 增强版

- GridLayout 3 列
- PageHeader + CategoryToggle
- **DestinationCard 重构**：精简设计，计数来自 `entries.length`
- **WishlistDetailModal**：目的地详情弹窗
  - Timeline 风格条目列表（左侧绿点 + 连接线）
  - 图片缩略图、描述、添加日期
  - 添加新条目表单（标题/图片URL/描述）
  - 删除条目 hover 按钮
  - 添加/删除后卡片计数实时同步

### 10. Timeline (`pages/Timeline.vue`)

- FullWidthLayout + YearFilter
- TimelineTrack + TripCard 列表

### Leaflet 地图组件

| 文件 | 说明 |
|------|------|
| `composables/useMap.ts` | Leaflet 生命周期（init/fitBounds/marker/polyline/destroy） |
| `components/features/map/CountryMap.vue` | 国家页地图 |
| `components/features/map/RouteMap.vue` | **照片位置标记（SVG 相机图标）+ 天筛选 + zoom 响应** |
| `components/features/map/CountryHomeMap.vue` | **本地全屏地图 + 贝塞尔航线弧 + 起降点 + zoom 响应** |
| `components/features/map/CityMarker.ts` | DivIcon 工厂（支持 size 参数） |
| `components/features/map/RouteLine.ts` | Polyline 工厂 |

### 新增 Molecule/Feature 组件

| 组件 | 文件 | 说明 |
|------|------|------|
| ViewModeToggle | `features/globe/ViewModeToggle.vue` | 全球/本地切换按钮 |
| CountryHomeMap | `features/map/CountryHomeMap.vue` | 本地模式全屏地图 |
| FlightDetailModal | `features/trip/FlightDetailModal.vue` | Flighty 风格航班详情弹窗 |
| WishlistDetailModal | `features/wishlist/WishlistDetailModal.vue` | 想去目的地详情弹窗 |

### 类型扩展

| 文件 | 新增 |
|------|------|
| `types/trip.ts` | Flight: status, actualDeparture, actualArrival, gate, terminal, duration |
| `types/photo.ts` | Photo: lat, lng（地理坐标） |
| `types/wishlist.ts` | WishlistEntry, WishlistItem.entries |
| `stores/appStore.ts` | viewMode ('global'\|'local'), setViewMode |
| `api/mock/data.ts` | 中国 5 条旅行 + 11 个机场坐标 + 22 张照片坐标 + 4 条 wishlist 含 12 个条目 |

---

## 设计系统

核心 Token 见 `design.md`。主要配色：

```
Page Background:  #F5F2ED (暖米白)
Card Background:  #FFFFFF
Sunset Orange:    #E8714A (主强调色)
Ocean Blue:       #3B7EC7 (路线/链接/飞行弧线)
Forest Green:     #4A9C7C (收藏/想去)
```

字体：Newsreader（Display）+ Inter（Body）+ JetBrains Mono（Mono）

---

## 数据层（Mock）

| 层 | 文件 | 说明 |
|----|------|------|
| API | `api/client.ts` | Axios 实例 |
| API | `api/countries.ts` | 国家 6 个接口 |
| API | `api/trips.ts` | 旅行 5 个接口 |
| API | `api/photos.ts` | 照片 4 个接口 |
| API | `api/wishlist.ts` | 清单 3 个接口 |
| API | `api/stats.ts` | 统计 1 个接口 |
| Mock | `api/mock/data.ts` | 30 国 + 5 条旅行（含中国数据）+ 22 照片 + 4 wishlist |
| Mock | `api/mock/index.ts` | 200-400ms 延迟模拟 |
| Store | `stores/appStore.ts` | 主题切换 + viewMode + localStorage |
| Store | `stores/countryStore.ts` | 国家数据 + 访问状态 |
| Store | `stores/tripStore.ts` | 旅行 CRUD |
| Store | `stores/wishlistStore.ts` | 想去清单 CRUD |

---

## 已知待办

### 数据与后端
1. **后端全栈开发** — Spring Boot + Java 21 + MySQL（`backend/` 目录为空）
2. **Phase 11 联调** — 将 `useMock = true` 切换为真实后端调用

### 质量优化
3. **深色主题巡检** — 新页面深色模式适配检查
4. **Globe3D HMR 警告** — 开发模式下组件更新警告
5. **照片上传** — 客户端压缩 + 上传进度

### 已修复问题
- 标记被瓦片遮挡不可见（`leaflet-marker-pane` z-index 错误覆盖 600→5）
- 本地模式城市标记太小（12px→20px，随 zoom 缩放到 10~33px）
- Detail 照片标记不可见（📷 emoji → SVG 相机图标，28px→32px，随 zoom 缩放到 22~48px）
- 航线数据混用（分离为国际航线/国内航线，分别绑定 Globe3D / CountryHomeMap）
- 国内航线直线→贝塞尔曲线弧（每条航线弧度不同）

### 后续功能（v0.2+）
6. **统计面板** — 增强统计功能 / 图表
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
├── api/           # 6 个 API 模块 + mock 数据
├── stores/        # 4 个 Pinia Stores
├── types/         # 5 个类型文件
├── utils/         # 4 个工具文件
├── composables/   # 7 个 composable
├── components/
│   ├── base/      # 16 个 Atom 组件
│   ├── shared/    # 20 个 Molecule 组件
│   ├── features/  # 25+ Organism 组件
│   │   ├── globe/   # Globe3D, ContextGlobe, ViewModeToggle
│   │   ├── map/     # CountryMap, RouteMap, CountryHomeMap, CityMarker, RouteLine
│   │   ├── trip/    # StatsPanel, TripCard, TripMiniCard, FlightCard, FlightDetailModal, DayTimelineStrip
│   │   ├── photo/   # PhotoGrid, LightboxGallery, PhotoCard, PhotoUploader
│   │   ├── wishlist/ # DestinationCard, CategoryToggle, AddFab, WishlistDetailModal
│   │   ├── timeline/ # YearFilter, TimelineTrack
│   │   └── content/  # NotesViewer
│   └── layout/   # 6 个 Layout + NavPill
└── pages/        # 7 个页面（全部接入 stores）
```

---

## 后续开发建议

1. **后端全栈** — 创建 Spring Boot 项目（`backend/`），按 `DEVELOPMENT_PLAN.md` 建表 + 接口
2. **联调** — 替换 Mock 数据为真实 API 调用
3. 如需新增功能，按 `docs/IMPLEMENTATION_PLAN.md` 推进
