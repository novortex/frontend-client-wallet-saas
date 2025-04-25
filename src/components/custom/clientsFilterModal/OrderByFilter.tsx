import { Checkbox } from '@/components/ui/checkbox'

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
    <div className="w-full">
      <div className="mb-2 font-bold text-black dark:text-[#959CB6]">
        Order By
      </div>
      <div className="grid grid-cols-2 gap-4 text-black dark:text-[#fff]">
        {filterOptions.map(({ name, label }) => (
          <div key={name} className="flex items-center gap-2">
            <Checkbox
              checked={filters[name]}
              onCheckedChange={() => handleCheckboxChange(name)}
              className="border-black dark:border-[#fff]"
            />
            <label>{label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
