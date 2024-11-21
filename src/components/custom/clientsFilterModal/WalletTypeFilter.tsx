import { Checkbox } from '@/components/ui/checkbox'

export function WalletTypeFilter() {
  return (
    <div className="w-full">
      <div className="h-[20%] w-full font-bold text-[#959CB6]">Wallet type</div>
      <div className="h-[80%] w-full">
        <div className="h-1/2 w-full flex flex-row">
          <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
            <Checkbox className="border-[#fff]" />
            <label>Standard</label>
          </div>
          <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
            <Checkbox className="border-[#fff]" />
            <label>Super Low Risk</label>
          </div>
          <div className="h-full w-1/3 flex justify-center items-center gap-1.5 text-[#fff]">
            <Checkbox className="border-[#fff]" />
            <label>Low Risk</label>
          </div>
        </div>
        <div className="h-1/2 w-full flex flex-row">
          <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
            <Checkbox className="border-[#fff]" />
            <label>High Risk</label>
          </div>
          <div className="h-full w-1/3 flex justify-start items-center gap-1.5 text-[#fff]">
            <Checkbox className="border-[#fff]" />
            <label>Super High Risk</label>
          </div>
        </div>
      </div>
    </div>
  )
}
