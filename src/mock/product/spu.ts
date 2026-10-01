import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const spus = Mock.mock({
  'list|33': [
    {
      id: '@increment',
      spuName: '@cword(4,8)',
      description: '@cword(10,20)',
      category3Id: '@integer(1,12)',
      tmId: '@integer(1,10)',
      spuImageList: Mock.mock({ 'imgs|2-4': [{ imgName: '@cword(2,4)', imgUrl: 'https://picsum.photos/seed/@integer(1,999)/200/200' }] }).imgs,
      spuSaleAttrList: Mock.mock({
        'attrs|2-3': [{ saleAttrName: '@pick(["颜色","版本","套餐"])', spuSaleAttrValueList: Mock.mock({ 'v|2-3': ['@cword(1,3)'] }).v.map((x: string) => ({ saleAttrValueName: x })) }]
      }).attrs
    }
  ]
}).list

const baseSaleAttr = [
  { id: 1, saleAttrName: '颜色' },
  { id: 2, saleAttrName: '版本' },
  { id: 3, saleAttrName: '套餐' }
]

const ok = (data: any = null, message = 'success') => ({ code: 200, message, data })

export default [
  {
    url: '/api/admin/product/:page/:limit',
    method: 'get',
    response: ({ url, query }: any) => {
      const parts = url.split('/')
      const p = +parts[parts.length - 2]
      const l = +parts[parts.length - 1]
      const c3 = +query.category3Id || 0
      const filtered = c3 ? spus.filter((s: any) => s.category3Id === c3) : spus
      const start = (p - 1) * l
      return ok({ records: filtered.slice(start, start + l), total: filtered.length })
    }
  },
  {
    url: '/api/admin/product/getSpuById/:id',
    method: 'get',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      return ok(spus.find((s: any) => s.id === id) || {})
    }
  },
  {
    url: '/api/admin/product/spuImageList/:id',
    method: 'get',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      return ok((spus.find((s: any) => s.id === id) || {}).spuImageList || [])
    }
  },
  {
    url: '/api/admin/product/spuSaleAttrList/:id',
    method: 'get',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      return ok((spus.find((s: any) => s.id === id) || {}).spuSaleAttrList || [])
    }
  },
  { url: '/api/admin/product/baseSaleAttrList', method: 'get', response: () => ok(baseSaleAttr) },
  { url: '/api/admin/product/saveSpuInfo', method: 'post', response: () => ok() },
  { url: '/api/admin/product/updateSpuInfo', method: 'post', response: () => ok() },
  {
    url: '/api/admin/product/deleteSpu/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = +url.split('/').pop()
      const idx = spus.findIndex((s: any) => s.id === id)
      if (idx > -1) spus.splice(idx, 1)
      return ok()
    }
  },
  { url: '/api/admin/product/saveSkuInfo', method: 'post', response: () => ok() },
  {
    url: '/api/admin/product/findBySpuId/:id',
    method: 'get',
    response: () => ok(Mock.mock({ 'list|2-5': [{ id: '@increment', skuName: '@cword(4,8)', price: '@integer(99,9999)', weight: '@integer(1,50)', skuDefaultImg: 'https://picsum.photos/seed/@integer(1,999)/120/120', isSale: '@integer(0,1)' }] }).list)
  }
] as MockMethod[]
