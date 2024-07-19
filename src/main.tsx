import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './pages/404.tsx'
import Root from './pages/outlet.tsx'
import Wallet from './pages/wallet.tsx'
import Login from './pages/login.tsx'
import Clients from './pages/clients.tsx'
import AssetsOrg from './pages/assets-org.tsx'
import Infos from './pages/infos.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '/wallet/:walletUuid/assets',
        element: <Wallet />,
      },
      {
        path: '/clients',
        element: <Clients />,
      },
      {
        path: '/admin/orgs',
        element: <AssetsOrg />,
      },
      {
        path: '/clients/:walletUuid/infos',
        element: <Infos />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
