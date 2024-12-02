import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'

interface FilterProps {
  filterDelayed: boolean
  setFilterDelayed: (value: boolean) => void
}

export function OrderByFilter({
  filterDelayed,
  setFilterDelayed,
}: FilterProps) {
  const [filters, setFilters] = useState({
    newest: false,
    older: false,
    nearestRebalancing: false,
    furtherRebalancing: false,
  })

  // to-do: implement this filter after
  console.log(`delayed =>`, filterDelayed)

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
    <div className="w-full ">
      <div className="font-bold text-[#959CB6] mb-2">Order By</div>
      <div className="grid grid-cols-2 gap-4 text-[#fff]">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.newest}
            onCheckedChange={() =>
              handleFilterChange('newest', !filters.newest)
            }
            className="border-[#fff]"
          />
          <label>Newest</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.older}
            onCheckedChange={() => handleFilterChange('older', !filters.older)}
            className="border-[#fff]"
          />
          <label>Older</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.nearestRebalancing}
            onCheckedChange={() =>
              handleFilterChange(
                'nearestRebalancing',
                !filters.nearestRebalancing,
              )
            }
            className="border-[#fff]"
          />
          <label>Nearest rebalancing</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.furtherRebalancing}
            onCheckedChange={() =>
              handleFilterChange(
                'furtherRebalancing',
                !filters.furtherRebalancing,
              )
            }
            className="border-[#fff]"
          />
          <label>Further rebalancing</label>
        </div>
      </div>
    </div>
  )
}
