import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/appStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 初始化主题（从 localStorage 或系统偏好读取）
const appStore = useAppStore()
appStore.initTheme()

app.mount('#app')
