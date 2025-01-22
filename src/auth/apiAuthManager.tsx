import { useEffect } from 'react'
import { useAuth } from '@/contexts/authContext'
import { setAuthToken } from '@/config/api'

export const ApiAuthManager: React.FC = () => {
  const { token } = useAuth()

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  return null
}
