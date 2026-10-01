import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 内存数据
const users = Mock.mock({
  'list|27': [
    {
      id: '@increment',
      username: '@first',
      nickName: '@cname',
      roleName: '@pick(["管理员","运营","访客"])',
      gmtCreate: '@datetime',
      gmtModified: '@datetime'
    }
  ]
}).list

const roles = Mock.mock({
  'list|9': [{ id: '@increment', roleName: '@pick(["超级管理员","运营角色","财务","客服","访客"])', remark: '@cword(4,8)' }]
}).list

const ok = (data: any = null, message = 'success') => ({ code: 200, message, data })

export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: () => ok('mall-token-' + Date.now())
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      const routes = ['Product', 'Trademark', 'Attr', 'Spu', 'Sku', 'Acl', 'User', 'Role', 'Permission', 'Screen']
      const buttons = [
        'btn.Trademark.add',
        'btn.Trademark.update',
        'btn.Trademark.remove',
        'btn.User.add',
        'btn.User.update',
        'btn.User.remove',
        'btn.User.assgin',
        'btn.Role.add',
        'btn.Role.update',
        'btn.Role.remove',
        'btn.Permission.add',
        'btn.Permission.update',
        'btn.Permission.remove'
      ]
      return ok({ name: 'admin', avatar: 'https://avatars.githubusercontent.com/u/0?v=4', routes, buttons, roles: ['admin'] })
    }
  },
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => ok()
  },
  {
    url: '/api/admin/acl/user/:page/:limit',
    method: 'get',
    response: ({ query }: any) => {
      const keyword = (query.username as string) || ''
      const filtered = keyword ? users.filter((u: any) => u.username.includes(keyword)) : users
      return ok({ records: filtered, total: filtered.length })
    }
  },
  {
    url: '/api/admin/acl/user/save',
    method: 'post',
    response: ({ body }: any) => {
      users.unshift({ id: Date.now(), gmtCreate: new Date().toISOString(), ...body })
      return ok()
    }
  },
  {
    url: '/api/admin/acl/user/update',
    method: 'post',
    response: ({ body }: any) => {
      const idx = users.findIndex((u: any) => u.id === body.id)
      if (idx > -1) users[idx] = { ...users[idx], ...body }
      return ok()
    }
  },
  {
    url: '/api/admin/acl/user/remove/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      const idx = users.findIndex((u: any) => u.id === id)
      if (idx > -1) users.splice(idx, 1)
      return ok()
    }
  },
  {
    url: '/api/admin/acl/user/toAssign/:userId',
    method: 'get',
    response: () => ok({ assignRoles: roles.slice(0, 2), allRolesList: roles })
  },
  {
    url: '/api/admin/acl/user/doAssignRole',
    method: 'post',
    response: () => ok()
  }
] as MockMethod[]
