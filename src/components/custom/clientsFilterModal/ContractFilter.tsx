import { Checkbox } from '@/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'
import { FileCheck } from 'lucide-react'

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
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <FileCheck className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Contrato
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 text-black dark:text-white">
          <Checkbox
            checked={hasContract}
            onCheckedChange={(checked: CheckedState) => {
              setHasContract(checked === true)
            }}
            className="border-gray-400 dark:border-gray-500"
          />
          <label className="text-sm font-medium">Tem contrato</label>
        </div>
        <div className="flex items-center gap-3 text-black dark:text-white">
          <Checkbox
            checked={hasNoContract}
            onCheckedChange={(checked: CheckedState) => {
              setHasNoContract(checked === true)
            }}
            className="border-gray-400 dark:border-gray-500"
          />
          <label className="text-sm font-medium">Sem contrato</label>
        </div>
      </div>
    </div>
  )
}
