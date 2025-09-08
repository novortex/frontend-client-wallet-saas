import { useEffect, useState } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import {
  getAllBenchmark,
  getAllCustomersOrganization,
  getAllExchange,
  getAllManagersOnOrganization,
} from '@/services/managementService'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '@/components/ui/use-toast'
import { DataTableCustomers } from '@/components/custom/customers/data-table'
import { useManagerOrganization } from '@/store/managers_benckmark_exchanges'
import {
  columnsCustomerOrg,
  CustomersOrganization,
} from '@/components/custom/customers/columns'
import { Loading } from '@/components/custom/loading'

export type RiskProfile =
  | 'STANDARD'
  | 'SUPER_LOW_RISK'
  | 'LOW_RISK'
  | 'HIGH_RISK'
  | 'SUPER_HIGH_RISK'
  | null

export function Customers() {
  const [data, setData] = useState<CustomersOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [signal] = useSignalStore((state) => [state.signal])
  const [setManager, setBenchs, setExchanges] = useManagerOrganization(
    (state) => [state.setManagers, state.setBenchs, state.setExchanges],
  )

  const { toast } = useToast()

  useEffect(() => {
    // TODO: separe this script this file :)
    async function getData(
      setDate: React.Dispatch<React.SetStateAction<CustomersOrganization[]>>,
    ) {
      try {
        const result = await getAllCustomersOrganization()

        if (!result) {
          return toast({
            className: 'toast-error',
            title: 'Erro ao carregar clientes',
            description: 'Não foi possível carregar os clientes da organização.',
            duration: 6000,
          })
        }

        const dataTable = result.map((item) => {
          const riskProfile: RiskProfile = item.riskProfile ?? null

          return {
            id: item.uuid,
            name: item.name,
            active: item.active,
            email: item.email,
            phone: item.phone,
            isWallet: item.isWallet,
            hasManager: item.hasManager,
            walletUuid: item.walletUuid,
            exchange: item.exchange,
            emailExchange: item.emailExchange,
            emailPassword: item.emailPassword,
            exchangePassword: item.exchangePassword,
            manager: item.manager,
            performanceFee: item.performanceFee,
            initialFeePaid: item.initialFeePaid,
            contract: item.contract,
            riskProfile,
          }
        })

        setDate(dataTable)
        setLoading(false)
      } catch (error) {
        toast({
          className: 'toast-error',
          title: '❌ Erro ao carregar clientes',
          description: 'Não foi possível carregar os clientes da organização.',
          duration: 6000,
        })
      }
    }
    getData(setData)

    const fetchManagersAndBenchmarks = async () => {
      try {
        const managers = await getAllManagersOnOrganization()
        const benchmarks = await getAllBenchmark()
        const exchanges = await getAllExchange()

        setManager(managers)
        setBenchs(benchmarks)
        setExchanges(exchanges)
      } catch (error) {
        console.error('Erro ao buscar gerentes:', error)
      }
    }
    fetchManagersAndBenchmarks()
  }, [signal, toast, setManager, setBenchs, setExchanges])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-sm text-muted-foreground">
              Manage customer accounts and wallets
            </p>
          </div>
          <SwitchTheme />
        </div>

        <div className="mb-10">
          <DataTableCustomers columns={columnsCustomerOrg} data={data} />
        </div>
      </div>
    </div>
  )
}
