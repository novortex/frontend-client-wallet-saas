import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SwitchTheme } from '@/components/custom/switch-theme'

interface HeaderProps {
  walletUuid: string | undefined
}

const Header: React.FC<HeaderProps> = ({ walletUuid }) => (
  <div className="mb-10 flex items-center justify-between">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-2xl font-medium text-black dark:text-white"
            href="/wallets"
          >
            Wallets
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-2xl font-medium text-black dark:text-white"
            href={`/clients/${walletUuid}/infos`}
          >
            Information clients
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-2xl font-medium text-black dark:text-white">
            Client wallet
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <SwitchTheme />
  </div>
)

export { Header }
