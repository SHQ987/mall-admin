import { MockMethod } from 'vite-plugin-mock'

// 菜单权限树（与角色模块共享结构，这里作为菜单管理模块的展示/编辑数据）
let menuTree = [
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

// 扁平化成可递归渲染的结构
const toList = (nodes: any[], pid = 0, level = 1): any[] =>
  nodes.map((n) => ({
    id: n.id,
    name: n.name,
    code: n.code,
    level,
    pid: n.pid ?? pid,
    children: n.children ? toList(n.children, n.id, level + 1) : []
  }))

export default [
  {
    url: '/api/admin/acl/permission',
    method: 'get',
    response: () => ok(toList(menuTree))
  },
  {
    url: '/api/admin/acl/permission/save',
    method: 'post',
    response: ({ body }: any) => {
      const node = { id: Date.now(), name: body.name, code: body.code, level: body.level, pid: body.pid, children: [] }
      if (body.level === 1) menuTree.push(node)
      else {
        const parent = menuTree.find((m) => m.id === body.pid)
        parent?.children.push(node)
      }
      return ok()
    }
  },
  {
    url: '/api/admin/acl/permission/update',
    method: 'post',
    response: ({ body }: any) => {
      const find = (nodes: any[]): any => {
        for (const n of nodes) {
          if (n.id === body.id) return n
          if (n.children) {
            const r = find(n.children)
            if (r) return r
          }
        }
      }
      const node = find(menuTree)
      if (node) {
        node.name = body.name
        node.code = body.code
      }
      return ok()
    }
  },
  {
    url: '/api/admin/acl/permission/remove/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      const remove = (nodes: any[]): boolean => {
        const idx = nodes.findIndex((n) => n.id === id)
        if (idx > -1) {
          nodes.splice(idx, 1)
          return true
        }
        return nodes.some((n) => n.children && remove(n.children))
      }
      remove(menuTree)
      return ok()
    }
  }
] as MockMethod[]
