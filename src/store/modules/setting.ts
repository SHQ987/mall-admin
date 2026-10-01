import { defineStore } from 'pinia'
import layoutSetting from '@/settings'

interface SettingState {
  isCollapse: boolean
  dark: boolean
  themeColor: string
}

function applyDark(dark: boolean) {
  const el = document.documentElement
  if (dark) el.classList.add('dark')
  else el.classList.remove('dark')
}

function applyTheme(color: string) {
  const el = document.documentElement
  el.style.setProperty('--el-color-primary', color)
  // 派生主色阶梯变量（Element Plus 风格）
  const mix = (c: string, weight: number) => {
    const t = weight < 0 ? 0 : 255
    const w = Math.abs(weight)
    const rgb = c.match(/\w\w/g)!.map((x) => parseInt(x, 16))
    const mixed = rgb.map((v) => Math.round((t - v) * w + v))
    return `rgb(${mixed.join(',')})`
  }
  for (let i = 1; i <= 9; i++) {
    el.style.setProperty(`--el-color-primary-light-${i}`, mix(color.replace('#', ''), i * 0.1))
  }
}

export const useSettingStore = defineStore('Setting', {
  state: (): SettingState => ({
    isCollapse: layoutSetting.sidebarCollapsed,
    dark: layoutSetting.darkMode,
    themeColor: layoutSetting.themeColor
  }),
  actions: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    setDark(val: boolean) {
      this.dark = val
      applyDark(val)
    },
    setThemeColor(color: string) {
      this.themeColor = color
      applyTheme(color)
    },
    initTheme() {
      applyDark(this.dark)
      applyTheme(this.themeColor)
    }
  }
})
