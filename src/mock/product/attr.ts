import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const c1 = Mock.mock({ 'list|5': [{ id: '@increment', name: '@cword(2,4)' }] }).list
const c2 = Mock.mock({ 'list|8': [{ id: '@increment', name: '@cword(2,4)' }] }).list
const c3 = Mock.mock({ 'list|12': [{ id: '@increment', name: '@cword(2,4)' }] }).list

const attrMap: Record<number, any[]> = {}
c3.forEach((c: any) => {
  attrMap[c.id] = Mock.mock({
    'list|3-6': [
      {
        id: '@increment',
        attrName: '@cword(2,5)',
        attrValueList: Mock.mock({ 'vals|2-4': ['@cword(1,3)'] }).vals.map((v: string) => ({
          id: Mock.mock('@increment'),
          valueName: v
        }))
      }
    ]
  }).list
})

const ok = (data: any = null, message = 'success') => ({ code: 200, message, data })

export default [
  { url: '/api/admin/product/getCategory1', method: 'get', response: () => ok(c1) },
  {
    url: '/api/admin/product/getCategory2/:id',
    method: 'get',
    response: () => ok(c2)
  },
  {
    url: '/api/admin/product/getCategory3/:id',
    method: 'get',
    response: () => ok(c3)
  },
  {
    url: '/api/admin/product/attrInfoList/:c1/:c2/:c3',
    method: 'get',
    response: ({ url }: any) => {
      const c3id = +url.split('/').pop()
      return ok(attrMap[c3id] || [])
    }
  },
  {
    url: '/api/admin/product/saveAttrInfo',
    method: 'post',
    response: () => ok()
  },
  {
    url: '/api/admin/product/deleteAttr/:id',
    method: 'delete',
    response: () => ok()
  }
] as MockMethod[]
