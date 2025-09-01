import { useEffect, useState } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import {
  AssetOrgs,
  columnsAssetOrg,
} from '@/components/custom/assets-org/columns'
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
    async function getData(
      setDate: React.Dispatch<React.SetStateAction<AssetOrgs[]>>,
    ) {
      try {
        const result = await getAllAssetsOrg()

        if (!result) {
          return toast({
            className: 'toast-error',
            title: 'Erro ao carregar ativos',
            description: 'Não foi possível carregar os ativos da organização.',
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
          className: 'toast-error',
          title: '❌ Erro ao carregar ativos',
          description: 'Não foi possível carregar os ativos da organização.',
        })
      }
    }
    getData(setData)
  }, [signal, toast])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Assets
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage organization assets and allocations
            </p>
          </div>
          <SwitchTheme />
        </div>

        <div className="mb-10">
          <DataTableAssetOrg columns={columnsAssetOrg} data={data} />
        </div>
      </div>
    </div>
  )
}
