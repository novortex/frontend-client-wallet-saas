import CardClient from '@/components/custom/card-client'
import SwitchTheme from '@/components/custom/switch-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import filterIcon from '../assets/image/filter-lines.png'
import AddNewClientModal from '@/components/custom/add-new-client-modal'
import { useState, useEffect } from 'react'
import { getManagerWallets, getManagerClients } from '@/service/request'
import { useUserStore } from '@/store/user'

type TWallet = {
  uuid: string
  enterDate: string
  investedAmount: number
  currentAmount: number
  closeDate: string
  initialFee: number | null
  initialFeePaid: boolean
  riskProfile: string
  monthCloseDate: string
  contract: boolean
  performanceFee: number
  lastRebalance: string | null
  userUuid: string
  rebalanceCuid: string | null
  exchangeUuid: string
  organizationUuid: string
  benchmarkCuid: string
  createAt: string
  updateAt: string
}

type TClientData = {
  uuid: string
  name: string
  email: string
  phone: string
  cpf: string
  createAt: string
  updateAt: string
}

type TClientInfosResponse = {
  userUuid: string
  walletUuid: string
  lastContactAt: string | null
  revokeAt: string | null
  createAt: string
  updateAt: string
  wallet: TWallet
  clientData: TClientData
}

export default function Clients() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uuidUser] = useUserStore((state) => [state.user.uuid])
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [clients, setClients] = useState<TClientInfosResponse[]>([])

  useEffect(() => {
    const fetchWalletsAndClients = async () => {
      try {
        const walletsResponse = await getManagerWallets(
          uuidUser,
          uuidOrganization,
        )
        console.log('Wallets Response:', walletsResponse)

        if (walletsResponse) {
          const userUuids = extractUserUuids(walletsResponse)
          const clientPromises = userUuids.map((userUuid) =>
            getManagerClients(userUuid, uuidOrganization),
          )

          const clientsResponses: TClientData[] =
            await Promise.all(clientPromises)

          const compiledClients: TClientInfosResponse[] = clientsResponses.map(
            (clientResponse, index) => {
              const wallet = walletsResponse[index]

              return {
                userUuid: clientResponse.uuid,
                walletUuid: wallet.uuid,
                lastContactAt: null,
                revokeAt: null,
                createAt: clientResponse.createAt,
                updateAt: clientResponse.updateAt,
                wallet,
                clientData: {
                  uuid: clientResponse.uuid,
                  name: clientResponse.name,
                  email: clientResponse.email,
                  phone: clientResponse.phone,
                  cpf: clientResponse.cpf,
                  createAt: clientResponse.createAt,
                  updateAt: clientResponse.updateAt,
                },
              }
            },
          )

          console.log('Compiled Clients:', compiledClients)
          setClients(compiledClients)
        }
      } catch (error) {
        console.error('Error fetching wallets and clients:', error)
      }
    }

    fetchWalletsAndClients()
  }, [uuidOrganization, uuidUser])

  function extractUserUuids(data: TClientInfosResponse[]): string[] {
    return data.map((item: TClientInfosResponse) => item.wallet.userUuid)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Clients</h1>
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
          <Button
            className="bg-[#1877F2] p-5"
            type="button"
            onClick={openModal}
          >
            + Add New
          </Button>
        </div>
      </div>
      <div className="w-full flex gap-7">
        {clients.map((client, index) => (
          <CardClient
            key={index}
            walletUuid={client.wallet.walletUuid}
            name={client.clientData.name}
            email={client.clientData.email}
            phone={client.clientData.phone}
            cpf={client.clientData.cpf}
            // alerts={}
            // responsible={}
            // lastRebalancing={client.wallet.lastRebalance}
            // nextRebalancing={}
          />
        ))}
      </div>
      <AddNewClientModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}
