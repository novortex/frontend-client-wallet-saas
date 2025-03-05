import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'

interface FilterProps {
  setFilterDelayed: (value: boolean) => void
}

export function AlertsFilter({ setFilterDelayed }: FilterProps) {
  const [filters, setFilters] = useState({
    alerts1to2: false,
    alerts2to5: false,
    alerts6to8: false,
    alerts9plus: false,
  })

  const handleFilterChange = (filterName: string, checked: boolean) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: checked,
    }))
  }

  useEffect(() => {
    const hasSelectedFilters = Object.values(filters).includes(true)
    setFilterDelayed(hasSelectedFilters)
  }, [filters, setFilterDelayed])

  return (
    <div className="w-full mb-4">
      <div className="font-bold text-black dark:text-[#959CB6] mb-2">Number of alerts</div>
      <div className="grid grid-cols-2 gap-4 text:black dark:text-[#fff]">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.alerts1to2}
            onCheckedChange={() => handleFilterChange('alerts1to2', !filters.alerts1to2)}
            className="border-black dark:border-[#fff]"
          />
          <label>1-2 alerts</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.alerts2to5}
            onCheckedChange={() => handleFilterChange('alerts2to5', !filters.alerts2to5)}
            className="border-black dark:border-[#fff]"
          />
          <label>2-5 alerts</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.alerts6to8}
            onCheckedChange={() => handleFilterChange('alerts6to8', !filters.alerts6to8)}
            className="border-black dark:border-[#fff]"
          />
          <label>6-8 alerts</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.alerts9plus}
            onCheckedChange={() => handleFilterChange('alerts9plus', !filters.alerts9plus)}
            className="border-black dark:border-[#fff]"
          />
          <label>9+ alerts</label>
        </div>
      </div>
    </div>
  )
}
