import ReactDOM from 'react-dom/client'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { Auth0Provider } from '@auth0/auth0-react'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Auth0Provider
      domain="dev-xg6cr74dpsnlijfn.us.auth0.com"
      clientId="j6YAVNNV2xgoH0SNm1cLQ5rsWDQ6MWhB"
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience: 'https://wealthVaultDeveloper.com/auth/api/v2',
        scope:
          'openid profile email offline_access read:current_user read:roles',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Auth0Provider>,
  )
} else {
  console.error("Root element with id 'root' not found")
}
