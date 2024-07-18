import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type TUser = {
  name: string
  email: string
  role: string
  imageUrl: string
  uuid: string
  uuidOrganization: string
}

type UserStore = {
  user: TUser
  setUser: (user: TUser) => void
  cleanUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        name: '',
        email: '',
        role: '',
        imageUrl: '',
        uuid: '',
        uuidOrganization: '',
      },

      setUser: (user: TUser) => set({ user }),

      cleanUser: () => {
        set({
          user: {
            name: '',
            email: '',
            role: '',
            imageUrl: '',
            uuid: '',
            uuidOrganization: '',
          },
        })
      },
    }),
    {
      name: 'user-info-vault',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
