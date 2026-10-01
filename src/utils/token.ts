// token 持久化工具（localStorage 封装）
const TOKEN_KEY = 'MALL_TOKEN'

export const getToken = (): string =>
  (localStorage.getItem(TOKEN_KEY) as string) || ''

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}
