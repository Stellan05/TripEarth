# Local/Global View Mode — Design Spec

> **日期：** 2026-07-23
> **目的：** 在 GlobeHome 首页右上角添加切换按钮，支持 Global（3D 地球）和 Local（平面地图）两种模式。

## 1. 模式定义

### Global Mode
- 当前的 3D 地球（Globe3D）渲染全球国家访问状态
- StatsPanel 显示全球维度统计数据
- Recent Trips 显示所有旅行
- NavPill 第一项为「地球」

### Local Mode
- Leaflet 平面地图显示用户所在国家
- 地图上显示该国家内的城市标记
- StatsPanel 维度切换到国家级别（已去地区/省内城市数/该国旅行次数等）
- Recent Trips 只过滤到该国家
- NavPill 第一项为「地图」

## 2. 架构变更

### 2.1 模式状态 — `appStore`
```typescript
// appStore 新增
viewMode: 'global' | 'local'
setViewMode(mode: 'global' | 'local')
```

### 2.2 切换按钮 — `ViewModeToggle.vue`
- 位于 GlobeHome Hero 右上角，QuickActions 上方
- 圆形按钮，图标：Globe ↔ Map
- 点击切换模式，切换时带动画
- 独立组件，可复用于其他页面

### 2.3 新建组件 — `CountryHomeMap.vue`
- Leaflet 地图，聚焦用户所在国家
- 显示该国家内城市标记（visited cities）
- 使用已有 `useMap.ts` composable
- 点击城市标记可导航到对应国家页

### 2.4 GlobeHome 修改
- 根据 `viewMode` 条件渲染 Globe3D 或 CountryHomeMap
- StatsPanel 数据源切换（全球 vs 国家）
- Recent Trips 过滤
- NavPill 第一项动态切换

## 3. 数据流

```
appStore.viewMode
    │
    ├─ 'global' → Globe3D + global stats + all trips
    │
    └─ 'local'  → CountryHomeMap + local stats + filtered trips
                        │
                        └─ 用户所在国 code（从 countryStore 获取 isHome=true 的 country）
```

## 4. Phase 划分

### Phase A: 模式状态与切换按钮
- `appStore` 增加 `viewMode` / `setViewMode`
- 创建 `ViewModeToggle.vue` 组件
- `GlobeHome.vue` 集成切换按钮（仅 UI，无功能切换）

### Phase B: 本地模式地图
- 创建 `CountryHomeMap.vue`（Leaflet 地图 + 城市标记）
- `GlobeHome.vue` 根据 `viewMode` 切换 Globe3D / CountryHomeMap

### Phase C: 本地模式数据 & Stats
- StatsPanel 适配本地模式
- 数据过滤（trips, stats）
- 删除已去国家 → 已去地区

### Phase D: 导航与动画
- NavPill 联动
- 过渡动画
- 边界情况处理

## 5. Mock 数据补充

需要补充：
- 用户所在国家的城市列表 + 统计数据
- 中国省份/地区数据（mock 级别即可）

## 6. UI 预览

```
┌──────────────────────────────────────┐
│  [🌐] [Timeline] [Wishlist] [+New]  │ ← NavPill
│                                      │
│            ┌──────────┐              │
│            │  Toggle   │ ← 切换按钮  │
│            │  🌐→🗺️   │              │
│            └──────────┘              │
│  ┌───────┐ ┌──────────────────┐      │
│  │ Stats │ │ Globe/Map       │      │
│  │ Panel │ │                 │      │
│  └───────┘ └──────────────────┘      │
└──────────────────────────────────────┘
```
