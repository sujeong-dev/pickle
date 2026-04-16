import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    { name: 'pickle-tokens' }
  )
)

export const getAccessToken = () => useTokenStore.getState().accessToken
export const getRefreshToken = () => useTokenStore.getState().refreshToken
export const setAccessToken = (token: string) => useTokenStore.getState().setAccessToken(token)
export const clearTokens = () => useTokenStore.getState().clearTokens()
