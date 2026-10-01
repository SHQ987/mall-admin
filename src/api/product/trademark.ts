import { request } from '@/utils/request'

export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}

export const getTrademarkApi = (page: number, limit: number) =>
  request<{ records: Trademark[]; total: number }>({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })

export const addOrUpdateTrademarkApi = (data: Trademark) =>
  request<null>({
    url: data.id
      ? '/admin/product/baseTrademark/update'
      : '/admin/product/baseTrademark/save',
    method: 'post',
    data
  })

export const deleteTrademarkApi = (id: number) =>
  request<null>({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })

export const getAllTrademarkApi = () =>
  request<Trademark[]>({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })
