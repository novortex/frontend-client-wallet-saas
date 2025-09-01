import { Checkbox } from '@/components/ui/checkbox'
import { DollarSign } from 'lucide-react'

interface CashFilterProps {
  selectedCashOptions: string[]
  handleSelectCashOption: (option: string) => void
  handleRemoveCashOption: (option: string) => void
}

function normalizeOption(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-').replace(/%/g, '')
}

export function CashFilter({
  selectedCashOptions,
  handleSelectCashOption,
  handleRemoveCashOption,
}: CashFilterProps) {
  const options = ['0%', '1% a 5%', '5% a 10%', '+10%']

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Dinheiro Disponível
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-black dark:text-[#fff]"
          >
            <Checkbox
              className="border-gray-400 dark:border-gray-500"
              onCheckedChange={() => {
                const normalizedOption = normalizeOption(option)
                if (selectedCashOptions.includes(normalizedOption)) {
                  handleRemoveCashOption(normalizedOption)
                } else {
                  handleSelectCashOption(normalizedOption)
                }
              }}
              checked={selectedCashOptions.includes(normalizeOption(option))}
            />
            <label className="text-sm font-medium">{option}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
