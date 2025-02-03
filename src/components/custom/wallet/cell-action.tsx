import { useRef, useState } from 'react'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
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
import { EyeOffIcon, PencilIcon, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ClientActive } from './columns'
import {
  deleteAssetWallet,
  updateAssetWalletInformations,
} from '@/services/wallet/walletAssetService'
import { useParams } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'

export function CellActions({
  rowInfos,
  fetchData,
}: {
  rowInfos: ClientActive
  fetchData: () => void
}) {
  const newQuantityAssetRef = useRef<HTMLInputElement>(null)
  const newIdealAllocationRef = useRef<HTMLInputElement>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])
  const { walletUuid } = useParams()
  const { toast } = useToast()

  const validateInputs = () => {
    let isValid = true

    const entryValue = newQuantityAssetRef.current?.value ?? '0'
    const allocation = newIdealAllocationRef.current?.value ?? '0'

    if (Number(entryValue) < 0) {
      toast({
        className: 'bg-red-500 border-0',
        title: 'Validation Error',
        description: 'Entry value cannot be negative',
      })
      isValid = false
    }

    const allocationValue = Number(allocation)
    if (allocationValue < 0 || allocationValue > 100) {
      toast({
        className: 'bg-red-500 border-0',
        title: 'Validation Error',
        description: 'Allocation must be between 0 and 100',
      })
      isValid = false
    }

    return isValid
  }

  const handleUpdateInformationAssetWallet = async () => {
    if (!validateInputs()) return

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

    const result = await updateAssetWalletInformations(
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

    setSignal(!signal)

    fetchData()
    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success update !!',
      description: 'Demo Vault !!',
    })
  }

  const handleDeleteAssetWallet = async () => {
    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing delete Asset in wallet',
      description: 'Demo Vault !!',
    })

    const result = await deleteAssetWallet(walletUuid as string, rowInfos.id)

    if (result.error) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed delete Asset in Wallet',
        description: 'Demo Vault !!',
      })
    }

    setSignal(!signal)

    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success delete !!',
      description: 'Demo Vault !!',
    })
  }

  const handleEditClick = () => {
    setIsEditDialogOpen(true)
  }

  return (
    <DropdownMenu>
      <Button
        className="flex justify-center gap-3 border-b border-[#D4D7E3] hover:bg-black hover:text-white"
        variant="secondary"
        onClick={handleEditClick}
      >
        <PencilIcon className="w-5" /> Edit
      </Button>

      <div className="flex flex-col">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1C1C1C] border-0 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                Editing information asset in wallet
              </DialogTitle>
              <DialogDescription>
                <div className="flex mt-3">
                  <p>Now you are editing information about</p>
                  <div className="ml-2 animate-bounce">
                    <img
                      src={rowInfos.asset.urlImage}
                      alt={rowInfos.asset.name}
                      className="w-6 h-6 mr-2"
                    />
                  </div>
                  <p>{rowInfos.asset.name} in this wallet</p>
                </div>

                <div className="flex mt-5 gap-5 w-full">
                  <Label className="w-1/2">Asset Quantity (Ex: 100)</Label>
                  <Label className="w-1/2">Ideal Allocation (%)</Label>
                </div>
                <div className="flex mt-5 gap-5 w-full">
                  <Input
                    className="w-1/2 h-full bg-[#131313] border-[#323232] text-[#959CB6]"
                    placeholder="Quantity"
                    type="number"
                    defaultValue={rowInfos.assetQuantity}
                    ref={newQuantityAssetRef}
                  />
                  <Input
                    className="w-1/2 h-full bg-[#131313] border-[#323232] text-[#959CB6]"
                    placeholder="Ideal allocation"
                    type="number"
                    defaultValue={rowInfos.idealAllocation}
                    ref={newIdealAllocationRef}
                  />
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
                Disabled asset <TriangleAlert className="text-yellow-400 w-5" />
              </DialogTitle>
              <DialogDescription>
                <p className="flex">
                  Disabled the
                  <span className="font-bold text-white ml-2">
                    {rowInfos.asset.name}
                  </span>
                  <div className="ml-2 animate-bounce">
                    <img
                      src={rowInfos.asset.urlImage}
                      alt={rowInfos.asset.name}
                      className="w-6 h-6 mr-2"
                    />
                  </div>
                </p>
                {!(
                  rowInfos.assetQuantity === 0 && rowInfos.idealAllocation === 0
                ) ? (
                  <p className="mt-5 font-bold text-yellow-200">
                    {' '}
                    Warning: It is not possible to disable this crypto asset
                    because it still has allocated values and remaining
                    quantities. Please check the allocations and ensure there is
                    no balance before attempting again.
                  </p>
                ) : null}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  Close
                </Button>
              </DialogClose>
              <Button
                disabled={
                  !(
                    rowInfos.assetQuantity === 0 &&
                    rowInfos.idealAllocation === 0
                  )
                }
                onClick={handleDeleteAssetWallet}
                className="bg-blue-500 hover:bg-blue-600 text-black"
              >
                Disabled
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DropdownMenu>
  )
}
