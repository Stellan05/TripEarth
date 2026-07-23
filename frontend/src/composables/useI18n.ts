/**
 * 简易 i18n — MVP 阶段支持中/英切换，后续可替换为 vue-i18n
 * 默认语言：中文
 */
import { ref, computed } from 'vue'

/** 支持的语言 */
export type Locale = 'zh-CN' | 'en'

/** 翻译词条（扁平 key → 文案） */
export interface LocaleMessages {
  [key: string]: string
}

// ===== 词条定义 =====
const zhCN: LocaleMessages = {
  // 通用
  'app.name': 'Travel Atlas',
  'app.tagline': '记录每一次旅行',

  // 导航
  'nav.globe': '地球',
  'nav.map': '地图',
  'nav.timeline': '时间轴',
  'nav.wishlist': '想去',
  'nav.newTrip': '新增旅行',

  // 首页
  'home.stats.countries': '已去国家',
  'home.stats.cities': '已去城市',
  'home.stats.trips': '旅行次数',
  'home.recentTrips': '最近旅行',
  'home.viewAll': '查看全部',
  'home.empty.title': '还没有旅行记录',
  'home.empty.desc': '开始记录你的第一次旅行，让地球上的每一个角落都留下回忆。',
  'home.empty.cta': '开始第一次旅行',
  'home.quick.newTrip': '新增旅行',
  'home.quick.wishlist': '想去清单',
  'home.quick.timeline': '浏览时间轴',
  'home.welcome': '欢迎回来，旅行者',
  'home.today': '继续探索你的旅行记忆',
  'home.loading': '正在加载你的旅行地图…',
  'home.stats.flights': '飞行次数',
  'home.stats.wishlist': '收藏目的地',
  'home.stats.regions': '已去地区',
  'home.wishlist.title': '想去的目的地',
  'home.wishlist.viewAll': '查看全部',
  'home.quick.browseMap': '浏览地图',
  'home.quick.viewStats': '查看统计',
  'home.quick.uploadPhotos': '上传照片',
  'home.switchToLocal': '切换至本地地图',
  'home.switchToGlobal': '切换至全球地球',
  'home.local': '本地',
  'home.global': '全球',

  // 主题
  'theme.light': '浅色',
  'theme.dark': '深色',

  // Playground
  'playground.title': '组件库',
  'playground.subtitle': 'Phase 2 — Base UI Components · Travel Atlas',
  'playground.forms': '表单',
  'playground.display': '展示',
  'playground.feedback': '反馈',
  'playground.navigation': '导航',
  'playground.layouts': '布局',
}

const enUS: LocaleMessages = {
  'app.name': 'Travel Atlas',
  'app.tagline': 'Capture every journey',

  'nav.globe': 'Globe',
  'nav.map': 'Map',
  'nav.timeline': 'Timeline',
  'nav.wishlist': 'Wishlist',
  'nav.newTrip': 'New Trip',

  'home.stats.countries': 'Countries',
  'home.stats.cities': 'Cities',
  'home.stats.trips': 'Trips',
  'home.recentTrips': 'Recent Trips',
  'home.viewAll': 'View All',
  'home.empty.title': 'No trips yet',
  'home.empty.desc': 'Start recording your first journey and leave memories in every corner of the globe.',
  'home.empty.cta': 'Start First Trip',
  'home.quick.newTrip': 'New Trip',
  'home.quick.wishlist': 'Wishlist',
  'home.quick.timeline': 'Timeline',
  'home.welcome': 'Welcome back, traveler',
  'home.today': 'Continue exploring your travel memories',
  'home.loading': 'Loading your travel map…',
  'home.stats.flights': 'Flights',
  'home.stats.wishlist': 'Wishlist',
  'home.stats.regions': 'Regions',
  'home.wishlist.title': 'Destinations',
  'home.wishlist.viewAll': 'View All',
  'home.quick.browseMap': 'Browse Map',
  'home.quick.viewStats': 'View Stats',
  'home.quick.uploadPhotos': 'Upload Photos',
  'home.switchToLocal': 'Switch to local map',
  'home.switchToGlobal': 'Switch to global globe',
  'home.local': 'Local',
  'home.global': 'Global',

  'theme.light': 'Light',
  'theme.dark': 'Dark',

  'playground.title': 'Component Library',
  'playground.subtitle': 'Phase 2 — Base UI Components · Travel Atlas',
  'playground.forms': 'Forms',
  'playground.display': 'Display',
  'playground.feedback': 'Feedback',
  'playground.navigation': 'Navigation',
  'playground.layouts': 'Layouts',
}

const messages: Record<Locale, LocaleMessages> = {
  'zh-CN': zhCN,
  en: enUS,
}

// ===== 全局状态 =====
const currentLocale = ref<Locale>(loadLocale())

function loadLocale(): Locale {
  try {
    const stored = localStorage.getItem('travel-atlas-locale')
    if (stored === 'zh-CN' || stored === 'en') return stored
  } catch { /* ignore */ }
  // 默认中文
  return 'zh-CN'
}

function saveLocale(locale: Locale) {
  try {
    localStorage.setItem('travel-atlas-locale', locale)
  } catch { /* ignore */ }
}

// ===== Composable =====
export function useI18n() {
  /** 翻译函数 */
  const t = computed(() => (key: string): string => {
    return messages[currentLocale.value][key] ?? key
  })

  /** 当前语言 */
  const locale = computed(() => currentLocale.value)

  /** 切换语言 */
  function setLocale(loc: Locale) {
    currentLocale.value = loc
    saveLocale(loc)
  }

  /** 所有支持的语言 */
  const availableLocales: { value: Locale; label: string }[] = [
    { value: 'zh-CN', label: '中文' },
    { value: 'en', label: 'English' },
  ]

  return { t: t.value, locale, setLocale, availableLocales }
}
