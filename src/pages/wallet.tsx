import { useEffect, useState } from 'react'
import { CardDashboard } from '@/components/custom/card-dashboard'
import {
  ClientActive,
  columns,
} from '@/components/custom/tables/wallet-client/columns'
import { DataTable } from '@/components/custom/tables/wallet-client/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// import searchIcon from '../assets/icons/MagnifyingGlass.svg'
import SwitchTheme from '@/components/custom/switch-theme'

async function getData(): Promise<ClientActive[]> {
  return [
    {
      id: '728ed52f',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      qtyInCript: 0.5912,
      inputData: '02/07/2024',
      entryValue: 'U$ 20.000,00',
      currentValue: 'U$ 20.000,00',
      optimalValue: 'U$ 20.000,00',
      optimalAllocation: '25%',
      currentAllocation: '30%',
    },
    {
      id: '728e',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      qtyInCript: 0.5912,
      inputData: '02/07/2024',
      entryValue: 'U$ 20.000,00',
      currentValue: 'U$ 20.000,00',
      optimalValue: 'U$ 20.000,00',
      optimalAllocation: '25%',
      currentAllocation: '30%',
    },
    {
      id: '728ed',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      qtyInCript: 0.5912,
      inputData: '02/07/2024',
      entryValue: 'U$ 20.000,00',
      currentValue: 'U$ 20.000,00',
      optimalValue: 'U$ 20.000,00',
      optimalAllocation: '25%',
      currentAllocation: '30%',
    },
    {
      id: '728ed5',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      qtyInCript: 0.5912,
      inputData: '02/07/2024',
      entryValue: 'U$ 20.000,00',
      currentValue: 'U$ 20.000,00',
      optimalValue: 'U$ 20.000,00',
      optimalAllocation: '25%',
      currentAllocation: '30%',
    },
    {
      id: '728ed52',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      qtyInCript: 0.5912,
      inputData: '02/07/2024',
      entryValue: 'U$ 20.000,00',
      currentValue: 'U$ 20.000,00',
      optimalValue: 'U$ 20.000,00',
      optimalAllocation: '25%',
      currentAllocation: '30%',
    },
  ]
}

export default function Wallet() {
  const [data, setData] = useState<ClientActive[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await getData()
      setData(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Wallet</h1>
        <SwitchTheme />
      </div>

      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-3/4 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
        <div className="flex gap-5">
          <Button type="button" variant="outline">
            Change history
          </Button>
          <Button className="bg-[#EF4E3D] p-5" type="button">
            Closing
          </Button>
        </div>
      </div>

      <div className="flex gap-5 mb-10">
        <CardDashboard title="Date of entry" data="02/07/2024" />
        <CardDashboard title="Initial value" data="0" />
        <CardDashboard title="Current value" data="0" />
        <CardDashboard title="Performance fee" data="0" />
        <CardDashboard title="Last rebalancing" data="02/07/2024" />
        <CardDashboard title="Closing date" data="02/07/2024" />
      </div>

      <div className="mb-10">
        <DataTable columns={columns} data={data} />
      </div>

      <div className="bg-[#171717] rounded-t-lg p-5 flex items-center justify-between ">
        <h1 className="text-white">My triggers</h1>
        <Button className="bg-[#1877F2] w-1/12 hover:bg-blue-600 p-5">
          + New trigger
        </Button>
      </div>
      <div className="bg-[#131313] flex justify-between gap-5 p-7">
        <div className="bg-red-400 w-1/3 p-5">
          <h2>Alert when it happens X</h2>
        </div>
        <div className="bg-yellow-400 w-1/3 p-5">
          <h2>Alert when it happens Y</h2>
        </div>
        <div className="bg-green-400 w-1/3 p-5">
          <h2>Alert when it happens Z</h2>
        </div>
      </div>
    </div>
  )
}
