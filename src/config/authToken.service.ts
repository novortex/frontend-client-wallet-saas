import { Auth0Client } from '@auth0/auth0-spa-js'

let auth0Client: Auth0Client | null = null

export const initializeAuth = async () => {
  if (!auth0Client) {
    auth0Client = new Auth0Client({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    })
  }
}

export const getAccessToken = async () => {
  if (!auth0Client) return null

  try {
    const token = await auth0Client.getTokenSilently()
    return token
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}
