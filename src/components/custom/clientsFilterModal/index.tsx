import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { OrderByFilter } from './OrderByFilter'
import { WalletTypeFilter } from './WalletTypeFilter'
import { ManagerFilter } from './ManagerFilter'
import { UnbalancedWalletFilter } from './UnbalanceWalletFilter'
import { useUserStore } from '@/store/user'
import { getAllManagersOnOrganization } from '@/services/request'
import { AlertsFilter } from './AlertsFilter'

export function ClientsFilterModal({
  onApplyFilters,
}: {
  onApplyFilters: (filters: {
    selectedManagers: string[]
    selectedWalletTypes: string[]
    filterDelayed: boolean
    filterUnbalanced: boolean
  }) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedManagers, setSelectedManagers] = useState<string[]>([])
  const [selectedWalletTypes, setSelectedWalletTypes] = useState<string[]>([])
  const [managers, setManagers] = useState<{ name: string }[]>([])
  const [filterDelayed, setFilterDelayed] = useState(false)
  const [filterUnbalanced, setFilterUnbalanced] = useState(false)

  const uuidOrganization = useUserStore((state) => state.user.uuidOrganization)

  useEffect(() => {
    const fetchManagers = async () => {
      const result = await getAllManagersOnOrganization(uuidOrganization)
      setManagers(result.map((item) => ({ name: item.name })))
    }
    fetchManagers()
  }, [uuidOrganization])

  const handleApplyFilters = () => {
    const filters = {
      selectedManagers: selectedManagers.length > 0 ? selectedManagers : [],
      selectedWalletTypes:
        selectedWalletTypes.length > 0 ? selectedWalletTypes : [],
      filterDelayed,
      filterUnbalanced,
    }
    onApplyFilters(filters)
    setIsOpen(false)
  }

  const handleSelectManager = (name: string) =>
    setSelectedManagers((prev) => [...prev, name])

  const handleRemoveManager = (name: string) =>
    setSelectedManagers((prev) => prev.filter((manager) => manager !== name))

  const handleSelectWalletType = (type: string) =>
    setSelectedWalletTypes((prev) => [...prev, type])

  const handleRemoveWalletType = (type: string) =>
    setSelectedWalletTypes((prev) => prev.filter((t) => t !== type))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="gap-2 hover:bg-gray-700"
          onClick={() => setIsOpen(true)}
        >
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#131313] h-fit">
        <DialogHeader className="text-[#fff]">
          <DialogTitle className="text-2xl text-center">
            Filter Customer
          </DialogTitle>
        </DialogHeader>
        <WalletTypeFilter
          selectedWalletTypes={selectedWalletTypes}
          handleSelectWalletType={handleSelectWalletType}
          handleRemoveWalletType={handleRemoveWalletType}
        />
        <OrderByFilter setFilterDelayed={setFilterDelayed} />
        <UnbalancedWalletFilter
          filterUnbalanced={filterUnbalanced}
          setFilterUnbalanced={setFilterUnbalanced}
        />
        <AlertsFilter setFilterDelayed={setFilterDelayed} />
        <ManagerFilter
          managers={managers}
          selectedManagers={selectedManagers}
          handleSelectManager={handleSelectManager}
          handleRemoveManager={handleRemoveManager}
        />
        <DialogFooter>
          <Button
            className="bg-[#1877f2] text-white"
            onClick={handleApplyFilters}
          >
            Apply
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
