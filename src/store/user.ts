// store/user.ts
import { create } from 'zustand'

interface User {
  name: string
  email: string
  role: string
  picture?: string
}

interface UserStore {
  user: User
  setUser: (user: User) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    name: '',
    email: '',
    role: '',
    picture: '',
  },
  setUser: (user) => set({ user }),
}))
