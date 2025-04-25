import { Checkbox } from '@/components/ui/checkbox'

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
    <div className="flex w-full flex-col gap-2">
      <div className="mb-2 font-bold text-black dark:text-[#959CB6]">
        Available Cash
      </div>
      <div className="flex w-full flex-wrap gap-10">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-black dark:text-[#fff]"
          >
            <Checkbox
              className="border-black dark:border-[#fff]"
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
            <label>{option}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
