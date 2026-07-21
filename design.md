# Travel Atlas — 设计规范

> **视觉方向：** Polarsteps 的旅行叙事 + Apple Maps 的克制清晰 + Flighty 的精致排版
> **核心情绪：** 温暖、自然、照片沉浸、旅途感
> **适用范围：** 所有页面和组件的唯一设计规范来源

---

## 0. 设计理念

### 0.1 三个支柱

| 支柱 | 来源 | 关键词 |
|------|------|--------|
| 旅行叙事 | Polarsteps | 照片第一、时间线故事、温暖手记感 |
| 地图克制 | Apple Maps | 浅色底图、最少标注、让数据说话 |
| 信息精致 | Flighty | 航班卡片如登机牌、数据排版考究、Mono 数字 |

### 0.2 从 VisionOS 到旅行本能的转变

| 维度 | 旧 (VisionOS) | 新 (Polarsteps × Maps × Flighty) |
|------|---------------|----------------------------------|
| 底色 | Space Black #06060D | 暖灰白 / 日出暖米色系 |
| 面板 | 玻璃 blur + 半透明 | 实色白卡片 + 细微阴影 |
| 强调色 | Gold #D4A14B | 日落橙 → 深蓝渐变（按时间/场景） |
| 地球 | 暗黑星空背景 | 浅灰蓝海洋 + 暖色陆地 |
| 字体 | Playfair Display | 有温度的衬线（Newsreader） |
| 照片 | 小网格 + hover 放大 | 大图铺陈、边缘出血、沉浸浏览 |
| 暗模式 | 纯黑底 | 深蓝灰底（#1C1E22），保留暖色 |

---

## 1. Color Tokens

### 1.1 浅色主题（默认）

```
背景层级
───────
Page Background      #F5F2ED    暖米白底色（像纸）
Card Background      #FFFFFF    纯白卡片
Card Elevated        #FAFAFA    卡片 hover 抬起
Sheet Background     #FBF9F6    底部 sheet / 大面板

文字
───────
Text Primary         #1C1E22    接近黑，不刺眼
Text Secondary       #6B6E77    中灰
Text Tertiary        #999CA6    浅灰，辅助信息
Text Inverse         #FFFFFF    深色背景上反白

强调色
───────
Sunset Orange        #E8714A    主 CTA、去过、当前选中
Sunset Glow          #F0A080    柔和态、hover
Ocean Blue           #3B7EC7    路线、航班、链接
Ocean Deep           #2A5F9A    路线静态态
Forest Green         #4A9C7C    想去、收藏、自然相关
Forest Light         #6DBA9A    green hover

地图专用
───────
Land Full            #F0E8D8    陆地默认色
Land Visited         #E8C9A0    去过国家（暖金米色，非金色）
Land Wishlist        #C5D8C0    想去国家（灰绿）
Water               #E8EDF2    海洋浅蓝灰
Water Dark          #D0D8E3    深海区域

航班卡片
───────
Flight Card Bg       #FFFFFF
Flight Accent        #4468B2    登机牌蓝色条
Flight Divider       #E8E8EC    虚线分隔

语义色
───────
Danger               #D94848    删除
Warning              #E8993A    警告
Success              #4A9C7C    成功
Info                 #3B7EC7    信息
```

### 1.2 深色主题

```
背景层级
───────
Page Background      #1C1E22    深蓝灰
Card Background      #262830
Card Elevated        #2E303A
Sheet Background     #22242A

文字
───────
Text Primary         #EBEBED
Text Secondary       #9B9DA5
Text Tertiary        #6B6D75

强调色（深色下提高亮度）
───────
Sunset Orange        #F08060
Sunset Glow          #F5B090
Ocean Blue           #5B9ED8
Ocean Deep           #7AB8E8
Forest Green         #5DBA90
Forest Light         #80D0AB

地图专用
───────
Land Visited         #C89870
Land Wishlist        #90A890
Water               #2A3040
Water Dark          #222838
```

### 1.3 功能色映射

