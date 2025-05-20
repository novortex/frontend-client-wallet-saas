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
import { Loading } from './components/custom/loading'
import { Notifications } from './pages/notifications/notifications'
import { WalletClosings } from './pages/walletClosing'
import Dashboard from './pages/dashboard'
import { PerformanceView } from './pages/performance_view'

export function App() {
  const [isMobile, setIsMobile] = useState(false)
  const { isLoading } = useAuth0()
  const { logout } = useAuth0()

  useEffect(() => {
    // Use a função melhorada de setLogoutFunction em vez da simples atribuição
    setLogoutFunction(logout)

    // Se quiser adicionar um evento para detectar quando a página for fechada
    const handleBeforeUnload = () => {
      // Opcional: limpar dados sensíveis ao fechar a página
      sessionStorage.removeItem('logout_reason')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
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
    return <Loading />
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
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/admin/orgs" element={<AssetsOrg />} />
                <Route path="/clients/:walletUuid/infos" element={<Infos />} />
                <Route path="/wallet/:walletUuid/graphs" element={<Graphs />} />
                <Route path="/performance" element={<PerformanceView />} />
                <Route
                  path="/wallet/:walletUuid/history"
                  element={<History />}
                />
                <Route path="/wallet-closings" element={<WalletClosings />} />
                <Route path="/dashboards" element={<Dashboard />} />

                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Route>
          </Route>
        )}
      </Routes>
    </AuthProvider>
  )
}
