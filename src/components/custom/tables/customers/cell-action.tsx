import { useRef, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  EyeOffIcon,
  PencilIcon,
  StepForward,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomersOrganization } from './columns'
import CreateWalletModal from '../../create-wallet-modal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useManagerOrganization } from '@/store/managers_benckmark_exchanges'
import { Checkbox } from '@/components/ui/checkbox'
import { updateCustomer, updateWallet } from '@/services/request'
import { useToast } from '@/components/ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'

export default function CellActions({
  rowInfos,
}: {
  rowInfos: CustomersOrganization
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contractChecked, setContractChecked] = useState<boolean>(
    !!rowInfos.contract,
  )
  const [initialFeeIsPaid, setInitialFeeIsPaid] = useState(
    rowInfos.initialFeePaid,
  )
  const [manager, setManager] = useState(rowInfos.manager?.managerUuid || '')
  const [ExchangeSelected, setExchangeSelected] = useState(
    rowInfos.exchange?.exchangeUuid || '',
  )
  const [performanceFee, setPerformanceFee] = useState(
    rowInfos.performanceFee ? String(rowInfos.performanceFee) : '',
  )

  console.log(rowInfos.performanceFee)

  const [name, setName] = useState(rowInfos.name || '')
  const [email, setEmail] = useState(rowInfos.email || '')
  const [phone, setPhone] = useState(rowInfos.phone || '')

  const accountPasswordRef = useRef<HTMLInputElement>(null)
  const emailExchangeRef = useRef<HTMLInputElement>(null)
  const emailPasswordRef = useRef<HTMLInputElement>(null)

  const [managersOrganization, exchanges] = useManagerOrganization((state) => [
    state.managers,
    state.exchanges,
  ])

  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const { toast } = useToast()

  const openModal = () => {
    setIsModalOpen(true)
  }
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    general: '',
  })

  const handleUpdateCustomer = async () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      general: '',
    }

    const normalizedName = name.replace(/\s+/g, ' ').trim()


    if (
      !/^[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,})+$/.test(
        normalizedName,
      ) ||
      /\s$/.test(name)
    ) {
      newErrors.name =
        'Name must include both first and last names, each starting with a capital letter and containing at least two letters.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format.'
    }

    if (!/^\d+$/.test(phone.replace(/\D/g, '')) || phone.trim().length < 11) {
      newErrors.phone =
        'The phone number must contain only numbers and include the country code.'
    }

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors)
      return
    }

    try {
      const result = await updateCustomer(rowInfos.id, {
        name,
        email,
        phone,
      })

      if (result !== true) {
        setErrors({
          ...newErrors,
          general: 'Failed to update customer. Try again.',
        })
        return
      }

      setSignal(!signal)

      setIsEditDialogOpen(false)
    } catch (error) {
      setErrors({
        ...newErrors,
        general: 'An unexpected error occurred. Please try again.',
      })
    }
  }

  const handleUpdateWallet = async () => {
    try {
      toast({
        className: 'bg-yellow-500 border-0',
        title: 'Processing add Asset in organization',
        description: 'Demo Vault !!',
      })

      const result = await updateWallet(rowInfos.walletUuid || '', {
        accountPassword: accountPasswordRef.current?.value ?? '',
        contract: contractChecked,
        emailExchange: emailExchangeRef.current?.value ?? '',
        emailPassword: emailPasswordRef.current?.value ?? '',
        exchangeUuid: ExchangeSelected,
        initialFeeIsPaid: initialFeeIsPaid ?? false,
        manager,
        performanceFee: parseFloat(String(performanceFee)),
      })

      if (result !== true) {
        return toast({
          className: 'bg-red-500 border-0',
          title: 'Failed add Asset in organization',
          description: 'Demo Vault !!',
        })
      }

      setSignal(!signal)

      return toast({
        className: 'bg-green-500 border-0',
        title: 'Success update !!',
        description: 'Demo Vault !!',
      })
    } catch (error) {
      return toast({
        className: 'bg-red-500 border-0',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        title: `${(error as any).response?.data?.message[0] ?? 'Unknown error'}`,
        description: 'Demo Vault !!',
      })
    }
  }

  const resetModalState = () => {
    setName(rowInfos.name || '')
    setEmail(rowInfos.email || '')
    setPhone(rowInfos.phone || '')
    setErrors({ name: '', email: '', phone: '', general: '' })
  }
  return (
    <>
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(isOpen) => {
          setIsEditDialogOpen(isOpen)
          if (!isOpen) resetModalState()
        }}
      >
        <DialogTrigger asChild>
          <Button
            className="flex justify-center gap-3 border-b border-[#D4D7E3] hover:bg-black hover:text-white"
            variant="secondary"
          >
            <PencilIcon className="w-5" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#1C1C1C] border-0 text-white max-w-fit">
          <DialogHeader>
            <DialogTitle className="text-white text-3xl">
              Customer edit
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="Profile">
            <TabsList className="flex justify-between gap-5 bg-[#1C1C1C]">
              <TabsTrigger
                className="w-1/2 bg-[#171717] text-[#F2BE38] data-[state=active]:bg-yellow-500"
                value="Profile"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                className="w-1/2 bg-[#171717] text-[#F2BE38] data-[state=active]:bg-yellow-500"
                value="Wallet"
              >
                Wallet
              </TabsTrigger>
            </TabsList>

            {/* Conteúdo da aba Profile */}
            <TabsContent className="mt-10" value="Profile">
              <div className="grid justify-items-center grid-cols-2 gap-5">
                <div>
                  <Label className="ml-2" htmlFor="Name">
                    Name
                  </Label>
                  <Input
                    className="bg-[#131313] border-[#323232] text-white"
                    type="text"
                    id="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label className="ml-2" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    className="bg-[#131313] border-[#323232] text-white"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label className="ml-2" htmlFor="Phone">
                    Phone
                  </Label>
                  <Input
                    className="bg-[#131313] border-[#323232] text-white"
                    type="tel"
                    id="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Botão Save para a aba Profile */}
              <div className="mt-12 flex justify-end gap-5">
                <Button
                  onClick={handleUpdateCustomer}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Profile
                </Button>

                <DialogClose asChild>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    Close
                  </Button>
                </DialogClose>
              </div>
            </TabsContent>

            {/* Conteúdo da aba Wallet */}
            <TabsContent className="mt-10" value="Wallet">
              {rowInfos.isWallet ? (
                <div className="grid justify-items-center grid-cols-2 gap-5">
                  <div className="w-full">
                    <Label className="ml-2" htmlFor="Name">
                      Exchange
                    </Label>
                    <Select
                      onValueChange={(value) => setExchangeSelected(value)}
                      defaultValue={ExchangeSelected}
                    >
                      <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                        <SelectValue>
                          {ExchangeSelected
                            ? exchanges.find(
                                (mgr) => mgr.uuid === ExchangeSelected,
                              )?.name
                            : 'Name'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                        {exchanges.map((bench) => (
                          <SelectItem key={bench.uuid} value={bench.uuid}>
                            {bench.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="ml-2" htmlFor="Email Password">
                      Email Password
                    </Label>
                    <Input
                      className="bg-[#131313] border-[#323232] text-white"
                      type="text"
                      id="Email Password"
                      placeholder="Email Password"
                      ref={emailPasswordRef}
                      defaultValue={rowInfos.emailPassword || ''}
                      required
                    />
                  </div>

                  <div>
                    <Label className="ml-2" htmlFor="EmailExchage">
                      Email ( Exchange )
                    </Label>
                    <Input
                      className="bg-[#131313] border-[#323232] text-white"
                      type="email"
                      id="Email Exchage"
                      ref={emailExchangeRef}
                      placeholder="Email Exchange"
                      defaultValue={rowInfos.emailExchange || ''}
                      required
                    />
                  </div>

                  <div>
                    <Label className="ml-2" htmlFor="Exchange Password">
                      Exchange Password
                    </Label>
                    <Input
                      className="bg-[#131313] border-[#323232] text-white"
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
                    <Select
                      onValueChange={(value) => setManager(value)}
                      defaultValue={manager}
                      required
                    >
                      <SelectTrigger className="bg-[#131313] border-[#323232] text-white">
                        <SelectValue>
                          {manager
                            ? managersOrganization.find(
                                (mgr) => mgr.uuid === manager,
                              )?.name
                            : 'Name'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-[#131313] border-[#323232] text-white">
                        {managersOrganization.map((manager) => (
                          <SelectItem key={manager.uuid} value={manager.uuid}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="ml-2" htmlFor="performanceFee">
                      Performance Fee
                    </Label>
                    <Input
                      className="bg-[#131313] border-[#323232] text-white"
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
                      <Checkbox
                        className="border-gray-500"
                        checked={!!contractChecked}
                        onCheckedChange={() =>
                          setContractChecked(!contractChecked)
                        }
                      />
                      <Label>Initial Fee is paid?</Label>
                    </div>

                    <div className="flex gap-3">
                      <Checkbox
                        className="border-gray-500"
                        checked={initialFeeIsPaid ?? false}
                        onCheckedChange={() =>
                          setInitialFeeIsPaid(!initialFeeIsPaid)
                        }
                      />
                      <Label>Contract</Label>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-yellow-500">
                  Please create a wallet first before filling these details.
                </p>
              )}

              {/* Botão Save para a aba Wallet */}
              <div className="mt-12 flex justify-end gap-5">
                <DialogClose asChild>
                  <Button
                    onClick={handleUpdateWallet}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Save Wallet
                  </Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    Close
                  </Button>
                </DialogClose>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-5">
            <DialogClose asChild></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* botão para cadastrar wallet */}
      {rowInfos.isWallet === false ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="flex justify-center gap-3 hover:bg-black hover:text-white"
              variant="secondary"
              onClick={openModal}
            >
              <StepForward className="w-5" /> Continue
            </Button>
          </DialogTrigger>
        </Dialog>
      ) : null}

      {/* botão para desabilitar um usuario, deve ser implementad essa função ainda */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="flex justify-center gap-3 border-b border-[#D4D7E3] hover:bg-black hover:text-white"
            variant="secondary"
          >
            <EyeOffIcon className="w-5" /> Disable
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#1C1C1C] border-0 text-white">
          <DialogHeader>
            <DialogTitle className="flex gap-5 items-center mb-5">
              Disabled asset <TriangleAlert className="text-yellow-400 w-5" />
            </DialogTitle>
            <DialogDescription>
              Disabled the for all wallets
              <p className="mt-5 font-bold text-yellow-200">
                Warning: You are about to disable this crypto asset for all
                wallets. This action is irreversible and will affect all users
                holding this asset. Please confirm that you want to proceed with
                this operation.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Close
              </Button>
            </DialogClose>
            <Button
              disabled
              className="bg-blue-500 hover:bg-blue-600 text-black"
            >
              Disabled
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateWalletModal
        rowInfos={rowInfos}
        onClose={closeModal}
        isOpen={isModalOpen}
      />
    </>
  )
}
