// Em auth0-callback.tsx, melhore o tratamento de redirecionamento
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateSession } from '@/services/auth' // Importe a nova função

export const Auth0Callback = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  console.log('Callback - Estado:', { isLoading, isAuthenticated })

  useEffect(() => {
    const processAuthentication = async () => {
      if (!isLoading) {
        if (isAuthenticated) {
          try {
            // Obter o token e validar a sessão
            const token = await getAccessTokenSilently()

            // Validar o token
            if (validateSession(token)) {
              // Se autenticado, redireciona para a página salva ou wallets
              const savedPath = localStorage.getItem('auth_return_path')
              const redirectTo = savedPath || '/wallets'

              // Limpar o path salvo
              localStorage.removeItem('auth_return_path')

              navigate(redirectTo, { replace: true })
            }
          } catch (error) {
            console.error('Erro ao processar autenticação:', error)
            navigate('/', { replace: true })
          }
        } else {
          // Se não autenticado, volta para a página inicial
          navigate('/', { replace: true })
        }
      }
    }

    processAuthentication()
  }, [isLoading, isAuthenticated, navigate, getAccessTokenSilently])

  return <div>Redirecionando...</div>
}
