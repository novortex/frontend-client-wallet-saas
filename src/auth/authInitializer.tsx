import { initializeAuth } from '@/config/authToken.service'

export const AuthInitializer = () => {
  initializeAuth()
  return null
}
