# Travel Atlas — 可执行开发计划

> **版本：** v1.0 | **日期：** 2026-07-21  
> **目标：** 这份计划不是文档，是要能照着执行的 TODO 清单。  
> **阅读顺序：** 1→10，但开发时只看第 10 章（最终 TODO）。

---

## 1. 项目分析

### 1.1 产品目标

**一句话：** 以 3D 地球为交互核心的个人旅行记录与回忆工具。

**核心体验：** 打开网站 → 看到一颗漂亮的浅色 3D 地球 → 去过的国家以暖金米色高亮 → 点击进入全是回忆。

**目标用户：** 热爱旅行的个人用户（MVP 单用户）。

### 1.2 核心功能矩阵

| 功能 | MVP | v0.2 |
|------|-----|------|
| 3D 地球渲染（可旋转/缩放） | ✅ | — |
| 国家颜色映射（去过/想去/未去） | ✅ | — |
| 地球点击 → 国家详情 | ✅ | — |
| 新增/编辑旅行（表单+路线+照片） | ✅ | — |
| 国家详情页（地图+城市+路线+照片） | ✅ | — |
| 旅行详情页（路线+航班+手记+照片） | ✅ | — |
| 想去清单（国家/城市收藏） | ✅ | — |
| 旅行手记（Markdown） | ✅ | — |
| 照片上传（本地存储） | ✅ | — |
| 浅色/深色主题切换 | ✅ | — |
| 时间轴页面 | ❌ | ✅ |
| 飞行轨迹回放动画 | ❌ | ✅ |
| 旅行统计面板 | ❌ | ✅ |
| 响应式适配（手机/平板） | ❌ | ✅ |
| 用户系统（注册/登录） | ❌ | ✅ |
| OSS 文件存储 | ❌ | ✅ |
| 社交功能（好友/分享） | ❌ | ✅ |

### 1.3 MVP 不做清单

- 用户系统 → 硬编码 `user_id = 1`
- OSS/CDN → 存服务器本地 `uploads/` 目录
- 飞行轨迹回放动画 → v0.2
- 响应式 → 仅 Desktop 1280px+
- 时间轴页面 → v0.2
- 统计面板 → v0.2
- 地理编码 API → 城市坐标用静态 JSON
- 付费地图服务 → 全部用免费方案（CartoDB / OpenStreetMap）

### 1.4 页面清单

| 路由 | 页面 | MVP | 开发顺序 |
|------|------|-----|----------|
| `/` | GlobeHome — 3D 地球首页 | ✅ | **#3** |
| `/country/:code` | CountryDetail — 国家详情 | ✅ | **#4** |
| `/trip/new` | TripEditor — 新增旅行 | ✅ | **#2**（先做，因为需要录入数据来验证其他页面） |
| `/trip/:id/edit` | TripEditor — 编辑旅行 | ✅ | 复用 #2 |
| `/trip/:id` | TripDetail — 旅行详情 | ✅ | **#5** |
| `/wishlist` | Wishlist — 想去清单 | ✅ | **#6** |
| `/timeline` | Timeline — 时间轴 | ❌ v0.2 | 后续 |

---

## 2. 技术架构

### 2.1 整体架构图

```
┌────────────────────────────────────────────────────────┐
│                    浏览器 (Chrome/Firefox)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │               Vue 3 + TypeScript                   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │   │
│  │  │  Pages   │ │  Router  │ │   Pinia Stores   │  │   │
│  │  ├──────────┤ ├──────────┤ ├──────────────────┤  │   │
│  │  │Components│ │Composables│ │    API Client    │  │   │
│  │  └──────────┘ └──────────┘ └────────┬─────────┘  │   │
│  └──────────────────────────────────────┼───────────┘   │
└─────────────────────────────────────────┼───────────────┘
                                          │ HTTP / REST
┌─────────────────────────────────────────┼───────────────┐
│  Spring Boot 3 + Java 21               │               │
│  ┌──────────────────────────────────────┴──────────┐   │
│  │              Controller 层                        │   │
│  │  CountryController  TripController  PhotoCtrl... │   │
│  ├─────────────────────────────────────────────────┤   │
│  │              Service 层                           │   │
│  │  CountryService  TripService  PhotoService...    │   │
│  ├─────────────────────────────────────────────────┤   │
│  │              Mapper 层 (MyBatis-Plus)             │   │
│  ├─────────────────────────────────────────────────┤   │
│  │         Redis (缓存)    │   MySQL (持久化)        │   │
│  └─────────────────────────────────────────────────┘   │
│                      文件系统 (uploads/)                 │
└────────────────────────────────────────────────────────┘
```

### 2.2 前端架构

#### 技术栈

| 技术 | 用途 | 备注 |
|------|------|------|
| Vue 3 + TypeScript | 框架 | `<script setup lang="ts">` |
| Vite | 构建 | 已配置 |
| Vue Router 4 | 路由 | 7 条路由已定义 |
| Pinia | 状态管理 | stores/ 目录待填充 |
| Axios | HTTP 请求 | 封装在 api/client.ts |
| Element Plus | UI 基础组件库 | 需覆盖主题色 |
| Globe.GL / Three.js | 3D 地球 | 交互 + 着色 + 旋转/缩放 |
| Leaflet | 2D 地图 | 已安装 |
| Lucide Vue | 图标 | 需安装 `lucide-vue-next` |
| marked | Markdown 渲染 | 需安装 |

#### 前端数据流

```
页面 mounted
  → composable 调用 api/*.ts
    → Axios 发送 HTTP 请求
      → 后端返回 JSON
    → 数据写入 Pinia stores（缓存）
  → 组件 props 接收数据并渲染
  → 用户操作 → 事件向上 emit → 页面/组件调用 api 更新
  → 更新成功 → 更新 Pinia → 响应式刷新 UI

特殊情况：文件上传 → 通过 POST multipart/form-data
特殊情况：GeoJSON → 前端 public/ 目录静态加载，不走 API
```

#### 状态管理策略 (Pinia)

| Store | 职责 | 数据来源 | 缓存策略 |
|-------|------|----------|----------|
| `appStore` | 主题模式、全局 loading、toast 队列 | 本地持久化 | localStorage 保存主题偏好 |
| `tripStore` | 最近旅行、当前旅行详情 | `GET /api/trips/*` | 页面跳转时不清空（路由缓存） |
| `countryStore` | 国家列表、访问状态、城市数据 | `GET /api/countries/*` | 地球数据 session 内缓存 |
| `wishlistStore` | 想去清单 | `GET /api/wishlist` | 增删后刷新 |

**不使用 Pinia 的情况：** 仅在单个页面内使用的数据（如照片网格、地图状态），用 composable 管理即可。

#### 路由守卫策略

- MVP 阶段无认证守卫
- 未来：`router.beforeEach` 检查 JWT token 是否存在

### 2.3 后端架构

#### 技术栈

| 技术 | 用途 | 备注 |
|------|------|------|
| Java 21 | 语言 | 使用 var, record, 模式匹配 |
| Spring Boot 3 | 框架 | 3.x 最新稳定版 |
| MyBatis-Plus | ORM | LambdaQueryWrapper |
| MySQL 8 | 数据库 | InnoDB, utf8mb4 |
| Redis (Lettuce) | 缓存 | Spring Cache 注解 |
| Maven | 构建 | pom.xml |

#### 异常处理架构

```
全局异常处理器 GlobalExceptionHandler：
  - MethodArgumentNotValidException → 400 + 字段错误信息
  - BindException → 400 + 参数错误信息  
  - NoHandlerFoundException → 404
  - RuntimeException → 500 + 日志记录
  - 自定义 BusinessException → 业务异常（前端根据 code 展示对应文案）
```

