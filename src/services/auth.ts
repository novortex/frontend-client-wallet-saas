import { useUserStore } from '@/store/user'

// Definir um tipo adequado para a função de logout do Auth0
type LogoutFunction = (options?: {
  logoutParams?: {
    returnTo?: string
    [key: string]: any
  }
}) => Promise<void>

let logoutFn: LogoutFunction | null = null

/**
 * Configura a função de logout do Auth0
 * @param fn Função de logout fornecida pelo Auth0
 */
export const setLogoutFunction = (fn: LogoutFunction): void => {
  logoutFn = fn
}

/**
 * Limpa todos os dados de autenticação armazenados localmente
 */
const cleanLocalStorageData = (): void => {
  try {
    console.log('Iniciando limpeza de dados locais')

    // Limpar dados do Zustand store
    if (typeof window !== 'undefined' && useUserStore?.getState) {
      console.log('Limpando Zustand store')
      useUserStore.getState().clearUser()
    }

    // Limpar explicitamente todos os itens que contenham auth0 no nome
    if (typeof window !== 'undefined' && window.localStorage) {
      console.log('Procurando itens no localStorage para limpar')
      Object.keys(localStorage).forEach((key) => {
        if (
          key.includes('auth0') ||
          key.includes('user') ||
          key.includes('token')
        ) {
          console.log('Removendo do localStorage:', key)
          localStorage.removeItem(key)
        }
      })
    }

    // Tentar limpar sessionStorage também
    if (typeof window !== 'undefined' && window.sessionStorage) {
      console.log('Procurando itens no sessionStorage para limpar')
      Object.keys(sessionStorage).forEach((key) => {
        if (
          key.includes('auth0') ||
          key.includes('user') ||
          key.includes('token')
        ) {
          console.log('Removendo do sessionStorage:', key)
          sessionStorage.removeItem(key)
        }
      })
    }

    // Lista específica de itens a limpar (backup)
    const authRelatedKeys = [
      'user-storage',
      'auth_return_path',
      'auth_app_state',
      'auth0.is.authenticated',
      'auth0.spajs.txs',
      'auth0.spajs.cache',
    ]

    authRelatedKeys.forEach((key) => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(key)
          sessionStorage.removeItem(key)
        }
      } catch (e) {
        console.warn(`Falha ao remover item '${key}' do storage:`, e)
      }
    })

    // Limpar cookies relacionados à autenticação
    if (typeof document !== 'undefined' && document.cookie) {
      console.log('Limpando cookies de autenticação')
      document.cookie.split(';').forEach((cookie) => {
        const [name] = cookie.trim().split('=')
        if (name.includes('auth0') || name.includes('token')) {
          console.log('Removendo cookie:', name)
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        }
      })
    }

    console.log('Limpeza de dados locais concluída')
  } catch (error) {
    console.error('Erro ao limpar dados de autenticação:', error)
  }
}

/**
 * Executa o processo completo de logout
 * @param returnUrl URL para onde redirecionar após o logout (opcional)
 */
export const handleLogout = async (returnUrl?: string): Promise<void> => {
  // Limpar dados locais primeiro
  cleanLocalStorageData()

  // Chamar API para limpar cache no backend
  try {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const response = await fetch('/api/auth/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Resposta da limpeza de cache:', await response.json())
    }
  } catch (error) {
    console.warn('Erro ao limpar cache no servidor:', error)
  }

  // Executar logout do Auth0
  if (logoutFn) {
    logoutFn({
      logoutParams: {
        returnTo: returnUrl || window.location.origin,
      },
    })
  } else {
    console.warn(
      'Função de logout não configurada. Redirecionando para a página inicial.',
    )
    window.location.href = returnUrl || window.location.origin
  }
}

/**
 * Executa um logout completo e agressivo, limpando completamente o estado
 * e redirecionando para o logout do Auth0
 */
export const handleCompleteClearLogout = async (): Promise<void> => {
  console.log('Iniciando logout completo e agressivo')

  // Limpar todos os dados locais
  cleanLocalStorageData()

  // Chamar API para limpar cache no backend
  try {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const response = await fetch('/api/auth/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Resposta da limpeza de cache:', await response.json())
    }
  } catch (error) {
    console.warn('Erro ao limpar cache no servidor:', error)
  }

  // Redirecionar para o logout do Auth0
  console.log('Redirecionando para logout do Auth0')

  if (typeof window !== 'undefined') {
    const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
    const returnTo = encodeURIComponent(window.location.origin)

    // URL para logout completo no Auth0
    const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`

    // Redirecionar
    window.location.href = logoutUrl
  } else {
    console.warn('Window não disponível para executar redirecionamento.')
  }
}

/**
 * Trata casos de acesso não autorizado, fazendo logout e redirecionando
 */
export const handleUnauthorized = (): void => {
  console.warn('Acesso não autorizado detectado. Iniciando processo de logout.')

  // Armazenar informação sobre o motivo do logout para exibir mensagem apropriada
  try {
    sessionStorage.setItem('logout_reason', 'unauthorized')
  } catch (e) {
    console.error('Não foi possível armazenar o motivo do logout:', e)
  }

  // Executar processo completo de logout
  handleCompleteClearLogout()
}

/**
 * Verifica se o token está expirado
 * @param token Token JWT a ser verificado
 * @returns Verdadeiro se o token estiver expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decodificar a parte payload do token
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      ),
    )

    // Verificar expiração
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) {
    console.error('Erro ao verificar expiração do token:', error)
    // Em caso de erro na verificação, considerar como expirado por segurança
    return true
  }
}

/**
 * Verifica e trata sessão inválida, como tokens expirados
 * @param token Token JWT atual
 * @returns Verdadeiro se a sessão for válida
 */
export const validateSession = (token: string | null): boolean => {
  if (!token) {
    console.warn('Sessão inválida: token não fornecido')
    return false
  }

  if (isTokenExpired(token)) {
    console.warn('Sessão expirada: token vencido')
    handleUnauthorized()
    return false
  }

  return true
}
