import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FilterOptions } from '../hooks/useWalletMonitoring'

interface FilterModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilter: (filters: FilterOptions) => void
  initialFilters: FilterOptions
  managers: Array<{ name: string }>
}

export function FilterModal({
  isOpen,
  onOpenChange,
  onApplyFilter,
  initialFilters,
  managers,
}: FilterModalProps) {
  const [selectedManagers, setSelectedManagers] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      setSelectedManagers(initialFilters.manager)
      setSelectedStatus(initialFilters.status)
    }
  }, [isOpen, initialFilters])

  const handleManagerChange = (managerUuid: string) => {
    setSelectedManagers((prev) =>
      prev.includes(managerUuid)
        ? prev.filter((uuid) => uuid !== managerUuid)
        : [...prev, managerUuid],
    )
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    )
  }

  const handleApply = () => {
    onApplyFilter({
      managersSelected: selectedManagers,
      dateFrom: initialFilters.dateFrom || '',
      dateTo: initialFilters.dateTo || '',
      manager: selectedManagers,
      status: selectedStatus,
      searchTerm: initialFilters.searchTerm,
    })
    onOpenChange(false)
  }

  const handleClear = () => {
    setSelectedManagers([])
    setSelectedStatus([])
    onApplyFilter({
      managersSelected: [],
      dateFrom: '',
      dateTo: '',
      manager: [],
      status: [],
      searchTerm: '',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">
            Filter Balance Monitoring
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <h3 className="mb-3 font-medium text-black dark:text-white">
              Performance Status
            </h3>
            <div className="space-y-2">
              {[
                {
                  value: 'perfect',
                  label: 'Perfect (100%)',
                  color: 'text-green-600',
                },
                {
                  value: 'good',
                  label: 'Good (80-99%)',
                  color: 'text-blue-600',
                },
                {
                  value: 'warning',
                  label: 'Warning (60-79%)',
                  color: 'text-yellow-600',
                },
                {
                  value: 'critical',
                  label: 'Critical (<60%)',
                  color: 'text-red-600',
                },
              ].map((status) => (
                <label key={status.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes(status.value)}
                    onChange={() => handleStatusChange(status.value)}
                    className="rounded"
                  />
                  <span className={`${status.color} font-medium`}>
                    {status.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Manager Filter */}
          <div>
            <h3 className="mb-3 font-medium text-black dark:text-white">
              Managers
            </h3>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {managers.map((manager) => (
                <label key={manager.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedManagers.includes(manager.name)}
                    onChange={() => handleManagerChange(manager.name)}
                    className="rounded"
                  />
                  <span className="text-black dark:text-white">
                    {manager.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleClear} variant="outline" className="flex-1">
              Clear All
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-[#F2BE38] text-black hover:bg-yellow-500"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
