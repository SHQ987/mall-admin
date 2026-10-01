import { request } from '@/utils/request'

export interface SpuImage {
  id?: number
  imgName: string
  imgUrl: string
}

export interface SaleAttrValue {
  id?: number
  saleAttrValueName: string
}

export interface Spu {
  id?: number
  spuName: string
  description: string
  category3Id: number
  tmId: number
  spuImageList?: SpuImage[]
  spuSaleAttrList?: SaleAttr[]
}

export interface SaleAttr {
  id?: number
  saleAttrName: string
  spuSaleAttrValueList?: SaleAttrValue[]
}

export interface Sku {
  id?: number
  skuName: string
  price: number
  weight: number
  skuDefaultImg: string
  isSale?: number
  skuAttrValueList?: any[]
  skuSaleAttrValueList?: any[]
}

export const getSpuListApi = (page: number, limit: number, category3Id: number) =>
  request<{ records: Spu[]; total: number }>({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
  })

export const getSpuByIdApi = (spuId: number) =>
  request<Spu>({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

export const getSpuImageListApi = (spuId: number) =>
  request<SpuImage[]>({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

export const getSpuSaleAttrListApi = (spuId: number) =>
  request<SaleAttr[]>({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

export const getBaseSaleAttrListApi = () =>
  request<SaleAttr[]>({ url: '/admin/product/baseSaleAttrList', method: 'get' })

export const addOrUpdateSpuApi = (data: Spu) =>
  request<null>({ url: data.id ? '/admin/product/updateSpuInfo' : '/admin/product/saveSpuInfo', method: 'post', data })

export const deleteSpuApi = (spuId: number) =>
  request<null>({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

export const addSkuApi = (data: Sku) =>
  request<null>({ url: '/admin/product/saveSkuInfo', method: 'post', data })

export const getSkuListBySpuApi = (spuId: number) =>
  request<Sku[]>({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
