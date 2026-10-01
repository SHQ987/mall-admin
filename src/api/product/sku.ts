import { request } from '@/utils/request'
import type { Sku } from './spu'

export const getSkuListApi = (page: number, limit: number) =>
  request<{ records: Sku[]; total: number }>({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
  })

export const onSaleApi = (skuId: number) =>
  request<null>({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

export const cancelSaleApi = (skuId: number) =>
  request<null>({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

export const deleteSkuApi = (skuId: number) =>
  request<null>({ url: `/admin/product/deleteSku/${skuId}`, method: 'delete' })
