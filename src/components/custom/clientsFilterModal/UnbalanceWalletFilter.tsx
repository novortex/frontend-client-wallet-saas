import { Checkbox } from '@/components/ui/checkbox'

export function UnbalancedWalletFilter({
  filterUnbalanced,
  setFilterUnbalanced,
}: {
  filterUnbalanced: boolean
  setFilterUnbalanced: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="w-full ">
      <div className="font-bold text-[#959CB6] mb-2">Wallet Status</div>
      <div className="h-[80%] w-full mt-2">
        <div className="flex items-center gap-2 text-[#fff]">
          <Checkbox
            checked={filterUnbalanced}
            onCheckedChange={() => setFilterUnbalanced(!filterUnbalanced)}
            className="border-[#fff]"
          />
          <label>Show unbalanced wallets</label>
        </div>
      </div>
    </div>
  )
}
