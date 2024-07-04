import { useEffect, useState } from 'react'
import SwitchTheme from '@/components/custom/switch-theme'
import { DataTableAssetOrg } from '@/components/custom/tables/assets-org/data-table'
import {
  AssetOrgs,
  columnsAssetOrg,
} from '@/components/custom/tables/assets-org/columns'

async function getData(): Promise<AssetOrgs[]> {
  return [
    {
      id: '728ed52f',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      price: 'U$ 66.000',
      appearances: '50 wallets',
      porcentOfApp: '95%',
      quantSLowRisk: '10 Wallets',
      quantLowRisk: '10 Wallets',
      quantStandard: '10 Wallets',
    },
    {
      id: '728ed52f',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      price: 'U$ 66.000',
      appearances: '50 wallets',
      porcentOfApp: '95%',
      quantSLowRisk: '10 Wallets',
      quantLowRisk: '10 Wallets',
      quantStandard: '10 Wallets',
    },
    {
      id: '728ed52f',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      price: 'U$ 66.000',
      appearances: '50 wallets',
      porcentOfApp: '95%',
      quantSLowRisk: '10 Wallets',
      quantLowRisk: '10 Wallets',
      quantStandard: '10 Wallets',
    },
    {
      id: '728ed52f',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      price: 'U$ 66.000',
      appearances: '50 wallets',
      porcentOfApp: '95%',
      quantSLowRisk: '10 Wallets',
      quantLowRisk: '10 Wallets',
      quantStandard: '10 Wallets',
    },
    {
      id: '728ed52f',
      active: {
        urlImage:
          'https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png',
        name: 'BTC',
      },
      price: 'U$ 66.000',
      appearances: '50 wallets',
      porcentOfApp: '95%',
      quantSLowRisk: '10 Wallets',
      quantLowRisk: '10 Wallets',
      quantStandard: '10 Wallets',
    },
  ]
}

export default function AssetsOrg() {
  const [data, setData] = useState<AssetOrgs[]>([])
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
        <h1 className="text-2xl text-white font-medium">Assets</h1>
        <SwitchTheme />
      </div>

      <div className="mb-10">
        <DataTableAssetOrg columns={columnsAssetOrg} data={data} />
      </div>
    </div>
  )
}
