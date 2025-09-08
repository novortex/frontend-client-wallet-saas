import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { CircleAlert, Eye, User, Calendar, Wallet, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TClientInfosResponse } from '@/types/customer.type'

interface WalletsTableViewProps {
  clients: TClientInfosResponse[]
  formatDate: (date: string) => string
}

export function WalletsTableView({ clients, formatDate }: WalletsTableViewProps) {
  const navigate = useNavigate()

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const handleViewClient = (walletUuid: string, name: string, email: string, phone?: string) => {
    navigate(`/clients/${walletUuid}/infos`, {
      state: { name, email, phone },
    })
  }

  const handleViewWallet = (walletUuid: string) => {
    navigate(`/wallet/${walletUuid}/assets`)
  }

  const handleViewGraphs = (walletUuid: string) => {
    navigate(`/wallet/${walletUuid}/graphs`)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 dark:bg-[#131313] hover:bg-gray-200 dark:hover:bg-[#131313]">
            <TableHead className="text-black dark:text-white font-semibold">
              Cliente
            </TableHead>
            <TableHead className="text-black dark:text-white font-semibold">
              Responsável
            </TableHead>
            <TableHead className="text-black dark:text-white font-semibold">
              Próximo Rebalanceamento
            </TableHead>
            <TableHead className="text-black dark:text-white font-semibold">
              Último Rebalanceamento
            </TableHead>
            <TableHead className="text-black dark:text-white font-semibold text-center">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-background">
          {clients.map((client) => {
            const nextRebalancing = client.nextBalance
              ? formatDate(client.nextBalance.toString())
              : '-'
            const lastRebalancing = client.lastBalance
              ? formatDate(client.lastBalance.toString())
              : '-'
            const isDelayedRebalancing =
              client.nextBalance && 
              new Date() > parseDate(formatDate(client.nextBalance.toString()))

            return (
              <TableRow
                key={client.walletUuid}
                className="hover:bg-muted/50 border-b transition-colors cursor-pointer"
                onClick={() => handleViewClient(
                  client.walletUuid,
                  client.infosClient.name,
                  client.infosClient.email,
                  client.infosClient.phone
                )}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {isDelayedRebalancing && (
                        <div className="group relative">
                          <div className="rounded-full bg-destructive/10 p-1">
                            <CircleAlert className="h-4 w-4 text-destructive" />
                          </div>
                          <div className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap rounded bg-white px-3 py-2 text-sm text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black dark:text-white shadow-lg border border-border z-10">
                            O rebalanceamento está atrasado
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-foreground">
                          {client.infosClient.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {client.infosClient.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{client.managerName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{nextRebalancing}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{lastRebalancing}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewClient(
                          client.walletUuid,
                          client.infosClient.name,
                          client.infosClient.email,
                          client.infosClient.phone
                        )
                      }}
                      className="text-primary hover:bg-yellow-500 hover:text-white transition-all duration-200 transform hover:scale-105"
                      title="Ver Informações"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewWallet(client.walletUuid)
                      }}
                      className="text-primary hover:bg-yellow-500 hover:text-white transition-all duration-200 transform hover:scale-105"
                      title="Ver Carteira"
                    >
                      <Wallet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewGraphs(client.walletUuid)
                      }}
                      className="text-primary hover:bg-yellow-500 hover:text-white transition-all duration-200 transform hover:scale-105"
                      title="Ver Gráficos"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}