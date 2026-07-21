# Travel Atlas — 开发规范 (Design-to-Code Spec)

> 基于 Stitch 生成的设计系统 + `design.md` 设计规范，作为前端开发的唯一参考来源。

---

## 1. Color Tokens

### 1.1 全局色板

```css
:root {
  /* ═══ 背景层级 ═══ */
  --color-page:            #F5F2ED;  /* 暖米白底色 */
  --color-card:            #FFFFFF;  /* 纯白卡片 */
  --color-card-hover:      #FAFAFA;  /* 卡片 hover */
  --color-sheet:           #FBF9F6;  /* 底部 Sheet / 大面板 */

  /* ═══ 文字 ═══ */
  --text-primary:          #1C1E22;  /* 主文字 */
  --text-secondary:        #6B6E77;  /* 辅助文字 */
  --text-tertiary:         #999CA6;  /* 浅色文字 */
  --text-inverse:          #FFFFFF;  /* 反白文字 */

  /* ═══ 语义强调 ═══ */
  --color-sunset:          #E8714A;  /* 日落橙 — 去过、选中、主 CTA */
  --color-sunset-glow:     #F0A080;  /* 日落橙 hover */
  --color-ocean:           #3B7EC7;  /* 海洋蓝 — 路线、航班、链接 */
  --color-ocean-deep:      #2A5F9A;  /* 海洋蓝静态 */
  --color-forest:          #4A9C7C;  /* 森林绿 — 收藏、想去 */
  --color-forest-light:    #6DBA9A;  /* 森林绿 hover */

  /* ═══ 地球/地图 ═══ */
  --map-land:              #F0E8D8;  /* 陆地默认 */
  --map-land-visited:      #E8C9A0;  /* 去过陆地（暖金米色） */
  --map-land-wishlist:     #C5D8C0;  /* 想去陆地（灰绿） */
  --map-water:             #E8EDF2;  /* 海洋 */
  --map-water-dark:        #D0D8E3;  /* 深海 */

  /* ═══ 航班卡片 ═══ */
  --flight-accent:         #4468B2;  /* 登机牌蓝色条 */
  --flight-divider:        #E8E8EC;  /* 虚线分隔 */

  /* ═══ 功能语义 ═══ */
  --color-danger:          #D94848;  /* 删除 */
  --color-warning:         #E8993A;  /* 警告 */
  --color-success:         #4A9C7C;  /* 成功 */
  --color-info:            #3B7EC7;  /* 信息 */
}
```

### 1.2 深色主题

```css
[data-theme="dark"] {
  --color-page:            #1C1E22;
  --color-card:            #262830;
  --color-card-hover:      #2E303A;
  --color-sheet:           #22242A;

  --text-primary:          #EBEBED;
  --text-secondary:        #9B9DA5;
  --text-tertiary:         #6B6D75;

  --color-sunset:          #F08060;
  --color-sunset-glow:     #F5B090;
  --color-ocean:           #5B9ED8;
  --color-ocean-deep:      #7AB8E8;
  --color-forest:          #5DBA90;
  --color-forest-light:    #80D0AB;

  --map-land-visited:      #C89870;
  --map-land-wishlist:     #90A890;
  --map-water:             #2A3040;
  --map-water-dark:        #222838;
}
```

### 1.3 功能色映射

| 语义 | Token | 用途 |
|------|-------|------|
| Visited / Active | `--color-sunset` | 去过标记、选中态、主按钮背景 |
| Route / Link | `--color-ocean` | 路线、航班号、可点击文字 |
| Wishlist / Bookmark | `--color-forest` | 收藏、想去、书签 |
| Danger / Delete | `--color-danger` | 删除确认按钮 |
| Disabled / Muted | `--text-tertiary` | 未访问、禁用态 |

---

## 2. Typography

### 2.1 字体族

| Token | 字体 | Fallback | 用途 |
|-------|------|----------|------|
| `--font-display` | **Newsreader** | Georgia, serif | 国家名、城市名、大数字、手记标题 |
| `--font-body` | **Inter** | -apple-system, sans-serif | 正文、标签、UI 控件 |
| `--font-mono` | **JetBrains Mono** | Consolas, monospace | 航班号、坐标、时长、统计数字 |