#### 响应体统一格式

```java
public record Result<T>(Integer code, String message, T data) {
    public static <T> Result<T> ok(T data) { ... }
    public static <T> Result<T> ok() { ... }
    public static <T> Result<T> error(Integer code, String message) { ... }
}
```

### 2.4 文件上传方案

```
前端选择/拖入照片
  → 客户端压缩（最大宽边 2400px，保持宽高比）
  → POST /api/trips/{id}/photos (multipart/form-data)
  → 后端接收 MultipartFile
    → 校验文件类型（白名单: jpg/png/webp）
    → 校验文件大小（单张 ≤ 10MB）
    → 生成 UUID 文件名 + 保留扩展名
    → 写入 uploads/{tripId}/{uuid}.{ext}
    → 记录数据库 photos 表
    → 返回照片 URL
  → 前端显示缩略图
```

### 2.5 地图与 3D 模块架构

#### 3D 地球 (Globe3D.vue)

```
Globe3D.vue
  ├── Globe 实例（Three.js 场景、相机、控制器）
  ├── 国家多边形网格（按访问状态着色）
  ├── 国家多边形 Overlay（GeoJSON，半透明按访问状态着色）
  │   ├── visited → warm gold (#E8C9A0, opacity 0.35)
  │   ├── wishlist → 灰绿 (#C5D8C0, opacity 0.30)
  │   └── unvisited → 无额外着色（展示 Terrain）
  ├── 国家标签（Sprite 文字）
  ├── 选中光圈（Entity ellipse + pulse 动画）
  └── 交互事件绑定
      ├── hover → 高亮 + tooltip
      └── click → 路由跳转

数据输入：
  - countries.json（GeoJSON 几何数据，从 public/geojson/ 加载）
  - countryStatus（从 API 获取访问状态，作为 props 传入）

数据输出：
  - @click-country(code: string) → 父组件处理路由

生命周期：
  - mounted: 初始化场景、加载 GeoJSON、开始动画循环
  - watch props: 更新国家 Overlay 颜色
  - beforeUnmount: 销毁 Three.js 场景（释放 GPU 内存）
```


#### 2D 地图 (CountryMap.vue / RouteMap.vue)

```
CountryMap.vue
  ├── Leaflet 地图实例
  ├── 瓦片图层（CartoDB Positron / Dark Matter）
  ├── 城市标点图层（Marker cluster 或自定义 DivIcon）
  └── 路线图层（Polyline + 分交通方式着色）

RouteMap.vue（继承 CountryMap，增加路线编辑功能）
  └── 可拖拽标点 + 路线重绘

Leaflet 组件设计：
  - 不直接使用 vue-leaflet（版本兼容性问题）
  - 用 composable 封装 Leaflet 逻辑
  - 通过 template ref 注入容器 div
  - 组件卸载时 destroy map 实例
```

---

## 3. 项目目录结构

### 3.1 后端目录

```
backend/
├── pom.xml
│
├── src/main/java/com/travelatlas/
│   ├── TravelAtlasApplication.java          # 启动类
│   │
│   ├── config/
│   │   ├── CorsConfig.java                  # 跨域配置（允许 localhost:3000）
│   │   ├── MyBatisPlusConfig.java           # 分页插件、乐观锁插件
│   │   ├── RedisConfig.java                 # Redis 序列化配置
│   │   ├── WebMvcConfig.java                # 静态资源映射（uploads/ → /uploads/**）
│   │   └── JacksonConfig.java               # 日期格式化、Long→String 序列化
│   │
│   ├── common/
│   │   ├── Result.java                      # 统一响应体
│   │   ├── BusinessException.java           # 业务异常
│   │   ├── GlobalExceptionHandler.java      # 全局异常处理
│   │   ├── PageResult.java                  # 分页响应
│   │   └── Constants.java                   # 常量定义
│   │
│   ├── controller/
│   │   ├── CountryController.java           # 国家相关接口
│   │   ├── TripController.java              # 旅行 CRUD 接口
│   │   ├── PhotoController.java             # 照片上传/管理接口
│   │   ├── FlightController.java            # 航班信息接口
│   │   ├── WishlistController.java          # 想去清单接口
│   │   └── StatsController.java             # 统计信息接口
│   │
│   ├── service/
│   │   ├── CountryService.java              # 国家服务接口
│   │   ├── TripService.java                 # 旅行服务接口
│   │   ├── PhotoService.java                # 照片服务接口
│   │   ├── FlightService.java               # 航班服务接口
│   │   ├── WishlistService.java             # 想去清单接口
│   │   └── StatsService.java                # 统计服务接口
│   │
│   ├── service/impl/
│   │   ├── CountryServiceImpl.java
│   │   ├── TripServiceImpl.java
│   │   ├── PhotoServiceImpl.java
│   │   ├── FlightServiceImpl.java
│   │   ├── WishlistServiceImpl.java
│   │   └── StatsServiceImpl.java
│   │
│   ├── mapper/
│   │   ├── CountryMapper.java
│   │   ├── TripMapper.java
│   │   ├── TripCityMapper.java
│   │   ├── TripRouteMapper.java
│   │   ├── PhotoMapper.java
│   │   ├── FlightMapper.java
│   │   └── WishlistMapper.java
│   │
│   ├── entity/
│   │   ├── Country.java
│   │   ├── Trip.java
│   │   ├── TripCity.java
│   │   ├── TripRoute.java
│   │   ├── Photo.java
│   │   ├── Flight.java
│   │   └── Wishlist.java
│   │
│   └── dto/                                # 数据传输对象
│       ├── TripCreateReq.java              # 创建旅行请求
│       ├── TripUpdateReq.java              # 更新旅行请求
│       ├── CountryStatusVO.java            # 国家访问状态（给地球用）
│       ├── CountryDetailVO.java            # 国家详情
│       ├── TripDetailVO.java               # 旅行详情
│       ├── StatsVO.java                    # 统计数据
│       └── PhotoUploadReq.java             # 照片上传
│
├── src/main/resources/
│   ├── application.yml                     # 主配置（数据源、Redis、文件大小）
│   ├── application-dev.yml                 # 开发环境配置
│   ├── application-prod.yml                # 生产环境配置
│   └── db/
│       ├── schema.sql                      # 建表 DDL
│       └── seed-data.sql                   # 种子数据（国家列表 + 示例数据）
│
└── uploads/                                # 照片上传目录（.gitignore）
```

