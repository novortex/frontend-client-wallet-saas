import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { X } from 'lucide-react'
import { getAllManagersOnOrganization } from '@/services/managementService'
import { FilterOptions } from '../types/filter'

interface FilterModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilter: (filters: FilterOptions) => void
  initialFilters?: FilterOptions
}

interface Manager {
  uuid: string
  name: string
}

export function FilterModal({
  isOpen,
  onOpenChange,
  onApplyFilter,
  initialFilters,
}: FilterModalProps) {
  const defaultFilters: FilterOptions = {
    status: [],
    manager: [],
  }

  const [filters, setFilters] = useState<FilterOptions>(
    initialFilters || defaultFilters,
  )
  const [selectedManager, setSelectedManager] = useState<string>('')
  const [managers, setManagers] = useState<Manager[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchManagers = async () => {
      if (isOpen) {
        try {
          setIsLoading(true)
          const data = await getAllManagersOnOrganization()
          setManagers(data)
        } catch (error) {
          console.error('Error fetching managers:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchManagers()
  }, [isOpen])

  const handleResetFilters = () => {
    setFilters(defaultFilters)
  }

  const handleApplyFilters = () => {
    onApplyFilter(filters)
    onOpenChange(false)
  }

  const handleRemoveManager = (managerId: string) => {
    setFilters((prev) => ({
      ...prev,
      manager: prev.manager.filter((id) => id !== managerId),
    }))
  }

  const toggleStatus = (status: string) => {
    setFilters((prev) => {
      if (prev.status.includes(status)) {
        return {
          ...prev,
          status: prev.status.filter((s) => s !== status),
        }
      } else {
        return {
          ...prev,
          status: [...prev.status, status],
        }
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[500px] overflow-y-visible rounded-lg border-transparent dark:bg-[#1C1C1C] dark:text-white">
        <DialogHeader className="border-b border-gray-200 pb-4 dark:border-gray-700">
          <DialogTitle className="text-2xl">Advanced Filter</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Manager Filter */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">Filter by manager</Label>
            <div className="flex flex-col space-y-4">
              <Select
                value={selectedManager}
                onValueChange={(value) => {
                  if (value && !filters.manager.includes(value)) {
                    setFilters((prev) => ({
                      ...prev,
                      manager: [...prev.manager, value],
                    }))
                  }
                  setSelectedManager('')
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="dark:border-[#323232] dark:bg-[#272727] dark:text-white">
                  <SelectValue
                    placeholder={
                      isLoading ? 'Loading managers...' : 'Select manager'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="dark:border-[#323232] dark:bg-[#272727] dark:text-white">
                  {managers.map((manager) => (
                    <SelectItem key={manager.uuid} value={manager.uuid}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.manager.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {filters.manager.map((managerId) => {
                    const manager = managers.find((m) => m.uuid === managerId)
                    return (
                      <div
                        key={managerId}
                        className="flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1 dark:bg-[#323232]"
                      >
                        <span className="text-sm dark:text-gray-200">
                          {manager ? manager.name : managerId}
                        </span>
                        <button
                          onClick={() => handleRemoveManager(managerId)}
                          className="flex items-center justify-center rounded-full p-1 hover:bg-gray-300 dark:hover:bg-[#454545]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          {/* Status Filter */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">Status</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-ok"
                  checked={filters.status.includes('ok')}
                  onCheckedChange={() => toggleStatus('ok')}
                  className="h-5 w-5 rounded-sm border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor="status-ok" className="flex">
                  <span className="mr-2">OK</span>
                  <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                    OK
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-days-left"
                  checked={filters.status.includes('days_left')}
                  onCheckedChange={() => toggleStatus('days_left')}
                  className="h-5 w-5 rounded-sm border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor="status-days-left" className="flex">
                  <span className="mr-2">Due soon</span>
                  <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">
                    Due soon
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-overdue"
                  checked={filters.status.includes('overdue')}
                  onCheckedChange={() => toggleStatus('overdue')}
                  className="h-5 w-5 rounded-sm border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor="status-overdue" className="flex">
                  <span className="mr-2">Overdue</span>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    Overdue
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-no_call"
                  checked={filters.status.includes('no_call')}
                  onCheckedChange={() => toggleStatus('no_call')}
                  className="h-5 w-5 rounded-sm border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor="status-no_call" className="flex">
                  <span className="mr-2">Outdated</span>
                  <span className="rounded-full bg-gray-500 px-2 py-0.5 text-xs text-white">
                    Outdated
                  </span>
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="border-gray-300 dark:border-gray-600 dark:bg-[#272727] dark:text-gray-200 dark:hover:bg-[#323232]"
          >
            Reset Filters
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