```css
:root {
  --font-display: 'Newsreader', Georgia, serif;
  --font-body:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:    'JetBrains Mono', 'Consolas', monospace;
}
```

### 2.2 字号阶梯

| Token | 值 | 用途 |
|-------|-----|------|
| `--text-display-xl` | 56px / 1.1 | 首页 Hero 数字、年份大标题 |
| `--text-display-lg` | 40px / 1.15 | 国家名（Country 页） |
| `--text-display-md` | 32px / 1.2 | 城市名（Trip 页） |
| `--text-display-sm` | 24px / 1.25 | 卡片标题、手记标题 |
| `--text-body-xl` | 20px / 1.5 | 导语、卡片摘要 |
| `--text-body-lg` | 18px / 1.5 | 正文段落 |
| `--text-body-md` | 16px / 1.5 | 标准 UI 文本 |
| `--text-body-sm` | 14px / 1.45 | 辅助信息、标签 |
| `--text-body-xs` | 12px / 1.4 | 日期戳、元数据 |
| `--text-mono-lg` | 20px / 1.3 | 统计大数字、航班号 |
| `--text-mono-md` | 16px / 1.3 | 时长、距离 |
| `--text-mono-sm` | 14px / 1.3 | 坐标、时间戳 |

### 2.3 字重

| 用途 | Newsreader | Inter | JetBrains Mono |
|------|-----------|-------|----------------|
| Hero | 600 | — | — |
| 标题 | 500 | 600 | — |
| 正文 | 400 | 400 | — |
| 标签/按钮 | — | 500 | — |
| 数据 | — | — | 500 |

---

## 3. Spacing Scale

### 3.1 基础间距（4px 基准）

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-xs` | 4px | icon 与文字间距、紧凑内边距 |
| `--space-sm` | 8px | 列表项间距、标签 gap、照片网格 gap |
| `--space-md` | 16px | 卡片内边距、标准元素间隙 |
| `--space-lg` | 24px | 段落间距、卡片网格 gap |
| `--space-xl` | 32px | 页面区块间距、页面边距 |
| `--space-2xl` | 48px | Hero 区上下间距 |
| `--space-3xl` | 64px | 页面级大分隔 |

### 3.2 组件特定间距

| 用途 | 值 |
|------|-----|
| Page Padding (页面边缘到内容) | 32px |
| Card Padding (卡片内部) | 20px |
| Card Gap (卡片网格) | 20px |
| Photo Grid Gap (照片墙) | 8px |
| Section Gap (大区块) | 48px |

---

## 4. Border Radius

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-sm` | 8px | 标签、badge、小按钮、输入框 |
| `--radius-md` | 14px | **标准卡片**（Apple 风格） |
| `--radius-lg` | 20px | 大卡片、模态框 |
| `--radius-xl` | 28px | 特大面板 |
| `--radius-full` | 9999px | Pill 按钮、选择器 |

**规则：**
- 照片卡片使用 `--radius-md`（14px），内图填满无边距
- 航班卡片使用 `--radius-md` + 顶部 4px 蓝色条
- 导航 Pill 使用 `--radius-full`
- 按钮优先使用 `--radius-full`（Pill 风格）

---

## 5. Shadows / Elevation

无 blur 玻璃效果。使用自然的卡片阴影系统。

