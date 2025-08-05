import { SideBar, SideBarItem } from '@/components/custom/sidebar'
import {
  UsersIcon,
  Coins,
  Wallet2Icon,
  FileCheck,
  BarChart2,
  Phone,
  LineChart,
  Eye,
} from 'lucide-react'
import { Outlet as RouterOutlet, useLocation } from 'react-router-dom'

export default function Navbar() {
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
              icon={<FileCheck size={20} />}
              text="Wallet Closings"
              href="/wallet-closings"
            />
            <SideBarItem
              icon={<Eye size={20} />}
              text="Monitoring"
              isDropdown={true}
              href="#"
            >
              <SideBarItem
                icon={<Phone size={18} />}
                text="Call Monitoring"
                href="/call-monitoring"
              />
              <SideBarItem
                icon={<Wallet2Icon size={18} />}
                text="Wallet Monitoring"
                href="/wallet-monitoring"
              />
            </SideBarItem>
            <SideBarItem
              icon={<BarChart2 size={20} />}
              text="Dashboards"
              href="/dashboards"
            />
            <SideBarItem
              icon={<LineChart size={20} />}
              text="Performance customers"
              href="/performance"
            />
            <SideBarItem
              icon={<Coins size={20} />}
              text="Assets organization"
              href="/admin/orgs"
            />
          </div>
        </SideBar>
      )}
      <div className="w-screen" id="detail">
        <RouterOutlet />
      </div>
    </div>
  )
}
