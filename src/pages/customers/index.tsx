import { useEffect, useState } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { getAllBenchmark, getAllCustomersOrganization, getAllExchange, getAllManagersOnOrganization } from '@/services/managementService'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '@/components/ui/use-toast'
import { DataTableCustomers } from '@/components/custom/customers/data-table'

import { useManagerOrganization } from '@/store/managers_benckmark_exchanges'
import { columnsCustomerOrg, CustomersOrganization } from '@/components/custom/customers/columns'

export function Customers() {
  const [data, setData] = useState<CustomersOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [signal] = useSignalStore((state) => [state.signal])
  const [setManager, setBenchs, setExchanges] = useManagerOrganization((state) => [state.setManagers, state.setBenchs, state.setExchanges])

  const { toast } = useToast()

  useEffect(() => {
    // TODO: separe this script this file :)
    async function getData(setDate: React.Dispatch<React.SetStateAction<CustomersOrganization[]>>) {
      try {
        const result = await getAllCustomersOrganization()

        if (!result) {
          return toast({
            className: 'bg-red-500 border-0 text-white',
            title: 'Failed get assets organization :(',
            description: 'Demo Vault !!',
          })
        }

        const dataTable = result.map((item) => ({
          id: item.uuid,
          name: item.name,
          active: item.active,
          email: item.email,
          phone: item.phone,
          isWallet: item.isWallet,
          walletUuid: item.walletUuid,
          exchange: item.exchange,
          emailExchange: item.emailExchange,
          emailPassword: item.emailPassword,
          exchangePassword: item.exchangePassword,
          manager: item.manager,
          performanceFee: item.performanceFee,
          initialFeePaid: item.initialFeePaid,
          contract: item.contract,
        }))

        setDate(dataTable)
        setLoading(false)
      } catch (error) {
        toast({
          className: 'bg-red-500 border-0 text-white',
          title: 'Failed get assets organization :(',
          description: 'Demo Vault !!',
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
    return <div>Loading...</div>
  }

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Customers</h1>
        <SwitchTheme />
      </div>

      <div className="mb-10">
        <DataTableCustomers columns={columnsCustomerOrg} data={data} />
      </div>
    </div>
  )
}
