import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users } from 'lucide-react'

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
    <div className="flex w-full flex-col gap-2">
      <div className="h-[20%] w-full font-bold dark:text-[#959CB6]">
        Filter by manager
      </div>
      <div className="flex h-[80%] w-full flex-col items-center justify-center gap-4">
        <div className="flex h-full w-[100%] items-center justify-center gap-2">
          <div className="flex h-full w-[6%] items-center justify-center">
            <Users className="text-[#D1AB00]" size="lg" />
          </div>
          <div className="flex w-full items-center justify-start">
            <Select value={lastManager} onValueChange={handleManagerSelection}>
              <SelectTrigger className="w-full dark:border-[#323232] dark:bg-[#131313] dark:text-[#fff]">
                <SelectValue placeholder="Select managers" />
              </SelectTrigger>
              <SelectContent className="border-2 dark:border-[#323232] dark:bg-[#131313]">
                {managers.map((manager, index) => (
                  <SelectItem
                    key={index}
                    value={manager.name}
                    className="border-0 dark:bg-[#131313] dark:text-white dark:focus:bg-[#252525] dark:focus:text-white"
                  >
                    <div>{manager.name}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-start justify-start gap-2">
          {selectedManagers.map((managerName, index) => (
            <div
              key={index}
              className="flex h-8 items-center justify-start rounded-md bg-[#959CB6] px-2 text-white"
            >
              <div
                className="mr-2 cursor-pointer"
                onClick={() => handleRemoveManager(managerName)}
              >
                X
              </div>
              <div>{managerName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
