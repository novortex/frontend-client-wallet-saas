import { useEffect, useState } from 'react'
import {SwitchTheme} from '@/components/custom/switch-theme'
import { DataTableAssetOrg } from '@/components/custom/tables/assets-org/data-table'
import {
  AssetOrgs,
  columnsAssetOrg,
} from '@/components/custom/tables/assets-org/columns'
import { getAllAssetsOrg } from '@/services/request'
import { useUserStore } from '@/store/user'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '@/components/ui/use-toast'

export function AssetsOrg() {
  const [data, setData] = useState<AssetOrgs[]>([])
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
      setDate: React.Dispatch<React.SetStateAction<AssetOrgs[]>>,
    ) {
      try {
        const result = await getAllAssetsOrg(uuidOrganization)

        if (!result) {
          return toast({
            className: 'bg-red-500 border-0 text-white',
            title: 'Failed get assets organization :(',
            description: 'Demo Vault !!',
          })
        }

        const dataTable = result.map((item) => ({
          id: item.uuid,
          asset: {
            urlImage: item.icon,
            name: item.name,
          },
          price: item.price,
          appearances: `${item.qntInWallet} wallets`,
          porcentOfApp: `${item.presencePercentage}%`,
          quantSLowRisk: `${item.riskProfileCounts.superLowRisk} Wallets`,
          quantLowRisk: `${item.riskProfileCounts.lowRisk} Wallets`,
          quantStandard: `${item.riskProfileCounts.standard} Wallets`,
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
        <h1 className="text-2xl text-white font-medium">Assets</h1>
        <SwitchTheme />
      </div>

      <div className="mb-10">
        <DataTableAssetOrg columns={columnsAssetOrg} data={data} />
      </div>
    </div>
  )
}