| 语义 | 颜色 | 用途 |
|------|------|------|
| Visited / Active | Sunset Orange | 去过标记、选中态、主按钮 |
| Route / Link | Ocean Blue | 路线、航班、可点击 |
| Wishlist / Save | Forest Green | 收藏、想去、书签 |
| Danger / Delete | Danger | 删除确认 |
| Neutral / Muted | Text Tertiary | 未访问、禁用 |

---

## 2. Typography Scale

### 2.1 字体族

| 角色 | 字体 | 风格 | 用途 |
|------|------|------|------|
| Display | **Newsreader** (400, 500, 600) | 温暖衬线，有书写感 | 国家名、城市名、大数字、手记标题 |
| Body | **Inter** (300–600, variable) | 清晰现代、屏幕可读 | 正文、标签、UI 控件、数据 |
| Mono | **JetBrains Mono** (400, 500) | 等宽、数据感 | 航班号、坐标、时长、统计数字 |

> 相比旧版的 Playfair Display，Newsreader 更现代、更易读，同时保留旅行日记的"书写感"，不会显得过于装饰性。

### 2.2 字号阶梯

```
Display XL     56px / 1.1    首页 Hero 数字、年份大标题
Display LG     40px / 1.15   国家名（Country 页）
Display MD     32px / 1.2    城市名（Trip 页）
Display SM     24px / 1.25   卡片标题、手记标题

Body XL        20px / 1.5    导语、卡片摘要
Body LG        18px / 1.5    正文段落
Body MD        16px / 1.5    标准 UI 文本
Body SM        14px / 1.45   辅助信息、标签
Body XS        12px / 1.4    日期戳、元数据

Mono LG        20px / 1.3    统计大数字、航班号
Mono MD        16px / 1.3    时长、距离
Mono SM        14px / 1.3    坐标、时间戳
```

### 2.3 字重使用规则

- Newsreader 400 用于正文级标题，500 用于卡片标题，600 用于 Hero
- Inter 400 正文，500 标签/按钮，600 强调
- JetBrains Mono 400 数据标签，500 重要数字

---

## 3. Spacing

### 3.1 基础单位

以 4px 为基准，所有间距为 4 的倍数。

```
Space XS     4px     紧凑内边距、icon 与文字间距
Space SM     8px     列表项间距、标签 gap
Space MD     16px    卡片内边距、标准间隙
Space LG     24px    段落间距、卡片间距
Space XL     32px    页面区块间距
Space 2XL    48px    Hero 区 / 大标题上下
Space 3XL    64px    页面级分隔
```

### 3.2 页面布局间距

```
Page Padding        32px     页面边缘到内容
Card Padding        20px     卡片内部（比旧版 16px 更宽松）
Card Gap            20px     卡片网格间隙
Photo Grid Gap      8px      照片墙间隙（紧凑沉浸感）
Section Gap         48px     页面内大区块间距
```

### 3.3 圆角

```
Radius SM    8px     内部元素、标签、小按钮
Radius MD    14px    标准卡片（比旧版 16px 稍紧，Apple 风格）
Radius LG    20px    大卡片、模态
Radius XL    28px    特大面板
Radius Full  9999px  Pill、按钮、选择器
```

- 照片卡片：Radius MD（14px），内图填满无边距
- 航班卡片：Radius MD + 顶部蓝色条

---

## 4. Shadows & Elevation

VisionOS 的玻璃模糊 → 改为自然的卡片阴影系统。

```
Elevation 0   无阴影           平地（页面背景）
Elevation 1   0 1px 3px rgba(0,0,0,0.06)    卡片默认
Elevation 2   0 4px 12px rgba(0,0,0,0.08)   卡片 hover
Elevation 3   0 8px 24px rgba(0,0,0,0.10)   模态 / Sheet
Elevation 4   0 16px 48px rgba(0,0,0,0.14)   最高层（极少用）
```

深色模式下阴影改为 `rgba(0,0,0,0.30)` 系列。

无 blur 背景。面板用纯色 + 细边框（`border: 1px solid rgba(0,0,0,0.06)`）。

---

## 5. Card Style

### 5.1 默认卡片

```css
.card {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--card-padding);
  box-shadow: var(--shadow-card);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: box-shadow 200ms ease, transform 200ms ease;
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
```

