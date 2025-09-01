import { Checkbox } from '@/components/ui/checkbox'
import { ArrowUpDown } from 'lucide-react'

type FilterProps = {
  filters: {
    newest: boolean
    oldest: boolean
    nearestRebalancing: boolean
    furtherRebalancing: boolean
  }
  onFilterChange: (
    filterName: keyof FilterProps['filters'],
    value: boolean,
  ) => void
}

const filterOptions: { name: keyof FilterProps['filters']; label: string }[] = [
  { name: 'newest', label: 'Newest' },
  { name: 'oldest', label: 'Oldest' },
  { name: 'nearestRebalancing', label: 'Nearest rebalancing' },
  { name: 'furtherRebalancing', label: 'Further rebalancing' },
]

export function OrderByFilter({ filters, onFilterChange }: FilterProps) {
  const handleCheckboxChange = (name: keyof FilterProps['filters']) => {
    onFilterChange(name, !filters[name])
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <ArrowUpDown className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Ordenar Por
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {filterOptions.map(({ name, label }) => (
          <div key={name} className="flex items-center gap-3 text-black dark:text-[#fff]">
            <Checkbox
              checked={filters[name]}
              onCheckedChange={() => handleCheckboxChange(name)}
              className="border-gray-400 dark:border-gray-500"
            />
            <label className="text-sm font-medium">{label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
