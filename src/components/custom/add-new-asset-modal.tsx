import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '../ui/input'
import * as React from 'react'
import { addCryptoOrg } from '@/service/request'
import { useUserStore } from '@/store/user'
import { useToast } from '../ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'

interface AddNewAssetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddNewAssetModal({
  isOpen,
  onClose,
}: AddNewAssetModalProps) {
  const [assetId, setAssetId] = React.useState('')
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
    const result = await addCryptoOrg(uuidOrganization, [Number(assetId)])

    if (result === false) {
      setAssetId('')
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed add Asset in organization',
        description: 'Demo Vault !!',
      })
    }

    setAssetId('')

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Regex to allow only digits
    if (/^\d*$/.test(value)) {
      setAssetId(value)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] bg-[#131313] text-[#fff] border-transparent">
        <DialogHeader>
          <DialogTitle className="text-3xl text-[#fff]">New Asset</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <Input
            placeholder="idCMC"
            className="w-full h-full bg-[#272727] border-[#323232] text-[#959CB6]"
            value={assetId}
            onChange={handleChange}
          />
          <div className="w-full flex flex-row gap-1">
            <p className="text-[#fff]">Check the desired asset ID at</p>
            <a
              className="text-[#1877F2] hover:opacity-70"
              href="https://coinmarketcap.com/"
              target="_blank"
              rel="noreferrer"
            >
              coinmarketcap
            </a>
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