| Token | 值 | 用途 |
|-------|-----|------|
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.06)` | 卡片默认 |
| `--shadow-card-hover` | `0 4px 12px rgba(0,0,0,0.08)` | 卡片 hover |
| `--shadow-modal` | `0 8px 24px rgba(0,0,0,0.10)` | 模态 / Sheet |
| `--shadow-max` | `0 16px 48px rgba(0,0,0,0.14)` | 最高层（极少用） |

**规则：**
- 卡片默认带 1px 边框 `rgba(0,0,0,0.06)` + `--shadow-card`
- Hover：阴影升级 + `translateY(-2px)`
- 照片卡片无阴影无边框（照片是第一公民）
- 深色模式下 shadow 透明度提高 5x

---

## 6. Icons

### 6.1 图标集

**Lucide Icons** — 线条风格，2px stroke。

### 6.2 尺寸

| 用途 | 尺寸 |
|------|------|
| UI 控件内 icon | 16px |
| 标准 icon | 20px |
| 导航 icon | 24px |
| 大图标 / 空状态 | 32px |

### 6.3 颜色规则

- 默认跟随文字颜色（`--text-secondary`）
- 交互式 icon hover 切换为语义色
- 选中态 icon 使用 `--color-sunset`

### 6.4 图标映射

| 场景 | Lucide 图标名 |
|------|--------------|
| 导航 — 地球 | `Globe` |
| 导航 — 国家 | `MapPin` |
| 导航 — 时间轴 | `Clock` |
| 导航 — 想去 | `Bookmark` |
| 航班 — 出发 | `PlaneTakeoff` |
| 航班 — 到达 | `PlaneLanding` |
| 交通 — 火车 | `Train` |
| 交通 — 汽车 | `Car` |
| 操作 — 收藏 | `Heart` |
| 操作 — 编辑 | `Edit3` |
| 操作 — 删除 | `Trash2` |
| 操作 — 照片 | `Camera` |
| 操作 — 分享 | `Share2` |
| 状态 — 去过 | `CheckCircle2` |
| 状态 — 想去 | `BookmarkPlus` |

---

## 7. Component Variants

### 7.1 按钮

| Variant | 背景 | 文字 | 边框 | 用途 |
|---------|------|------|------|------|
| Primary | `--color-sunset` | white | 无 | 主 CTA、保存 |
| Secondary | transparent | `--color-sunset` | 1px `--color-sunset` | 次要操作 |
| Ghost | transparent | `--text-secondary` | 无 | 低优先级 |
| Danger | `--color-danger` | white | 无 | 删除确认 |

所有按钮：`--radius-full`、`padding: 10px 24px`、`font: 500 14px Inter`、hover 时 `scale(0.98)` 按压反馈。

### 7.2 卡片

| Variant | 背景 | 阴影 | 边框 | 圆角 |
|---------|------|------|------|------|
| Default | `--color-card` | `--shadow-card` | `1px rgba(0,0,0,0.06)` | `--radius-md` |
| Photo | 无背景 | 无 | 无 | `--radius-md` |
| Flight | `--color-card` | `--shadow-card` | 顶部 4px `--flight-accent` | `--radius-md` |
| Destination | 封面图 + 渐变遮罩 | `--shadow-card` | 无 | `--radius-md` |

### 7.3 标签 / Chip

| Variant | 背景 | 文字 | 用途 |
|---------|------|------|------|
| Active | `--color-sunset` | white | 当前选中 |
| Default | transparent | `--text-secondary` | 未选中 |
| Wishlist | `--color-forest` | white | 想去标记 |
| Pill | `--color-card` + `--shadow-card` | `--text-primary` | 导航、筛选 |

### 7.4 输入框

- 底部边框线风格（minimalist）
- 默认：`border-bottom: 1px solid rgba(0,0,0,0.15)`
- Focus：`border-bottom: 2px solid --color-sunset`
- Label 使用 `--text-body-sm`、`--text-secondary`

### 7.5 导航 Pill

```
┌─────────────────────────────────────────────┐
│  🌍 Globe  ·  Country  ·  Timeline  ·  ...  │
└─────────────────────────────────────────────┘
```

- 顶部居中浮动
- `--color-card` 背景，`--shadow-card`，`--radius-full`
- 内部 item 间距 4px
- 选中态：`--color-sunset` 背景 pill + 白字
- 未选中：透明 + `--text-secondary`

### 7.6 航班卡片

- 顶部 4px 蓝色条（`--flight-accent`）
- 航司名 Inter 14px `--text-secondary`
- 航班号 JetBrains Mono 18px `--text-primary`
- 时间线：Ocean Blue 圆点 + 连接线
- 多航班堆叠：每张卡片微旋转 ±0.5°

### 7.7 照片网格

- `display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); grid-auto-flow: dense;`
- `gap: 8px`
- 图片 `border-radius: 14px`，无边框无阴影
- 不同宽高比（3:2 / 1:1 / 2:3）混合排列

---

## 8. Grid System

### 8.1 桌面端（≥ 1280px）

```
┌──────────────────────────────────────────────┐
│ 32px                                    32px │
│  ┌────────────────────────────────────────┐  │
│  │         12-column Grid                 │  │
│  │   col: 78px  |  gutter: 20px          │  │
│  │   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ... ┌──┐      │  │
│  │   └──┘ └──┘ └──┘ └──┘     └──┘      │  │
│  └────────────────────────────────────────┘  │
│  Content max-width: 1280px                   │
└──────────────────────────────────────────────┘
```

- 12 列，列宽 78px，gutter 20px
- 页面两侧 padding 32px
- 内容最大宽度 1280px，居中

### 8.2 常见布局分区

| 布局 | 左列 | 右列 | 用途 |
|------|------|------|------|
| 双列 6+6 | 6 cols | 6 cols | Country 页（地图 + 信息） |
| 双列 7+5 | 7 cols | 5 cols | Trip 页（地图 + 航班卡片） |
| 三列 4×3 | 4 cols × 3 | — | Wishlist 目的地网格 |
| 单列居中 | 8 cols 居中 | — | 手记详情、新增旅行表单 |
| 全宽 | 12 cols | — | Globe 首页、时间轴 |

---

## 9. Breakpoints

### 9.1 断点定义

| 名称 | 最小宽度 | 目标设备 |
|------|---------|---------|
| **Desktop** | 1280px | 桌面显示器（MVP 优先） |
| **Tablet** | 768px | iPad / 小屏笔记本（v0.2） |
| **Mobile** | 390px | iPhone / Android（v0.2） |

### 9.2 MVP 阶段

- **仅适配 Desktop (1280px+)**
- 设计基准 1440×900
- 照片、地图、卡片均按 Desktop 规范

### 9.3 响应式降级规则（v0.2）

| 元素 | Desktop → Mobile |
|------|-------------------|
| 3D 地球 | → 静态世界地图图片 + 国家点击 |
| 双列布局 | → 单列堆叠 |
| Nav Pill | → 底部 Tab Bar |
| 卡片网格 3 列 | → 1 列全宽 |
| 照片网格 | → 2 列 |
| 阴影 / blur | → 降级为纯 `box-shadow`（移动端性能） |
| 航班卡片堆叠 | → 紧凑单行布局 |
| Page Padding | 32px → 16px |

---

## 10. Motion Tokens

### 10.1 缓动函数

```css
:root {
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);      /* 标准过渡 */
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);             /* 元素入场 */
  --ease-in:      cubic-bezier(0.4, 0, 1, 1);             /* 元素退场 */
  --ease-spring:  cubic-bezier(0.22, 0.61, 0.36, 1);      /* 卡片 hover、弹性 */
  --ease-globe:   cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* 地球旋转缩放 */
}
```

### 10.2 时长

| 动画 | 时长 | 缓动 |
|------|------|------|
| Hover 态 | 150ms | `--ease-default` |
| 页面入场 | 300ms | `--ease-out` |
| 页面退场 | 200ms | `--ease-in` |
| 卡片 stagger | 每张 +60ms | `--ease-out` |
| 地球旋转 | 800ms | `--ease-globe` |
| 路线绘制 | 1000ms | `--ease-in-out` |
| 光箱展开 | 350ms | `--ease-spring` |
| 光箱关闭 | 250ms | `--ease-in` |
| 数字滚动 | 400ms | `--ease-globe` |
| Toast 进出 | 250ms | `--ease-out` / `--ease-in` |

### 10.3 页面入场序列

```
Globe 首页：
  0ms    页面背景淡入
  200ms   3D 地球从 alpha 0 → 1 (800ms ease-globe)
  400ms   Stats HUD 从左上滑入 (300ms ease-out)
  500ms   Nav Pill 从上方滑入 (300ms ease-out)
  600ms   底部卡片 strip 从下方滑入，每张 stagger 80ms

