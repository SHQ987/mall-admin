import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const trademarks = Mock.mock({
  'list|21': [
    {
      id: '@increment',
      tmName: '@pick(["苹果","华为","小米","OPPO","vivo","三星","荣耀","一加","realme","红米"])',
      logoUrl: 'https://picsum.photos/seed/@integer(1,999)/120/120'
    }
  ]
}).list

const ok = (data: any = null, message = 'success') => ({ code: 200, message, data })

export default [
  {
    url: '/api/admin/product/baseTrademark/:page/:limit',
    method: 'get',
    response: ({ url }: any) => {
      const parts = url.split('/')
      const p = +parts[parts.length - 2]
      const l = +parts[parts.length - 1]
      const start = (p - 1) * l
      return ok({ records: trademarks.slice(start, start + l), total: trademarks.length })
    }
  },
  {
    url: '/api/admin/product/baseTrademark/save',
    method: 'post',
    response: ({ body }: any) => {
      trademarks.unshift({ id: Date.now(), ...body })
      return ok()
    }
  },
  {
    url: '/api/admin/product/baseTrademark/update',
    method: 'post',
    response: ({ body }: any) => {
      const idx = trademarks.findIndex((t: any) => t.id === body.id)
      if (idx > -1) trademarks[idx] = { ...trademarks[idx], ...body }
      return ok()
    }
  },
  {
    url: '/api/admin/product/baseTrademark/remove/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      const idx = trademarks.findIndex((t: any) => t.id === id)
      if (idx > -1) trademarks.splice(idx, 1)
      return ok()
    }
  },
  {
    url: '/api/admin/product/baseTrademark/getTrademarkList',
    method: 'get',
    response: () => ok(trademarks)
  }
] as MockMethod[]
