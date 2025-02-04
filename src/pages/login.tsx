import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/wallets')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button onClick={() => loginWithRedirect()} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Login with Auth0
      </button>
    </div>
  )
}
