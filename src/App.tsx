import './index.css'
import { Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Wallet } from '@/pages/wallet/index'
import { Graphs } from '@/pages/graphs'
import { History } from '@/pages/history'
import { Clients } from '@/pages/wallets'
import { Infos } from '@/pages/infos'
import { Customers } from '@/pages/customers'
import { AssetsOrg } from '@/pages/assets-org'
import { Login } from '@/pages/login'
import { ErrorPage } from '@/pages/404'
import { AdviceToTeam } from './pages/AdviceToTeam'

export function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Routes>
      {!isMobile && (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/wallet/:walletUuid/assets" element={<Wallet />} />
          <Route path="/wallets" element={<Clients />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/admin/orgs" element={<AssetsOrg />} />
          <Route path="/clients/:walletUuid/infos" element={<Infos />} />
          <Route path="/wallet/:walletUuid/graphs" element={<Graphs />} />
          <Route path="/wallet/:walletUuid/history" element={<History />} />
          <Route path="*" element={<ErrorPage />} />
        </>
      )}

      {isMobile && <Route path="/" element={<AdviceToTeam />} />}
    </Routes>
  )
}
