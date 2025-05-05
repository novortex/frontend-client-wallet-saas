// user.ts (zustand store)

import { TUser } from '@/types/userType'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Extenda o tipo TUser com campos adicionais se necessário
interface User extends TUser {
  picture?: string
}

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        try {
          set({ user })
        } catch (error) {
          console.error('Storage error:', error)
        }
      },
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => {
        try {
          return localStorage
        } catch {
          try {
            return sessionStorage
          } catch {
            return {
              getItem: () => null,
              setItem: () => null,
              removeItem: () => null,
            }
          }
        }
      }),
    },
  ),
)
