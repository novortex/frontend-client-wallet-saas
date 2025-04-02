import { useState, useEffect, ChangeEvent } from 'react'
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
  const [inputQuantity, setInputQuantity] = useState<string>('0')
  const [tradeAmount, setTradeAmount] = useState(0)
  const { handleTradeAsset } = useWalletActions(rowInfos, fetchData)

  // Função para calcular a diferença enquanto digita
  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputQuantity(value)

    const inputNum = parseFloat(value || '0')
    if (!Number.isNaN(inputNum)) {
      const result = rowInfos.assetQuantity - inputNum
      setTradeAmount(result)
    }
  }

  // Reset o state quando o dialog abre
  useEffect(() => {
    if (isOpen) {
      setInputQuantity('0')
      setTradeAmount(0)
    }
  }, [isOpen])

  const handleBuy = () => {
    const buyAmount = Math.abs(tradeAmount)

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
    const sellAmount = -Math.abs(tradeAmount)

    if (sellAmount >= 0) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Invalid quantity for sell',
        description: 'Please provide a valid quantity to sell.',
      })
    }

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
      <DialogContent className="w-full max-w-md border-0 text-white dark:bg-[#1C1C1C]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black dark:text-white">
            Trade Asset
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex items-center">
          <div className="mr-3 h-8 w-8 flex-shrink-0">
            <img
              src={rowInfos.asset.urlImage}
              alt={rowInfos.asset.name}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-lg font-medium">{rowInfos.asset.name}</span>
        </div>

        <div className="mb-4 mt-2">
          <label className="font-medium text-gray-400 dark:text-gray-300">
            Balance:{' '}
            <span className="text-white">
              {rowInfos.assetQuantity} {rowInfos.asset.name}
            </span>
          </label>
        </div>

        <div className="mt-5 space-y-5">
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-400 dark:text-gray-300">
              Nova Quantidade total:
            </label>
            <Input
              className="h-10 w-full dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
              placeholder="Quantity"
              type="number"
              value={inputQuantity}
              onChange={handleQuantityChange}
            />
          </div>

          <div className="rounded-md bg-gray-800 p-3">
            <label className="font-medium">
              {tradeAmount < 0 ? (
                <span className="text-green-500">Comprando:</span>
              ) : (
                <span className="text-red-500">Vendendo:</span>
              )}{' '}
              <span className="text-lg text-white">
                {Math.abs(tradeAmount)} Un.
              </span>
            </label>
          </div>
        </div>

        <DialogFooter className="mt-6 flex items-center justify-between">
          <div className="flex justify-start gap-3">
            <Button
              className="w-28 bg-green-500 text-black hover:bg-green-600"
              onClick={handleBuy}
              disabled={tradeAmount >= 0}
            >
              Buy
            </Button>
            <Button
              className="w-28 bg-red-500 text-white hover:bg-red-600"
              onClick={handleSell}
              disabled={tradeAmount <= 0}
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
