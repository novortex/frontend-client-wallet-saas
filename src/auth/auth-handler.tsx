import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export const AuthHandler = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const location = useLocation()

  useEffect(() => {
    const handleAuth = async () => {
      if (!isLoading && !isAuthenticated) {
        // Salva o caminho atual antes do redirecionamento
        localStorage.setItem(
          'auth_app_state',
          JSON.stringify({
            returnTo: location.pathname,
          }),
        )

        await loginWithRedirect({
          appState: { returnTo: location.pathname },
        })
      }
    }

    handleAuth()
  }, [isLoading, isAuthenticated, loginWithRedirect, location])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? <Outlet /> : null
}