### 5.2 旅行卡片（TripMiniCard）

- 顶部 120px 封面图区域，图片填满，`border-radius: 14px 14px 0 0`
- 下方 3 行文字区：城市名（Newsreader 24px）+ 日期（Inter 14px Secondary）+ 天数 pill
- 整体比例约 3:4（宽:高），图片占 50%
- hover：图片微放大（scale 1.03），卡片抬起

### 5.3 目的地卡片（Wishlist）

- 全高封面图，底部叠加渐变遮罩（透明 → rgba(0,0,0,0.6)）
- 文字反白在遮罩上
- 书签按钮（Forest Green）浮动于右上角

### 5.4 照片卡片

- 无边框、无阴影
- `border-radius: 14px`
- hover：scale(1.02) + 细微阴影出现

---

## 6. Globe Strategy

### 6.1 配色方案

地球不再是"暗黑星空"风格，改为**浅色底图 + 温暖陆地**：

```
海洋：       Water #E8EDF2 → Water Dark #D0D8E3（渐变）
陆地默认：   Land Full #F0E8D8（暖米色，未访问的中性色）
陆地去过：   Land Visited #E8C9A0（暖金米色，不是金属金）
陆地想去：   Land Wishlist #C5D8C0（低饱和灰绿）
选中发光：   Sunset Orange #E8714A，透明度 0.4
```

### 6.2 地球背景

- 不使用星空粒子
- 底色为页面背景色（#F5F2ED），与页面融为一体
- 地球边缘有微弱的大气光晕（#E8EDF2 glow）

### 6.3 深色模式

```
海洋：       #2A3040 → #222838
陆地默认：   #3A3840
陆地去过：   #C89870（暖铜色）
陆地想去：   #90A890
```

高品质旅行应用的质感，不是 GIS 系统。

### 6.8 深色模式

```
海洋：       #2A3040 → #222838
陆地默认：   展示 Terrain 地貌（不加着色）
陆地去过：   #C89870，opacity 0.35（暖铜色 overlay）
陆地想去：   #90A890，opacity 0.30
```

---

## 7. Map Interaction

### 7.1 地图瓦片

使用浅色地图瓦片：

- **浅色模式：** CartoDB Positron（浅灰底图，最小标注）
- **深色模式：** CartoDB Dark Matter
- 不用默认 OSM 风格（颜色太多，抢视觉焦点）

### 7.2 标点 & 路线

| 元素 | 浅色 | 深色 |
|------|------|------|
| 城市标点（去过） | Sunset Orange #E8714A，8px 圆 + 2px pulse 环 | #F08060 |
| 城市标点（想去） | Forest Green #4A9C7C | #5DBA90 |
| 飞行路线 | Ocean Blue #3B7EC7，2px 实线 | #5B9ED8 |
| 铁路路线 | Forest Green #4A9C7C，2px 虚线 | #5DBA90 |
| 公路路线 | Text Tertiary #999，1.5px 虚线 | #6B6D75 |
| 路线 hover | 线宽变为 4px，颜色提高亮度 |

### 7.3 交互

- 地图默认 zoom 级别低（能看到国家全貌）
- 点击城市标点：平滑 pan + zoom，城市名弹出 tooltip
- 地图不自动旋转（Apple Maps 风格：用户主动操作才动）

---

## 8. Timeline Style

### 8.1 布局

