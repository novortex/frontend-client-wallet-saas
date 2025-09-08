import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { ClientSearch } from '@/components/custom/client-search'

interface HeaderProps {
  walletUuid: string | undefined
}

const Header: React.FC<HeaderProps> = ({ walletUuid }) => (
  <div className="mb-10">
    <div className="mb-6 flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href="/wallets"
            >
              Wallets
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href={`/clients/${walletUuid}/infos`}
            >
              Information clients
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium text-foreground">
              Client wallet
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SwitchTheme />
    </div>
    <ClientSearch />
  </div>
)

export { Header }
