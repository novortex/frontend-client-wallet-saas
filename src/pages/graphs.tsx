import { useEffect, useState } from 'react'
import SwitchTheme from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { CardDashboard } from '@/components/custom/card-dashboard'
import WalletGraph from '@/components/custom/graph-wallet'
import { getGraphData } from '@/service/request'
import { useParams } from 'react-router-dom'
import { useUserStore } from '@/store/user'

interface graphDataEntry {
  cuid: string
  amountPercentage: number
  cryptoMoney: number
  benchmarkMoney: number
  walletUuid: string
  createAt: string
}

export default function Graphs() {
  const [graphData, setGraphData] = useState<graphDataEntry[]>([])
  const { walletUuid } = useParams()
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])

  useEffect(() => {
    async function fetchGraphData() {
      if (uuidOrganization && walletUuid) {
        try {
          const data = await getGraphData(uuidOrganization, walletUuid)
          setGraphData(data)
        } catch (error) {
          console.error('Failed to fetch historic:', error)
        }
      } else {
        console.error('organizationUuid or walletUuid is undefined')
      }
    }
    fetchGraphData()
  }, [uuidOrganization, walletUuid])

  console.log(graphData)

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Graphs</h1>
        <SwitchTheme />
      </div>
      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-full border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
      </div>
      <div className="w-full h-1/3 mb-5 flex flex-row justify-between">
        <CardDashboard title="Entry date" data="123123" />
        <CardDashboard title="Closing date" data="123123" />
        <CardDashboard title="Initial value" data="123123" />
        <CardDashboard title="Current value" data="123123" />
      </div>
      <div className="w-full h-1/3 mb-10 flex flex-row justify-between">
        <CardDashboard title="Performance fee" data="123123" />
        <CardDashboard title="Last rebalance" data="123123" />
        <CardDashboard title="Current value in benchmark" data="123123" />
        <CardDashboard title="Current value ideal portfolio" data="123123" />
      </div>
      <div className="w-full h-1/3">
        <WalletGraph />
      </div>
    </div>
  )
}
