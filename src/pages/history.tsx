import SwitchTheme from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import filterIcon from '../assets/image/filter-lines.png'
import HistoryThread from '@/components/custom/history-thread'
import { getWalletHistoric } from '@/service/request'
import { useUserStore } from '@/store/user'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function History() {
  const [historic, setHistoric] = useState([])
  const [organizationUuid] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const { walletUuid } = useParams()

  useEffect(() => {
    async function fetchHistoric() {
      if (organizationUuid && walletUuid) {
        try {
          const data = await getWalletHistoric(organizationUuid, walletUuid)
          setHistoric(data)
        } catch (error) {
          console.error('Failed to fetch historic:', error)
        }
      } else {
        console.error('organizationUuid or walletUuid is undefined')
      }
    }

    fetchHistoric()
  }, [organizationUuid, walletUuid])

  console.log(historic)

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Changes</h1>
        <SwitchTheme />
      </div>
      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-3/4 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
        <div className="flex gap-5">
          <Button
            type="button"
            variant="outline"
            className="gap-2 hover:bg-gray-700"
          >
            <img src={filterIcon} alt="" />
            <p>Filters</p>
          </Button>
        </div>
      </div>
      <div>
        <HistoryThread
          user="Arthur Fraige"
          operationType="DEPOSIT"
          active="Bitcoin"
          date="01/01/2024"
          hour="10:00"
          oldValue={20}
          newValue={30}
        />
      </div>
    </div>
  )
}
