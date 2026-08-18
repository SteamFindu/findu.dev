import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'

export const getAuthToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) || null
}

export const setAuthToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 })
}

export const logout = (): void => {
  Cookies.remove(TOKEN_KEY)
}
