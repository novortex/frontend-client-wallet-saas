import { SideBar, SideBarItem } from '@/components/custom/sidebar'
import { UsersIcon, Coins, Wallet2Icon } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'

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
            <h3 className="w-full text-center font-medium dark:text-white">
              Admin
            </h3>
            <br />
            <SideBarItem
              icon={<Wallet2Icon size={20} />}
              text="Wallets"
              href="/wallets"
            />
            <SideBarItem
              icon={<UsersIcon size={20} />}
              text="Customers"
              href="/customers"
            />
            <SideBarItem
              icon={<Coins size={20} />}
              text="Assets organization"
              href="/admin/orgs"
            />
          </div>
          <div className="mb-5">{/* Outras seções */}</div>
        </SideBar>
      )}
      <div className="w-screen" id="detail">
        <Outlet />
      </div>
    </div>
  )
}
