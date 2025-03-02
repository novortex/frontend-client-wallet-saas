import { useEffect, useState } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { AssetOrgs, columnsAssetOrg } from '@/components/custom/assets-org/columns'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '@/components/ui/use-toast'
import { getAllAssetsOrg } from '@/services/managementService'
import { DataTableAssetOrg } from '@/components/custom/assets-org/data-table'
import { Loading } from '@/components/custom/loading'

export function AssetsOrg() {
  const [data, setData] = useState<AssetOrgs[]>([])
  const [loading, setLoading] = useState(true)
  const [signal] = useSignalStore((state) => [state.signal])

  const { toast } = useToast()

  useEffect(() => {
    // TODO: separe this script this file :)
    async function getData(setDate: React.Dispatch<React.SetStateAction<AssetOrgs[]>>) {
      try {
        const result = await getAllAssetsOrg()

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
          quantHighRisk: `${item.riskProfileCounts.highRisk} Wallets`,
          quantSHighRisk: `${item.riskProfileCounts.superHighRisk} Wallets`,
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
  }, [signal, toast])

  if (loading) {
    return <Loading />
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
