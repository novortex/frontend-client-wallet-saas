import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import responsibleIcon from '@/assets/image/responsible-icon.png'

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
  return (
    <div className="w-full">
      <div className="h-[20%] w-full font-bold text-[#959CB6]">
        Filter by manager
      </div>
      <div className="h-[80%] w-full flex flex-col items-center justify-center gap-4">
        <div className="h-full w-[100%] flex justify-center gap-2 items-center">
          <div className="h-full w-[10%] flex justify-center items-center">
            <img src={responsibleIcon} alt="icon" className="w-12" />
          </div>
          <div className="w-full flex items-center justify-start">
            <Select onValueChange={handleSelectManager}>
              <SelectTrigger className="w-full bg-[#131313] border-[#323232] text-[#fff]">
                <SelectValue placeholder="Select managers" />
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-2 border-[#323232]">
                {managers.map((manager, index) => (
                  <SelectItem
                    key={index}
                    value={manager.name}
                    className="bg-[#131313] border-0 focus:bg-[#252525] focus:text-white text-white"
                  >
                    <div>{manager.name}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          {selectedManagers.map((managerName, index) => (
            <div
              key={index}
              className="h-8 flex items-center bg-[#959CB6] text-white rounded-md px-2"
            >
              <div
                className="cursor-pointer mr-2"
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
