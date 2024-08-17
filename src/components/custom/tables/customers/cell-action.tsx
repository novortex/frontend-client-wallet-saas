import { useRef, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  MoreHorizontal,
  PencilIcon,
  TriangleAlert,
  StepForward,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomersOrganization } from './columns'
import { updateAssetWalletInformations } from '@/service/request'
import { useUserStore } from '@/store/user'
import { useParams } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'

export default function CellActions({
  rowInfos,
}: {
  rowInfos: CustomersOrganization
}) {
  const newQuantityAssetRef = useRef<HTMLInputElement>(null)
  const newIdealAllocationRef = useRef<HTMLInputElement>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])
  const { walletUuid } = useParams()
  const { toast } = useToast()

  const handleUpdateInformationAssetWallet = async () => {
    if (!newQuantityAssetRef.current && !newIdealAllocationRef.current) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed add Asset in organization',
        description: 'Demo Vault !!',
      })
    }
    setIsEditDialogOpen(false)

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing add Asset in organization',
      description: 'Demo Vault !!',
    })

    const quantity = parseFloat(newQuantityAssetRef.current?.value ?? '0')
    const idealAllocation = parseFloat(
      newIdealAllocationRef.current?.value ?? '0',
    )

    // toast yellow for process
    const result = await updateAssetWalletInformations(
      uuidOrganization,
      walletUuid as string,
      rowInfos.id,
      quantity,
      idealAllocation,
    )

    if (result === false) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed add Asset in organization',
        description: 'Demo Vault !!',
      })
    }

    if (!signal) {
      setSignal(true)
    } else {
      setSignal(false)
    }

    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success update !!',
      description: 'Demo Vault !!',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white border-0 text-black"
        align="center"
      >
        <div className="flex flex-col">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex justify-center gap-3 border-b border-[#D4D7E3] hover:bg-black hover:text-white"
                variant="secondary"
              >
                <PencilIcon className="w-5" /> Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1C1C1C] border-0 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Editing information asset in wallet
                </DialogTitle>
                <DialogDescription>
                  <div className="flex mt-3">
                    <p>Now you are editing information about</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleUpdateInformationAssetWallet}
                  className="bg-green-500 hover:bg-green-600 text-black"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {rowInfos.isWallet === false ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="flex justify-center gap-3 hover:bg-black hover:text-white"
                  variant="secondary"
                >
                  <StepForward className="w-5" /> Continue
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1C1C1C] border-0 text-white">
                <DialogHeader>
                  <DialogTitle className="flex gap-5 items-center mb-5">
                    Disabled asset{' '}
                    <TriangleAlert className="text-yellow-400 w-5" />
                  </DialogTitle>
                  <DialogDescription>
                    Disabled the for all wallets
                    <p className="mt-5 font-bold text-yellow-200">
                      Warning: You are about to disable this crypto asset for
                      all wallets. This action is irreversible and will affect
                      all users holding this asset. Please confirm that you want
                      to proceed with this operation.
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
          ) : null}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="flex justify-center gap-3 hover:bg-black hover:text-white"
                variant="secondary"
              >
                <EyeOffIcon className="w-5" /> Disable
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1C1C1C] border-0 text-white">
              <DialogHeader>
                <DialogTitle className="flex gap-5 items-center mb-5">
                  Disabled asset{' '}
                  <TriangleAlert className="text-yellow-400 w-5" />
                </DialogTitle>
                <DialogDescription>
                  Disabled the for all wallets
                  <p className="mt-5 font-bold text-yellow-200">
                    Warning: You are about to disable this crypto asset for all
                    wallets. This action is irreversible and will affect all
                    users holding this asset. Please confirm that you want to
                    proceed with this operation.
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
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
