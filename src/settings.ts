// 项目级默认配置（环境变量与主题配置）
export default {
  title: import.meta.env.VITE_APP_TITLE || 'mall-admin',
  // 是否展示设置抽屉（主题/暗黑切换）
  showSettings: true,
  // 默认折叠
  sidebarCollapsed: false,
  // 默认主题色
  themeColor: '#409eff',
  // 默认暗黑模式
  darkMode: false
}
