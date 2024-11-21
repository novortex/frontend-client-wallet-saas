/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function ClientsFilterModal({ onClose }: { onClose: () => void }) {
  const [selectedManagers, setSelectedManagers] = useState<string[]>([])
  const [managers, setManagers] = useState<{ name: string }[]>([])
  const [filterDelayed, setFilterDelayed] = useState(false)
  const [filterUnbalanced, setFilterUnbalanced] = useState(false)

  const uuidOrganization = useUserStore((state) => state.user.uuidOrganization)

  useEffect(() => {
    const fetchManagers = async () => {
      const result = await getAllManagersOnOrganization(uuidOrganization)
      const managersData = result.map((item: any) => ({ name: item.name }))
      setManagers(managersData)
    }
    fetchManagers()
  }, [uuidOrganization])

  const handleSelectManager = (managerName: string) => {
    const updatedManagers = [...selectedManagers, managerName]
    setSelectedManagers(updatedManagers)
    localStorage.setItem('selectedManagers', JSON.stringify(updatedManagers))
  }

  const handleRemoveManager = (managerName: string) => {
    const updatedManagers = selectedManagers.filter(
      (name) => name !== managerName,
    )
    setSelectedManagers(updatedManagers)
    localStorage.setItem('selectedManagers', JSON.stringify(updatedManagers))
  }

  const handleApplyFilters = () => {
    localStorage.setItem('filterUnbalanced', JSON.stringify(filterUnbalanced))
    onClose()
  }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogTrigger>
        <Button
          type="button"
          variant="outline"
          className="gap-2 hover:bg-gray-700"
        >
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90%] bg-[#131313] ">
        <DialogHeader className="text-[#fff]">
          <DialogTitle className="text-2xl text-center ">
            Filter Customer
          </DialogTitle>
        </DialogHeader>
        <WalletTypeFilter />

        <OrderByFilter
          filterDelayed={filterDelayed}
          setFilterDelayed={setFilterDelayed}
        />
        <UnbalancedWalletFilter
          filterUnbalanced={filterUnbalanced}
          setFilterUnbalanced={setFilterUnbalanced}
        />
        <AlertsFilter
          filterDelayed={filterDelayed}
          setFilterDelayed={setFilterDelayed}
        />

        <ManagerFilter
          managers={managers}
          selectedManagers={selectedManagers}
          handleSelectManager={handleSelectManager}
          handleRemoveManager={handleRemoveManager}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="bg-[#1877F2] w-1/4 hover:bg-blue-600 p-5"
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
