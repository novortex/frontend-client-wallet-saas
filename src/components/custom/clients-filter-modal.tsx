import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import responsibleIcon from '../../assets/image/responsible-icon.png'
import { useUserStore } from '@/store/user'
import { getAllManagersOnOrganization } from '@/service/request'

interface ClientsFilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ClientsFilterModal({
  isOpen,
  onClose,
}: ClientsFilterModalProps) {
  const [selectedManagers, setSelectedManagers] = useState<string[]>([])
  const [managers, setManagers] = useState<{ name: string }[]>([])

  const uuidOrganization = useUserStore((state) => state.user.uuidOrganization)

  // Carregar gerentes do localStorage ao abrir o modal
  useEffect(() => {
    const cachedManagers = localStorage.getItem('selectedManagers')
    if (cachedManagers) {
      setSelectedManagers(JSON.parse(cachedManagers))
    }
  }, [])

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const result = await getAllManagersOnOrganization(uuidOrganization)
        // Processar os dados da API e definir o estado dos gerentes
        const managersData = result.map((item: any) => ({
          name: item.name,
        }))
        setManagers(managersData)
      } catch (error) {
        console.error('Erro ao buscar gerentes:', error)
      }
    }
    fetchManagers()
  }, [uuidOrganization])

  const handleClose = () => {
    onClose()
  }

  const handleSelectManager = (managerName: string) => {
    if (!selectedManagers.includes(managerName)) {
      const updatedManagers = [...selectedManagers, managerName]
      setSelectedManagers(updatedManagers)
      localStorage.setItem('selectedManagers', JSON.stringify(updatedManagers)) // Armazenar no localStorage
    }
  }

  const handleRemoveManager = (managerName: string) => {
    const updatedManagers = selectedManagers.filter(
      (name) => name !== managerName,
    )
    setSelectedManagers(updatedManagers)
    localStorage.setItem('selectedManagers', JSON.stringify(updatedManagers)) // Atualizar o localStorage
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[90%] bg-[#131313]">
        <DialogHeader className="flex justify-center items-center text-[#fff]">
          <DialogTitle className="text-2xl">Filter Customer</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          {/* Wallet Type */}
          <div className="h-[20%] w-full font-bold text-[#959CB6]">
            Wallet type
          </div>
          <div className="h-[80%] w-full">
            <div className="h-1/2 w-full flex flex-row">
              <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>Standard</label>
              </div>
              <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>Super Low Risk</label>
              </div>
              <div className="h-full w-1/3 flex justify-center items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>Low Risk</label>
              </div>
            </div>
            <div className="h-1/2 w-full flex flex-row">
              <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>High Risk</label>
              </div>
              <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>Super High Risk</label>
              </div>
              <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]"></div>
            </div>
          </div>
        </div>
        <div className="w-full">
          {/* Order By */}
          <div className="h-[20%] w-full font-bold text-[#959CB6]">
            Order By
          </div>
          <div className="h-[80%] w-full">
            <div className="h-1/2 w-full flex flex-row">
              <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>Newest</label>
              </div>
              <div className="h-full w-2/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>Nearest rebalancing</label>
              </div>
            </div>
            <div className="h-1/2 w-full flex flex-row">
              <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>Older</label>
              </div>
              <div className="h-full w-2/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>Further rebalancing</label>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          {/* Number of Alerts */}
          <div className="h-[20%] w-full font-bold text-[#959CB6]">
            Number of alerts
          </div>
          <div className="h-[80%] w-full">
            <div className="h-1/2 w-full flex flex-row">
              <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>1-2 alerts</label>
              </div>
              <div className="h-full w-2/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>2-5 alerts</label>
              </div>
            </div>
            <div className="h-1/2 w-full flex flex-row">
              <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>6-8 alerts</label>
              </div>
              <div className="h-full w-2/3 flex justify-start items-center gap-1.5 text-[#fff]">
                <Checkbox className="border-[#fff]" />
                <label>9+ alerts</label>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          {/* Filter by Manager */}
          <div className="h-[20%] w-full font-bold text-[#959CB6]">
            Filter by manager
          </div>
          <div className="h-[80%] w-full flex flex-row">
            <div className="h-full w-[10%] flex justify-start items-center">
              <img src={responsibleIcon} alt="icon" className="w-[70%]" />
            </div>
            <div className="h-full w-[90%] flex flex-col justify-center">
              <div className="w-full flex items-center justify-start mb-2">
                <Select onValueChange={handleSelectManager}>
                  <SelectTrigger className="w-full bg-[#131313] border-[#323232] text-[#fff]">
                    <SelectValue placeholder="Select managers" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131313] border-2 border-[#323232]">
                    {managers.map((manager, index) => (
                      <SelectItem
                        key={index}
                        value={manager.name}
                        className="bg-[#131313] border-0 focus:bg-[#252525] focus:text-white text-white"
                      >
                        <div>{manager.name}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Render selected manager tags */}
                {selectedManagers.map((managerName, index) => (
                  <div
                    key={index}
                    className="h-8 flex items-center bg-[#959CB6] text-white rounded-md px-2"
                  >
                    <div
                      className="cursor-pointer mr-2"
                      onClick={() => handleRemoveManager(managerName)}
                    >
                      X
                    </div>
                    <div>{managerName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="w-full flex justify-end items-end">
          <Button
            onClick={handleClose}
            className="bg-[#1877F2] w-1/4 hover:bg-blue-600 p-5"
          >
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
