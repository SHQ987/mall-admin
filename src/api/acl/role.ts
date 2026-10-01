import { request } from '@/utils/request'
import type { RoleItem } from '@/api/user'

export type { RoleItem }

export const getRoleListApi = (page: number, limit: number, roleName = '') =>
  request<{ records: RoleItem[]; total: number }>({
    url: `/admin/acl/role/${page}/${limit}`,
    method: 'get',
    params: { roleName }
  })

export const addOrUpdateRoleApi = (data: RoleItem) =>
  request<null>({
    url: data.id ? '/admin/acl/role/update' : '/admin/acl/role/save',
    method: 'post',
    data
  })

export const deleteRoleApi = (id: number) =>
  request<null>({ url: `/admin/acl/role/remove/${id}`, method: 'delete' })

export const getRoleMenuApi = (roleId: number) =>
  request<{ menuList: MenuNode[]; checkedKeys: number[] }>({
    url: `/admin/acl/permission/toAssign/${roleId}`,
    method: 'get'
  })

export const assignRoleMenuApi = (roleId: number, permissionId: number[]) =>
  request<null>({
    url: '/admin/acl/permission/doAssign',
    method: 'post',
    params: { roleId, permissionId: permissionId.join(',') }
  })

export interface MenuNode {
  id: number
  name: string
  level: number
  children?: MenuNode[]
  select?: boolean
}
