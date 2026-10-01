import type { RouteRecordRaw } from 'vue-router'
import type { MenuMeta } from './constant'

// 异步路由（需经后端返回的可访问路由名过滤后，作为子路由动态挂载到 Layout 下）
const asyncRoutes: RouteRecordRaw[] = [
  {
    path: 'product',
    name: 'Product',
    redirect: '/product/trademark',
    meta: { title: '商品管理', icon: 'product' } as MenuMeta,
    children: [
      {
        path: 'trademark',
        name: 'Trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: { title: '品牌管理', icon: 'trademark' } as MenuMeta
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: { title: '平台属性管理', icon: 'attr' } as MenuMeta
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: { title: 'SPU管理', icon: 'spu' } as MenuMeta
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: { title: 'SKU管理', icon: 'sku' } as MenuMeta
      }
    ]
  },
  {
    path: 'acl',
    name: 'Acl',
    redirect: '/acl/user',
    meta: { title: '权限管理', icon: 'acl' } as MenuMeta,
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/acl/user/index.vue'),
        meta: { title: '用户管理', icon: 'acl' } as MenuMeta
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/acl/role/index.vue'),
        meta: { title: '角色管理', icon: 'role' } as MenuMeta
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: { title: '菜单管理', icon: 'permission' } as MenuMeta
      }
    ]
  },
  {
    path: 'screen',
    name: 'Screen',
    component: () => import('@/views/screen/index.vue'),
    meta: { title: '数据大屏', icon: 'screen' } as MenuMeta
  }
]

export default asyncRoutes
