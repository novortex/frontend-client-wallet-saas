import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Auth0Callback = () => {
  const { isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()

  console.log('Callback - Estado:', { isLoading, isAuthenticated })

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Se autenticado, redireciona para a página salva ou wallets
        const savedPath = localStorage.getItem('auth_return_path')
        const redirectTo = savedPath || '/wallets'
        console.log('Redirecionando para:', redirectTo)

        localStorage.removeItem('auth_return_path')
        navigate(redirectTo, { replace: true })
      } else {
        // Se não autenticado, volta para a página inicial
        navigate('/', { replace: true })
      }
    }
  }, [isLoading, isAuthenticated, navigate])

  return <div>Redirecionando...</div>
}
