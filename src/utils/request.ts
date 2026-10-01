import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from './token'
import { useUserStore } from '@/store/modules/user'

// 统一响应结构
export interface Result<T = any> {
  code: number
  message: string
  data: T
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

// 请求拦截器：注入 token + 进度条
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    nprogress.start()
    const token = getToken()
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => {
    nprogress.done()
    return Promise.reject(error)
  }
)

// 响应拦截器：拆包 + 统一错误处理
service.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    nprogress.done()
    const res = response.data
    if (res.code === 200) {
      return res
    }
    // 业务错误
    if (res.code === 201) {
      // token 过期 / 未登录
      removeToken()
      ElMessage.error(res.message || '登录失效，请重新登录')
      // 触发登出
      const userStore = useUserStore()
      userStore.userLogout()
      return Promise.reject(new Error(res.message || '登录失效'))
    }
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || 'Error'))
  },
  (error) => {
    nprogress.done()
    ElMessage.error(error.message || '网络异常')
    return Promise.reject(error)
  }
)

// 对外暴露的泛型请求方法
export function request<T = any>(config: AxiosRequestConfig): Promise<Result<T>> {
  return service(config) as unknown as Promise<Result<T>>
}

export default service
