import type { RouteRecordRaw } from 'vue-router'

// 菜单 meta 扩展类型
export interface MenuMeta {
  title: string
  icon?: string
  hidden?: boolean
}

// 常量路由（无需权限，任何登录用户均可访问）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404/index.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },
  // 任意路由 -> 兜底 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: { title: '任意路由', hidden: true }
  }
]