```
┌──────────────────────────────────────────┐
│                                          │
│    2025  ·  2024  ·  2023  ·  All        │  ← 年份筛选
│                                          │
│    ┌── 2024 ─────────────────────────┐   │
│    │                                 │   │
│    │   Dec  ┌──────────────────┐     │   │
│    │        │ 封面图 (160px)    │     │   │
│    │   ●────│ Paris, France    │     │   │  ← 时间线左侧圆点 + 月份
│    │        │ 8 days · 3 cities│     │   │
│    │        └──────────────────┘     │   │
│    │              │                  │   │
│    │   Jul  ┌──────────────────┐     │   │
│    │        │ 封面图 (160px)    │     │   │
│    │   ●────│ Tokyo, Japan     │     │   │
│    │        │ 5 days · 2 cities│     │   │
│    │        └──────────────────┘     │   │
│    │              │                  │   │
│    │   Mar  ┌──────────────────┐     │   │
│    │        │ 封面图 (160px)    │     │   │
│    │   ●────│ Bangkok, Thailand│     │   │
│    │        │ 7 days · 3 cities│     │   │
│    │        └──────────────────┘     │   │
│    │                                 │   │
│    └─────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

### 8.2 关键要素

- **时间线：** 左侧 2px 竖线，颜色 `#E0DCD4`（浅色）/ `#363840`（深色）
- **年份标签：** Newsreader 48px，`Text Tertiary` 低透明度，置于时间线左侧
- **月份标签：** Inter 14px，`Text Secondary`，置于圆点左侧
- **圆点：** 12px，Sunset Orange（去过），Forest Green（想去）
- **卡片：** 标准卡片样式，左侧 120px × 80px 封面缩略图 + 右侧文字区
- **卡片 hover：** 封面图亮度提升 + 卡片抬起

### 8.3 年份筛选

- 水平 Pill 组，居中在上方
- 选中态：Sunset Orange 底色 + 白色文字
- 未选：透明 + Text Secondary
- "All" 为默认选中

---

## 9. Flight Card

### 9.1 视觉方向

Flighty 风格的登机牌卡片——干净、信息密度适中、蓝色条带。

```
┌──────────────────────────────────────┐
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← 顶部蓝色条 (4px, #4468B2)
│                                      │
│  Air France                   AF111  │  ← 航司名 (Inter 14px Secondary) + 航班号 (Mono 18px Primary)
│  Boeing 777-300ER                    │  ← 机型 (Inter 12px Tertiary)
│                                      │
│  PVG ──────────────────────── CDG   │  ← 路线视觉
│  Shanghai                Paris      │  ← 城市名 (Inter 12px Tertiary)
│                                      │
│  10:30  ●────────────────●  14:20   │  ← 时间 + 时间线 (Ocean Blue dot + line)
│  Oct 12                    Oct 12   │  ← 日期 (Inter 12px Tertiary)
│                                      │
│              11h 50m                │  ← 时长 (Mono 16px Primary, 居中)
│              Direct                 │  ← 经停信息 (Inter 12px Tertiary)
│                                      │
└──────────────────────────────────────┘
```

### 9.2 多航班堆叠

- 卡片间距 12px
- 每张卡片微旋转（±0.5°，交错排列，模拟真实登机牌叠放）
- hover 时该卡片回正 + 前置

### 9.3 深色模式

- 卡片背景 #262830
- 蓝色条保持 #4468B2
- 文字颜色对应 Text Primary / Secondary

---

## 10. Photo Gallery

### 10.1 布局

Polarsteps 风格——大图铺陈，照片是第一公民。

```
页面级照片网格（Country / Trip 页）：
┌──────────────────────────────────────────┐
│  ┌──────────┐ ┌──────┐ ┌──────────────┐ │
│  │          │ │      │ │              │ │
│  │  2:3 竖  │ │ 1:1  │ │    3:2 横    │ │  ← 不规则比例，
│  │          │ │      │ │              │ │     模拟真实相册
│  │          │ └──────┘ └──────────────┘ │
│  └──────────┘                           │
│  ┌──────────────────┐ ┌──────────┐      │
│  │                  │ │          │      │
│  │     3:2 横       │ │  1:1     │      │
│  │                  │ │          │      │
│  └──────────────────┘ └──────────┘      │
└──────────────────────────────────────────┘
```

### 10.2 规格

- **网格方式：** CSS Grid `masonry` 或 `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))` + `grid-auto-flow: dense`
- **间距：** 8px
- **圆角：** 14px
- **无边框、无阴影**

### 10.3 光箱（Lightbox）

```
打开：
  - 背景：rgba(0,0,0,0.92)，非 blur
  - 图片从网格位置 scale + translate 到全屏居中
  - 周围显示 EXIF 信息（底部胶囊）：日期 · 地点 · 相机型号
  - 左右箭头导航（半透明圆，hover 变实色）
  - 关闭：点击背景 / 按 Esc → collapse 回网格位置

动画：
  - 展开 350ms cubic-bezier(0.22, 0.61, 0.36, 1)
  - 关闭 250ms ease-in
```

