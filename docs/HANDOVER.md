# Travel Atlas — 项目交接文档

> **更新日期：** 2026-07-22
> **GitHub：** https://github.com/Stellan05/TripEarth.git
> **最新提交：** `8141619` — p6完成存档

---

## 项目状态总览

纯前端项目（Vue 3 + TypeScript + Vite），尚无后端。所有数据使用 Mock Data。

### 当前版本完成的 Phase

| Phase | 内容 | 状态 |
|-------|------|------|
| Phase 0 | Foundation（types, utils, composables, GeoJSON） | ✅ |
| Phase 1 | Atom 组件（AppButton, AppCard, AppInput … 15 个） | ✅ |
| Phase 2 | Molecule 组件（20 个 shared 组件，部分完成） | 🔧 部分完成 |
| Phase 3 | Layout 模板 + NavPill（6 个 layout 组件） | ✅ |
| Phase 4 | API Layer & Mock Data | ⬜ 未开始 |
| Phase 5 | TripEditor 页面 | ✅ |
| Phase 6 | Globe3D 地球模块 | ✅ |
| — | **Home 页面（原描述中的 "Phase 5"）** | ✅ |
| — | CountryDetail 页面（骨架） | 🔧 部分完成 |
| — | TripDetail 页面（骨架） | 🔧 部分完成 |
| — | Wishlist 页面（骨架） | 🔧 部分完成 |
| — | Timeline 页面（骨架） | 🔧 部分完成 |

### 已交付的核心功能

1. **Globe3D 地球** (`components/features/globe/Globe3D.vue`)
   - globe.gl + Three.js 渲染
   - 去过国家 → Sunset Orange 轮廓线
   - 想去国家 → 灰绿轮廓线
   - 未去过 → 极淡灰轮廓
   - 用户所在国 → 灰色填充覆盖
   - Hover 轮廓高亮 + 显示国名（台湾映射为 China，hover/click 随大陆）
   - 鼠标进入地球停止自转，离开恢复
   - 滚轮缩放（页面顶部时缩放，下滑后滚动页面）

2. **Home 首页** (`pages/GlobeHome.vue`)
   - Hero 区域 70vh，Globe3D 居中
   - 左侧 Stats 面板（玻璃卡片样式，5 项统计：国家/城市/旅行/飞行/收藏）
   - 右上角 Quick Actions（新增旅行/浏览地图/查看统计/上传照片）
   - Welcome 动画：首次进入播放一次（800ms 淡入 → 2.5s 停留 → 800ms blur/scale 淡出），sessionStorage 控制
   - Recent Trips 直接显示在 Hero 下方
   - 响应式：1024px 适配，768px 隐藏 Stats 和 QA

3. **StatsPanel** (`components/features/trip/StatsPanel.vue`)
   - 垂直卡片样式，使用全站设计系统配色
   - 有语义色图标：Globe/MapPin/Calendar/Plane/Heart
   - 行级 hover translateX(3px) 动画
   - 数字 count up（useOdometer，700ms）

4. **其他页面（骨架状态）**
   - TripEditor — 完整表单（国家搜索 + 城市 + 路线 + 照片 + 手记）
   - CountryDetail / TripDetail / Wishlist / Timeline — 路由可访问，基础框架

---

## 核心技术栈

```
Vue 3 + TypeScript + Vite
Vue Router 4 + Pinia
Element Plus（已覆盖主题）
Globe.GL / Three.js（3D 地球）
Leaflet（2D 地图，已安装但未使用）
Lucide Icons（已封装为 AppIcon）
```

---

## 关键文件清单

### 页面
| 文件 | 路由 | 状态 |
|------|------|------|
| `pages/GlobeHome.vue` | `/` | ✅ |
| `pages/TripEditor.vue` | `/trip/new`, `/trip/:id/edit` | ✅ |
| `pages/CountryDetail.vue` | `/country/:code` | 🔧 骨架 |
| `pages/TripDetail.vue` | `/trip/:id` | 🔧 骨架 |
| `pages/Wishlist.vue` | `/wishlist` | 🔧 骨架 |
| `pages/Timeline.vue` | `/timeline` | 🔧 骨架 |

