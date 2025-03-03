import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CustomersOrganization } from '@/components/custom/customers/columns'

interface WalletTabProps {
  rowInfos: CustomersOrganization
  ExchangeSelected: string
  setExchangeSelected: (value: string) => void
  exchanges: { name: string; uuid: string }[]
  emailPasswordRef: React.RefObject<HTMLInputElement>
  emailExchangeRef: React.RefObject<HTMLInputElement>
  accountPasswordRef: React.RefObject<HTMLInputElement>
  manager: string
  setManager: (value: string) => void
  managersOrganization: { name: string; uuid: string }[]
  performanceFee: string
  setPerformanceFee: (value: string) => void
  contractChecked: boolean
  setContractChecked: (value: boolean) => void
  initialFeeIsPaid: boolean | null
  setInitialFeeIsPaid: (value: boolean) => void
  handleUpdateWallet: () => Promise<void>
}

export function WalletTab({
  rowInfos,
  ExchangeSelected,
  setExchangeSelected,
  exchanges,
  emailPasswordRef,
  emailExchangeRef,
  accountPasswordRef,
  manager,
  setManager,
  managersOrganization,
  performanceFee,
  setPerformanceFee,
  contractChecked,
  setContractChecked,
  initialFeeIsPaid,
  setInitialFeeIsPaid,
  handleUpdateWallet,
}: WalletTabProps) {
  if (!rowInfos.isWallet) {
    return <p className="text-yellow-500">Please create a wallet first before filling these details.</p>
  }

  return (
    <div className="grid justify-items-center grid-cols-2 gap-5">
      <div className="w-full">
        <Label className="ml-2" htmlFor="Name">
          Exchange
        </Label>
        <Select onValueChange={setExchangeSelected} defaultValue={ExchangeSelected}>
          <SelectTrigger className="dark:bg-[#131313] dark:border-[#323232] dark:text-[#959CB6]">
            <SelectValue>{ExchangeSelected ? exchanges.find((mgr) => mgr.uuid === ExchangeSelected)?.name : 'Name'}</SelectValue>
          </SelectTrigger>
          <SelectContent className="dark:bg-[#131313] dark:border-[#323232] dark:text-[#959CB6]">
            {exchanges.map((bench) => (
              <SelectItem key={bench.uuid} value={bench.uuid}>
                {bench.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <Label className="ml-2" htmlFor="Email Password">
          Email Password
        </Label>
        <Input
          className="dark:bg-[#131313] dark:border-[#323232] dark:text-white"
          type="text"
          id="Email Password"
          placeholder="Email Password"
          ref={emailPasswordRef}
          defaultValue={rowInfos.emailPassword || ''}
          required
        />
      </div>

      <div className="w-full">
        <Label className="ml-2" htmlFor="EmailExchage">
          Email (Exchange)
        </Label>
        <Input
          className="dark:bg-[#131313] dark:border-[#323232] dark:text-white"
          type="email"
          id="Email Exchage"
          ref={emailExchangeRef}
          placeholder="Email Exchange"
          defaultValue={rowInfos.emailExchange || ''}
          required
        />
      </div>

      <div className="w-full">
        <Label className="ml-2" htmlFor="Exchange Password">
          Exchange Password
        </Label>
        <Input
          className="dark:bg-[#131313] dark:border-[#323232] dark:text-white"
          type="text"
          id="Exchange Password"
          placeholder="Exchange Password"
          ref={accountPasswordRef}
          defaultValue={rowInfos.exchangePassword || ''}
          required
        />
      </div>

      <div className="w-full">
        <Label className="ml-2" htmlFor="Phone">
          Manager
        </Label>
        <Select onValueChange={setManager} defaultValue={manager} required>
          <SelectTrigger className="dark:bg-[#131313] dark:border-[#323232] dark:text-white">
            <SelectValue>{manager ? managersOrganization.find((mgr) => mgr.uuid === manager)?.name : 'Name'}</SelectValue>
          </SelectTrigger>
          <SelectContent className="dark:bg-[#131313] dark:border-[#323232] dark:text-white">
            {managersOrganization.map((manager) => (
              <SelectItem key={manager.uuid} value={manager.uuid}>
                {manager.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <Label className="ml-2" htmlFor="performanceFee">
          Performance Fee
        </Label>
        <Input
          className="dark:bg-[#131313] dark:border-[#323232] dark:text-white"
          type="text"
          id="performanceFee"
          value={String(performanceFee)}
          onChange={(e) => setPerformanceFee(e.target.value)}
          placeholder="Enter performance fee"
          required
        />
      </div>

      <div className="w-full mt-4">
        <div className="mb-3 flex gap-3">
          <Checkbox className="border-gray-500" checked={!!contractChecked} onCheckedChange={() => setContractChecked(!contractChecked)} />
          <Label>Initial Fee is paid?</Label>
        </div>

        <div className="flex gap-3">
          <Checkbox className="border-gray-500" checked={initialFeeIsPaid ?? false} onCheckedChange={() => setInitialFeeIsPaid(!initialFeeIsPaid)} />
          <Label>Contract</Label>
        </div>
      </div>

      <div className="mt-12 flex justify-end gap-5">
        <DialogClose asChild>
          <Button onClick={handleUpdateWallet} className="bg-blue-500 hover:bg-blue-600 text-white">
            Save Wallet
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button className="bg-red-500 hover:bg-red-600 text-white">Close</Button>
        </DialogClose>
      </div>
    </div>
  )
}