### 3.2 前端目录

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
│
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── geojson/
│       └── countries-110m.json             # Natural Earth 国家边界数据
│
└── src/
    ├── main.ts                             # 入口：createApp + Router + Pinia + ElementPlus
    ├── App.vue                             # 根组件：<router-view> + 页面过渡动画
    └── style.css                           # 全局 CSS：Design Tokens + 基础样式 + Element Plus 覆盖
    │
    ├── router/
    │   └── index.ts                        # 路由定义（已创建，7 条路由）
    │
    ├── pages/                              # 页面组件（职责：组合业务组件 + 调用 API）
    │   ├── GlobeHome.vue                   # [MVP #3] 首页 3D 地球
    │   ├── CountryDetail.vue               # [MVP #4] 国家详情
    │   ├── TripDetail.vue                  # [MVP #5] 旅行详情
    │   ├── TripEditor.vue                  # [MVP #2] 新增/编辑旅行
    │   ├── Timeline.vue                    # [v0.2] 时间轴
    │   └── Wishlist.vue                    # [MVP #6] 想去清单
    │
    ├── components/
    │   ├── base/                           # 基础 UI 组件（完全解耦、无业务依赖）
    │   │   ├── BaseButton.vue
    │   │   ├── BaseCard.vue
    │   │   ├── BaseChip.vue
    │   │   ├── BaseInput.vue
    │   │   ├── BaseModal.vue
    │   │   ├── Toast.vue
    │   │   ├── Lightbox.vue
    │   │   ├── EmptyState.vue              # 空状态占位（含插槽）
    │   │   ├── LoadingSpinner.vue
    │   │   └── ConfirmDialog.vue
    │   │
    │   ├── layout/                         # 布局组件（全局导航/结构）
    │   │   └── NavPill.vue                 # 顶部浮动导航
    │   │
    │   ├── globe/                          # 3D 地球模块
    │   │   ├── Globe3D.vue                 # Globe.GL 地球封装
    │   │   ├── CountryPolygon.ts           # 国家多边形半透明 Overlay 逻辑
    │   │   ├── GlobeTooltip.ts             # 地球 hover tooltip
    │   │   └── useGlobe.ts                 # 3D 地球辅助函数 composable
    │   │
    │   ├── map/                            # 2D 地图模块
    │   │   ├── CountryMap.vue              # 国家页地图
    │   │   ├── RouteMap.vue                # 旅行页路线地图
    │   │   ├── CityMarker.vue              # 城市标点
    │   │   ├── RouteLine.vue               # 路线连线
    │   │   └── useMap.ts                   # Leaflet 初始化 composable
    │   │
    │   ├── trip/                           # 旅行模块
    │   │   ├── TripCard.vue                # 旅行列表卡片
    │   │   ├── TripMiniCard.vue            # 首页水平滚动小卡片
    │   │   ├── FlightCard.vue              # 登机牌风格航班卡片
    │   │   ├── DayTimelineStrip.vue        # 天时间线（水平滚动）
    │   │   ├── RouteEditor.vue             # 路线编辑器（拖拽城市排序）
    │   │   └── StatsHUD.vue                # 统计数字面板
    │   │
    │   ├── photo/                          # 照片模块
    │   │   ├── PhotoGrid.vue               # CSS Grid 不规则网格
    │   │   ├── PhotoCard.vue               # 单张照片
    │   │   └── PhotoUploader.vue           # 拖拽上传组件
    │   │
    │   ├── timeline/                       # 时间轴模块
    │   │   ├── YearFilter.vue              # 年份筛选 Pill
    │   │   ├── TimelineList.vue            # 时间线列表容器
    │   │   └── YearGroup.vue               # 年份分组
    │   │
    │   ├── wishlist/                       # 想去清单模块
    │   │   └── DestinationCard.vue         # 目的地卡片
    │   │
    │   ├── NotesSection.vue                # 手记展示区
    │   ├── MarkdownEditor.vue              # Markdown 编辑器
    │   ├── ContextGlobe.vue                # 右下角小地球
    │   └── RecentTripStrip.vue             # 首页底部最近旅行
    │
    ├── composables/                        # 可复用逻辑
    │   ├── useTheme.ts                     # 主题切换（light/dark + localStorage 持久化）
    │   ├── useGlobe.ts                     # 3D 地球生命周期管理
    │   ├── useMap.ts                       # Leaflet 地图生命周期管理
    │   ├── usePhoto.ts                     # 照片上传/压缩/验证
    │   ├── useToast.ts                     # Toast 通知
    │   └── usePagination.ts               # 分页逻辑
    │
    ├── stores/                             # Pinia 状态
    │   ├── appStore.ts                     # 全局状态（主题、loading、toast）
    │   ├── tripStore.ts                    # 旅行数据缓存
    │   ├── countryStore.ts                 # 国家数据 + 访问状态
    │   └── wishlistStore.ts                # 想去清单数据
    │
    ├── api/                                # Axios 请求封装
    │   ├── client.ts                       # Axios 实例（baseURL、超时、拦截器）
    │   ├── countries.ts                    # 国家相关 API
    │   ├── trips.ts                        # 旅行相关 API
    │   ├── photos.ts                       # 照片相关 API
    │   ├── wishlist.ts                     # 想去清单 API
    │   └── stats.ts                        # 统计 API
    │
    ├── types/                              # TypeScript 类型定义
    │   ├── country.ts
    │   ├── trip.ts
    │   ├── photo.ts
    │   ├── wishlist.ts
    │   └── common.ts                       # 通用类型（PageResult, ApiResponse 等）
    │
    └── utils/                              # 纯工具函数
        ├── date.ts                         # 日期格式化
        ├── geo.ts                          # 地理计算（大圆插值、距离计算）
        └── format.ts                       # 数字格式化、文字截断
```

---

## 4. 页面开发计划

### 4.1 开发顺序

```
TripEditor (新增旅行) ────── 先做数据录入入口
       │
       ▼
GlobeHome ─────────────────── 再做首页（需要数据验证）
       │
       ▼
CountryDetail ────────────── 然后做国家详情（需要旅行数据）
       │
       ▼
TripDetail ───────────────── 再做旅行详情（需要城市、路线、照片数据）
       │
       ▼