### 地球模块
| 文件 | 说明 |
|------|------|
| `components/features/globe/Globe3D.vue` | 3D 地球核心（国家着色 + 交互 + 显示国名） |
| `components/features/globe/ContextGlobe.vue` | 右下角小地球 |
| `composables/useGlobe.ts` | 地球生命周期 composable |

### 核心组件
| 文件 | 说明 |
|------|------|
| `components/base/AppIcon.vue` | Lucide 图标唯一入口 |
| `components/base/AppButton.vue` | 4 变体按钮 |
| `components/base/AppCard.vue` | 4 变体卡片 |
| `components/base/AppEmptyState.vue` | 空状态 |
| `components/base/AppSpinner.vue` | 加载指示器 |
| `components/features/trip/StatsPanel.vue` | 首页统计面板 |
| `components/features/trip/TripMiniCard.vue` | 紧凑旅行卡片 |
| `components/layout/NavPill.vue` | 顶部浮动导航（4 项：地球/时间轴/想去/新增旅行） |
| `components/layout/FullBleedLayout.vue` | 全屏沉浸布局 |

### 数据层 (Mock)
| 文件 | 说明 |
|------|------|
| `utils/colors.ts` | 颜色常量 + 地球色板 + 路线色板 |
| `utils/date.ts` | 日期格式化工具 |
| `composables/useI18n.ts` | 中英双语 i18n |
| `composables/useOdometer.ts` | 数字滚动动画 |
| `composables/useTheme.ts` | 主题切换（浅色/深色） |
| `types/trip.ts` | Trip/TripDetail/Flight/Stats 类型 |
| `types/country.ts` | Country/CountryStatus 类型 |

---

## 设计系统

设计规范在 `design.md` 中有完整定义。核心 Token：

### Colors
```
Page Background:  #F5F2ED (暖米白)
Card Background:  #FFFFFF
Sunset Orange:    #E8714A (主强调色)
Ocean Blue:       #3B7EC7 (路线/链接)
Forest Green:     #4A9C7C (收藏/想去)
```

### Fonts
```
Display:    Newsreader (衬线)
Body:       Inter
Mono:       JetBrains Mono
```

### 设计方向
- Polarsteps 的旅行叙事 + Apple Maps 的克制 + Flighty 的精致排版
- 暖白旅行风（非暗黑/玻璃风格）

---

## 已知未完成 / 待办

### 前端页面开发
1. **CountryDetail** — 需要对接 CountryMap + CityMarker + RouteLine + PhotoGrid + LightboxGallery 等地图组件
2. **TripDetail** — 需要对接 RouteMap + FlightCard + DayTimelineStrip + NotesViewer + PhotoGrid
3. **Wishlist** — 需要 DestinationCard + CategoryToggle + AddFab + 搜索浮层
4. **Timeline** — 需要 YearFilter + TimelineTrack
5. **PhotoGrid / LightboxGallery** — 照片网格和全屏浏览组件尚未实现
6. **Leaflet 地图** — CountryMap.vue / RouteMap.vue / CityMarker.ts / RouteLine.ts / useMap.ts 均未实现

### 数据与后端
7. **API 层** — `api/` 目录下有框架文件但未填充真实调用
8. **Pinia Stores** — `stores/` 目录为空
9. **后端** — 整个 `backend/` 项目尚未创建（Spring Boot + Java 21 + MySQL）

### 已知问题
10. Three.js canvas wheel 事件拦截 — 页面顶部可缩放地球，下滑后滚动。实现方式是在 canvas 上加 `capture` 阶段 wheel listener，`scrollY > 0` 时 `stopPropagation()`

---

## 启动方式

```bash
cd frontend
npm install   # 已安装
npm run dev   # Vite 开发服务器 → http://localhost:3000
```

---

## 后续开发建议

1. 按 `docs/IMPLEMENTATION_PLAN.md` 继续 Phase 7–12
2. 优先实现 Leaflet 地图模块（useMap + CountryMap + RouteMap）
3. 然后完善 CountryDetail → TripDetail → Wishlist → Timeline
4. 最后接入 API + 后端开发
