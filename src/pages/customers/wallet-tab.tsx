import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CustomersOrganization } from '@/components/custom/customers/columns'
import { RiskProfile } from './index'

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
  setRiskProfile: (value: RiskProfile) => void
  riskProfile: RiskProfile
  showUpdateCheckbox: boolean
  isUpdateWithBaseWallet: boolean
  setIsUpdateWithBaseWallet: (value: boolean) => void
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
  setRiskProfile,
  riskProfile,
  showUpdateCheckbox,
  isUpdateWithBaseWallet,
  setIsUpdateWithBaseWallet,
}: WalletTabProps) {
  if (!rowInfos.isWallet) {
    return (
      <p className="text-yellow-500">
        Please create a wallet first before filling these details.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 justify-items-start gap-5">
      <div className="w-full">
        <Label className="ml-2" htmlFor="Name">
          Exchange
        </Label>
        <Select
          onValueChange={setExchangeSelected}
          defaultValue={ExchangeSelected}
        >
          <SelectTrigger className="dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]">
            <SelectValue>
              {ExchangeSelected
                ? exchanges.find((mgr) => mgr.uuid === ExchangeSelected)?.name
                : 'Name'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]">
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
          className="dark:border-[#323232] dark:bg-[#131313] dark:text-white"
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
          className="dark:border-[#323232] dark:bg-[#131313] dark:text-white"
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
          className="dark:border-[#323232] dark:bg-[#131313] dark:text-white"
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
          <SelectTrigger className="dark:border-[#323232] dark:bg-[#131313] dark:text-white">
            <SelectValue>
              {manager
                ? managersOrganization.find((mgr) => mgr.uuid === manager)?.name
                : 'Name'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="dark:border-[#323232] dark:bg-[#131313] dark:text-white">
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
          className="dark:border-[#323232] dark:bg-[#131313] dark:text-white"
          type="text"
          id="performanceFee"
          value={String(performanceFee)}
          onChange={(e) => setPerformanceFee(e.target.value)}
          placeholder="Enter performance fee"
          required
        />
      </div>
      <div className="w-full">
        <Label className="ml-2" htmlFor="riskProfile">
          Risk Profile
        </Label>
        <Select
          onValueChange={(value) => setRiskProfile(value as RiskProfile)}
          value={riskProfile || undefined}
          required
        >
          <SelectTrigger className="dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]">
            <SelectValue>
              {riskProfile
                ? riskProfile
                    .replace(/_/g, ' ')
                    .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
                : 'Select Risk Profile'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]">
            <SelectItem value="SUPER_LOW_RISK">Super Low Risk</SelectItem>
            <SelectItem value="LOW_RISK">Low Risk</SelectItem>
            <SelectItem value="STANDARD">Standard</SelectItem>
            <SelectItem value="HIGH_RISK">High Risk</SelectItem>
            <SelectItem value="SUPER_HIGH_RISK">Super High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 w-full">
        <div className="mb-3 flex gap-3">
          <Checkbox
            className="border-gray-500"
            checked={!!contractChecked}
            onCheckedChange={() => setContractChecked(!contractChecked)}
          />
          <Label>Initial Fee is paid?</Label>
        </div>

        <div className="flex gap-3">
          <Checkbox
            className="border-gray-500"
            checked={initialFeeIsPaid ?? false}
            onCheckedChange={() => setInitialFeeIsPaid(!initialFeeIsPaid)}
          />
          <Label>Contract</Label>
        </div>

        {showUpdateCheckbox && (
          <div className="mt-3 flex items-center gap-3">
            <Checkbox
              className="border-gray-500"
              checked={isUpdateWithBaseWallet}
              onCheckedChange={(checked) =>
                setIsUpdateWithBaseWallet(checked as boolean)
              }
            />
            <Label>Update with base wallet?</Label>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-end gap-5">
        <DialogClose asChild>
          <Button
            onClick={handleUpdateWallet}
            className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            Save Wallet
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button className="btn-red">
            Close
          </Button>
        </DialogClose>
      </div>
    </div>
  )
}
