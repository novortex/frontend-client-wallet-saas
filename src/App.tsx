import './index.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Wallet } from '@/pages/wallet/index'
import { Graphs } from '@/pages/graphs'
import { History } from '@/pages/history'
import { Clients } from '@/pages/wallets'
import { Infos } from '@/pages/infos'
import { Customers } from '@/pages/customers'
import { AssetsOrg } from '@/pages/assets-org'
import { ErrorPage } from '@/pages/404/index'
import { AdviceToTeam } from './pages/AdviceToTeam'
import Root from './pages/outlet'
import { AuthHandler } from './auth/auth-handler'
import { Auth0Callback } from './auth/auth0-callback'
import { AuthProvider } from '@/contexts/authContext'
import { ApiAuthManager } from '@/auth/apiAuthManager'
import { UserDataHandler } from './auth/userDataHandler'
import { ProtectedRouteWrapper } from './auth/protectedRouteWrapper'
import { setLogoutFunction } from './services/auth'

export function App() {
  const [isMobile, setIsMobile] = useState(false)
  const { isLoading } = useAuth0()
  const { logout } = useAuth0()

  useEffect(() => {
    setLogoutFunction(logout)
  }, [logout])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AuthProvider>
      <UserDataHandler />
      <ApiAuthManager />
        <Routes>
          {isMobile ? (
            <Route path="/" element={<AdviceToTeam />} />
          ) : (
            <Route element={<AuthHandler />}>
              <Route path="/callback" element={<Auth0Callback />} />
              <Route element={<ProtectedRouteWrapper />}>
                <Route element={<Root />}>
                  <Route path="/" element={<Navigate to="/wallets" replace />} />
                  <Route path="/wallet/:walletUuid/assets" element={<Wallet />} />
                  <Route path="/wallets" element={<Clients />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/admin/orgs" element={<AssetsOrg />} />
                  <Route path="/clients/:walletUuid/infos" element={<Infos />} />
                  <Route path="/wallet/:walletUuid/graphs" element={<Graphs />} />
                  <Route path="/wallet/:walletUuid/history" element={<History />} />
                  <Route path="*" element={<ErrorPage />} />
                </Route>
              </Route>
            </Route>
          )}
        </Routes>
    </AuthProvider>
  )
}
