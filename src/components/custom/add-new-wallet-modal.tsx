import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '../ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useState, useEffect } from 'react'

import { useToast } from '../ui/use-toast'
import {
  addCryptoWalletClient,
  AssetsOrganizationForSelectedResponse,
  getAllAssetsInOrgForAddWalletClient,
} from '@/service/request'
import { useUserStore } from '@/store/user'
import { useSignalStore } from '@/store/signalEffect'

interface AddNewWalletModalProps {
  isOpen: boolean
  onClose: () => void
  walletUuid: string
}

export default function AddNewWalletModal({
  isOpen,
  onClose,
  walletUuid,
}: AddNewWalletModalProps) {
  const [selectedAsset, setSelectedAsset] = useState('')
  const [entryValue, setEntryValue] = useState('')
  const [allocation, setAllocation] = useState('')
  const [assetForSelected, setAssetForSelected] = useState<
    AssetsOrganizationForSelectedResponse[]
  >([])
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])

  const { toast } = useToast()

  const handleAddAsset = async () => {
    onClose()

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing add Asset in organization',
      description: 'Demo Vault !!',
    })

    // toast yellow for process
    const result = await addCryptoWalletClient(
      uuidOrganization,
      walletUuid,
      selectedAsset,
      Number(entryValue),
      Number(allocation),
    )

    if (result === false) {
      setSelectedAsset('')
      setEntryValue('')
      setAllocation('')
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed add Asset in organization',
        description: 'Demo Vault !!',
      })
    }

    // Reset the dropdowns and inputs
    setSelectedAsset('Asset')
    setEntryValue('')
    setAllocation('')

    if (!signal) {
      setSignal(true)
    } else {
      setSignal(false)
    }

    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success !! new Asset in organization',
      description: 'Demo Vault !!',
    })
  }

  useEffect(() => {
    async function getData(
      uuidOrganization: string,
      setAssetForSelected: React.Dispatch<
        React.SetStateAction<AssetsOrganizationForSelectedResponse[]>
      >,
    ) {
      const result = await getAllAssetsInOrgForAddWalletClient(uuidOrganization)

      if (!result) {
        return null
      }

      setAssetForSelected(result)
    }

    getData(uuidOrganization, setAssetForSelected)
  }, [uuidOrganization])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] bg-[#131313] text-[#fff]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-[#fff]">New Asset</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full h-1/2 flex flex-row justify-between gap-4 items-center">
            <Select onValueChange={(item) => setSelectedAsset(item)}>
              <SelectTrigger className="w-2/4 h-full bg-[#131313] border-[#323232]">
                <SelectValue placeholder="Asset" />
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-2 border-[#323232]">
                {assetForSelected &&
                  assetForSelected.map((item) => (
                    <SelectItem
                      className=" bg-[#131313] border-0  focus:bg-[#252525] focus:text-white text-white"
                      key={item.uuid}
                      value={item.uuid}
                    >
                      <div className="flex gap-5">
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="w-6 h-6 mr-2"
                        />
                        {item.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Input
              className="w-1/2 h-full bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Entry value"
              value={entryValue}
              onChange={(e) => setEntryValue(e.target.value)}
            />
          </div>
          <div className="w-full h-1/2 flex flex-row justify-between gap-4 items-center">
            <Input
              className="w-1/2 h-full bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Allocation"
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-1/4 hover:bg-blue-600 p-5"
            onClick={handleAddAsset}
          >
            Add asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
