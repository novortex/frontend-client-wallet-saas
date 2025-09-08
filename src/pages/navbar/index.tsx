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
  Target,
} from 'lucide-react'
import { Outlet as RouterOutlet, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const hideNavigationRoutes = ['/']

  const shouldHideNavigation = hideNavigationRoutes.includes(location.pathname)
  
  return (
    <div className="flex gap-10">
      {!shouldHideNavigation && (
        <SideBar>
          <div className="mb-5">
            <SideBarItem
              icon={<Wallet2Icon size={20} />}
              iconExpanded={<Wallet2Icon size={24} />}
              text="Wallets"
              href="/wallets"
            />
            <SideBarItem
              icon={<UsersIcon size={20} />}
              iconExpanded={<UsersIcon size={24} />}
              text="Customers"
              href="/customers"
            />
            <SideBarItem
              icon={<Eye size={20} />}
              iconExpanded={<Eye size={24} />}
              text="Monitoring"
              isDropdown={true}
              href="#"
            >
              <SideBarItem
                icon={<Phone size={18} />}
                iconExpanded={<Phone size={22} />}
                text="Call Monitoring"
                href="/call-monitoring"
              />
              <SideBarItem
                icon={<Wallet2Icon size={18} />}
                iconExpanded={<Wallet2Icon size={22} />}
                text="Wallet Monitoring"
                href="/wallet-monitoring"
              />
              <SideBarItem
                icon={<FileCheck size={18} />}
                iconExpanded={<FileCheck size={22} />}
                text="Wallet Closings"
                href="/wallet-closings"
              />
            </SideBarItem>
            <SideBarItem
              icon={<BarChart2 size={20} />}
              iconExpanded={<BarChart2 size={24} />}
              text="Dashboards"
              href="/dashboards"
            />
            <SideBarItem
              icon={<LineChart size={20} />}
              iconExpanded={<LineChart size={24} />}
              text="Performance customers"
              href="/performance"
            />
            <SideBarItem
              icon={<Target size={20} />}
              iconExpanded={<Target size={24} />}
              text="Carteiras Padrões"
              href="/base-wallets"
            />
            <SideBarItem
              icon={<Coins size={20} />}
              iconExpanded={<Coins size={24} />}
              text="Assets organization"
              href="/admin/orgs"
            />
          </div>
        </SideBar>
      )}
      <div className="flex-1 overflow-x-auto" id="detail">
        <RouterOutlet />
      </div>
    </div>
  )
}
