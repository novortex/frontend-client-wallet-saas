import CardClient from '@/components/custom/card-client'
import {SwitchTheme} from '@/components/custom/switch-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import filterIcon from '../assets/image/filter-lines.png'
import ClientsFilterModal from '@/components/custom/clients-filter-modal'
import { useState, useEffect } from 'react'
import { getWalletOrganization } from '@/services/request'
import { useUserStore } from '@/store/user'
import { useToast } from '@/components/ui/use-toast'
import { formatDate } from '@/utils'
import { useSignalStore } from '@/store/signalEffect'
import { TClientInfosResponse } from '@/types/customer.type'

export function Clients() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [clients, setClients] = useState<TClientInfosResponse[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  const [signal] = useSignalStore((state) => [state.signal])

  useEffect(() => {
    const fetchWalletsAndClients = async () => {
      try {
        const result = await getWalletOrganization(uuidOrganization)

        if (!result) {
          return toast({
            className: 'bg-red-500 border-0 text-white',
            title: 'Failed get clients :(',
            description: 'Demo Vault !!',
          })
        }

        setClients(result)
      } catch (error) {
        console.error('Error fetching wallets and clients:', error)
      }
    }

    fetchWalletsAndClients()
  }, [toast, uuidOrganization, signal])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  // Função para obter gerentes do cache
  const getCachedManagers = () => {
    const cachedManagers = localStorage.getItem('selectedManagers')
    return cachedManagers ? JSON.parse(cachedManagers) : []
  }

  const cachedManagers = getCachedManagers()

  // Filtrar clientes com base no termo de pesquisa e gerentes em cache
  const filteredClients = clients.filter((client) => {
    const nameMatches =
      client.infosClient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.managerName.toLowerCase().includes(searchTerm.toLowerCase())

    const managerMatches =
      cachedManagers.length === 0 || cachedManagers.includes(client.managerName)

    return nameMatches && managerMatches
  })

  const openFilterModal = () => {
    setIsFilterModalOpen(true)
  }

  const closeFilterModal = () => {
    setIsFilterModalOpen(false)
  }

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Wallets</h1>
        <SwitchTheme />
      </div>
      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-5/6 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="flex gap-5">
          <Button
            type="button"
            variant="outline"
            className="gap-2 hover:bg-gray-700"
            onClick={openFilterModal}
          >
            <img src={filterIcon} alt="" />
            <p>Filters</p>
          </Button>
        </div>
      </div>
      <div className="w-full grid grid-cols-3 flex gap-7 ">
        {filteredClients &&
          filteredClients.map((client, index) => (
            <CardClient
              key={index}
              walletUuid={client.walletUuid}
              name={client.infosClient.name}
              email={client.infosClient.email}
              phone={client.infosClient.phone}
              alerts={0}
              responsible={client.managerName}
              lastRebalancing={
                client.lastBalance !== null
                  ? formatDate(client.lastBalance.toString())
                  : '-'
              }
              nextRebalancing={
                client.nextBalance !== null
                  ? formatDate(client.nextBalance.toString())
                  : '-'
              }
            />
          ))}
      </div>
      <ClientsFilterModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
      />
    </div>
  )
}
