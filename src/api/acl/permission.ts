import { request } from '@/utils/request'
import type { MenuNode } from './role'

export interface Permission {
  id?: number
  name: string
  code: string
  level: number
  pid: number
  children?: Permission[]
}

export const getMenuApi = () =>
  request<Permission[]>({ url: '/admin/acl/permission', method: 'get' })

export const addOrUpdateMenuApi = (data: Permission) =>
  request<null>({
    url: data.id ? '/admin/acl/permission/update' : '/admin/acl/permission/save',
    method: 'post',
    data
  })

export const deleteMenuApi = (id: number) =>
  request<null>({ url: `/admin/acl/permission/remove/${id}`, method: 'delete' })

export type { MenuNode }
