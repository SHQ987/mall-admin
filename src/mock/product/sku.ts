import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const skus = Mock.mock({
  'list|47': [
    {
      id: '@increment',
      skuName: '@cword(4,8)',
      price: '@integer(99,9999)',
      weight: '@integer(1,50)',
      skuDefaultImg: 'https://picsum.photos/seed/@integer(1,999)/120/120',
      isSale: '@integer(0,1)'
    }
  ]
}).list

const ok = (data: any = null, message = 'success') => ({ code: 200, message, data })

export default [
  {
    url: '/api/admin/product/list/:page/:limit',
    method: 'get',
    response: ({ url }: any) => {
      const parts = url.split('/')
      const p = +parts[parts.length - 2]
      const l = +parts[parts.length - 1]
      const start = (p - 1) * l
      return ok({ records: skus.slice(start, start + l), total: skus.length })
    }
  },
  {
    url: '/api/admin/product/onSale/:id',
    method: 'get',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      const s = skus.find((x: any) => x.id === id)
      if (s) s.isSale = 1
      return ok()
    }
  },
  {
    url: '/api/admin/product/cancelSale/:id',
    method: 'get',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      const s = skus.find((x: any) => x.id === id)
      if (s) s.isSale = 0
      return ok()
    }
  },
  {
    url: '/api/admin/product/deleteSku/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      const idx = skus.findIndex((x: any) => x.id === id)
      if (idx > -1) skus.splice(idx, 1)
      return ok()
    }
  }
] as MockMethod[]
