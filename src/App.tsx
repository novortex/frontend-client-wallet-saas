// App.jsx
import './index.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Wallet } from '@/pages/wallet/index'
import { Graphs } from '@/pages/graphs'
import { History } from '@/pages/history'
import { Clients } from '@/pages/wallets'
import { Infos } from '@/pages/infos'
import { Customers } from '@/pages/customers'
import { AssetsOrg } from '@/pages/assets-org'
import { Login } from '@/pages/login'
import { ErrorPage } from '@/pages/404'
import Root from './pages/outlet'

export function App() {
  // to-do: remove this in future for use the real logic for side bar and auth
  const location = useLocation()
  const isLoginRoute = location.pathname === '/'

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {!isLoginRoute && (
        <Route element={<Root />}>
          <Route path="/wallet/:walletUuid/assets" element={<Wallet />} />
          <Route path="/wallets" element={<Clients />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/admin/orgs" element={<AssetsOrg />} />
          <Route path="/clients/:walletUuid/infos" element={<Infos />} />
          <Route path="/wallet/:walletUuid/graphs" element={<Graphs />} />
          <Route path="/wallet/:walletUuid/history" element={<History />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      )}
    </Routes>
  )
}
