import { Checkbox } from '@/components/ui/checkbox'

interface WalletTypeFilterProps {
  selectedWalletTypes: string[]
  handleSelectWalletType: (walletType: string) => void
  handleRemoveWalletType: (walletType: string) => void
}

function normalizeOption(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}

export function WalletTypeFilter({ selectedWalletTypes, handleSelectWalletType, handleRemoveWalletType }: WalletTypeFilterProps) {
  const options = ['Standard', 'Super Low Risk', 'Low Risk', 'High Risk', 'Super High Risk']

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="font-bold text-black dark:text-[#959CB6] mb-2">Wallet Type</div>
      <div className="w-full flex flex-wrap gap-4">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2 text-black dark:text-[#fff]" style={{ flex: '1 0 30%' }}>
            <Checkbox
              className="border-black dark:border-[#fff]"
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
            <label>{option}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
