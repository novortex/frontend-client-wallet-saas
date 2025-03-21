import { Checkbox } from '@/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'

export function UnbalancedWalletFilter({
  filterUnbalanced,
  setFilterUnbalanced,
}: {
  filterUnbalanced: boolean
  setFilterUnbalanced: (checked: boolean) => void
}) {
  return (
    <div className="w-full">
      <div className="mb-2 font-bold text-black dark:text-[#959CB6]">
        Wallet Status
      </div>
      <div className="mt-2 h-[80%] w-full">
        <div className="flex items-center gap-2 text-black dark:text-[#fff]">
          <Checkbox
            checked={filterUnbalanced}
            onCheckedChange={(checked: CheckedState) => {
              setFilterUnbalanced(checked === true)
            }}
            className="border-black dark:border-[#fff]"
          />
          <label>Show unbalanced wallets</label>
        </div>
      </div>
    </div>
  )
}
