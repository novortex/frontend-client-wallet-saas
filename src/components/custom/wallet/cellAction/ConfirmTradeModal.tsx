'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TradeType } from '@/types/wallet.type'

interface TradeConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  assetName: string
  assetPrice: number
  assetImage: string
  tradeAmount: number
  tradeType: TradeType
  onConfirm: () => void
}

export function TradeConfirmationDialog({
  isOpen,
  onOpenChange,
  assetName,
  assetPrice,
  assetImage,
  tradeAmount,
  tradeType,
  onConfirm,
}: TradeConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal>
      <DialogContent className="w-full max-w-md border-0 text-white dark:bg-[#1C1C1C]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black dark:text-white">
            Confirm Trade
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex items-center">
          <div className="mr-3 h-8 w-8 flex-shrink-0">
            <img
              src={assetImage || '/placeholder.svg'}
              alt={assetName}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-lg font-medium">{assetName}</span>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-md bg-gray-800 p-4">
            <p className="text-center text-lg font-medium">
              You are about to{' '}
              <span
                className={
                  tradeType === TradeType.BUY
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {tradeType === TradeType.BUY ? 'BUY' : 'SELL'}
              </span>
            </p>
            <div className="flex flex-col space-y-2">
              <p className="mt-2 text-center text-2xl font-bold">
                {Math.abs(tradeAmount).toFixed(6)} {assetName}
              </p>
              <label className="text-center font-medium text-yellow-400">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(assetPrice)}
              </label>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400">
            Please confirm this transaction to proceed
          </p>
        </div>

        <DialogFooter className="mt-6 flex items-center justify-between">
          <Button
            className={`w-full ${
              tradeType === TradeType.BUY
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
            onClick={handleConfirm}
          >
            Confirm {tradeType === TradeType.BUY ? 'Purchase' : 'Sale'}
          </Button>

          <DialogClose asChild>
            <Button
              className="w-full bg-gray-500 text-white hover:bg-gray-600"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
