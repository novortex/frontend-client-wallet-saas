import { Checkbox } from '@/components/ui/checkbox'
import { Shield } from 'lucide-react'

interface WalletTypeFilterProps {
  selectedWalletTypes: string[]
  handleSelectWalletType: (walletType: string) => void
  handleRemoveWalletType: (walletType: string) => void
}

function normalizeOption(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}

export function WalletTypeFilter({
  selectedWalletTypes,
  handleSelectWalletType,
  handleRemoveWalletType,
}: WalletTypeFilterProps) {
  const options = [
    'Standard',
    'Super Low Risk',
    'Low Risk',
    'High Risk',
    'Super High Risk',
  ]

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Tipo de Carteira
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
                if (selectedWalletTypes.includes(normalizedOption)) {
                  handleRemoveWalletType(normalizedOption)
                } else {
                  handleSelectWalletType(normalizedOption)
                }
              }}
              checked={selectedWalletTypes.includes(normalizeOption(option))}
            />
            <label className="text-sm font-medium">{option}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
