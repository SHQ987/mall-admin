import { request } from '@/utils/request'

export interface Category {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

export interface AttrValue {
  id?: number
  valueName: string
  isEdit?: boolean
}

export interface Attr {
  id?: number
  attrName: string
  categoryId: number
  categoryLevel: number
  attrValueList: AttrValue[]
}

// 三级分类
export const getCategory1Api = () =>
  request<Category[]>({ url: '/admin/product/getCategory1', method: 'get' })

export const getCategory2Api = (category1Id: number) =>
  request<Category[]>({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

export const getCategory3Api = (category2Id: number) =>
  request<Category[]>({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 平台属性
export const getAttrApi = (category1Id: number, category2Id: number, category3Id: number) =>
  request<Attr[]>({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })

export const addOrUpdateAttrApi = (data: Attr) =>
  request<null>({ url: '/admin/product/saveAttrInfo', method: 'post', data })

export const deleteAttrApi = (attrId: number) =>
  request<null>({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })
