import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface FilterProps {
  setFilterDelayed: (value: boolean) => void
}

export function AlertsFilter({ setFilterDelayed }: FilterProps) {
  const [filters] = useState({
    alerts1to2: false,
    alerts2to5: false,
    alerts6to8: false,
    alerts9plus: false,
  })
  const { toast } = useToast()

  const handleFilterChange = () => {
    toast({
      title: 'Feature em desenvolvimento',
      description: 'O filtro por número de alertas será liberado em breve.',
      className: 'toast-info',
      duration: 4000,
    })
  }

  useEffect(() => {
    const hasSelectedFilters = Object.values(filters).includes(true)
    setFilterDelayed(hasSelectedFilters)
  }, [filters, setFilterDelayed])

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Número de Alertas
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 text-black dark:text-[#fff]">
          <Checkbox
            checked={filters.alerts1to2}
            onCheckedChange={() =>
              handleFilterChange()
            }
            className="border-gray-400 dark:border-gray-500"
          />
          <label className="text-sm font-medium">1-2 alertas</label>
        </div>
        <div className="flex items-center gap-3 text-black dark:text-[#fff]">
          <Checkbox
            checked={filters.alerts2to5}
            onCheckedChange={() =>
              handleFilterChange()
            }
            className="border-gray-400 dark:border-gray-500"
          />
          <label className="text-sm font-medium">2-5 alertas</label>
        </div>
        <div className="flex items-center gap-3 text-black dark:text-[#fff]">
          <Checkbox
            checked={filters.alerts6to8}
            onCheckedChange={() =>
              handleFilterChange()
            }
            className="border-gray-400 dark:border-gray-500"
          />
          <label className="text-sm font-medium">6-8 alertas</label>
        </div>
        <div className="flex items-center gap-3 text-black dark:text-[#fff]">
          <Checkbox
            checked={filters.alerts9plus}
            onCheckedChange={() =>
              handleFilterChange()
            }
            className="border-gray-400 dark:border-gray-500"
          />
          <label className="text-sm font-medium">9+ alertas</label>
        </div>
      </div>
    </div>
  )
}
