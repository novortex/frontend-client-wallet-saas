import { useUserStore } from '@/store/user'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

export const UserDataHandler = () => {
  const { user, isAuthenticated } = useAuth0()
  const setUser = useUserStore(
    (state) => state.setUser
  )

  useEffect(() => {
    if (isAuthenticated && user) {
      setUser({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'User',
        picture: user.picture || '',
      })
    } else {
      setUser({
        name: '',
        email: '',
        role: '',
        picture: '',
      })
    }
  }, [isAuthenticated, user, setUser])

  return null
}