Wishlist ─────────────────── 最后做想去清单（独立模块）
```

**为什么先做 TripEditor？** 因为其他页面都需要有旅行数据才能展示，TripEditor 是数据入口。

### 4.2 TripEditor 页面

| 属性 | 说明 |
|------|------|
| **路由** | `/trip/new`（新增）和 `/trip/:id/edit`（编辑） |
| **职责** | 创建/编辑一次旅行：选择国家、添加城市、编辑路线、录入航班、上传照片、写手记 |
| **依赖页面** | 无依赖（第一个开发的页面） |
| **被依赖** | GlobeHome（需要 trip 数据）、CountryDetail（需要 trip 数据）、TripDetail（编辑入口） |
| **组件** | BaseInput, BaseButton, BaseChip, PhotoUploader, RouteEditor, MarkdownEditor, EmptyState, ConfirmDialog, BaseModal |
| **Composables** | usePhoto（压缩+上传）, useToast |
| **Store** | tripStore（写操作） |
| **API** | `POST /api/trips`, `PUT /api/trips/:id`, `DELETE /api/trips/:id`, `POST /api/trips/:id/photos`, `DELETE /api/photos/:id`, `GET /api/countries`（下拉搜索），`GET /api/trips/:id`（编辑时预填） |
| **状态** | 表单状态（响应式对象）、上传队列（进度条）、验证状态 |
| **States** | 表单初始空（新增）/ 预填（编辑）、上传中（进度条）、保存中（按钮 loading） |

**完成标准：**
- 能完成一次完整的旅行创建流程
- 城市可增删、路线可排序、照片可上传和预览
- 编辑时能回填所有已有数据
- 表单验证正确

### 4.3 GlobeHome 页面

| 属性 | 说明 |
|------|------|
| **路由** | `/` |
| **职责** | 全屏 3D 地球交互 + 统计概览 + 最近旅行预览 |
| **依赖页面** | 需要 TripEditor 已有旅行数据 |
| **被依赖** | CountryDetail 的入口（通过地球点击）、Wishlist 的入口（通过快捷按钮） |
| **组件** | Globe3D, NavPill, StatsHUD, RecentTripStrip, TripMiniCard, LoadingSpinner |
| **Composables** | useGlobe, useTheme |
| **Store** | countryStore（国家状态列表）、tripStore（最近旅行） |
| **API** | `GET /api/countries/visited`（地球着色），`GET /api/stats`（统计数字），`GET /api/trips?limit=8`（最近旅行） |
| **States** | 地球加载中（perspective 淡入）、统计数字滚动动画、数据为空（"还没有旅行记录" + 引导 CTA） |

**关键交互：**
1. 地球加载 GeoJSON → 按访问状态着色
2. 国家 hover → 边缘发光 + tooltip
3. 国家 click → 路由到 CountryDetail 或 Wishlist
4. 统计数字 odometer 动画
5. 页面入场动画序列（地球→Stats→Nav→Strip）

**完成标准：**
- 3D 地球可旋转/缩放/hover/click
- 国家颜色按访问状态正确映射
- 数据来自 API（非 mock）
- 最近旅行 strip 正确显示
- 所有入场动画正常

### 4.4 CountryDetail 页面

| 属性 | 说明 |
|------|------|
| **路由** | `/country/:code` |
| **职责** | 展示一个国家概况：基本信息、地图城市标点、照片墙、旅行列表 |
| **依赖页面** | 需要 TripEditor 已有数据 |
| **被依赖** | TripDetail 的入口（点击旅行卡片） |
| **组件** | BaseCard, PhotoGrid, PhotoCard, TripCard, CountryMap, CityMarker, RouteLine, ContextGlobe, NavPill, Lightbox, EmptyState, LoadingSpinner |
| **Composables** | useMap, usePhoto, useToast |
| **Store** | countryStore |
| **API** | `GET /api/countries/:code`, `GET /api/countries/:code/cities`, `GET /api/countries/:code/trips`, `GET /api/countries/:code/photos` |
| **States** | Loading（地图切片加载+数据加载）、Empty（尚未去过的国家）、Error（国家代码不存在 → 404 提示） |

**完成标准：**
- 国家信息正确展示
- 地图上城市标点位置正确
- 城市间路线连线正确
- 照片网格展示 + Lightbox 可用
- 旅行列表可点击跳转到 TripDetail

### 4.5 TripDetail 页面

| 属性 | 说明 |
|------|------|
| **路由** | `/trip/:id` |
| **职责** | 展示一次旅行的完整内容：路线地图、航班卡片、天时间线、照片画廊、手记 |
| **依赖页面** | 需要 TripEditor 已有数据 |
| **被依赖** | 无 |
| **组件** | BaseCard, FlightCard, DayTimelineStrip, RouteMap, CityMarker, RouteLine, PhotoGrid, PhotoCard, NotesSection, NavPill, ContextGlobe, Lightbox, LoadingSpinner, MarkdownEditor |
| **Composables** | useMap, usePhoto, useToast |
| **Store** | tripStore |
| **API** | `GET /api/trips/:id`, `GET /api/trips/:id/routes`, `GET /api/trips/:id/flights`, `GET /api/trips/:id/photos`, `GET /api/trips/:id/notes`, `PUT /api/trips/:id/notes` |
| **States** | Loading（全量数据加载）、Empty（旅行不存在 → 404）、Error |

**完成标准：**
- 旅行基本信息正确展示
- 路线图 + 航班卡片对应
- 照片画廊 + Lightbox 可用
- 手记展示 + 内联编辑可用

### 4.6 Wishlist 页面

| 属性 | 说明 |
|------|------|
| **路由** | `/wishlist` |
| **职责** | 管理"想去的国家/城市"清单 |
| **依赖页面** | 无独立依赖（数据独立） |
| **被依赖** | GlobeHome（通过快捷按钮进入） |
| **组件** | BaseCard, BaseChip, BaseButton, BaseInput, DestinationCard, NavPill, BaseModal, EmptyState, LoadingSpinner |
| **Composables** | useToast |
| **Store** | wishlistStore |
| **API** | `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:id` |
| **States** | Loading（列表加载）、Empty（"还没有想去的地方，点击 + 添加"）、Categories/Countries 切换 |
| **卡片展开** | Click 卡片 → 显示已保存城市列表 + 添加城市输入框 |

**完成标准：**
- 想去清单列表正确展示
- Countries / Cities 分类切换正常
- 添加/删除想去正确更新
- 卡片展开/收起动画正常

---

## 5. 公共组件规划

### 5.1 基础 UI 组件

| 组件 | Props | Events | 职责 | 复用场景 |
|------|-------|--------|------|----------|
| **BaseButton** | variant, size, disabled, loading, icon, round, fullWidth | @click | 统一按钮样式 | 全站所有按钮 |
| **BaseCard** | variant (default/photo/flight/destination), hoverable, padding | @click | 卡片容器 | 通用包裹器 |
| **BaseChip** | variant (active/default/wishlist), closable | @click, @close | 标签/筛选器 | 年份筛选、分类切换、标签 |
| **BaseInput** | modelValue, label, placeholder, type, error, prefixIcon | @update:modelValue | 文本输入 | 表单字段 |
| **BaseModal** | visible, title, width, closable | @close, @confirm | 模态对话框 | 确认弹窗、搜索浮层 |
| **Toast** | —（通过 composable 调用） | — | 操作反馈 | 全站通知 |
| **Lightbox** | visible, images, initialIndex | @close | 照片全屏查看 | 所有照片场景 |
| **EmptyState** | icon, title, description, ctaText | @cta-click | 空状态占位 | 所有列表空态 |
| **LoadingSpinner** | size | — | 加载指示器 | 全站 loading |
| **ConfirmDialog** | visible, title, message, confirmText, variant | @confirm, @cancel | 带确认/取消的弹窗 | 删除确认 |

### 5.2 布局组件

| 组件 | Props | 职责 | 复用场景 |
|------|-------|------|----------|
| **NavPill** | items, activeIndex, variant | 顶部浮动导航 | 所有页面 |
| **RecentTripStrip** | trips | 首页底部水平滚动卡片 | GlobeHome |

### 5.3 业务组件（按模块）

#### 地球模块

| 组件 | Props | 事件 | 职责 |
|------|-------|------|------|
| **Globe3D** | countries: CountryStatus[], visitedOnly: boolean | @country-click, @country-hover | 3D 地球渲染 + 交互 |
| **ContextGlobe** | countryCode: string | — | 右下角 80px 小地球，高亮当前国家位置 |

#### 地图模块

| 组件 | Props | 事件 | 职责 |
|------|-------|------|------|
| **CountryMap** | cities, routes, countryCode | @city-click | 国家页地图 |
| **RouteMap** | cities, routes, transportTypes, editable | @route-change | 旅行页路线图 |
| **CityMarker** | city, variant (visited/wishlist) | @click | 单个城市标点 |
| **RouteLine** | from, to, transportType, active | @click | 路线段 |

#### 旅行模块

| 组件 | Props | 事件 | 职责 |
|------|-------|------|------|
| **TripCard** | trip | @click | 旅行列表卡片（含封面+信息） |
| **TripMiniCard** | trip | @click | 首页小卡片（紧凑） |
| **FlightCard** | flight, stacked, index | @click, @hover | 航班登机牌 |
| **DayTimelineStrip** | days: DayInfo[], activeDay | @day-click | 天时间线导航 |
| **RouteEditor** | cities, routes | @update | 路线编辑（拖拽排序+交通方式选择） |
| **StatsHUD** | stats: StatsVO | — | 统计数字面板 |

#### 照片模块

| 组件 | Props | 事件 | 职责 |
|------|-------|------|------|
| **PhotoGrid** | photos: Photo[] | @photo-click | 不规则照片网格 |
| **PhotoCard** | photo, size | @click | 单张照片（含 hover 效果） |
| **PhotoUploader** | maxCount, uploaded | @upload | 拖拽上传区域 |

#### 其他

| 组件 | Props | 事件 | 职责 |
|------|-------|------|------|
| **NotesSection** | notesMd, editable | @update | 手记展示区 |
| **MarkdownEditor** | modelValue | @update:modelValue | Markdown 编辑 |
| **DestinationCard** | destination, expanded | @click, @bookmark | 想去清单卡片 |

---

## 6. API 规划

### 6.1 通用约定

```
Base URL: /api
Content-Type: application/json（除上传外）
响应格式: { code, message, data }
分页请求: ?page=1&pageSize=20
分页响应: { records: [], total, page, pageSize }
成功: code=200, data={...}
错误: code=4xx/5xx, message="错误信息"
```

### 6.2 接口清单

#### 国家接口

| # | Method | URL | 请求参数 | 响应 data | 分页 | 缓存 | MVP |
|---|--------|-----|----------|-----------|------|------|-----|
| C1 | GET | `/api/countries` | ?q=搜索关键词 | `Country[]`（id, code, name, flagEmoji） | ❌ | ✅ Redis | ✅ |
| C2 | GET | `/api/countries/visited` | 无 | `{ visited: CountryStatus[], wishlist: CountryStatus[] }` | ❌ | ✅ Redis 30s | ✅ |
| C3 | GET | `/api/countries/:code` | 路径参数 | `{ code, name, flagEmoji, continent, tripCount, cityCount, firstVisit, lastVisit }` | ❌ | ✅ Redis 60s | ✅ |
| C4 | GET | `/api/countries/:code/cities` | 路径参数 | `City[]`（id, name, lat, lng, visitCount, lastVisit） | ❌ | ✅ Redis 60s | ✅ |
| C5 | GET | `/api/countries/:code/trips` | 路径参数 + 分页 | `Trip[]`（分页） | ✅ | ❌ | ✅ |
| C6 | GET | `/api/countries/:code/photos` | 路径参数 + 分页 | `Photo[]`（分页） | ✅ | ❌ | ✅ |

#### 旅行接口

| # | Method | URL | 请求参数 | 响应 data | 分页 | 缓存 | MVP |
|---|--------|-----|----------|-----------|------|------|-----|
| T1 | GET | `/api/trips` | ?limit, ?country | `Trip[]` | ❌ | ❌ | ✅ |
| T2 | GET | `/api/trips/:id` | 路径参数 | `TripDetail`（含城市、路线） | ❌ | ❌ | ✅ |
| T3 | POST | `/api/trips` | `TripCreateReq` body（见下方） | `{ id }` | ❌ | ❌ | ✅ |
| T4 | PUT | `/api/trips/:id` | 路径参数 + `TripUpdateReq` body | `{ id }` | ❌ | ❌ | ✅ |
| T5 | DELETE | `/api/trips/:id` | 路径参数 | 无 | ❌ | ❌ | ✅ |

**TripCreateReq 格式：**
```json
{
  "countryCode": "FRA",
  "startDate": "2024-10-12",
  "endDate": "2024-10-19",
  "cities": [
    { "name": "Paris", "lat": 48.8566, "lng": 2.3522, "sortOrder": 1 }
  ],
  "routes": [
    { "fromCityIndex": 0, "toCityIndex": 0, "transportType": "FLIGHT", "flight": { ... } }
  ],
  "notesMd": "## Day 1\n..."
}
```

#### 路线接口

| # | Method | URL | 请求参数 | 响应 data | 分页 | 缓存 | MVP |
|---|--------|-----|----------|-----------|------|------|-----|
| R1 | GET | `/api/trips/:id/routes` | 路径参数 | `RouteSegment[]`（fromCity, toCity, transportType, sortOrder） | ❌ | ❌ | ✅ |

#### 航班接口

| # | Method | URL | 请求参数 | 响应 data | 分页 | 缓存 | MVP |
|---|--------|-----|----------|-----------|------|------|-----|
| F1 | GET | `/api/trips/:id/flights` | 路径参数 | `Flight[]`（flightNo, airline, aircraft, departureTime, arrivalTime, depAirport, arrAirport） | ❌ | ❌ | ✅ |

#### 照片接口

| # | Method | URL | 请求参数 | 响应 data | 分页 | 缓存 | MVP |
|---|--------|-----|----------|-----------|------|------|-----|
| P1 | GET | `/api/trips/:id/photos` | 路径参数 + 分页 | `Photo[]`（url, caption, takenAt, sortOrder） | ✅ | ❌ | ✅ |
| P2 | POST | `/api/trips/:id/photos` | multipart/form-data（多文件） | `Photo[]`（上传后的 URL 列表） | ❌ | ❌ | ✅ |
| P3 | PUT | `/api/photos/:id` | `{ caption, sortOrder }` body | 无 | ❌ | ❌ | ✅ |
| P4 | DELETE | `/api/photos/:id` | 路径参数 | 无 | ❌ | ❌ | ✅ |

#### 手记接口

| # | Method | URL | 请求参数 | 响应 data | 分页 | 缓存 | MVP |
|---|--------|-----|----------|-----------|------|------|-----|
| N1 | GET | `/api/trips/:id/notes` | 路径参数 | `{ notesMd: string }` | ❌ | ❌ | ✅ |
| N2 | PUT | `/api/trips/:id/notes` | `{ notesMd: string }` | 无 | ❌ | ❌ | ✅ |

#### 想去清单接口

| # | Method | URL | 请求参数 | 响应 data | 分页 | 缓存 | MVP |
|---|--------|-----|----------|-----------|------|------|-----|
| W1 | GET | `/api/wishlist` | ?type=COUNTRY\|CITY | `WishlistItem[]`（id, type, countryCode, countryName, cityName, note, cityCount） | ❌ | ❌ | ✅ |
| W2 | POST | `/api/wishlist` | `{ type, countryCode, cityName?, note? }` | `{ id }` | ❌ | ❌ | ✅ |
| W3 | DELETE | `/api/wishlist/:id` | 路径参数 | 无 | ❌ | ❌ | ✅ |

#### 统计接口

| # | Method | URL | 请求参数 | 响应 data | 分页 | 缓存 | MVP |
|---|--------|-----|----------|-----------|------|------|-----|
| S1 | GET | `/api/stats` | 无 | `{ countryCount, cityCount, tripCount, totalDays, flightCount, continentCount }` | ❌ | ✅ Redis 60s | ✅ |

---

## 7. 数据库规划

### 7.1 ER 关系图

```
countries ────── 1:N ────── trips ────── 1:N ────── photos
                               │
                               ├── 1:N ── trip_cities
                               │
                               ├── 1:N ── trip_routes ── 1:1 ── flights
                               │
                               └── 1:N ── trip_routes (as from→to)

