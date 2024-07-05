import { SideBar, SideBarItem } from '@/components/custom/sidebar'
import {
  PieChartIcon,
  Activity,
  UsersIcon,
  Info,
  BarChartBig,
  WalletIcon,
} from 'lucide-react'
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
              icon={<PieChartIcon size={20} />}
              text="Dashboard"
            ></SideBarItem>
            <SideBarItem
              icon={<Activity size={20} />}
              text="Active"
            ></SideBarItem>
          </div>
          <div className="mb-5">
            <h3 className="text-white font-semibold">Client</h3>
            <SideBarItem icon={<UsersIcon />} text="Clients" />
            <SideBarItem icon={<Info />} text="Infos" />
            <SideBarItem icon={<BarChartBig />} text="Graphics" />
            <SideBarItem icon={<WalletIcon />} text="Wallet" />
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
