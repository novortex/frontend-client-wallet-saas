import { SideBar, SideBarItem } from '@/components/custom/sidebar'
import { UsersIcon, Coins } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

// TODO: colocar a verificação da pagina para não aparecer a navegação no login
export default function Root() {
  const location = useLocation()
  const hideNavigationRoutes = ['/']

  const shouldHideNavigation = hideNavigationRoutes.includes(location.pathname)
  return (
    <div className="flex gap-10">
      {!shouldHideNavigation && (
        <SideBar alerts={0}>
          <div className="mb-5">
            <h3 className="text-white font-medium">Admin</h3>
            <SideBarItem
              icon={<UsersIcon size={20} />}
              text="Clients"
              href="/clients"
            ></SideBarItem>
            <SideBarItem
              icon={<Coins size={20} />}
              text="Assets organization"
              href="/admin/orgs"
            ></SideBarItem>
          </div>
          <div className="mb-5">
            {/* <h3 className="text-white font-semibold">Client</h3> */}
            {/* <SideBarItem icon={<UsersIcon />} text="Clients" />
            <SideBarItem icon={<Info />} text="Infos" />
            <SideBarItem icon={<BarChartBig />} text="Graphics" />
            <SideBarItem icon={<WalletIcon />} text="Wallet" /> */}
          </div>
        </SideBar>
      )}
      <div className="w-screen" id="detail">
        <Outlet />
      </div>
      <Toaster />
    </div>
  )
}