countries ────── 1:N ────── wishlist (type=COUNTRY)
```

### 7.2 表结构

#### countries 表

```sql
CREATE TABLE countries (
    id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    code        VARCHAR(3)   NOT NULL UNIQUE          COMMENT 'ISO 3166-1 alpha-3',
    name        VARCHAR(100) NOT NULL                 COMMENT '英文名',
    name_cn     VARCHAR(100)                          COMMENT '中文名',
    flag_emoji  VARCHAR(10)                           COMMENT '国旗 emoji',
    continent   VARCHAR(20)                           COMMENT '大洲',
    created_at  DATETIME     NOT NULL DEFAULT NOW(),
    updated_at  DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    INDEX idx_continent (continent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='国家信息';
```

#### trips 表

```sql
CREATE TABLE trips (
    id           BIGINT       PRIMARY KEY AUTO_INCREMENT,
    user_id      BIGINT       NOT NULL DEFAULT 1      COMMENT '用户ID(MVP硬编码)',
    country_code VARCHAR(3)   NOT NULL                 COMMENT '国家代码',
    title        VARCHAR(200)                          COMMENT '旅行标题',
    start_date   DATE         NOT NULL                 COMMENT '开始日期',
    end_date     DATE         NOT NULL                 COMMENT '结束日期',
    notes_md     TEXT                                  COMMENT 'Markdown手记',
    is_deleted   TINYINT      NOT NULL DEFAULT 0       COMMENT '逻辑删除',
    created_at   DATETIME     NOT NULL DEFAULT NOW(),
    updated_at   DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    INDEX idx_user_id (user_id),
    INDEX idx_country_code (country_code),
    INDEX idx_start_date (start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='旅行记录';
```

#### trip_cities 表

```sql
CREATE TABLE trip_cities (
    id         BIGINT        PRIMARY KEY AUTO_INCREMENT,
    trip_id    BIGINT        NOT NULL                  COMMENT '关联旅行',
    city_name  VARCHAR(100)  NOT NULL                  COMMENT '城市名',
    lat        DECIMAL(10,7)                           COMMENT '纬度',
    lng        DECIMAL(10,7)                           COMMENT '经度',
    sort_order INT           NOT NULL DEFAULT 0        COMMENT '顺序',
    created_at DATETIME      NOT NULL DEFAULT NOW(),
    INDEX idx_trip_id (trip_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='旅行城市';
```

#### trip_routes 表

```sql
CREATE TABLE trip_routes (
    id             BIGINT       PRIMARY KEY AUTO_INCREMENT,
    trip_id        BIGINT       NOT NULL               COMMENT '关联旅行',
    from_city_id   BIGINT       NOT NULL               COMMENT '出发城市',
    to_city_id     BIGINT       NOT NULL               COMMENT '到达城市',
    transport_type VARCHAR(20)  NOT NULL DEFAULT 'OTHER' COMMENT 'FLIGHT/TRAIN/CAR/OTHER',
    sort_order     INT          NOT NULL DEFAULT 0     COMMENT '路线段顺序',
    created_at     DATETIME     NOT NULL DEFAULT NOW(),
    INDEX idx_trip_id (trip_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (from_city_id) REFERENCES trip_cities(id) ON DELETE CASCADE,
    FOREIGN KEY (to_city_id) REFERENCES trip_cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='旅行路线段';
```

#### flights 表

```sql
CREATE TABLE flights (
    id               BIGINT       PRIMARY KEY AUTO_INCREMENT,
    route_id         BIGINT       NOT NULL               COMMENT '关联路线段',
    flight_no        VARCHAR(20)                          COMMENT '航班号(AF111)',
    airline          VARCHAR(100)                         COMMENT '航空公司',
    aircraft         VARCHAR(50)                          COMMENT '机型',
    departure_time   DATETIME                             COMMENT '起飞时间',
    arrival_time     DATETIME                             COMMENT '降落时间',
    departure_airport VARCHAR(10)                         COMMENT '出发机场代码',
    arrival_airport   VARCHAR(10)                         COMMENT '到达机场代码',
    created_at       DATETIME     NOT NULL DEFAULT NOW(),
    INDEX idx_route_id (route_id),
    FOREIGN KEY (route_id) REFERENCES trip_routes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='航班信息';
```

#### photos 表

```sql
CREATE TABLE photos (
    id         BIGINT        PRIMARY KEY AUTO_INCREMENT,
    trip_id    BIGINT        NOT NULL                  COMMENT '关联旅行',
    url        VARCHAR(500)  NOT NULL                  COMMENT '文件路径',
    caption    VARCHAR(500)                            COMMENT '照片说明',
    taken_at   DATETIME                               COMMENT '拍摄时间(EXIF)',
    sort_order INT           NOT NULL DEFAULT 0        COMMENT '排序',
    created_at DATETIME      NOT NULL DEFAULT NOW(),
    INDEX idx_trip_id (trip_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='照片';
```

#### wishlist 表

```sql
CREATE TABLE wishlist (
    id           BIGINT       PRIMARY KEY AUTO_INCREMENT,
    user_id      BIGINT       NOT NULL DEFAULT 1       COMMENT '用户ID',
    type         VARCHAR(10)  NOT NULL                 COMMENT 'COUNTRY/CITY',
    country_code VARCHAR(3)                            COMMENT '国家代码',
    city_name    VARCHAR(100)                          COMMENT '城市名(type=CITY时)',
    note         VARCHAR(500)                          COMMENT '备注',
    is_deleted   TINYINT      NOT NULL DEFAULT 0       COMMENT '逻辑删除',
    created_at   DATETIME     NOT NULL DEFAULT NOW(),
    INDEX idx_user_id (user_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='想去清单';
```

### 7.3 表关系总结

| 表 A | 关系 | 表 B | 外键 | 级联 |
|------|------|------|------|------|
| countries | 1:N | trips | trips.country_code → countries.code | RESTRICT |
| trips | 1:N | trip_cities | trip_cities.trip_id → trips.id | CASCADE |
| trips | 1:N | trip_routes | trip_routes.trip_id → trips.id | CASCADE |
| trips | 1:N | photos | photos.trip_id → trips.id | CASCADE |
| trip_cities | 1:N | trip_routes (as from) | trip_routes.from_city_id → trip_cities.id | CASCADE |
| trip_cities | 1:N | trip_routes (as to) | trip_routes.to_city_id → trip_cities.id | CASCADE |
| trip_routes | 1:1 | flights | flights.route_id → trip_routes.id | CASCADE |
| countries | 1:N | wishlist | wishlist.country_code → countries.code | RESTRICT |

### 7.4 种子数据

**countries 表：** 约 200 条（ISO 3166-1 全部国家）。
从 open source 数据集导入，包含 code、name、flag_emoji、continent。

---

## 8. 开发阶段

### 总时间线

```
Phase 1 (2天)  ──── 基础框架搭建 ✅
Phase 2 (2天)  ──── 基础 UI 组件库 ✅
Phase 3 (1天)  ──── TripEditor 页面 ✅
Phase 4 (2天)  ──── 3D 地球模块 🔧 (Globe ✅, Map ➖)
────────────────
已完成: ~7 天

未来版本 (v0.2):
Phase 5 (2天)  ──── CountryDetail 页面
Phase 6 (2天)  ──── TripDetail 页面
Phase 7 (1天)  ──── Wishlist 页面
Phase 8 (2天)  ──── 联调与收尾
```

### Phase 1：基础框架搭建（2 天）

**目标：** 前后端项目可以运行 + 数据库就绪 + API skeleton

**Day 1 — 后端骨架：**

| Task | 组件 | 产出 |
|------|------|------|
| 1.1 | Spring Boot | 初始化项目，配置 Maven 依赖（web, mybatis-plus, mysql, redis, validation） |
| 1.2 | application.yml | 配置数据源、Redis、文件上传大小、服务器端口 |
| 1.3 | config 包 | CORS 配置、MyBatis-Plus 分页插件、日期序列化 |
| 1.4 | common 包 | Result 统一响应体、BusinessException、GlobalExceptionHandler |
| 1.5 | schema.sql | 执行 7 张表的建表 DDL |
| 1.6 | seed-data.sql | 导入国家种子数据（~200 个国家） |
| 1.7 | Entity + Mapper | 生成 7 个 Entity 类和对应 Mapper（可 MyBatis-Plus Code Generator） |
| 1.8 | 启动验证 | 项目能正常启动并连接数据库 |

**Day 2 — 前端骨架：**

| Task | 组件 | 产出 |
|------|------|------|
| 1.9 | 项目检查 | 确认 Vue3 + Vite + TypeScript + Router + Pinia + Element Plus 均正常 |
| 1.10 | Axios 封装 | api/client.ts — 配置 baseURL, 超时, 响应拦截 |
| 1.11 | types 定义 | country.ts, trip.ts, photo.ts, wishlist.ts, common.ts |
| 1.12 | api 各模块 | 6 个 api 文件（仅函数签名，返回 Promise<T>） |
| 1.13 | Pinia stores | appStore（主题）, countryStore, tripStore（框架） |
| 1.14 | CSS 主题验证 | 确认 style.css Design Tokens 正确应用 |
| 1.15 | 启动验证 | 前端能正常启动，页面可路由切换 |

**完成标准：**
- `mvn spring-boot:run` → 后端启动成功，数据库连接正常
- `npm run dev` → 前端启动成功，页面可切换
- 所有 API 文件函数签名已定义但返回 mock 数据或空数据

### Phase 2：基础 UI 组件库（2 天）

**目标：** 开发所有基础 UI 组件，建立可复用的组件库

**Day 3 — 基础组件：**

| Task | 组件 | 说明 |
|------|------|------|
| 2.1 | BaseButton | 4 种变体（Primary/Secondary/Ghost/Danger）+ 3 种尺寸 + loading + disabled |
| 2.2 | BaseCard | 4 种变体（Default/Photo/Flight/Destination）+ hover 动画 |
| 2.3 | BaseChip | 3 种变体（Active/Default/Wishlist）+ closable |
| 2.4 | BaseInput | 底部边框风格，label, error, prefixIcon, 验证状态 |
| 2.5 | BaseModal | visible/title/width/closable 控制，动画过渡 |

**Day 4 — 交互组件：**

| Task | 组件 | 说明 |
|------|------|------|
| 2.6 | Toast | 通过 composable useToast 调用，success/error/info 3 种类型 |
| 2.7 | Lightbox | 背景 92% 暗色，EXIF 底部胶囊，左右导航，键盘支持 |
| 2.8 | LoadingSpinner | Sunset Orange pulse 动画，3 种尺寸 |
| 2.9 | EmptyState | icon/title/description/ctaText 插槽 |
| 2.10 | ConfirmDialog | 基于 BaseModal，danger/warning 变体 |

**完成标准：**
- 所有组件在独立文件中有完整实现
- 组件支持所有 Props/Events/Slots（见第 5 章）
- 组件视觉符合 design.md 规范
- 可在其他页面中正常引入使用

### Phase 3：TripEditor 页面（1 天）

**目标：** 先做数据录入入口

| Task | 组件/文件 | 说明 |
|------|-----------|------|
| 3.1 | TripEditor.vue | 页面布局：表单 8 列居中 |
| 3.2 | 表单字段 | 国家下拉搜索、城市输入、日期选择 |
| 3.3 | RouteEditor.vue | 城市顺序拖拽 + 交通方式选择 |
| 3.4 | PhotoUploader.vue | 拖拽/点击上传 + 缩略图预览 + 删除 |
| 3.5 | MarkdownEditor.vue | Markdown 文本编辑区域 |
| 3.6 | TripController | C3 (POST), C4 (PUT), C5 (DELETE) |
| 3.7 | TripServiceImpl | 创建旅行事务（trip + cities + routes + flights + photos） |
| 3.8 | PhotoController | P2 (POST upload), P4 (DELETE) |
| 3.9 | PhotoServiceImpl | 文件存储 + 数据库记录 |

**完成标准：**
- 可以完整创建一次旅行（包含城市、路线、照片）
- 编辑旅行时可回填已有数据
- 表单验证正确（必填字段、日期逻辑）
- 照片上传后即时预览

### Phase 4：3D 地球模块（2 天）

**目标：** 可交互 3D 地球（Globe.GL / Three.js）。

**已完成 — 地球渲染：**

| Task | 组件/文件 | 状态 |
|------|-----------|------|
| 4.1 | Globe3D.vue | ✅ Three.js / Globe.GL 场景初始化 + GeoJSON 加载 |
| 4.2 | public/geojson/ | ✅ NPM globe.gl + countries-110m.json |
| 4.3 | useGlobe.ts | ✅ 地球生命周期 composable（init/destroy/resize） |
| 4.4 | Globe3D 渲染 | ✅ 国家多边形 + hover tooltip + click 交互 |
| 4.5 | ContextGlobe.vue | ✅ 右下角 80×80 小地球占位 |

**未开始 — 地图组件（Phase 6 遗留）：**

| Task | 组件/文件 | 说明 |
|------|-----------|------|
| 4.6 | useMap.ts | Leaflet 初始化 composable |
| 4.7 | CountryMap.vue | Leaflet 地图容器 |
| 4.8 | CityMarker / RouteLine | 城市标点 + 路线线工厂函数 |
| 4.9 | RouteMap.vue | 旅行路线地图 |

**未来版本 — 首页（v0.2 Phase 7）：**

| Task | 组件/文件 | 说明 |
|------|-----------|------|
| — | StatsHUD / StatsPanel | 统计面板 + odometer 动画 |
| — | RecentTripStrip / TripMiniCard | 底部水平滚动卡片 |
| — | GlobeHome.vue | 首页页面组装 |
| — | NavPill | 顶部浮动导航（已完成） |

**完成标准（当前基线）：**
- 3D 地球可旋转、缩放、hover、click
- 国家颜色按访问状态正确渲染（三种颜色）
- Click 国家 → 路由跳转
- ContextGlobe 高亮指定国家

### Phase 5：CountryDetail 页面（未来版本 v0.2）

**目标：** 国家详情 + 地图 + 照片 + 旅行列表

**Day 9 — 地图模块：**

| Task | 组件/文件 | 说明 |
|------|-----------|------|
| 5.1 | useMap.ts | Leaflet 初始化 composable（瓦片、缩放、事件） |
| 5.2 | CountryMap.vue | 国家地图容器 + CartoDB 瓦片 |
| 5.3 | CityMarker.vue | 自定义 DivIcon 城市标点（Sunset Orange / Forest Green） |
| 5.4 | RouteLine.vue | 城市间路线连线 + 颜色按交通方式 |

**Day 10 — 国家页面：**

| Task | 组件/文件 | 说明 |
|------|-----------|------|
| 5.5 | CountryController | C3, C4, C5, C6 |
| 5.6 | PhotoGrid.vue | CSS Grid dense 不规则网格 |
| 5.7 | PhotoCard.vue | 单张照片（14px 圆角 + hover scale） |
| 5.8 | TripCard.vue | 旅行列表卡片 |
| 5.9 | ContextGlobe.vue | 右下角 80px 小地球 |
| 5.10 | CountryDetail.vue | 组装国家页所有组件 |
| 5.11 | Lightbox 集成 | 照片点击 → Lightbox 全屏 |

**完成标准：**
- 国家信息、地图、城市标点、路线连线正确
- 照片网格展示 + Lightbox 可用
- 旅行列表可点击路由到 TripDetail
- 多状态处理（Loading/Empty/Error）

### Phase 6：TripDetail 页面（未来版本 v0.2）

**目标：** 旅行详情 + 航班卡片 + 天时间线 + 手记

**Day 11 — 航班卡片 + 路线：**

| Task | 组件/文件 | 说明 |
|------|-----------|------|
| 6.1 | FlightCard.vue | 登机牌风格（蓝色条 + Mono 数字 + 时间线） |
| 6.2 | RouteMap.vue | 旅行路线地图 + 交通图标 |
| 6.3 | DayTimelineStrip.vue | 水平滚动天时间线 |
| 6.4 | NotesSection.vue | 手记展示（Markdown 渲染 + 内联编辑） |

**Day 12 — 旅行页面：**

| Task | 组件/文件 | 说明 |
|------|-----------|------|
| 6.5 | TripController | T2, R1, F1, N1, N2, P1 |
| 6.6 | TripDetail.vue | 组装旅行页所有组件 |
| 6.7 | 航班堆叠效果 | 多卡片 ±0.5° 旋转交错 |
| 6.8 | 路线交互 | Hover 路线 → 线宽变化 + tooltip |
| 6.9 | 内联编辑 | 手记内联 Markdown 编辑 + 保存 |

**完成标准：**
- 旅行路线的地图展示 + 航班卡片对应
- 天时间线可点击跳转到对应照片区
- 手记展示 + 内联编辑 + 保存
- Lightbox 照片查看

### Phase 7：Wishlist 页面（未来版本 v0.2）

**目标：** 想去清单管理

| Task | 组件/文件 | 说明 |
|------|-----------|------|
| 7.1 | WishlistController | W1, W2, W3 |
| 7.2 | DestinationCard.vue | 卡片 + 展开/收起城市列表 |
| 7.3 | Wishlist.vue | 页面组装 + 分类切换 |
| 7.4 | 添加功能 | 搜索浮层 + 添加国家/城市 |

**完成标准：**
- 想去清单列表展示 + Countries/Cities 切换
- 添加/删除功能正确
- 卡片展开动画流畅

### Phase 8：联调与收尾（未来版本 v0.2）

**目标：** 全流程联调 + 缺漏补齐 + 打磨

| Task | 说明 |
|------|------|
| 8.1 | 全流程测试 | TripEditor → GlobeHome → CountryDetail → TripDetail → Wishlist |
| 8.2 | 深色主题 | 确认 [data-theme="dark"] 所有组件颜色正确 |
| 8.3 | 边界状态 | 所有页面补全 Loading/Empty/Error 状态 |
| 8.4 | 过渡动画 | 页面过渡 + 组件入场动画完整 |
| 8.5 | 照片上传 | 压缩、验证、上传进度、错误处理 |
| 8.6 | 性能检查 | 地球 GPU 内存释放、图片懒加载、路由懒加载 |

**完成标准：**
- 完整用户流程可用：创建旅行 → 地球查看 → 国家详情 → 旅行详情
- 深色模式所有组件适配正确
- 无控制台错误（warning/error）
- 无明显性能问题

---

## 9. 风险分析

| 风险 | 概率 | 影响 | 应对方案 |
|------|------|------|----------|
| **R1: Globe.GL 文档不完善或 API 变更** | 中 | 高 | 备选方案：直接用 Three.js + react-globe.gl（社区维护更活跃）。MVP 阶段只需要国家多边形着色 + 点击，Three.js 原生实现也不复杂 |
| **R2: Three.js 地球 GPU 内存泄漏** | 中 | 中 | 组件卸载时必须调用 `scene.dispose()`、`renderer.dispose()`、移除所有 event listener。使用 composable 封装生命周期 |
| **R3: GeoJSON 文件过大（countries-110m.json 约 1.5MB）** | 低 | 中 | 压缩方案：使用 TopoJSON（约 300KB）。加载方案：页面入口时 prefetch，不阻塞渲染 |
| **R4: 照片上传失败（大文件、网络中断）** | 中 | 中 | 客户端限制单张 ≤ 10MB，前端压缩到 ≤ 2400px 宽边。上传失败可重试，保留上传队列状态 |
| **R5: Leaflet 与 Vue 生命周期不匹配** | 中 | 中 | 封装在 composable 中管理：`onMounted` 初始化、`onUnmounted` 销毁。不直接使用 `vue-leaflet` |
| **R6: Element Plus 主题覆盖不到位** | 中 | 低 | 在 style.css 中覆盖 CSS 变量（已完成）。对于深度封装的组件（如 DatePicker），用 `:deep()` 选择器覆盖 |
| **R7: MVP 范围膨胀** | 高 | 中 | 严格执行"MVP 不做清单"。任何新功能需求先问："这个不做会死吗？" |
| **R8: 前端组件耦合过高** | 低 | 中 | 组件只通过 props/events 通信，不直接引用 store。业务组件可引用 store，基础 UI 组件不准 |
| **R9: 数据一致性（创建旅行事务）** | 低 | 高 | 一次创建涉及 trips + trip_cities + trip_routes + flights + photos 5 张表。全部在 Service 层用一个 `@Transactional` 包裹 |
| **R10: 城市坐标数据缺失** | 中 | 低 | MVP 阶段手动输入常见城市坐标（约 100 个热门旅行城市）。v0.2 接入 Nominatim 地理编码 |

---

## 10. 最终 TODO — 可执行 Checklist

> ✅ = 完成 &ensp; 🔧 = 进行中 &ensp; ⬜ = 未开始

### Phase 1：基础框架搭建

```
✅ 1.1 后端（未开始 — 纯前端项目）
✅ 1.2 前端
    ✅ types 定义 ✓
    ✅ Vite + Vue3 + Router + Pinia 可用
    ✅ Theme 切换 composable
    ✅ style.css Design Tokens 就绪
    ✅ 项目启动无报错
```

### Phase 2：基础 UI 组件库

```
✅ 2.1 AppButton ✓    ✅ 2.2 AppCard ✓    ✅ 2.3 AppChip ✓
✅ 2.4 AppInput ✓    ✅ 2.5 AppModal ✓
✅ AppIcon / AppIconButton / AppBadge / AppDivider / AppSkeleton
✅ AppSpinner / AppProgress / AppTooltip / AppSwitch
✅ AppCheckbox / AppRadio / AppTextarea / AppSelect
✅ Toast ✓           ✅ AppEmptyState ✓  ✅ AppPagination ✓  ✅ AppTabs ✓

🔧 分子组件（shared/）未实现：SearchInput / DateRangeField / TransportIcon 等 20 个
```

### Phase 3：TripEditor 页面

```
✅ 3.1–3.7 TripEditor 页面 + RouteEditor + PhotoUploader + NotesViewer
⬜ 3.8–3.14 后端相关（未开始 — 纯前端项目）
```

### Phase 4：3D 地球模块

```
✅ 4.1 Globe3D.vue（globe.gl + GeoJSON 国家 Overlay）
✅ 4.2 composables/useGlobe.ts
✅ 4.3 ContextGlobe.vue（80x80 小地球）

⬜ 4.4–4.6 地图组件（useMap / CountryMap / CityMarker / RouteLine / RouteMap）— 待补充
⬜ 4.7–4.8 后台接口（未开始）

⬜ 4.9–4.19 GlobeHome 首页组件（StatsPanel / TripMiniCard / 入场动画）— 未来版本 v0.2
```

### Phase 5–8：页面组装与联调（未来版本 v0.2）

```
⬜ Phase 5  CountryDetail 页面（地图 + 照片 + 旅行列表）
⬜ Phase 6  TripDetail 页面（航班卡片 + 时间线 + 手记）
⬜ Phase 7  Wishlist 页面（目的地卡片网格）
⬜ Phase 8  联调与收尾
```

---

> **最后更新：** 2026-07-21（回退到 P6 基线）  
> **当前状态：** Phase 1–3 完成，Phase 4 部分完成（Globe 3D ✅，Map ⬜，Home ⬜）  
> **开发顺序：** Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5–8（v0.2）  
> **预期工时（已投入）：** ~7 个工作日  
> **当前可用的页面：** TripEditor（新增/编辑旅行）、Timeline（骨架）、Playground（组件展示）  
> **下一阶段：** 完成 Phase 4 遗留地图组件 → 进入 Phase 5–8（v0.2）
