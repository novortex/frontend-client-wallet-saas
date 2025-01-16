// src/services/authToken.ts
import { useAuth0 } from '@auth0/auth0-react'

let getToken: () => Promise<string>

export const initializeAuth = () => {
  const { getAccessTokenSilently } = useAuth0()
  getToken = getAccessTokenSilently
}

export const getAccessToken = () => {
  if (!getToken) {
    throw new Error('Auth not initialized')
  }
  return getToken()
}
