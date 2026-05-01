import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const COOKIE_NAME = 'access_token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7일

function syncCookie(token: string | null) {
  if (typeof document === 'undefined') return
  if (token) {
    document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
  } else {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
  }
}

interface TokenStore {
  accessToken: string | null
  refreshToken: string | null
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  clearTokens: () => void
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (token) => {
        syncCookie(token)
        set({ accessToken: token })
      },
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearTokens: () => {
        syncCookie(null)
        set({ accessToken: null, refreshToken: null })
      },
    }),
    {
      name: 'pickle-tokens',
      onRehydrateStorage: () => (state) => {
        syncCookie(state?.accessToken ?? null)
      },
    }
  )
)

export const getAccessToken = () => useTokenStore.getState().accessToken
export const getRefreshToken = () => useTokenStore.getState().refreshToken
export const setAccessToken = (token: string) => useTokenStore.getState().setAccessToken(token)
export const setRefreshToken = (token: string) => useTokenStore.getState().setRefreshToken(token);
export const clearTokens = () => useTokenStore.getState().clearTokens()
