import { useEffect, useState } from 'react'
import SwitchTheme from '@/components/custom/switch-theme'
import { getAllCustomersOrganization } from '@/service/request'
import { useUserStore } from '@/store/user'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '@/components/ui/use-toast'
import { DataTableCustomers } from '@/components/custom/tables/customers/data-table'
import {
  columnsCustomerOrg,
  CustomersOrganization,
} from '@/components/custom/tables/customers/columns'

export function Customers() {
  const [data, setData] = useState<CustomersOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [signal] = useSignalStore((state) => [state.signal])

  const { toast } = useToast()

  useEffect(() => {
    // TODO: separe this script this file :)
    async function getData(
      uuidOrganization: string,
      setDate: React.Dispatch<React.SetStateAction<CustomersOrganization[]>>,
    ) {
      try {
        const result = await getAllCustomersOrganization(uuidOrganization)

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
          cpf: item.cpf,
          isWallet: item.isWallet,
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
    getData(uuidOrganization, setData)
  }, [uuidOrganization, signal, toast])

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
