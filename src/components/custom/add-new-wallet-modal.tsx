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
import { useUserStore } from '@/store/user'
import { useSignalStore } from '@/store/signalEffect'
import { Label } from '../ui/label'
import { AssetsOrganizationForSelectedResponse } from '@/types/asset.type'
import {
  addCryptoWalletClient,
  getAllAssetsInOrgForAddWalletClient,
} from '@/services/assetsService'

interface AddNewWalletModalProps {
  isOpen: boolean
  onClose: () => void
  walletUuid: string
}

export function AddNewWalletModal({
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

  const [errors, setErrors] = useState({
    asset: '',
    entryValue: '',
    allocation: '',
  })

  const { toast } = useToast()

  const handleAddAsset = async () => {
    if (!validateInputs()) return

    onClose()

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing add Asset in organization',
      description: 'Demo Vault !!',
    })

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

    setSelectedAsset('')
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

  const validateInputs = () => {
    let isValid = true
    const errorsCopy = { ...errors }

    // Validate Asset Selection
    if (!selectedAsset) {
      errorsCopy.asset = 'Asset must be selected.'
      isValid = false
    } else {
      errorsCopy.asset = ''
    }

    // Validate Entry Value
    if (!/^\d+(\.\d{0,30})?$/.test(entryValue) || parseFloat(entryValue) < 0) {
      errorsCopy.entryValue = 'Asset value must be a positive number.'
      isValid = false
    } else {
      errorsCopy.entryValue = ''
    }

    // Validate Allocation
    const allocationValue = parseFloat(allocation)
    if (
      !/^\d+(\.\d{0,2})?$/.test(allocation) ||
      allocationValue < 0 ||
      allocationValue > 100
    ) {
      errorsCopy.allocation =
        'Allocation must be a number between 0 and 100 with up to two decimal places after the point.'
      isValid = false
    } else {
      errorsCopy.allocation = ''
    }

    setErrors(errorsCopy)
    return isValid
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
      <DialogContent className="h-[45%] w-[200%] bg-[#131313] text-[#fff] border-transparent">
        <DialogHeader>
          <DialogTitle className="text-3xl text-[#fff]">New Asset</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full h-1/2 flex flex-row justify-between gap-4 items-start">
            <div className="flex flex-col w-1/2 gap-3">
              <Select onValueChange={(item) => setSelectedAsset(item)}>
                <SelectTrigger className="w-full h-full bg-[#131313] border-[#323232]">
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
              {errors.asset && (
                <Label className="text-red-500">{errors.asset}</Label>
              )}
            </div>
            <div className="flex flex-col w-1/2 gap-3">
              <Input
                className="w-full h-full bg-[#131313] border-[#323232] text-[#959CB6]"
                placeholder="Asset Quantity (Ex: 10)"
                value={entryValue}
                onChange={(e) => setEntryValue(e.target.value)}
              />
              {errors.entryValue && (
                <Label className="text-red-500">{errors.entryValue}</Label>
              )}
            </div>
          </div>
          <div className="w-full h-1/2 flex flex-row justify-between gap-4 items-center">
            <div className="flex flex-col w-1/2 gap-3">
              <Input
                className="w-full h-full bg-[#131313] border-[#323232] text-[#959CB6]"
                placeholder="Ideal Allocation (%)"
                value={allocation}
                onChange={(e) => setAllocation(e.target.value)}
              />
              {errors.allocation && (
                <Label className="text-red-500">{errors.allocation}</Label>
              )}
            </div>
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