Country 页：
  0ms    页面从右滑入 (300ms ease-out)
  100ms  国家名文字逐个淡入 (stagger 30ms per letter)
  200ms  地图从灰度过渡到彩色
  300ms  城市标点依次亮起 (从最早到最近)
  400ms  照片网格浮入，每张 stagger 50ms

Timeline 页：
  0ms    年份标签淡入
  200ms  时间线竖线从上向下绘制 (600ms)
  300ms  卡片依次从两侧滑入 (stagger 80ms)
```

### 10.4 照片加载序列

```
0ms    页面结构渲染完成
100ms  照片开始加载（每张 +40ms stagger）
200ms  照片 opacity 0→1 + translateY(8px→0)
大图优先加载，缩略图延后
```

---

## 11. Stitch 项目状态

### 11.1 项目概览

| 属性 | Travel Atlas (旧) | Travel Atlas — 暖白旅行风 (新) |
|------|-------------------|-------------------------------|
| Project ID | `8576119415348266698` | `14698863986216072936` |
| 设计系统 | Terra Cotta Modern (暗色金) | Travel Atlas — 旅行叙事 (暖白) |
| 色彩模式 | DARK → 屏幕已更新为暖色 | LIGHT |
| 主色 | #D4A14B (旧) | #E8714A |
| 屏幕数量 | 60+ | 16 |

### 11.2 已生成页面清单

| 页面 | 暖白旅行风 Project | 状态 |
|------|-------------------|------|
| 首页 — Globe 3D | `7444d9d0` — Home with 3D Globe | 多重变体已生成 |
| 首页 — Globe | `38648ba3` / `46e09ecc` / `fd5a0053` / `d35a78b6` — Home | 多重变体已生成 |
| 巴黎行程详情 | `f0633d1e` / `276e2c7b` — Paris Trip Detail | 多重变体已生成 |
| 时间轴 | 旧项目中 `aaf1c820` — Journey Timeline (Warm Narrative) | 暖色版已生成 |
| 想去清单 | 旧项目中 `122568fc` — 梦想目的地心愿单 (暗色隐藏) | 需用提示词重新生成暖色版 |
| 新增旅行 | 旧项目中 `a00be5dd` — 新增编辑旅行 (暗色隐藏) | 需用提示词重新生成暖色版 |

---

## 12. 实现检查清单

### 12.1 全局基础

- [ ] CSS 变量文件（`:root` + `[data-theme="dark"]`）
- [ ] Newsreader + Inter + JetBrains Mono 字体引入
- [ ] Lucide Icons 图标库引入
- [ ] Element Plus 主题覆盖注入
- [ ] 深色模式切换机制

### 12.2 组件库

- [ ] BaseButton（Primary / Secondary / Ghost / Danger）
- [ ] BaseCard（Default / Photo / Flight / Destination）
- [ ] BaseChip（Active / Default / Wishlist）
- [ ] BaseInput（底部边框风格）
- [ ] NavPill（顶部浮动导航）
- [ ] FlightCard（登机牌风格）
- [ ] PhotoGrid（不规则网格 + 光箱）
- [ ] TimelineLine（时间线竖线 + 圆点）
- [ ] Toast（顶部飘入通知）

### 12.3 页面

- [ ] GlobePage — 首页 3D 地球
- [ ] CountryPage — 国家详情（地图 + 照片 + 行程列表）
- [ ] TripPage — 行程详情（路线 + 航班 + 时间线 + 手记）
- [ ] TimelinePage — 时间轴（年份筛选 + 卡片列表）
- [ ] WishlistPage — 想去清单（目的地网格）
- [ ] NewTripPage — 新增/编辑旅行（表单 + 路线编辑器）
