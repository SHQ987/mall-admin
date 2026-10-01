import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const roles = Mock.mock({
  'list|9': [{ id: '@increment', roleName: '@pick(["超级管理员","运营角色","财务","客服","访客"])', remark: '@cword(4,8)' }]
}).list

// 菜单树（用于菜单管理模块与角色分配权限）
const menuTree = [
  {
    id: 1,
    name: '商品管理',
    code: 'Product',
    level: 1,
    pid: 0,
    children: [
      { id: 11, name: '品牌管理', code: 'Trademark', level: 2, pid: 1, children: [] },
      { id: 12, name: '平台属性管理', code: 'Attr', level: 2, pid: 1, children: [] },
      { id: 13, name: 'SPU管理', code: 'Spu', level: 2, pid: 1, children: [] },
      { id: 14, name: 'SKU管理', code: 'Sku', level: 2, pid: 1, children: [] }
    ]
  },
  {
    id: 2,
    name: '权限管理',
    code: 'Acl',
    level: 1,
    pid: 0,
    children: [
      { id: 21, name: '用户管理', code: 'User', level: 2, pid: 2, children: [] },
      { id: 22, name: '角色管理', code: 'Role', level: 2, pid: 2, children: [] },
      { id: 23, name: '菜单管理', code: 'Permission', level: 2, pid: 2, children: [] }
    ]
  },
  { id: 3, name: '数据大屏', code: 'Screen', level: 1, pid: 0, children: [] }
]

const ok = (data: any = null, message = 'success') => ({ code: 200, message, data })

export default [
  {
    url: '/api/admin/acl/role/:page/:limit',
    method: 'get',
    response: ({ query }: any) => {
      const keyword = (query.roleName as string) || ''
      const filtered = keyword ? roles.filter((r: any) => r.roleName.includes(keyword)) : roles
      return ok({ records: filtered, total: filtered.length })
    }
  },
  {
    url: '/api/admin/acl/role/save',
    method: 'post',
    response: ({ body }: any) => {
      roles.unshift({ id: Date.now(), ...body })
      return ok()
    }
  },
  {
    url: '/api/admin/acl/role/update',
    method: 'post',
    response: ({ body }: any) => {
      const idx = roles.findIndex((r: any) => r.id === body.id)
      if (idx > -1) roles[idx] = { ...roles[idx], ...body }
      return ok()
    }
  },
  {
    url: '/api/admin/acl/role/remove/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      const idx = roles.findIndex((r: any) => r.id === id)
      if (idx > -1) roles.splice(idx, 1)
      return ok()
    }
  },
  {
    url: '/api/admin/acl/permission/toAssign/:roleId',
    method: 'get',
    response: () => ok({ menuList: menuTree, checkedKeys: [11, 21, 3] })
  },
  {
    url: '/api/admin/acl/permission/doAssign',
    method: 'post',
    response: () => ok()
  }
] as MockMethod[]
