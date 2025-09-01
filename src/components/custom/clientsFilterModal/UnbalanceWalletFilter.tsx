import { Checkbox } from '@/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'
import { AlertTriangle } from 'lucide-react'

export function UnbalancedWalletFilter({
  filterUnbalanced,
  setFilterUnbalanced,
}: {
  filterUnbalanced: boolean
  setFilterUnbalanced: (checked: boolean) => void
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Status da Carteira
        </h3>
      </div>
      
      <div className="flex items-center gap-3 text-black dark:text-[#fff]">
        <Checkbox
          checked={filterUnbalanced}
          onCheckedChange={(checked: CheckedState) => {
            setFilterUnbalanced(checked === true)
          }}
          className="border-gray-400 dark:border-gray-500"
        />
        <label className="text-sm font-medium">Mostrar carteiras desbalanceadas</label>
      </div>
    </div>
  )
}
