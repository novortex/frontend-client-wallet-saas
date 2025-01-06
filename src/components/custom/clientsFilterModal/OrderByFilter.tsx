import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'

interface FilterProps {
  setFilterNewest: (value: boolean) => void
  setFilterOldest: (value: boolean) => void
  setFilterNearestRebalancing: (value: boolean) => void
  setFilterFurtherRebalancing: (value: boolean) => void
}

type Filters = {
  [key: string]: boolean
}

const filterOptions: { name: string; label: string }[] = [
  { name: 'newest', label: 'Newest' },
  { name: 'older', label: 'Older' },
  { name: 'nearestRebalancing', label: 'Nearest rebalancing' },
  { name: 'furtherRebalancing', label: 'Further rebalancing' },
]

export function OrderByFilter({
  setFilterNewest,
  setFilterOldest,
  setFilterNearestRebalancing,
  setFilterFurtherRebalancing,
}: FilterProps) {
  const [filters, setFilters] = useState<Filters>({
    newest: false,
    older: false,
    nearestRebalancing: false,
    furtherRebalancing: false,
  })

  const handleFilterChange = (filterName: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = Object.keys(prevFilters).reduce((acc, key) => {
        acc[key] = key === filterName ? !prevFilters[key] : false
        return acc
      }, {} as Filters)
      return updatedFilters
    })
  }

  useEffect(() => {
    setFilterNewest(filters.newest)
    setFilterOldest(filters.older)
    setFilterNearestRebalancing(filters.nearestRebalancing)
    setFilterFurtherRebalancing(filters.furtherRebalancing)
  }, [
    filters,
    setFilterNewest,
    setFilterOldest,
    setFilterNearestRebalancing,
    setFilterFurtherRebalancing,
  ])

  return (
    <div className="w-full">
      <div className="font-bold text-[#959CB6] mb-2">Order By</div>
      <div className="grid grid-cols-2 gap-4 text-[#fff]">
        {filterOptions.map(({ name, label }) => (
          <div key={name} className="flex items-center gap-2">
            <Checkbox
              checked={filters[name]}
              onCheckedChange={() => handleFilterChange(name)}
              className="border-[#fff]"
            />
            <label>{label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
