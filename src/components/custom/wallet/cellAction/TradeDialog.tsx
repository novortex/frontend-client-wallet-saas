import { useRef } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ClientActive } from '../columns'
import { useWalletActions } from './useWalletActions'
import { toast } from '@/components/ui/use-toast'
import { TradeType } from '@/types/wallet.type'

interface TradeDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  rowInfos: ClientActive
  fetchData: () => void
}

export function TradeDialog({
  isOpen,
  onOpenChange,
  rowInfos,
  fetchData,
}: TradeDialogProps) {
  const quantityRef = useRef<HTMLInputElement>(null)
  const { handleTradeAsset } = useWalletActions(rowInfos, fetchData)

  const handleBuy = () => {
    const buyAmount = parseFloat(quantityRef.current?.value ?? '0')
    if (buyAmount <= 0) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Error',
        description: 'Please provide a valid quantity to buy.',
      })
    }
    handleTradeAsset(buyAmount, TradeType.BUY)
    onOpenChange(false)
  }

  const handleSell = () => {
    const input = parseFloat(quantityRef.current?.value ?? '0')

    if (input <= 0) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Invalid quantity for sell',
        description: 'Please provide a valid quantity to sell.',
      })
    }

    const sellAmount = (() => {
      return Number.isNaN(input) ? 0 : -Math.abs(input)
    })()

    if (rowInfos.assetQuantity + sellAmount < 0) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Insufficient quantity',
        description: `You cannot sell more than your current quantity of ${rowInfos.assetQuantity}.`,
      })
    }

    handleTradeAsset(sellAmount, TradeType.SELL)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal>
      <DialogContent className="border-0 text-white dark:bg-[#1C1C1C]">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">
            Trade Asset
          </DialogTitle>
        </DialogHeader>
        <div className="mt-3 flex">
          <div className="mr-2 h-6 w-6">
            <img src={rowInfos.asset.urlImage} alt={rowInfos.asset.name} />
          </div>
          <span>{rowInfos.asset.name}</span>
        </div>
        <label className="w-1/2">Balance: {rowInfos.assetQuantity}</label>
        <div className="mt-5 flex w-full gap-5">
          <Input
            className="h-full w-1/2 dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
            placeholder="Quantity"
            type="number"
            defaultValue={0}
            ref={quantityRef}
          />
        </div>
        <DialogFooter className="flex items-center justify-between">
          <div className="flex justify-start gap-3">
            <Button
              className="w-28 bg-green-500 text-black hover:bg-green-600"
              onClick={handleBuy}
            >
              Buy
            </Button>
            <Button
              className="w-28 bg-red-500 text-white hover:bg-red-600"
              onClick={handleSell}
            >
              Sell
            </Button>
          </div>

          <DialogClose asChild>
            <Button
              className="bg-gray-500 text-white hover:bg-gray-600"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
