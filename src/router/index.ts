import { createRouter, createWebHistory } from 'vue-router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { constantRoutes } from './constant'
import { getToken } from '@/utils/token'
import { useUserStore } from '@/store/modules/user'

nprogress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 })
})

// 白名单（无需登录）
const whiteList = ['/login', '/404']

router.beforeEach(async (to, _from, next) => {
  nprogress.start()
  const token = getToken()
  if (token) {
    if (to.path === '/login') {
      next('/')
      nprogress.done()
      return
    }
    const userStore = useUserStore()
    if (userStore.name) {
      next()
      return
    }
    try {
      const accessibleRoutes = await userStore.getUserInfo()
      // 动态挂载异步路由到 Layout 下
      accessibleRoutes.forEach((route) => {
        router.addRoute('Layout', route)
      })
      // 重新进入目标路由，确保动态路由生效
      next({ ...to, replace: true })
    } catch (err) {
      await userStore.userLogout()
      next('/login')
      nprogress.done()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nprogress.done()
    }
  }
})

router.afterEach(() => {
  nprogress.done()
})

export default router
