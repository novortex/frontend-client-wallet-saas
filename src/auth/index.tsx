/* eslint-disable camelcase */
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '../../../../../../../../vite.svg'
import './App.css'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const [count, setCount] = useState(0)
  const [userMetadata, setUserMetadata] = useState(null)
  const [accessToken, setAccessToken] = useState<string | null>(null) // Adicionando estado para o token
  const {
    loginWithRedirect,
    user,
    isAuthenticated,
    logout,
    getAccessTokenSilently,
  } = useAuth0()

  const handleLogin = async () => {
    loginWithRedirect()
  }

  useEffect(() => {
    const fetchAccessToken = async () => {
      const domain = 'dev-xg6cr74dpsnlijfn.us.auth0.com'

      console.log('Fetching access token')

      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope:
              'openid profile email offline_access read:current_user read:roles',
          },
        })

        console.log('Got token', token)
        setAccessToken(token) // Armazena o token no estado
      } catch (e) {
        console.error('Error getting access token', e)
      }
    }

    const getUserMetadata = async () => {
      const domain = 'dev-xg6cr74dpsnlijfn.us.auth0.com'

      if (!accessToken || !user) return

      // Busca o token se o usuário estiver autenticado

      try {
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const { user_metadata } = await metadataResponse.json()
        setUserMetadata(user_metadata)
      } catch (e) {
        console.error('Error fetching user metadata', e)
      }
    }

    if (isAuthenticated) {
      fetchAccessToken()
    }

    getUserMetadata()
  }, [accessToken, getAccessTokenSilently, isAuthenticated, user]) // Depende do accessToken e do user

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {isAuthenticated && (
        <div>
          {user && <img src={user.picture} alt={user.name} />}
          {user && <h2>{user.name}</h2>}
          {user && <h2>{user.email}</h2>}
          <h3>User Metadata</h3>
          {userMetadata ? (
            <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
          ) : (
            'No user metadata defined'
          )}
          <h3>Access Token</h3>
          <p>{accessToken}</p> {/* Exibe o token para verificar */}
        </div>
      )}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={handleLogin}>Log In</button>
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log Out
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
