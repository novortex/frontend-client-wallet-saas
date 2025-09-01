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
  baseWalletUuid: string | undefined
  baseWalletName?: string
}

const Header: React.FC<HeaderProps> = ({ baseWalletName }) => (
  <div className="mb-10 flex items-center justify-between">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            href="/base-wallets"
          >
            Carteiras Padrões
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-sm font-medium text-foreground">
            {baseWalletName || 'Carteira Padrão'}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <SwitchTheme />
  </div>
)

export { Header }