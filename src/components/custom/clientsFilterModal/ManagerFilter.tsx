import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, X } from 'lucide-react'

export function ManagerFilter({
  managers,
  selectedManagers,
  handleSelectManager,
  handleRemoveManager,
}: {
  managers: { name: string }[]
  selectedManagers: string[]
  handleSelectManager: (managerName: string) => void
  handleRemoveManager: (managerName: string) => void
}) {
  const handleManagerSelection = (managerName: string) => {
    if (!selectedManagers.includes(managerName)) {
      handleSelectManager(managerName)
    }
  }
  const lastManager = selectedManagers.at(-1) ?? ''

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Manager
        </h3>
      </div>
      
      <div className="space-y-3">
        <Select value={lastManager} onValueChange={handleManagerSelection}>
          <SelectTrigger className="w-full border-gray-300 bg-white text-black transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-primary">
            <SelectValue placeholder="Select manager" />
          </SelectTrigger>
          <SelectContent className="border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
            {managers.map((manager, index) => (
              <SelectItem
                key={index}
                value={manager.name}
                className="hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
              >
                <div>{manager.name}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedManagers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedManagers.map((managerName, index) => (
              <div
                key={index}
                className="flex h-8 items-center justify-start rounded-md bg-yellow-600 px-2 text-white hover:bg-yellow-700 transition-colors cursor-pointer"
                onClick={() => handleRemoveManager(managerName)}
              >
                <span className="mr-2">{managerName}</span>
                <X className="h-3 w-3" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
