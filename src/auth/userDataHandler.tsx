// Em userDataHandler.tsx, melhore a limpeza de dados
import { useUserStore } from '@/store/user'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

export const UserDataHandler = () => {
  const { user, isAuthenticated } = useAuth0()
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)

  useEffect(() => {
    if (isAuthenticated && user) {
      setUser({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'User',
        picture: user.picture || '',
      })
    } else {
      // Limpar completamente os dados do usuário quando não estiver autenticado
      clearUser()

      // Garantir que não haja dados remanescentes no localStorage
      try {
        localStorage.removeItem('user-storage')
      } catch (e) {
        console.error('Erro ao limpar storage:', e)
      }
    }
  }, [isAuthenticated, user, setUser, clearUser])

  return null
}
