import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'virtual:svg-icons-register'
import '@/styles/index.scss'

import App from './App.vue'
import pinia from '@/store'
import router from '@/router'
import { setupPermissionDirective } from '@/directive/has'
import { useSettingStore } from '@/store/modules/setting'

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
setupPermissionDirective(app)

// 初始化主题（暗黑 / 主题色）
useSettingStore().initTheme()

app.mount('#app')
