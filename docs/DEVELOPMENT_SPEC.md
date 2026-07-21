# Travel Atlas — 完整开发规范

> **版本：** v1.0 | **日期：** 2026-07-21  
> **参考来源：** Stitch 暖白旅行风项目 (`14698863986216072936`) + design.md + 开发计划 + 设计规范  
> **适用阶段：** MVP v0.1 → v0.2  
> **本文件是：** 所有开发工作的唯一权威参考。不写代码，只定义"做什么"和"怎么做"。

---

## 目录

1. [项目总览](#1-项目总览)
2. [设计系统](#2-设计系统)
3. [页面规范](#3-页面规范)
4. [组件规范](#4-组件规范)
5. [数据模型](#5-数据模型)
6. [API 规范](#6-api-规范)
7. [交互与动画规范](#7-交互与动画规范)
8. [技术架构](#8-技术架构)
9. [实现路线图](#9-实现路线图)
10. [开发约定](#10-开发约定)

---

## 1. 项目总览

### 1.1 产品定位

**一句话：** 以 3D 地球为交互核心的个人旅行记录与回忆工具。

**目标用户：** 热爱旅行的个人用户（MVP 阶段为单用户模式）。

**核心体验：** 打开网站 → 看到一颗漂亮的浅色 3D 地球 → 去过的国家以暖金米色高亮 → 点击进入全是回忆。

**竞品区分：**
- 不是地图标注工具（不做 POI 密度）
- 不是旅行攻略（不做推荐引擎）
- **是：个人旅行记忆的可视化与叙事**

### 1.2 视觉方向

| 支柱 | 来源 | 关键词 |
|------|------|--------|
| 旅行叙事 | Polarsteps | 照片第一、时间线故事、温暖手记感 |
| 地图克制 | Apple Maps | 浅色底图、最少标注、让数据说话 |
| 信息精致 | Flighty | 登机牌卡片、数据排版考究、Mono 数字 |

### 1.3 核心情绪

温暖、自然、照片沉浸、旅途感。

### 1.4 页面清单

| 路由 | 页面 | 状态 | 说明 |
|------|------|------|------|
| `/timeline` | Timeline — 时间轴 | ✅ v0.1 | 年份筛选 + 时间线卡片列表（骨架） |
| `/trip/new` | TripEditor — 新增旅行 | ✅ | 表单录入 + 路线编辑 + 照片上传 |
| `/trip/:id/edit` | TripEditor — 编辑旅行 | ✅ | 同上，预填已有数据 |
| `/playground` | Component Playground | ✅ | 组件展示与验收 |
| `/` | GlobeHome — 3D 地球首页 | 🔜 v0.2 | 地球交互 + Stats HUD + 最近旅行 |
| `/country/:code` | CountryDetail — 国家详情 | 🔜 v0.2 | 地图 + 城市标点 + 照片网格 + 旅行列表 |
| `/trip/:id` | TripDetail — 旅行详情 | 🔜 v0.2 | 路线图 + 航班卡片 + 时间线 + 照片 + 手记 |
| `/wishlist` | Wishlist — 想去清单 | 🔜 v0.2 | 目的地卡片网格 + 分类切换 |

### 1.5 MVP 阶段明确不做

- 用户系统（单用户硬编码 user_id=1）
- 飞行轨迹回放动画
- 旅行统计面板
- 响应式适配（仅 Desktop 1280px+）
- OSS 文件存储（照片存服务器本地磁盘）
- 社交功能
- **页面：GlobeHome / CountryDetail / TripDetail / Wishlist（v0.2）**

---

## 2. 设计系统

### 2.1 设计理念

从旧版 VisionOS 暗黑玻璃风格彻底转向**暖白旅行叙事风格**：

| 维度 | 旧 (VisionOS) | 新 (Polarsteps × Maps × Flighty) |
|------|---------------|----------------------------------|
| 底色 | Space Black #06060D | 暖灰白 #F5F2ED |
| 面板 | 玻璃 blur + 半透明 | 实色白卡片 + 细微阴影 |
| 强调色 | Gold #D4A14B | 日落橙 #E8714A |
| 地球 | 暗黑星空背景 | 浅灰蓝海洋 + 暖色陆地 |
| 字体 | Playfair Display | Newsreader（现代衬线） |
| 照片 | 小网格 + hover 放大 | 大图铺陈、不规则网格 |
| 暗模式 | 纯黑底 | 深蓝灰底 #1C1E22，保留暖色 |

### 2.2 颜色系统

#### 背景层级

| Token | 浅色 | 深色 | 用途 |
|-------|------|------|------|
| `--color-page` | `#F5F2ED` | `#1C1E22` | 页面底色 |
| `--color-card` | `#FFFFFF` | `#262830` | 卡片背景 |
| `--color-card-hover` | `#FAFAFA` | `#2E303A` | 卡片 hover |
| `--color-sheet` | `#FBF9F6` | `#22242A` | 底部 Sheet / 大面板 |

#### 文字

| Token | 浅色 | 深色 | 用途 |
|-------|------|------|------|
| `--text-primary` | `#1C1E22` | `#EBEBED` | 主文字 |
| `--text-secondary` | `#6B6E77` | `#9B9DA5` | 辅助文字 |
| `--text-tertiary` | `#999CA6` | `#6B6D75` | 浅色/禁用 |
| `--text-inverse` | `#FFFFFF` | `#FFFFFF` | 深色背景反白 |

#### 语义强调色

| Token | 浅色 | 深色 | 用途 |
|-------|------|------|------|
| `--color-sunset` | `#E8714A` | `#F08060` | 去过、选中、主 CTA、主按钮 |
| `--color-sunset-glow` | `#F0A080` | `#F5B090` | Sunset hover 态 |
| `--color-ocean` | `#3B7EC7` | `#5B9ED8` | 路线、航班、链接 |
| `--color-ocean-deep` | `#2A5F9A` | `#7AB8E8` | Ocean 静态态 |
| `--color-forest` | `#4A9C7C` | `#5DBA90` | 收藏、想去、书签 |
| `--color-forest-light` | `#6DBA9A` | `#80D0AB` | Forest hover 态 |

#### 功能色映射

| 语义 | 使用 Token | 典型场景 |
|------|-----------|----------|
| Visited / Active | `--color-sunset` | 去过标记、选中态、主按钮背景 |
| Route / Link | `--color-ocean` | 路线线、航班号、可点击文字 |
| Wishlist / Bookmark | `--color-forest` | 收藏图标、想去标签 |
| Danger / Delete | `--color-danger` (#D94848) | 删除确认按钮 |
| Disabled / Muted | `--text-tertiary` | 未访问、禁用态 |

#### 地图专用色

| Token | 浅色 | 深色 | 用途 |
|-------|------|------|------|
| `--map-land` | `#F0E8D8` | `#3A3840` | 陆地默认（未访问） |
| `--map-land-visited` | `#E8C9A0` | `#C89870` | 去过国家 |
| `--map-land-wishlist` | `#C5D8C0` | `#90A890` | 想去国家 |
| `--map-water` | `#E8EDF2` | `#2A3040` | 海洋 |
| `--map-water-dark` | `#D0D8E3` | `#222838` | 深海 |

#### 航班卡片专用

| Token | 值 | 用途 |
|-------|-----|------|
| `--flight-accent` | `#4468B2` | 登机牌顶部蓝色条 |
| `--flight-divider` | `#E8E8EC` (浅色) / `#363840` (深色) | 虚线分隔 |

#### 语义色

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-danger` | `#D94848` | 删除/危险操作 |
| `--color-warning` | `#E8993A` | 警告 |
| `--color-success` | `#4A9C7C` | 成功（复用 Forest） |
| `--color-info` | `#3B7EC7` | 信息（复用 Ocean） |

### 2.3 字体系统

#### 字体族

| 角色 | 字体 | Fallback | 用途 |
|------|------|----------|------|
| Display | **Newsreader** (400/500/600) | Georgia, serif | 国家名、城市名、大数字、手记标题 |
| Body | **Inter** (300/400/500/600) | -apple-system, sans-serif | 正文、标签、UI 控件 |
| Mono | **JetBrains Mono** (400/500) | Consolas, monospace | 航班号、坐标、时长、统计数字 |

> 为什么从 Playfair Display 改为 Newsreader：Newsreader 更现代、更易读，同时保留旅行日记的"书写感"，不会显得过于装饰性。

#### 字号阶梯

| Token | 字号/行高 | 字体 | 字重 | 用途 |
|-------|-----------|------|------|------|
| Display XL | 56px / 1.1 | Newsreader | 600 | 首页 Hero 数字、年份大标题 |
| Display LG | 40px / 1.15 | Newsreader | 500 | 国家名（Country 页） |
| Display MD | 32px / 1.2 | Newsreader | 500 | 城市名（Trip 页） |
| Display SM | 24px / 1.25 | Newsreader | 500 | 卡片标题、手记标题 |
| Body XL | 20px / 1.5 | Inter | 400 | 导语、卡片摘要 |
| Body LG | 18px / 1.5 | Inter | 400 | 正文段落 |
| Body MD | 16px / 1.5 | Inter | 400 | 标准 UI 文本 |
| Body SM | 14px / 1.45 | Inter | 400 | 辅助信息、标签 |
| Body XS | 12px / 1.4 | Inter | 400 | 日期戳、元数据 |
| Mono LG | 20px / 1.3 | JetBrains Mono | 500 | 统计大数字、航班号 |
| Mono MD | 16px / 1.3 | JetBrains Mono | 400 | 时长、距离 |
| Mono SM | 14px / 1.3 | JetBrains Mono | 400 | 坐标、时间戳 |

#### 字重使用规则

- **Newsreader：** 400 正文级标题，500 卡片标题，600 Hero
- **Inter：** 400 正文，500 标签/按钮，600 强调
- **JetBrains Mono：** 400 数据标签，500 重要数字

### 2.4 间距系统

基准单位：4px。所有间距为 4 的倍数。

#### 基础间距 Token

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-xs` | 4px | icon 与文字间距、紧凑内边距 |
| `--space-sm` | 8px | 列表项间距、标签 gap、照片网格 gap |
| `--space-md` | 16px | 卡片内边距、标准元素间隙 |
| `--space-lg` | 24px | 段落间距、卡片网格 gap |
| `--space-xl` | 32px | 页面区块间距、页面边距 |
| `--space-2xl` | 48px | Hero 区上下间距 |
| `--space-3xl` | 64px | 页面级大分隔 |

#### 组件特定间距

| 用途 | 值 |
|------|-----|
| Page Padding（页面边缘到内容） | 32px |
| Card Padding（卡片内部） | 20px |
| Card Gap（卡片网格） | 20px |
| Photo Grid Gap（照片墙） | 8px |
| Section Gap（大区块） | 48px |

### 2.5 圆角系统

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-sm` | 8px | 标签、badge、小按钮、输入框 |
| `--radius-md` | 14px | **标准卡片**（Apple 风格，比传统 16px 更精致） |
| `--radius-lg` | 20px | 大卡片、模态框 |
| `--radius-xl` | 28px | 特大面板 |
| `--radius-full` | 9999px | Pill 按钮、选择器、导航 |

**规则：**
- 照片卡片：`--radius-md`（14px），内图填满无边距
- 航班卡片：`--radius-md` + 顶部 4px 蓝色条（`--flight-accent`）
- 导航 Pill：`--radius-full`
- 按钮：`--radius-full`（Pill 风格优先）

### 2.6 阴影系统

无 blur 玻璃效果。使用自然的卡片阴影：

| Token | 浅色 | 深色 | 用途 |
|-------|------|------|------|
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.06)` | `0 1px 3px rgba(0,0,0,0.30)` | 卡片默认 |
| `--shadow-card-hover` | `0 4px 12px rgba(0,0,0,0.08)` | `0 4px 12px rgba(0,0,0,0.40)` | 卡片 hover |
| `--shadow-modal` | `0 8px 24px rgba(0,0,0,0.10)` | `0 8px 24px rgba(0,0,0,0.50)` | 模态 / Sheet |
| `--shadow-max` | `0 16px 48px rgba(0,0,0,0.14)` | `0 16px 48px rgba(0,0,0,0.60)` | 最高层（极少用） |

**规则：**
- 卡片默认带 `1px solid rgba(0,0,0,0.06)` 边框 + `--shadow-card`
- Hover 时阴影升级 + `translateY(-2px)`
- 照片卡片无阴影无边框（照片是第一公民）
- 深色模式下阴影透明度提高 5 倍

### 2.7 图标系统

使用 **Lucide Icons**（线条风格，2px stroke）。

#### 尺寸规格

| 用途 | 尺寸 |
|------|------|
| UI 控件内 icon | 16px |
| 标准 icon | 20px |
| 导航 icon | 24px |
| 大图标 / 空状态 | 32px |

#### 颜色规则

- 默认跟随文字颜色（`--text-secondary`）
- 交互式 icon hover 切换为对应语义色
- 选中态 icon 使用 `--color-sunset`

#### 图标映射表

| 场景 | Lucide 图标 | 颜色 |
|------|-------------|------|
| 导航 — 地球 | `Globe` | 默认 |
| 导航 — 地图 | `MapPin` | 默认 |
| 导航 — 时间轴 | `Clock` | 默认 |
| 导航 — 想去 | `Bookmark` | 默认 |
| 航班 — 出发 | `PlaneTakeoff` | Ocean |
| 航班 — 到达 | `PlaneLanding` | Ocean |
| 航班 — 飞行中 | `Plane`（旋转 45°） | Ocean |
| 交通 — 火车 | `Train` | Forest |
| 交通 — 汽车 | `Car` | Tertiary |
| 操作 — 收藏 | `Heart` | Forest |
| 操作 — 编辑 | `Edit3` | Secondary |
| 操作 — 删除 | `Trash2` | Danger |
| 操作 — 照片 | `Camera` | Secondary |
| 操作 — 分享 | `Share2` | Secondary |
| 状态 — 去过 | `CheckCircle2` | Sunset |
| 状态 — 想去 | `BookmarkPlus` | Forest |
| 状态 — 添加 | `Plus` | 跟随按钮 |
| 导航 — 返回 | `ArrowLeft` | Secondary |

### 2.8 地球配色策略

地球不再是"暗黑星空"风格，改为**浅色底图 + 温暖陆地**：

| 元素 | 颜色 |
|------|------|
| 海洋 | `#E8EDF2` → `#D0D8E3`（渐变） |
| 陆地默认（未访问） | `#F0E8D8`（暖米色） |
| 陆地去过 | `#E8C9A0`（暖金米色，不是金属金） |
| 陆地想去 | `#C5D8C0`（低饱和灰绿） |
| 选中发光 | Sunset Orange，透明度 40% |
| 大气光晕 | `#E8EDF2`，微弱 glow |

#### 交互

- `polygonsData()` 精确国界线，纯色填充
- 去过多边形 → 暖金色梯度（按次数加深）
- Hover 国家 → 停止自转 + 微浮起 + tooltip（仅国名）
- 点击国家 → router 跳转

### 2.9 2D 地图（Leaflet，CountryDetail / TripDetail 页专用）配色

国家详情和旅行详情页中的 2D 地图继续使用 Leaflet。地图瓦片不使用默认 OSM（颜色太多，抢视觉焦点）：

- **浅色模式：** CartoDB Positron（浅灰底图，最小标注）
- **深色模式：** CartoDB Dark Matter

| 元素 | 浅色 | 深色 |
|------|------|------|
| 城市标点（去过） | `#E8714A`，8px 圆 + 2px pulse 环 | `#F08060` |
| 城市标点（想去） | `#4A9C7C` | `#5DBA90` |
| 飞行路线 | `#3B7EC7`，2px 实线 | `#5B9ED8` |
| 铁路路线 | `#4A9C7C`，2px 虚线 | `#5DBA90` |
| 公路路线 | `#999CA6`，1.5px 虚线 | `#6B6D75` |
| 路线 hover | 线宽变 4px，颜色提高亮度 | 同 |

---

## 3. 页面规范

### 3.1 GlobeHome — 3D 地球首页（未来版本 v0.2）

**路由：** `/`  
**设计基准：** 1440×900（桌面端）  
**Stitch 参考屏幕：** `38648ba3` (Home), `7444d9d0` / `d35a78b6` / `fd5a0053` (Home with 3D Globe), `46e09ecc` (Interactive Globe)

#### 3.1.1 布局结构

```
┌──────────────────────────────────────────────┐
│  ┌─ NavPill (顶部居中浮动) ────────────────┐ │
│  │  Globe  ·  Timeline  ·  Wishlist  ·  +  │ │
│  └──────────────────────────────────────────┘ │
│                                              │
│  ┌─ StatsHUD (左上) ──┐  ┌─ QuickActions ──┐│
│  │  7 Countries        │  │  Wishlist       ││
│  │  23 Cities          │  │  Recent         ││
│  │  12 Trips           │  │                 ││
│  └─────────────────────┘  └─────────────────┘│
│                                              │
│             🌍  3D GLOBE                     │
│         （全屏交互式 3D 地球）                │
│     可旋转、缩放、点击国家                    │
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │  最近旅行 (水平滚动卡片 strip)            ││
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   ││
│  │  │ 东京  │ │ 巴黎  │ │ 罗马  │ │ 曼谷  │  ││
│  │  └──────┘ └──────┘ └──────┘ └──────┘   ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

#### 3.1.2 组件树及职责

```
GlobePage
├── Globe3D                        # Globe.GL 全屏交互地球
│   ├── 国家多边形（按访问状态着色）
│   ├── 国家多边形 Overlay（按访问状态着色） # visited→暖金 overlay, wishlist→灰绿 overlay
│   ├── 国家标签（hover 时浮出）     # Newsreader 16px，底部发光
│   └── 选中光圈（pulse 动画）       # Sunset Orange 透明度 40%
├── NavPill                        # 顶部居中浮动导航
│   ├── NavItem "Globe" (active)
│   ├── NavItem "Timeline"
│   ├── NavItem "Wishlist"
│   └── NavItem "＋" (新增旅行)
├── StatsHUD                       # 左上角统计卡片
│   ├── StatRow "N Countries"      # Mono 数字 + Inter 标签
│   ├── StatRow "N Cities"
│   └── StatRow "N Trips"
├── QuickActions                   # 右上角快捷操作
│   ├── WishlistButton             # 带 Forest 标记
│   └── RecentButton
└── RecentTripStrip                # 底部水平滚动
    └── TripMiniCard × N           # 封面缩略图 + 城市名 + 日期
```

#### 3.1.3 交互行为

| 操作 | 行为 |
|------|------|
| 地球拖拽 | 水平旋转，垂直限制 0–90° |
| 滚轮 | 缩放（1.0x – 3.0x） |
| Hover 国家 | 国家多边形边缘发光 2px Sunset Orange；tooltip 显示国名 + 去过次数 |
| Click 国家（去过） | 地球旋转使该国居中 → 放大 → 路由到 `/country/:code` |
| Click 国家（想去） | 地球旋转使该国居中 → 路由到 `/wishlist`（带国家锚点） |
| Click 国家（未去） | 无路由跳转，仅放大显示国名 |
| 页面加载 | 地球淡入（800ms） → Stats 数字滚动 → Nav Pill 下落 → 卡片 strip 上浮 |

#### 3.1.4 页面入场动画序列

```
0ms      页面背景就绪
200ms    3D 地球从 opacity 0 → 1（800ms ease-globe）
400ms    Stats HUD 从左侧滑入（300ms ease-out）
500ms    Nav Pill 从上方滑入（translateY: -12px → 0, 300ms ease-out）
600ms    RecentTripStrip 从下方滑入，每张卡片 stagger 80ms
800ms    统计数字从 0 滚到目标值（400ms per number, ease-globe）
```

#### 3.1.5 数据依赖

| 数据 | 来源 | 说明 |
|------|------|------|
| 国家访问状态 | `GET /api/countries/visited` | 去过/想去/未去 |
| 统计数字 | `GET /api/stats` | 国家数、城市数、旅行次数 |
| 最近旅行 | `GET /api/trips?limit=8` | 最近 8 次旅行，按日期倒序 |
| GeoJSON 边界 | 前端静态文件 | Natural Earth 110m 精度 |

---

### 3.2 CountryDetail — 国家详情（未来版本 v0.2）

**路由：** `/country/:code`  
**设计基准：** 1440×900  
**Stitch 参考屏幕：** 此页面在新项目中尚未直接生成，参考旧项目中的 Country 页布局 + design.md Section 13

#### 3.2.1 布局结构

```
┌──────────────────────────────────────────────┐
│  ← Back    FRANCE  🇫🇷                       │
│  3 trips · 5 cities · 2023–2025              │
│                                              │
│  ┌────── 左列 (7 cols) ─┐ ┌─ 右列 (5 cols) ┐│
│  │                       │ │  Photos       ││
│  │   Country Map         │ │  ┌──┐┌──┐┌──┐││
│  │   (Leaflet 地图)       │ │  │  ││  ││  ││││
│  │                       │ │  └──┘└──┘└──┘││
│  │  · Paris  · Lyon     │ │  ┌──┐┌──┐    ││
│  │     ╲ ╱              │ │  │  ││  │    ││
│  │   · Marseille         │ │  └──┘└──┘    ││
│  │                       │ └──────────────┘│
│  │                       │ ┌──────────────┐│
│  │                       │ │ Trips List   ││
│  │                       │ │ ┌──────────┐ ││
│  │                       │ │ │ Paris     │ ││
│  │                       │ │ │ Oct 2024  │ ││
│  │                       │ │ └──────────┘ ││
│  │                       │ │ ┌──────────┐ ││
│  │                       │ │ │ Lyon      │ ││
│  │                       │ │ │ Jul 2023  │ ││
│  │                       │ │ └──────────┘ ││
│  └───────────────────────┘ └──────────────┘│
│                                              │
│  ┌─ ContextGlobe (右下角小地球) ─────────────┐
└──────────────────────────────────────────────┘
```

#### 3.2.2 组件树

```
CountryPage
├── CountryHeader                  # 顶部信息
│   ├── BackButton                 # ← Back，玻璃 pill 风格
│   ├── CountryName                # Newsreader Display LG (40px), text-primary
│   ├── CountryFlag                # Emoji 国旗，40px
│   └── TripSummary                # "N trips · N cities · YYYY–YYYY"
├── ContentGrid (7+5 双列)         # 12 列网格
│   ├── [左 7 cols] CountryMap      # Leaflet 地图，sticky 定位
│   │   ├── CityMarker × N         # 城市标点，按访问时间排列
│   │   │                         # 去过→Sunset Orange, 想去→Forest Green
│   │   └── RouteLine × N          # 城市间连接线，颜色按交通方式
│   └── [右 5 cols] RightPanel     # 可滚动
│       ├── PhotoGrid              # CSS Grid dense 不规则网格
│       │   └── PhotoCard × N      # 14px 圆角，无阴影无边框
│       ├── TripList               # 该国旅行列表
│       │   └── TripCard × N       # 封面缩略图 + 城市名 + 日期 + 天数
│       └── NotesPreview           # 手记摘要（最多 3 条，2 行 clamp）
└── ContextGlobe                   # 右下角 80×80 小地球，当前国家高亮
```

#### 3.2.3 交互行为

| 操作 | 行为 |
|------|------|
| Hover 城市标点 | 城市名浮起 + 去过日期 tooltip（卡片样式浮层） |
| Click 城市标点 | 地图 pan 到该城市，zoom +1 |
| Click TripCard | 路由到 `/trip/:id` |
| 滚动右侧面板 | 地图保持不动（sticky） |
| Click 照片 | Lightbox 全屏查看（背景 rgba(0,0,0,0.92)） |
| Click Back | 路由回 `/`（带过渡动画） |
| 页面入场 | 页面从右滑入 → 国家名逐字出现 → 地图灰度→彩色过渡 → 标点依次亮起 → 照片浮入 |

#### 3.2.4 数据依赖

| 数据 | 来源 | 说明 |
|------|------|------|
| 国家信息 | `GET /api/countries/:code` | 名称、国旗、统计 |
| 城市列表 | `GET /api/countries/:code/cities` | 城市名、坐标、访问状态 |
| 旅行列表 | `GET /api/countries/:code/trips` | 该国所有旅行 |
| 照片列表 | `GET /api/countries/:code/photos` | 照片 URL、标题、日期 |

---

### 3.3 TripDetail — 旅行详情（未来版本 v0.2）

**路由：** `/trip/:id`  
**设计基准：** 1440×900  
**Stitch 参考屏幕：** `f0633d1e`, `276e2c7b` (Paris Trip Detail)

#### 3.3.1 布局结构

```
┌──────────────────────────────────────────────┐
│  ← Back to France                           │
│                                              │
│  Paris, France          Oct 12–19, 2024     │
│  8 days                                     │
│  Shanghai ✈ Paris 🚄 Lyon 🚄 Paris ✈ Shanghai│
│                                              │
│  ┌───── 左列 (7 cols) ────┐ ┌─ 右列 (5 cols)┐│
│  │                         │ │ Flight Card  ││
│  │   Route Map (Leaflet)   │ │ ┌──────────┐ ││
│  │                         │ │ │ AF 111   │ ││
│  │   Shanghai ──✈── Paris │ │ │ Air France│ ││
│  │                ╭─╮      │ │ │ B777     │ ││
│  │   Paris ──🚄── Lyon     │ │ │ 10:30    │ ││
│  │                ╰─╯      │ │ │  ↓       │ ││
│  │                         │ │ │ 14:20    │ ││
│  │                         │ │ └──────────┘ ││
│  │                         │ │ ┌──────────┐ ││
│  │                         │ │ │ AF 112   │ ││
│  │                         │ │ │ (return) │ ││
│  │                         │ │ └──────────┘ ││
│  └─────────────────────────┘ └──────────────┘│
│                                              │
│  ┌─ DayTimelineStrip (水平滚动) ────────────┐│
│  │  Day1 ○──Day2 ○──Day3 ○──Day4 ○──...    ││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌─ Photos (不规则网格) ────────────────────┐│
│  │  ┌──┐┌──┐┌──┐┌──┐┌──┐                  ││
│  │  │  ││  ││  ││  ││  │                  ││
│  │  └──┘└──┘└──┘└──┘└──┘                  ││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌─ Notes ──────────────────────────────────┐│
│  │  ## Day 1: Montmartre                    ││
│  │  We woke up to the smell of fresh...     ││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌─ ContextGlobe (右下角小地球) ─────────────┐
└──────────────────────────────────────────────┘
```

#### 3.3.2 组件树

```
TripPage
├── TripHeader                     # 顶部信息区
│   ├── BackButton                 # ← Back to {Country}
│   ├── CityCountry                # Newsreader Display MD (32px)
│   ├── DateRange                  # Inter Body SM, text-secondary
│   ├── DurationBadge              # Pill: "N days", Sunset Orange 文字
│   └── RouteSummary               # 路线缩略：城市名 + 交通图标 + 箭头
├── ContentLayout (7+5 双列)
│   ├── [左 7 cols] RouteMap        # Leaflet 地图
│   │   ├── RouteSegment × N        # 按交通方式分色的路线段
│   │   ├── CityNode × N            # 城市圆点 + 标签
│   │   └── TransportIcon × N       # ✈️/🚄/🚗 mid-point 图标
│   └── [右 5 cols] Sidebar
│       └── FlightCard × N          # 登机牌风格卡片
│           ├── AirlineName         # Inter Body SM, text-secondary
│           ├── FlightNumber        # Mono LG（18px）, Ocean Blue
│           ├── AircraftModel       # Inter Body XS, text-tertiary
│           ├── RouteVisual         # DEP ───✈─── ARR
│           ├── TimeBar             # 时间线竖线 + 起飞/降落时间
│           ├── Duration            # Mono MD, 居中
│           └── StopsInfo           # "Direct" / "1 stop"
├── DayTimelineStrip               # 水平滚动天时间线
│   └── DayDot × N                  # 实心圆（有照片）/ 空心圆（无照片），点击跳转
├── PhotoGallery                    # 不规则网格
│   └── PhotoCard × N               # 14px 圆角，无阴影，hover scale(1.02)
└── NotesSection                   # Markdown 渲染
    ├── NoteBlock × N               # Newsreader 标题 + Inter 正文
    └── EditButton                  # Pill 按钮 "Edit Note"
```

#### 3.3.3 航班卡片详细规范

```
┌──────────────────────────────────────┐
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← 顶部 4px 蓝色条 (#4468B2)
│                                      │
│  Air France                   AF111  │  ← 航司: Inter 14px Secondary
│  Boeing 777-300ER                    │  ← 机型: Inter 12px Tertiary
│                                      │
│  PVG ──────────────────────── CDG   │  ← 路线视觉
│  Shanghai                Paris      │  ← 城市名 Inter 12px Tertiary
│                                      │
│  10:30  ●────────────────●  14:20   │  ← 时间: Mono 20px Primary
│  Oct 12                    Oct 12   │  ← 日期: Inter 12px Tertiary
│                                      │
│              11h 50m                │  ← 时长: Mono 16px Primary 居中
│              Direct                 │  ← 经停: Inter 12px Tertiary
│                                      │
└──────────────────────────────────────┘
```

航班卡片顶部蓝色条使用 `::before` 伪元素或 `border-top: 4px solid var(--flight-accent)`。

多航班堆叠：每张卡片微旋转 ±0.5° 交错排列，hover 时回正 + 前置（z-index）。

#### 3.3.4 路线颜色编码

| 交通方式 | 地图线颜色 | 线型 | 线宽 | 图标 |
|----------|-----------|------|------|------|
| 飞机 | `--color-ocean` | 实线 | 2px | ✈️ (PlaneTakeoff/PlaneLanding) |
| 火车/高铁 | `--color-forest` | 虚线（dash 8, gap 4） | 2px | 🚄 (Train) |
| 汽车/自驾 | `--text-tertiary` | 虚线（dash 4, gap 6） | 1.5px | 🚗 (Car) |
| 步行/其他 | `--text-tertiary` 30% | 点线 | 1px | — |

#### 3.3.5 交互行为

| 操作 | 行为 |
|------|------|
| Hover 路线线段 | 线宽加粗到 4px + tooltip 显示交通方式 |
| Hover 航班卡片 | 卡片抬起 translateY(-2px) + shadow-card-hover |
| Click 航班卡片 | 地图对应航线高亮闪烁 2 次 |
| Click DayDot | 页面滚动到对应日期的照片区域 |
| Click 照片 | Lightbox 全屏查看 |
| Hover 照片 | scale(1.02) + 细微阴影出现 |
| Click Edit Note | 内联 Markdown 编辑器展开 |

#### 3.3.6 数据依赖

| 数据 | 来源 | 说明 |
|------|------|------|
| 旅行详情 | `GET /api/trips/:id` | 基本信息、日期、天数 |
| 路线段 | `GET /api/trips/:id/routes` | 城市序列、交通方式 |
| 航班信息 | `GET /api/trips/:id/flights` | 航班号、航司、时间 |
| 照片列表 | `GET /api/trips/:id/photos` | 照片 URL、标题、拍摄日期 |
| 手记内容 | `GET /api/trips/:id/notes` | Markdown 文本 |

---

### 3.4 TripEditor — 新增/编辑旅行

**路由：** `/trip/new`, `/trip/:id/edit`  
**设计基准：** 1440×900

#### 3.4.1 布局结构

```
┌──────────────────────────────────────────────┐
│  ← Back    New Trip / Edit Trip              │
│                                              │
│  ┌─ 表单区 (8 cols 居中) ──────────────────┐ │
│  │                                          │ │
│  │  Country *          [___________] 🔍     │ │
│  │  City *             [___________]        │ │
│  │  Start Date *       [___]  End Date [___]│ │
│  │                                          │ │
│  │  ─── Route Editor ────────────────────   │ │
│  │  City 1  [✈]  City 2  [🚄]  City 3     │ │
│  │  [+ Add City]                            │ │
│  │                                          │ │
│  │  ─── Flight Info ─────────────────────   │ │
│  │  Flight No   [____]  Airline [_______]   │ │
│  │  Aircraft    [____]                      │ │
│  │  Dep Time    [____]  Arr Time [_______]  │ │
│  │                                          │ │
│  │  ─── Photos ──────────────────────────   │ │
│  │  ┌──────────────────────────────────┐    │ │
│  │  │  📷 拖入照片或点击上传            │    │ │
│  │  │  (虚线区域, 支持多选)            │    │ │
│  │  └──────────────────────────────────┘    │ │
│  │  [thumbnail] [thumbnail] [thumbnail]     │ │
│  │                                          │ │
│  │  ─── Notes ──────────────────────────   │ │
│  │  ┌──────────────────────────────────┐    │ │
│  │  │  Markdown Editor                 │    │ │
│  │  │                                  │    │ │
│  │  └──────────────────────────────────┘    │ │
│  │                                          │ │
│  │  [Cancel]            [Save Trip]        │ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

#### 3.4.2 表单规范

| 字段 | 类型 | 必填 | 验证 |
|------|------|------|------|
| Country | 下拉搜索 | ✅ | 从国家列表中选择 |
| City | 文本 + 添加 | ✅ | 至少 1 个城市 |
| Start Date | 日期选择 | ✅ | ≤ End Date |
| End Date | 日期选择 | ✅ | ≥ Start Date |
| Route | 城市序列 + 交通方式 | ❌ | 至少 2 个城市才能建路线 |
| Flight No | 文本 | ❌ | 大写字母+数字格式 |
| Airline | 文本 | ❌ | — |
| Aircraft | 文本 | ❌ | — |
| Dep/Arr Time | 日期时间选择 | ❌ | Dep < Arr |
| Photos | 文件上传（多选） | ❌ | JPG/PNG/WebP, 单张 ≤ 10MB |
| Notes | Markdown 文本区 | ❌ | — |

#### 3.4.3 照片上传规范

- 上传区域：虚线边框 `2px dashed #D0D0D8`，背景 `#FAFAFA`
- 提示文字："拖入照片或点击上传"（Inter 14px, text-tertiary）
- 支持多选，上传后即时出现在缩略图区（带 fade-in stagger）
- 已上传缩略图可拖拽排序、可点击×删除
- 后端接口：`POST /api/trips/:id/photos`，multipart/form-data

#### 3.4.4 数据依赖

| 操作 | API | 说明 |
|------|-----|------|
| 创建旅行 | `POST /api/trips` | 一次性提交所有字段 |
| 更新旅行 | `PUT /api/trips/:id` | 部分更新 |
| 上传照片 | `POST /api/trips/:id/photos` | multipart，返回 URL 列表 |
| 删除照片 | `DELETE /api/photos/:id` | 单张删除 |
| 获取国家列表 | `GET /api/countries` | 下拉搜索的数据源 |

---

### 3.5 Timeline — 时间轴（当前默认页面）

**路由：** `/timeline`  
**版本：** v0.2  
**Stitch 参考屏幕：** 旧项目 `aaf1c820` (Journey Timeline - Warm Narrative)

#### 3.5.1 布局结构

```
┌──────────────────────────────────────────────┐
│           ┌─ NavPill ──────────┐             │
│           └────────────────────┘             │
│                                              │
│           [All]  [2025]  [2024]  [2023]      │  ← 年份筛选 Pill
│                                              │
│  2024                                        │  ← 年份大标题 (Newsreader 48px)
│  │                                           │
│  │  Oct ●────  ┌──────────────────────┐     │  ← 圆点 + 卡片
│  │             │ 🇫🇷 Paris, France    │     │
│  │             │ 8 days · 3 cities    │     │
│  │             │ [照片缩略 ×3]  →     │     │
│  │             └──────────────────────┘     │
│  │                                           │
│  │  Jul ●────  ┌──────────────────────┐     │
│  │             │ 🇮🇹 Rome, Italy      │     │
│  │             │ 5 days · 2 cities    │     │
│  │             └──────────────────────┘     │
│  │                                           │
│  │  Mar ●────  ┌──────────────────────┐     │
│  │             │ 🇹🇭 Bangkok, Thailand│     │
│  │             │ 7 days · 3 cities    │     │
│  │             └──────────────────────┘     │
│  │                                           │
│  2023                                        │
│  │  ...                                      │
│  │                                           │
└──────────────────────────────────────────────┘
```

#### 3.5.2 关键视觉元素

- **时间线竖线：** 左侧 2px，颜色 `#E0DCD4`（浅色）/ `#363840`（深色）
- **年份标签：** Newsreader 48px，`text-tertiary` 低透明度（0.12），置于时间线左侧
- **月份标签：** Inter 14px，`text-secondary`，置于圆点左侧
- **圆点：** 12px，Sunset Orange（去过），Forest Green（想去）
- **卡片：** 标准样式，左侧 44×44 照片缩略图（3 张）+ 右侧文字区
- **连接线：** 圆点之间，2px solid，颜色同时间线

#### 3.5.3 交互行为

| 操作 | 行为 |
|------|------|
| Click 年份 Pill | 过滤显示该年份，其他年份动画收起 |
| Click "All" | 显示全部，默认选中 |
| Click TripCard | 路由到 `/trip/:id` |
| 滚动页面 | 右侧 ScrollProgress 指示器跟随 |
| Hover TripCard | 卡片抬起，照片 strip 滚动显示更多 |
| 页面入场 | 年份标签淡入 → 时间线从上向下绘制（600ms）→ 卡片 stagger 浮入 |

---

### 3.6 Wishlist — 想去清单（未来版本 v0.2）

**路由：** `/wishlist`  
**Stitch 参考屏幕：** 旧项目 `122568fc`（需重新生成暖色版）

#### 3.6.1 布局结构

```
┌──────────────────────────────────────────────┐
│           ┌─ NavPill ──────────┐             │
│           └────────────────────┘             │
│                                              │
│  Dream Destinations                          │  ← Newsreader 36px, Forest Green
│  Places waiting to be explored               │  ← Inter 14px, text-secondary
│                                              │
│  [Countries]  [Cities]                       │  ← 分类切换 Pill
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │    🇮🇸   │ │    🇳🇿   │ │    🇵🇪   │     │
│  │ Iceland  │ │New Zealand│ │  Peru    │     │  ← 3 列网格
│  │          │ │          │ │          │     │
│  │ Reykjavik│ │Milford   │ │Machu     │     │
│  │ Northern │ │Hobbiton  │ │Picchu    │     │
│  │          │ │          │ │          │     │
│  │  [★ 5]  │ │  [★ 3]  │ │  [★ 2]  │     │
│  └──────────┘ └──────────┘ └──────────┘     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │    🇯🇵   │ │    🇲🇦   │ │    🇳🇴   │     │
│  │  Japan   │ │ Morocco  │ │  Norway  │     │
│  │  [★ 8]  │ │  [★ 4]  │ │  [★ 3]  │     │
│  └──────────┘ └──────────┘ └──────────┘     │
│                                              │
│                        [+ Add Destination]   │  ← 右下角 FAB
└──────────────────────────────────────────────┘
```

#### 3.6.2 目的地卡片结构

每张卡片包含：
- 封面区域：渐变背景（根据国家生成独特色调）+ 国旗 emoji 48px
- 右上角：书签按钮（Forest Green 填充，显示已保存城市数）
- 国家名：Newsreader 28px, text-primary
- 描述行：代表性城市名称，Inter 11px, text-tertiary
- 底部区域：渐变遮罩（透明 → rgba(0,0,0,0.4)），显示 "N saved cities"

#### 3.6.3 卡片展开状态

点击卡片展开，显示已保存的城市列表：

```
┌──────────────────────────────────────┐
│  🇮🇸 Iceland                        │
│  ┌─────────────────────────────────┐ │
│  │ Reykjavik            [×]       │ │
│  │ Northern Lights tour           │ │ ← 备注
│  ├─────────────────────────────────┤ │
│  │ Akureyri              [×]      │ │
│  │ Hot springs                    │ │
│  ├─────────────────────────────────┤ │
│  │ Vík                   [×]      │ │
│  │ Black sand beach               │ │
│  ├─────────────────────────────────┤ │
│  │ + Add city                     │ │
│  └─────────────────────────────────┘ │
│  [Save Note: ___________________ ]   │
└──────────────────────────────────────┘
```

#### 3.6.4 交互行为

| 操作 | 行为 |
|------|------|
| Click [Countries]/[Cities] | 切换分类视图 |
| Click 卡片 | 展开/收起城市列表（height auto 动画 300ms） |
| Click [×] 城市 | 移除已保存城市 |
| Click "+ Add city" | 展开内联输入框 |
| Click [+ Add Destination] FAB | 弹出搜索浮层：输入国家/城市名 → 选择添加 |
| Hover 卡片 | 封面 scale(1.04)，渐变遮罩上移 |

---

## 4. 组件规范

### 4.1 组件分类

#### 基础 UI 组件（可复用）

| 组件名 | 用途 | 变体 |
|--------|------|------|
| `BaseButton` | 通用按钮 | Primary / Secondary / Ghost / Danger + sm/md/lg |
| `BaseCard` | 通用卡片容器 | Default / Photo / Flight / Destination |
| `BaseChip` | 标签/筛选 Chip | Active / Default / Wishlist |
| `BaseInput` | 文本输入框 | 底部边框风格 |
| `NavPill` | 顶部浮动导航 | 含 NavItem 子项 |
| `Toast` | 操作反馈通知 | Success / Error / Info |
| `Lightbox` | 照片全屏查看 | 含 EXIF 信息 + 左右导航 |
| `EmptyState` | 空状态占位 | 图标 + 文字 + CTA 按钮 |
| `LoadingSpinner` | 加载中 | Sunset Orange pulse 动画 |
| `ConfirmDialog` | 确认对话框 | Danger / Warning 变体 |
| `PhotoUploader` | 照片上传区域 | 拖拽支持 + 多选 |
| `MarkdownEditor` | Markdown 编辑器 | 编辑/预览双栏 |

#### 业务组件（页面内使用）

| 组件名 | 用途 | 使用页面 |
|--------|------|----------|
| `Globe3D` | Globe.GL 3D 地球 | GlobeHome |
| `StatsHUD` | 统计数字面板 | GlobeHome |
| `RecentTripStrip` | 最近旅行水平滚动条 | GlobeHome |
| `TripMiniCard` | 旅行缩略卡片 | GlobeHome, CountryDetail |
| `CountryMap` | Leaflet 国家地图 | CountryDetail |
| `CityMarker` | 城市标点（地图） | CountryDetail, TripDetail |
| `RouteLine` | 路线连线（地图） | CountryDetail, TripDetail |
| `PhotoGrid` | 不规则照片网格 | CountryDetail, TripDetail |
| `PhotoCard` | 单张照片 | PhotoGrid, Lightbox |
| `TripCard` | 旅行列表卡片 | CountryDetail, Timeline |
| `FlightCard` | 登机牌卡片 | TripDetail |
| `DayTimelineStrip` | 天时间线水平滚动 | TripDetail |
| `NotesSection` | 手记展示区 | TripDetail |
| `RouteEditor` | 路线编辑器 | TripEditor |
| `YearFilter` | 年份筛选 Pill 组 | Timeline |
| `TimelineList` | 时间线列表 | Timeline |
| `YearGroup` | 年份分组 | Timeline |
| `DestinationCard` | 目的地卡片 | Wishlist |
| `ContextGlobe` | 右下角小地球 | CountryDetail, TripDetail |
| `QuickActions` | 快捷操作面板 | GlobeHome |

### 4.2 组件设计规范细则

#### BaseButton

```
尺寸：
  sm: padding 6px 14px, font 12px
  md (default): padding 10px 20px, font 14px
  lg: padding 14px 28px, font 16px

变体：
  Primary:    bg=--color-sunset, color=white, hover: bg=--color-sunset-glow + sunse-glow-shadow
  Secondary:  bg=transparent, color=--text-secondary, border=1px rgba(0,0,0,0.10), hover: bg=--color-card-hover
  Ghost:      bg=transparent, color=--text-secondary, hover: bg=--color-card-hover
  Danger:     bg=--color-danger, color=white, hover: bg=#c43e3e

所有按钮：border-radius=--radius-full, font-weight=500, transition=150ms
active 态：scale(0.98) 按压反馈
disabled 态：opacity=0.5, cursor=not-allowed
```

#### BaseCard

```
Default:
  bg=--color-card, border-radius=--radius-md
  padding=20px (--card-padding)
  box-shadow=--shadow-card
  border=1px solid rgba(0,0,0,0.06)
  hover: shadow=--shadow-card-hover, translateY(-2px)

Photo:
  无背景、无阴影、无边框
  border-radius=--radius-md
  overflow=hidden
  hover: scale(1.02) + shadow 出现

Flight:
  继承 Default
  border-top=4px solid --flight-accent

Destination:
  bg=封面图，叠加渐变遮罩
  border-radius=--radius-md, overflow=hidden
  文字反白在底部
```

#### NavPill

```
位置：顶部居中浮动（position: fixed, top: 16px, left: 50%, translateX(-50%)）
尺寸：padding 8px 24px
外观：bg=--color-card, shadow=--shadow-card, border-radius=--radius-full, border=1px rgba(0,0,0,0.06)

内部 NavItem：
  padding: 6px 14px, border-radius: 16px (--radius-full)
  图标 + 文字标签，间距 6px
  默认：color=--text-secondary, bg=transparent
  选中：bg=--color-sunset 10% opacity, color=--color-sunset, border=0.5px --color-sunset 40% opacity
  hover：color=--text-primary

页面特定颜色：Wishlist 页选中态用 --color-forest 替代 --color-sunset
```

#### FlightCard

```
卡片内部布局（从上到下）：
  1. 顶部 4px 蓝色条（position: absolute, top:0, left:0, right:0 或 border-top）
  2. Row: 航司名 (Inter 14px, text-secondary) + spacer + 航班号 (Mono 18px, text-primary)
  3. 机型 (Inter 12px, text-tertiary)
  4. Row: DEP code (Mono 14px) + 虚线 + ARR code (Mono 14px)
  5. Row: 城市名 (Inter 12px, text-tertiary)
  6. Row: 起飞时间 (Mono 20px, text-primary) + Ocean 圆点线 + 降落时间
  7. Row: 起飞日期 + 时长 badge + 降落日期 (all Inter 10px, text-tertiary)
  8. 居中: 时长 (Mono 16px, text-primary)
  9. 居中: 经停信息 (Inter 12px, text-tertiary)

TimeBar 细节：
  使用 Ocean Blue 圆点（6px） + 横线连接两个时间
  线宽 1px, Ocean Blue 60% opacity

多航班堆叠：
  间距 12px
  每张卡片微旋转 ±0.5°（伪随机交替）
  hover 时回正 + z-index 提升
```

#### PhotoGrid

```
CSS Grid:
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
  grid-auto-flow: dense
  gap: 8px (--photo-grid-gap)

图片比例混合：
  3:2 (横版) — grid-column: span 2
  2:3 (竖版) — grid-row: span 2
  1:1 (方形) — 默认

图片：
  object-fit: cover, width: 100%, height: 100%
  border-radius: 14px
  无边框、无阴影
  hover: scale(1.02), box-shadow 出现, transition 200ms
```

#### Lightbox

```
背景：rgba(0,0,0,0.92)（纯暗色，不用 blur）

图片：居中全屏展示，max-width: 90vw, max-height: 85vh

信息栏（底部居中胶囊）：
  bg=rgba(255,255,255,0.08), border-radius=--radius-full
  显示：日期 · 地点 · 相机型号（如有 EXIF）
  Inter 12px, text-inverse 80%

导航箭头（左右两侧）：
  半透明圆 bg=rgba(255,255,255,0.12)
  hover: bg=rgba(255,255,255,0.25)
  icon: ChevronLeft / ChevronRight, 24px

关闭方式：
  - 点击背景区域
  - 按 Escape 键
  - 点击右上角 × 按钮

动画：
  展开 350ms ease-spring（从网格位置 scale + translate 到全屏）
  关闭 250ms ease-in（collapse 回原位）
```

#### Toast

```
位置：顶部居中（top: 24px, left: 50%, translateX(-50%)）
外观：bg=--color-card, shadow=--shadow-modal, border-radius=--radius-full
      padding: 10px 20px, gap: 8px

内容：icon (16px) + message (Inter 14px)

变体：
  Success: CheckCircle2 (Forest Green) + "操作成功" 
  Error:   AlertCircle (Danger) + "操作失败"
  Info:    Info (Ocean Blue) + 信息提示

动画：从顶部滑入（translateY: -100% → 0, 250ms ease-out）
      停留 3s
      上滑消失（250ms ease-in）

可手动点击×关闭
```

---

## 5. 数据模型

### 5.1 数据库表结构

#### countries — 国家信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BIGINT PK AUTO_INCREMENT | 主键 |
| `code` | VARCHAR(3) UNIQUE NOT NULL | ISO 3166-1 alpha-3（如 FRA, JPN） |
| `name` | VARCHAR(100) NOT NULL | 英文名（如 France） |
| `name_cn` | VARCHAR(100) | 中文名（如 法国） |
| `flag_emoji` | VARCHAR(10) | 国旗 emoji（如 🇫🇷） |
| `continent` | VARCHAR(20) | 大洲 |
| `created_at` | DATETIME DEFAULT NOW() | 创建时间 |
| `updated_at` | DATETIME DEFAULT NOW() ON UPDATE | 更新时间 |

#### trips — 旅行记录

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BIGINT PK AUTO_INCREMENT | 主键 |
| `user_id` | BIGINT NOT NULL DEFAULT 1 | 用户 ID（MVP 硬编码） |
| `title` | VARCHAR(200) | 旅行标题 |
| `country_code` | VARCHAR(3) NOT NULL | 关联国家 |
| `start_date` | DATE NOT NULL | 开始日期 |
| `end_date` | DATE NOT NULL | 结束日期 |
| `notes_md` | TEXT | Markdown 手记 |
| `is_deleted` | TINYINT DEFAULT 0 | 逻辑删除 |
| `created_at` | DATETIME DEFAULT NOW() | |
| `updated_at` | DATETIME DEFAULT NOW() ON UPDATE | |

索引：`idx_user_id`, `idx_country_code`, `idx_start_date`

#### trip_cities — 旅行城市

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BIGINT PK AUTO_INCREMENT | |
| `trip_id` | BIGINT NOT NULL | 关联旅行 |
| `city_name` | VARCHAR(100) NOT NULL | 城市名 |
| `lat` | DECIMAL(10,7) | 纬度 |
| `lng` | DECIMAL(10,7) | 经度 |
| `sort_order` | INT DEFAULT 0 | 城市在旅行中的顺序 |
| `created_at` | DATETIME DEFAULT NOW() | |

索引：`idx_trip_id`

#### trip_routes — 旅行路线段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BIGINT PK AUTO_INCREMENT | |
| `trip_id` | BIGINT NOT NULL | 关联旅行 |
| `from_city_id` | BIGINT NOT NULL | 出发城市 ID（关联 trip_cities） |
| `to_city_id` | BIGINT NOT NULL | 到达城市 ID（关联 trip_cities） |
| `transport_type` | VARCHAR(20) NOT NULL | FLIGHT / TRAIN / CAR / OTHER |
| `sort_order` | INT DEFAULT 0 | 路线段顺序 |
| `created_at` | DATETIME DEFAULT NOW() | |

索引：`idx_trip_id`

#### flights — 航班信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BIGINT PK AUTO_INCREMENT | |
| `route_id` | BIGINT NOT NULL | 关联路线段（transport_type=FLIGHT） |
| `flight_no` | VARCHAR(20) | 航班号（如 AF111） |
| `airline` | VARCHAR(100) | 航空公司 |
| `aircraft` | VARCHAR(50) | 机型（如 Boeing 777-300ER） |
| `departure_time` | DATETIME | 起飞时间 |
| `arrival_time` | DATETIME | 降落时间 |
| `departure_airport` | VARCHAR(10) | 出发机场代码（如 PVG） |
| `arrival_airport` | VARCHAR(10) | 到达机场代码（如 CDG） |
| `created_at` | DATETIME DEFAULT NOW() | |

索引：`idx_route_id`

#### photos — 照片

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BIGINT PK AUTO_INCREMENT | |
| `trip_id` | BIGINT NOT NULL | 关联旅行 |
| `url` | VARCHAR(500) NOT NULL | 文件路径/URL |
| `caption` | VARCHAR(500) | 照片说明 |
| `taken_at` | DATETIME | 拍摄时间（EXIF） |
| `sort_order` | INT DEFAULT 0 | 排序 |
| `created_at` | DATETIME DEFAULT NOW() | |

索引：`idx_trip_id`

#### wishlist — 想去清单

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BIGINT PK AUTO_INCREMENT | |
| `user_id` | BIGINT NOT NULL DEFAULT 1 | 用户 ID |
| `type` | VARCHAR(10) NOT NULL | COUNTRY / CITY |
| `country_code` | VARCHAR(3) | 国家代码 |
| `city_name` | VARCHAR(100) | 城市名（type=CITY 时） |
| `note` | VARCHAR(500) | 备注 |
| `is_deleted` | TINYINT DEFAULT 0 | |
| `created_at` | DATETIME DEFAULT NOW() | |

索引：`idx_user_id`, `idx_type`

### 5.2 实体关系

```
countries  1──N  trips
trips      1──N  trip_cities
trips      1──N  trip_routes
trips      1──N  photos
trip_cities 1──N  trip_routes (as from_city / to_city)
trip_routes 1──1  flights (when transport_type=FLIGHT)
countries  1──N  wishlist (when type=COUNTRY)
```

---

## 6. API 规范

### 6.1 通用规范

- **Base URL：** `/api`
- **请求格式：** JSON（除文件上传用 multipart/form-data）
- **响应格式：**

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

- **分页响应：**

```json
{
  "code": 200,
  "data": {
    "records": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

- **错误响应：**

```json
{
  "code": 400,
  "message": "具体错误信息",
  "data": null
}
```

- **HTTP 状态码：** 200 成功, 201 创建成功, 400 参数错误, 404 不存在, 500 服务器错误
- **认证：** MVP 阶段不做 JWT 校验，所有请求视为 user_id=1

### 6.2 接口列表

#### 国家

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/countries` | 获取国家列表（支持 ?q= 搜索） |
| `GET` | `/api/countries/visited` | 获取已访问/想去的国家（供地球 Overlay 着色） |
| `GET` | `/api/countries/:code` | 获取国家详情（含统计） |
| `GET` | `/api/countries/:code/cities` | 获取该国的城市标点数据 |
| `GET` | `/api/countries/:code/trips` | 获取该国的旅行列表 |
| `GET` | `/api/countries/:code/photos` | 获取该国的照片（分页） |

#### 旅行

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/trips` | 获取旅行列表（支持 ?limit= & ?country=） |
| `POST` | `/api/trips` | 创建新旅行 |
| `GET` | `/api/trips/:id` | 获取旅行详情（含路线、城市、航班） |
| `PUT` | `/api/trips/:id` | 更新旅行信息 |
| `DELETE` | `/api/trips/:id` | 删除旅行（逻辑删除） |
| `GET` | `/api/trips/:id/routes` | 获取旅行路线段 |
| `GET` | `/api/trips/:id/flights` | 获取旅行航班信息 |

#### 照片

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/trips/:id/photos` | 获取旅行照片列表 |
| `POST` | `/api/trips/:id/photos` | 上传照片（multipart，支持批量） |
| `PUT` | `/api/photos/:id` | 更新照片信息（标题、排序） |
| `DELETE` | `/api/photos/:id` | 删除照片 |

#### 手记

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/trips/:id/notes` | 获取手记内容 |
| `PUT` | `/api/trips/:id/notes` | 更新手记（Markdown 文本） |

#### 想去清单

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/wishlist` | 获取想去清单（?type=COUNTRY|CITY） |
| `POST` | `/api/wishlist` | 添加想去 |
| `DELETE` | `/api/wishlist/:id` | 删除想去 |

#### 统计

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/stats` | 获取全局统计（国家数、城市数、旅行数、总天数） |

### 6.3 关键数据格式示例

#### `GET /api/countries/visited` 响应

```json
{
  "code": 200,
  "data": {
    "visited": [
      { "code": "FRA", "name": "France", "visitCount": 3, "lastVisit": "2024-10-12" },
      { "code": "JPN", "name": "Japan", "visitCount": 1, "lastVisit": "2025-03-15" }
    ],
    "wishlist": [
      { "code": "ISL", "name": "Iceland", "citiesCount": 12 },
      { "code": "PER", "name": "Peru", "citiesCount": 5 }
    ]
  }
}
```

#### `POST /api/trips` 请求

```json
{
  "countryCode": "FRA",
  "startDate": "2024-10-12",
  "endDate": "2024-10-19",
  "cities": [
    { "name": "Paris", "lat": 48.8566, "lng": 2.3522, "sortOrder": 1 },
    { "name": "Lyon", "lat": 45.7640, "lng": 4.8357, "sortOrder": 2 }
  ],
  "routes": [
    {
      "fromCityIndex": 0, "toCityIndex": 1,
      "transportType": "TRAIN",
      "flight": null
    }
  ],
  "notesMd": "## Day 1: Arrival\n..."
}
```

---

## 7. 交互与动画规范

### 7.1 动画哲学

从 VisionOS 的"科技感浮动"改为**自然、轻柔的旅行节奏**：

| 原则 | 说明 |
|------|------|
| 不让用户等待 | 所有动画 ≤ 400ms（除地球旋转和路线绘制） |
| 一个元素一个方向 | 列表从下方入、面板从右侧入、header 从上方入——保持空间感 |
| 照片优先 | 照片加载有 stagger 淡入，模拟翻相册 |
| 地图要稳 | 地图平移/缩放用 ease-in-out，不抢眼 |

### 7.2 缓动函数

| Token | 值 | 使用场景 |
|-------|-----|----------|
| `--ease-default` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | 标准过渡（hover 态切换） |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 元素入场 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 元素退场 |
| `--ease-spring` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | 卡片 hover、光箱展开 |
| `--ease-globe` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 地球旋转/缩放 |

### 7.3 时长标准

| 动画类型 | 时长 | 缓动 |
|----------|------|------|
| Hover 态切换 | 150ms | ease-default |
| 页面入场 | 300ms | ease-out |
| 页面退场 | 200ms | ease-in |
| 卡片 stagger | 每张 +60ms | ease-out |
| 地球旋转 | 800ms | ease-globe |
| 路线绘制 | 1000ms | ease-in-out |
| 光箱展开 | 350ms | ease-spring |
| 光箱关闭 | 250ms | ease-in |
| 数字滚动（odometer） | 400ms | ease-globe |
| Toast 进出 | 250ms | ease-out / ease-in |
| 卡片展开/收起 | 300ms | ease-out |

### 7.4 页面过渡规范

所有页面切换使用 Vue Router `transition`，`mode="out-in"`：

```
页面入场：opacity 0→1 + translateY(12px→0)，300ms ease-out
页面退场：opacity 1→0 + translateY(0→-8px)，200ms ease-in
```

### 7.5 照片加载序列

```
0ms    页面结构渲染完成
100ms  照片开始加载（每张 +40ms stagger）
200ms  照片 opacity 0→1 + translateY(8px→0)
大图（封面图、Hero 图）优先加载，缩略图延迟
```

### 7.6 微交互清单

| 元素 | 交互 | 视觉反馈 |
|------|------|----------|
| 按钮 Hover | 背景色切换 | 150ms 过渡 |
| 按钮 Active | 按压反馈 | scale(0.98) |
| 卡片 Hover | 抬起 + 阴影加深 | translateY(-2px), 200ms |
| 数字变化 | odometer 滚动效果 | 400ms ease-globe |
| Toast 通知 | 顶部滑入 → 停留 3s → 上滑消失 | 250ms |
| Loading | Sunset Orange pulse 光环 | infinite 循环 |
| Empty State | 插图 + 文字 + CTA | 静态 |
| 删除确认 | 卡片 shake → 变红 → 缩小消失 | 400ms |
| 照片上传 | 拖入区域发光 → 进度条 | — |
| 地球 Hover 国家 | 边缘发光 2px + tooltip 浮出 | 200ms |
| 地图标点 Hover | 城市名浮起 + pulse 环 | 200ms |

---

## 8. 技术架构

### 8.1 技术栈

#### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Java | 21 | 运行环境 |
| Spring Boot | 3.x | Web 框架 |
| MyBatis-Plus | 3.x | ORM |
| MySQL | 8.x | 主数据库 |
| Redis | 7.x | 缓存 |
| Maven | 3.x | 构建工具 |

#### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.x | UI 框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x / Rolldown | 构建工具 |
| Element Plus | 2.x | UI 组件库（需主题覆盖） |
| Axios | 1.x | HTTP 客户端 |
| Vue Router | 4.x | 路由 |
| Pinia | 2.x | 状态管理 |
| Globe.GL / Three.js | latest | 3D 地球渲染（多边形着色 + 交互） |
| Leaflet | 1.x | 2D 地图（国家/旅行详情页） |
| Lucide Icons | latest | 图标库 |
| marked | latest | Markdown 渲染 |

### 8.2 架构分层

#### 后端分层

```
Controller  → 接收请求、参数校验、返回响应
    ↓
Service     → 业务逻辑、事务管理、缓存策略
    ↓
Mapper      → 数据访问（MyBatis-Plus）
    ↓
Database    → MySQL + Redis
```

规则：
- Controller 不包含业务逻辑
- Service 不直接操作 HttpServletRequest/Response
- Mapper 只做数据访问，不写业务判断
- 跨 Service 调用通过依赖注入

#### 前端分层

```
Pages         → 页面组装，组合业务组件
    ↓
Components    → 业务组件 + 基础 UI 组件
    ↓
Composables   → 可复用逻辑（usePhoto, useGlobe, useMap...）
    ↓
Stores        → Pinia 全局状态（user, trips 缓存）
    ↓
API (Axios)   → HTTP 请求封装
```

### 8.3 目录结构

#### 后端（`backend/`）

```
backend/
├── src/main/java/com/travelatlas/
│   ├── TravelAtlasApplication.java
│   ├── config/              # 配置类（CORS, MyBatis, Redis）
│   ├── controller/          # REST 控制器
│   ├── service/             # 业务服务接口
│   │   └── impl/            # 业务服务实现
│   ├── mapper/              # MyBatis-Plus Mapper
│   ├── entity/              # 实体类
│   ├── dto/                 # 数据传输对象
│   ├── vo/                  # 视图对象（响应）
│   └── common/              # 通用（Result, ExceptionHandler, Constants）
├── src/main/resources/
│   ├── application.yml
│   └── mapper/              # MyBatis XML（如需复杂 SQL）
└── pom.xml
```

#### 前端（`frontend/`）

```
frontend/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── style.css                   # 全局样式 + Design Tokens
│   ├── router/index.ts
│   ├── pages/                      # 页面组件
│   │   ├── GlobeHome.vue
│   │   ├── CountryDetail.vue
│   │   ├── TripDetail.vue
│   │   ├── TripEditor.vue
│   │   ├── Timeline.vue            # v0.2
│   │   └── Wishlist.vue
│   ├── components/
│   │   ├── base/                   # 基础 UI 组件
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseCard.vue
│   │   │   ├── BaseChip.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── Toast.vue
│   │   │   ├── Lightbox.vue
│   │   │   ├── EmptyState.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── ConfirmDialog.vue
│   │   ├── globe/                  # 3D 地球相关
│   │   │   └── Globe3D.vue
│   │   ├── map/                    # 地图相关
│   │   │   ├── CountryMap.vue
│   │   │   ├── CityMarker.vue
│   │   │   └── RouteLine.vue
│   │   ├── trip/                   # 旅行相关
│   │   │   ├── TripMiniCard.vue
│   │   │   ├── TripCard.vue
│   │   │   ├── FlightCard.vue
│   │   │   ├── DayTimelineStrip.vue
│   │   │   └── RouteEditor.vue
│   │   ├── photo/                  # 照片相关
│   │   │   ├── PhotoGrid.vue
│   │   │   ├── PhotoCard.vue
│   │   │   └── PhotoUploader.vue
│   │   ├── timeline/               # 时间轴相关
│   │   │   ├── YearFilter.vue
│   │   │   ├── TimelineList.vue
│   │   │   └── YearGroup.vue
│   │   ├── wishlist/               # 想去清单相关
│   │   │   └── DestinationCard.vue
│   │   ├── NavPill.vue
│   │   ├── StatsHUD.vue
│   │   ├── RecentTripStrip.vue
│   │   ├── ContextGlobe.vue
│   │   ├── NotesSection.vue
│   │   └── MarkdownEditor.vue
│   ├── composables/                # 可复用逻辑
│   │   ├── useGlobe.ts
│   │   ├── useMap.ts
│   │   ├── usePhoto.ts
│   │   ├── useTheme.ts
│   │   └── useToast.ts
│   ├── stores/                     # Pinia 状态
│   │   ├── app.ts
│   │   └── trips.ts
│   ├── api/                        # Axios 请求封装
│   │   ├── client.ts               # Axios 实例
│   │   ├── countries.ts
│   │   ├── trips.ts
│   │   ├── photos.ts
│   │   ├── wishlist.ts
│   │   └── stats.ts
│   ├── types/                      # TypeScript 类型定义
│   │   ├── country.ts
│   │   ├── trip.ts
│   │   ├── photo.ts
│   │   └── common.ts
│   └── utils/                      # 工具函数
│       ├── date.ts                 # 日期格式化
│       ├── geo.ts                  # 地理计算
│       └── format.ts               # 数字/文字格式化
├── public/
│   └── geojson/                    # 静态 GeoJSON 数据
│       └── countries-110m.json
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 9. 实现路线图

### 9.1 MVP v0.1（进行中 — 已回退到 Phase 6 基线）

#### 已完成（Phase 0–6）

| 周 | 任务 | 状态 |
|----|------|------|
| 1–2 | 前端项目骨架（Vue 3 + Vite + Router + Pinia）；原子组件库（AppButton/AppCard/…）；布局模板（FullBleed/TwoColumn/…）；TripEditor 表单 | ✅ |
| 3–4 | Globe3D 渲染（globe.gl + GeoJSON 国家 Overlay）；国家颜色映射（去过/想去/未去）；ContextGlobe 小地球；地球 hover/click 交互 | ✅ 部分完成 |

#### 未开始（Phase 6 遗留 + v0.2）

| 任务 | 说明 | 版本 |
|------|------|------|
| useMap + CountryMap + CityMarker + RouteLine | Leaflet 2D 地图组件 | Phase 6 遗留 |
| GlobeHome 首页 | StatsPanel + TripMiniCard + 入场动画 | v0.2 |
| CountryDetail 国家详情 | 地图 + 照片 + 旅行列表 | v0.2 |
| TripDetail 旅行详情 | 航班卡片 + 时间线 + 手记 | v0.2 |
| Wishlist 想去清单 | 目的地卡片 + 分类 | v0.2 |
| 照片上传 + Lightbox | 压缩/上传/全屏浏览 | v0.2 |
| 后端 Spring Boot + MySQL | 数据层 | v0.2 |
| Bug 修复 + 样式打磨 | 深色主题 + 边界状态 | v0.2 |

### 9.2 v0.2+ 功能队列

| 优先级 | 功能 | 预计工时 |
|--------|------|----------|
| P0 | Timeline 时间轴页面 | 3 天 |
| P0 | 飞行轨迹回放动画（航班卡片 → 地球弧线） | 3 天 |
| P0 | 旅行统计面板（`/stats`） | 2 天 |
| P0 | Trip 页路线高亮动效 | 1 天 |
| P1 | 批量导入照片（按 EXIF 自动归类） | 3 天 |
| P1 | 响应式适配（Tablet + Mobile） | 5 天 |
| P2 | 导出旅行报告（图片/PDF） | 3 天 |
| P2 | 用户系统（注册/登录/JWT） | 3 天 |
| P2 | 好友系统（关注/查看好友地球） | 5 天 |

---

## 10. 开发约定

### 10.1 代码规范

- Java：遵循标准 Java 命名规范，Service 接口 + Impl 实现
- TypeScript：启用 strict 模式，使用 interface 定义数据结构
- Vue：使用 `<script setup lang="ts">`，Composition API
- CSS：使用 `:root` 变量，不写硬编码颜色值
- 中文注释（复杂逻辑），英文标识符
- 小函数（≤ 50 行），清晰命名，Early return

### 10.2 Git 规范

- 分支：`main`（稳定） + `dev`（开发）
- 功能分支：`feature/xxx`（如 `feature/globe-render`）
- Commit 信息：中文描述，简明扼要
- 每次 commit 对应一个完整的功能点或 bug 修复

### 10.3 状态处理原则

**每个页面必须覆盖以下 4 种状态：**

| 状态 | 处理方式 |
|------|----------|
| Loading | 骨架屏/Spinner（Sunset Orange pulse） |
| Empty | EmptyState 组件 + CTA 引导 |
| Error | 错误提示 + Retry 按钮 |
| Success | 正常内容展示 |

### 10.4 性能要求

- 照片懒加载（Intersection Observer）
- 路由懒加载（Vue Router dynamic import）
- Leaflet 地图组件按需加载
- 照片上传前客户端压缩（最大宽度 2400px）
- 适当使用 Redis 缓存接口数据（国家列表、统计数据）

### 10.5 MVP 简化策略

- 不做用户系统：硬编码 `user_id = 1`
- 不做 OSS：照片存 `uploads/` 目录，Spring Boot 静态资源映射
- 不做响应式：MVP 仅供 Desktop 1280px+
- 不做动画：飞行轨迹回放放 v0.2
- 国家 GeoJSON 数据从 Natural Earth 下载 110m 精度（约 1–2MB），放前端 public 目录
- 城市坐标用静态 JSON 文件维护，不接地理编码 API
- 地图瓦片使用免费 CartoDB，不依赖任何付费外部服务

### 10.6 安全注意事项

- 所有 API 参数必须后端二次校验
- 照片上传限制文件类型和白名单扩展名
- 照片上传限制单文件大小（≤ 10MB）
- 防范 XSS：Markdown 渲染时 sanitize HTML
- 防范 SQL 注入：使用 MyBatis-Plus 参数化查询

### 10.7 Element Plus 主题覆盖

通过 CSS 变量覆盖 Element Plus 默认主题，使其符合本规范：

- 主色：`--el-color-primary` → `--color-sunset`
- 字体：`--el-font-family` → `--font-body`
- 圆角：`--el-border-radius-base` → `--radius-sm`
- 按钮组件需额外覆盖 border-radius 为 `--radius-full`

---

> **本规范最后更新：2026-07-21（回退到 P6 基线）**  
> **当前状态：Phase 0–5 完成，Phase 6 部分完成（Globe ✅，Map ➖）**  
> **当前页面：Timeline（骨架）、TripEditor、Playground**  
> **下一个里程碑：完成 Phase 6 地图组件 → 进入 v0.2 页面开发**