### 10.4 照片上传区域

- 虚线边框区域 2px dashed `#D0D0D8`
- 背景 `#FAFAFA`
- 图标 + "拖入照片或点击上传"
- 支持多选，上传后即时出现在网格中（带 fade-in stagger）

---

## 11. Motion Principles

### 11.1 动画哲学

从 VisionOS 的"科技感浮动"改为**自然、轻柔的旅行节奏**：

| 原则 | 说明 |
|------|------|
| 不让用户等待 | 所有动画 ≤ 400ms（除地球旋转和路线绘制） |
| 一个元素一个方向 | 列表从下方入、面板从右侧入、header 从上方入——保持空间感 |
| 照片优先 | 照片加载有 stagger 淡入，模拟翻相册 |
| 地图要稳 | 地图平移/缩放用 ease-in-out，不抢眼 |

### 11.2 缓动函数

```css
--ease-default:  cubic-bezier(0.25, 0.1, 0.25, 1);     /* 标准过渡 */
--ease-out:      cubic-bezier(0, 0, 0.2, 1);            /* 入场 */
--ease-in:       cubic-bezier(0.4, 0, 1, 1);            /* 退场 */
--ease-spring:   cubic-bezier(0.22, 0.61, 0.36, 1);     /* 弹性质感、卡片 hover */
--ease-globe:    cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* 地球缓动 */
```

### 11.3 时长标准

| 类型 | 时长 | 缓动 |
|------|------|------|
| Hover 态切换 | 150ms | ease-default |
| 页面入场 | 300ms | ease-out |
| 页面退场 | 200ms | ease-in |
| 卡片 stagger | 每张 +60ms | ease-out |
| 地球旋转 | 800ms | ease-globe |
| 路线绘制 | 1000ms | ease-in-out |
| 光箱展开 | 350ms | ease-spring |
| 光箱关闭 | 250ms | ease-in |
| 数字滚动 | 400ms | ease-globe |
| Toast 进出 | 250ms | ease-out / ease-in |

### 11.4 照片加载序列

```
页面进入后：
  0ms    页面结构渲染完成
  100ms  照片开始加载（每张 +40ms stagger）
  200ms  照片从透明度 0 → 1 + translateY(8px → 0)
  
  大图（封面图、Hero 图）优先加载，缩略图延迟
```

---

## 12. Icon Style

### 12.1 图标集

使用 **Lucide Icons**（线条风格，2px stroke）：

- 比 Feather 更全
- 线条风格与 Apple Maps / Flighty 一致
- 支持自定义 stroke-width

### 12.2 规格

- Stroke: 2px
- 尺寸：UI 控件 20px，导航 24px，大图标 32px
- 颜色：与文字颜色一致（Primary / Secondary / Tertiary）
- 交互式图标 hover 时颜色变为对应的语义色

### 12.3 特有图标处理

| 场景 | 图标 | 风格 |
|------|------|------|
| 导航 | Globe, MapPin, Clock, Bookmark, Plus | 线条 |
| 航班 | Plane (旋转 45°), PlaneLanding, PlaneTakeoff | 线条 |
| 交通 | 飞机 = Plane, 火车 = Train, 汽车 = Car | 线条，不同颜色 |
| 操作 | Heart (收藏), Share, Edit3, Trash2, Camera | 线条 |
| 状态 | CheckCircle2 (去过), BookmarkPlus (想去), Star | 线条 |

---

## 13. 页面结构（保留不变）

以下页面结构和组件层级与旧版设计保持一致，仅视觉风格按本规范更新：

| 页面 | 路由 | 核心组件 |
|------|------|----------|
| 首页 — Globe | `/` | Globe3D, NavPill, StatsHUD, QuickActions, RecentTripStrip |
| 国家详情 | `/country/:code` | CountryHeader, CountryMap, PhotoGrid, TripList, ContextGlobe |
| 旅行详情 | `/trip/:id` | TripHeader, RouteMap, FlightCard, DayTimelineStrip, PhotoGallery, NotesSection |
| 时间轴 | `/timeline` | YearFilter, TimelineList, YearGroup, TripCard |
| 想去清单 | `/wishlist` | CategoryToggle, DestinationGrid, DestinationCard, AddFab |

