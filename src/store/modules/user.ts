import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes, type MenuMeta } from '@/router/constant'
import asyncRoutes from '@/router/asyncRoute'
import { getToken, setToken, removeToken } from '@/utils/token'
import { loginApi, getUserInfoApi, logoutApi } from '@/api/user'

function cloneRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.map((route) => {
    const cloned = { ...route }
    if (cloned.children) cloned.children = cloneRoutes(cloned.children)
    return cloned
  })
}
// 根据后端返回的可访问路由名，递归过滤异步路由
function filterAsyncRoute(routes: RouteRecordRaw[], allowed: string[]): RouteRecordRaw[] {
  return routes.filter((route) => {
    if (route.children && route.children.length) {
      route.children = filterAsyncRoute(route.children, allowed)
    }
    // 顶层无 component 的父级（如 Product/Acl）按 name 判断；带 component 的叶子按 name 判断
    return allowed.includes(route.name as string)
  })
}

interface UserInfo {
  name: string
  avatar: string
  buttons: string[]
  roles: string[]
}

interface UserState {
  token: string
  name: string
  avatar: string
  buttons: string[]
  menuRoutes: RouteRecordRaw[]
}

export const useUserStore = defineStore('User', {
  state: (): UserState => ({
    token: getToken(),
    name: '',
    avatar: '',
    buttons: [],
    menuRoutes: constantRoutes
  }),
  actions: {
    async userLogin(data: { username: string; password: string }) {
      const res = await loginApi(data)
      const token = res.data as string
      setToken(token)
      this.token = token
    },
    async getUserInfo() {
      const res = await getUserInfoApi()
      const info = res.data as UserInfo & { routes: string[] }
      this.name = info.name
      this.avatar = info.avatar
      this.buttons = info.buttons || []
      // 过滤出当前用户有权访问的异步路由
      const cloned = cloneRoutes(asyncRoutes)
      const accessible = filterAsyncRoute(cloned, info.routes || [])
      this.menuRoutes = [...constantRoutes, ...accessible]
      return accessible
    },
    async userLogout() {
      try {
        await logoutApi()
      } catch {
        /* 忽略登出接口异常 */
      }
      removeToken()
      this.token = ''
      this.name = ''
      this.avatar = ''
      this.buttons = []
      this.menuRoutes = constantRoutes
      import('@/router').then((m) => {
        m.default.push('/login')
      })
    }
  }
})

export type { MenuMeta }
