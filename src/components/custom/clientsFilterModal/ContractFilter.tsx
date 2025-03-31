import { Checkbox } from '@/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'

export function ContractFilter({
  hasContract,
  hasNoContract,
  setHasContract,
  setHasNoContract,
}: {
  hasContract: boolean
  hasNoContract: boolean
  setHasContract: (checked: boolean) => void
  setHasNoContract: (checked: boolean) => void
}) {
  return (
    <div className="w-full">
      <div className="mb-2 font-bold text-black dark:text-[#959CB6]">
        Contract
      </div>
      <div className="mt-2 h-[80%] w-full">
        <div className="flex flex-col gap-2 text-black dark:text-white">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={hasContract}
              onCheckedChange={(checked: CheckedState) => {
                setHasContract(checked === true)
              }}
              className="border-black dark:border-white"
            />
            <label>Has contract</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={hasNoContract}
              onCheckedChange={(checked: CheckedState) => {
                setHasNoContract(checked === true)
              }}
              className="border-black dark:border-white"
            />
            <label>No contract</label>
          </div>
        </div>
      </div>
    </div>
  )
}
