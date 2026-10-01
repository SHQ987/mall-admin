import { request } from '@/utils/request'

export interface LoginForm {
  username: string
  password: string
}

export interface UserInfo {
  name: string
  avatar: string
  routes: string[]
  buttons: string[]
  roles: string[]
}

export interface UserItem {
  id?: number
  username: string
  nickName?: string
  password?: string
  roleName?: string
  gmtCreate?: string
  gmtModified?: string
}

export interface RoleItem {
  id?: number
  roleName: string
  remark?: string
}

export interface AssignRoleForm {
  userId: number
  roleIdList: number[]
}

// 登录
export const loginApi = (data: LoginForm) =>
  request<string>({ url: '/user/login', method: 'post', data })

// 获取用户信息（含可访问路由名与按钮权限）
export const getUserInfoApi = () =>
  request<UserInfo>({ url: '/user/info', method: 'get' })

// 退出登录
export const logoutApi = () =>
  request<null>({ url: '/user/logout', method: 'post' })

// 用户列表（分页 + 关键字）
export const getUserListApi = (page: number, limit: number, keyword = '') =>
  request<{ records: UserItem[]; total: number }>({
    url: `/admin/acl/user/${page}/${limit}`,
    method: 'get',
    params: { username: keyword }
  })

export const addOrUpdateUserApi = (data: UserItem) =>
  request<null>({
    url: data.id ? '/admin/acl/user/update' : '/admin/acl/user/save',
    method: 'post',
    data
  })

export const deleteUserApi = (id: number) =>
  request<null>({ url: `/admin/acl/user/remove/${id}`, method: 'delete' })

export const assignRoleApi = (data: AssignRoleForm) =>
  request<null>({ url: '/admin/acl/user/doAssignRole', method: 'post', data })

export const getUserRoleApi = (userId: number) =>
  request<{ assignRoles: RoleItem[]; allRolesList: RoleItem[] }>({
    url: `/admin/acl/user/toAssign/${userId}`,
    method: 'get'
  })
