import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SwitchTheme } from '@/components/custom/switch-theme'

interface HeaderProps {
  walletUuid: string | undefined
}

const Header: React.FC<HeaderProps> = ({ walletUuid }) => (
  <div className="mb-10 flex items-center justify-between">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-2xl text-black dark:text-white font-medium" href="/wallets">
            Wallets
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="text-2xl text-black dark:text-white font-medium" href={`/clients/${walletUuid}/infos`}>
            Information clients
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-2xl text-black dark:text-white font-medium">Client wallet</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <SwitchTheme />
  </div>
)

export { Header }
