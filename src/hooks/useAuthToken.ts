import { useAuth0 } from '@auth0/auth0-react'
import { useCallback } from 'react'

export const useAuthToken = () => {
  const { getAccessTokenSilently } = useAuth0()

  const getToken = useCallback(async () => {
    try {
      return await getAccessTokenSilently()
    } catch (error) {
      console.error(
        'Error getting access token:',
        error
      )
      return null
    }
  }, [getAccessTokenSilently])

  return { getToken }
}
