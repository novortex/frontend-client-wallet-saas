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
import { CalendarIcon, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

// Define filter options type
interface FilterOptions {
  status: string[]
  manager: string[]
  startDateFrom: Date | null
  startDateTo: Date | null
  closingDateFrom: Date | null
  closingDateTo: Date | null
  showClosedWallets: boolean
}

interface FilterModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilter: (filters: FilterOptions) => void
  initialFilters?: FilterOptions
}

// Mock manager data
const managers = [
  { id: 'm1', name: 'Pedro Gattai' },
  { id: 'm2', name: 'Allan Resende' },
  { id: 'm3', name: 'Marco Aurelio' },
  { id: 'm4', name: 'Arthur Mendes' },
  { id: 'm5', name: 'Abner Costa' },
]

export function FilterModal({
  isOpen,
  onOpenChange,
  onApplyFilter,
  initialFilters,
}: FilterModalProps) {
  // Set default filter options if not provided
  const defaultFilters: FilterOptions = {
    status: [],
    manager: [],
    startDateFrom: null,
    startDateTo: null,
    closingDateFrom: null,
    closingDateTo: null,
    showClosedWallets: true,
  }

  const [filters, setFilters] = useState<FilterOptions>(
    initialFilters || defaultFilters,
  )
  const [selectedManager, setSelectedManager] = useState<string>('')

  // Reset filters
  const handleResetFilters = () => {
    setFilters(defaultFilters)
  }

  // Apply filters
  const handleApplyFilters = () => {
    onApplyFilter(filters)
    onOpenChange(false)
  }

  // Add manager to selection
  const handleAddManager = (managerId: string) => {
    if (managerId && !filters.manager.includes(managerId)) {
      setFilters((prev) => ({
        ...prev,
        manager: [...prev.manager, managerId],
      }))
      setSelectedManager('')
    }
  }

  // Remove manager from selection
  const handleRemoveManager = (managerId: string) => {
    setFilters((prev) => ({
      ...prev,
      manager: prev.manager.filter((id) => id !== managerId),
    }))
  }

  // Toggle status selection
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

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return format(date, 'dd/MM/yyyy')
  }

  // Get manager name from id
  const getManagerName = (managerId: string) => {
    const manager = managers.find((m) => m.id === managerId)
    return manager ? manager.name : ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[600px] overflow-y-auto rounded-lg border-transparent dark:bg-[#1C1C1C] dark:text-white">
        <DialogHeader className="border-b border-gray-200 pb-4 dark:border-gray-700">
          <DialogTitle className="text-2xl">Filter Wallet Closings</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Manager Filter - Redesigned */}
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
              >
                <SelectTrigger className="dark:border-[#323232] dark:bg-[#272727] dark:text-white">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent className="dark:border-[#323232] dark:bg-[#272727] dark:text-white">
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected Managers as chips */}
              {filters.manager.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {filters.manager.map((managerId) => (
                    <div
                      key={managerId}
                      className="flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1 dark:bg-[#323232]"
                    >
                      <span className="text-sm dark:text-gray-200">
                        {getManagerName(managerId)}
                      </span>
                      <button
                        onClick={() => handleRemoveManager(managerId)}
                        className="flex items-center justify-center rounded-full p-1 hover:bg-gray-300 dark:hover:bg-[#454545]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
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
                  id="status-completed"
                  checked={filters.status.includes('Completed')}
                  onCheckedChange={() => toggleStatus('Completed')}
                  className="h-5 w-5 rounded-sm border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor="status-completed" className="flex">
                  <span className="mr-2">Completed</span>
                  <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                    Completed
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-pending"
                  checked={filters.status.includes('Pending')}
                  onCheckedChange={() => toggleStatus('Pending')}
                  className="h-5 w-5 rounded-sm border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor="status-pending" className="flex">
                  <span className="mr-2">Pending</span>
                  <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">
                    Pending
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-failed"
                  checked={filters.status.includes('Failed')}
                  onCheckedChange={() => toggleStatus('Failed')}
                  className="h-5 w-5 rounded-sm border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor="status-failed" className="flex">
                  <span className="mr-2">Failed</span>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    Failed
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-processing"
                  checked={filters.status.includes('Processing')}
                  onCheckedChange={() => toggleStatus('Processing')}
                  className="h-5 w-5 rounded-sm border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor="status-processing" className="flex">
                  <span className="mr-2">Processing</span>
                  <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                    Processing
                  </span>
                </Label>
              </div>
            </div>
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Start Date Range */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Start Date Range</Label>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label>From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between dark:border-gray-600 dark:bg-[#272727] dark:text-gray-200"
                      >
                        {filters.startDateFrom
                          ? formatDate(filters.startDateFrom)
                          : 'Select date'}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.startDateFrom || undefined}
                        onSelect={(date) =>
                          setFilters((prev) => ({
                            ...prev,
                            startDateFrom: date,
                          }))
                        }
                        className="rounded-md dark:bg-[#1C1C1C] dark:text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label>To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between dark:border-gray-600 dark:bg-[#272727] dark:text-gray-200"
                      >
                        {filters.startDateTo
                          ? formatDate(filters.startDateTo)
                          : 'Select date'}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.startDateTo || undefined}
                        onSelect={(date) =>
                          setFilters((prev) => ({ ...prev, startDateTo: date }))
                        }
                        className="rounded-md dark:bg-[#1C1C1C] dark:text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Closing Date Range */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Closing Date Range</Label>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label>From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between dark:border-gray-600 dark:bg-[#272727] dark:text-gray-200"
                      >
                        {filters.closingDateFrom
                          ? formatDate(filters.closingDateFrom)
                          : 'Select date'}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.closingDateFrom || undefined}
                        onSelect={(date) =>
                          setFilters((prev) => ({
                            ...prev,
                            closingDateFrom: date,
                          }))
                        }
                        className="rounded-md dark:bg-[#1C1C1C] dark:text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label>To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between dark:border-gray-600 dark:bg-[#272727] dark:text-gray-200"
                      >
                        {filters.closingDateTo
                          ? formatDate(filters.closingDateTo)
                          : 'Select date'}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.closingDateTo || undefined}
                        onSelect={(date) =>
                          setFilters((prev) => ({
                            ...prev,
                            closingDateTo: date,
                          }))
                        }
                        className="rounded-md dark:bg-[#1C1C1C] dark:text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-4 mt-2 space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-closed-wallets"
                checked={filters.showClosedWallets}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    showClosedWallets: checked === true,
                  }))
                }
                className="h-5 w-5 rounded-sm border-gray-300 dark:border-gray-600"
              />
              <Label htmlFor="show-closed-wallets">Show closed wallets</Label>
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
