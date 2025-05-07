// user.ts (zustand store)
import { TUser } from '@/types/userType'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Extensão do tipo TUser com campos adicionais se necessário
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
      clearUser: () => {
        try {
          // Limpar o estado do usuário
          set({ user: null })

          // Limpar explicitamente o localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-storage')
          }
        } catch (error) {
          console.error('Error clearing user data:', error)
        }
      },
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
      // Adicionar blacklist para excluir items sensíveis da persistência (opcional)
      partialize: (state) => ({
        user: {
          ...state.user,
          // omita dados sensíveis que não devem ser persistidos
        },
      }),
    },
  ),
)