---

## 14. Design Tokens（CSS 变量速查）

### 14.1 浅色主题

```css
:root {
  /* 背景 */
  --color-page:        #F5F2ED;
  --color-card:        #FFFFFF;
  --color-card-hover:  #FAFAFA;
  --color-sheet:       #FBF9F6;

  /* 文字 */
  --text-primary:      #1C1E22;
  --text-secondary:    #6B6E77;
  --text-tertiary:     #999CA6;
  --text-inverse:      #FFFFFF;

  /* 强调 */
  --color-sunset:      #E8714A;
  --color-sunset-glow: #F0A080;
  --color-ocean:       #3B7EC7;
  --color-ocean-deep:  #2A5F9A;
  --color-forest:      #4A9C7C;
  --color-forest-light:#6DBA9A;

  /* 地图 */
  --map-land:          #F0E8D8;
  --map-land-visited:  #E8C9A0;
  --map-land-wishlist: #C5D8C0;
  --map-water:         #E8EDF2;
  --map-water-dark:    #D0D8E3;

  /* 航班卡片 */
  --flight-accent:     #4468B2;
  --flight-divider:    #E8E8EC;

  /* 语义 */
  --color-danger:      #D94848;
  --color-warning:     #E8993A;
  --color-success:     #4A9C7C;
  --color-info:        #3B7EC7;

  /* 阴影 */
  --shadow-card:       0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-modal:      0 8px 24px rgba(0, 0, 0, 0.10);
  --shadow-max:        0 16px 48px rgba(0, 0, 0, 0.14);

  /* 圆角 */
  --radius-sm:  8px;
  --radius-md:  14px;
  --radius-lg:  20px;
  --radius-xl:  28px;
  --radius-full: 9999px;

  /* 间距 */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* 字体 */
  --font-display: 'Newsreader', serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* 缓动 */
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);
  --ease-in:      cubic-bezier(0.4, 0, 1, 1);
  --ease-spring:  cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-globe:   cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 14.2 深色主题

```css
[data-theme="dark"], .dark {
  --color-page:        #1C1E22;
  --color-card:        #262830;
  --color-card-hover:  #2E303A;
  --color-sheet:       #22242A;

  --text-primary:      #EBEBED;
  --text-secondary:    #9B9DA5;
  --text-tertiary:     #6B6D75;

  --color-sunset:      #F08060;
  --color-sunset-glow: #F5B090;
  --color-ocean:       #5B9ED8;
  --color-ocean-deep:  #7AB8E8;
  --color-forest:      #5DBA90;
  --color-forest-light:#80D0AB;

  --map-land-visited:  #C89870;
  --map-land-wishlist: #90A890;
  --map-water:         #2A3040;
  --map-water-dark:    #222838;

  --shadow-card:       0 1px 3px rgba(0, 0, 0, 0.30);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.40);
  --shadow-modal:      0 8px 24px rgba(0, 0, 0, 0.50);
  --shadow-max:        0 16px 48px rgba(0, 0, 0, 0.60);
}
```

---

## 15. 实现注意事项

1. **所有 Element Plus 组件需覆盖默认主题**，通过 CSS 变量或 `el-config-provider` 注入本规范 tokens
2. **Leaflet 瓦片 URL** 指向 CartoDB 而非默认 OSM
3. **地球 (Globe.GL / Three.js)** 的颜色通过材质 `color` 和 `emissive` 属性设置，国家高亮通过 `polygonsData` 多边形填充。不使用旧版 `#06060D` 太空背景
4. **照片网格**使用 CSS Grid dense 模式实现不规则布局，不需要引入 Masonry 库
5. **登机牌蓝色条** 使用 `::before` 伪元素或 `border-top: 4px solid var(--flight-accent)`
6. **深色模式**通过 `[data-theme="dark"]` 或系统 `prefers-color-scheme` 切换，无需 JS 库
