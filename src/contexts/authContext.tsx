import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { useAuthToken } from '../hooks/useAuthToken'

interface AuthContextType {
  token: string | null
  updateToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = React.useState<string | null>(null)
  const { getToken } = useAuthToken()

  const updateToken = useCallback(async () => {
    const newToken = await getToken()
    setToken(newToken)
  }, [getToken])

  useEffect(() => {
    updateToken()
  }, [updateToken])

  return <AuthContext.Provider value={{ token, updateToken }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
