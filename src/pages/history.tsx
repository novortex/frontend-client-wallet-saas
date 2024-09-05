import SwitchTheme from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import filterIcon from '../assets/image/filter-lines.png'

export default function History() {
  console.log('oi')

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Changes</h1>
        <SwitchTheme />
      </div>
      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-3/4 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
        <div className="flex gap-5">
          <Button
            type="button"
            variant="outline"
            className="gap-2 hover:bg-gray-700"
          >
            <img src={filterIcon} alt="" />
            <p>Filters</p>
          </Button>
        </div>
      </div>
    </div>
  )
}
