import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RebalanceReturn } from '@/types/wallet.type'
import { useState, useEffect } from 'react'

type RebalanceItem = RebalanceReturn & {
  selected: boolean
  customAmount: string
  originalAmount: number
  calculatedAmount: number // Valor exato calculado (com decimais)
}

type ResultRebalanceModalProps = {
  open: boolean | undefined
  onOpenChange: (open: boolean) => void
  rebalanceResults: RebalanceReturn[] | []
  onConfirm?: (selectedItems: RebalanceItem[]) => void
}

export function ResultRebalanceModal({
  open,
  onOpenChange,
  rebalanceResults,
  onConfirm,
}: ResultRebalanceModalProps) {
  const [rebalanceItems, setRebalanceItems] = useState<RebalanceItem[]>([])

  // Inicializa os itens quando o modal abrir
  useEffect(() => {
    if (open && rebalanceResults.length > 0) {
      const items = rebalanceResults.map((result) => ({
        ...result,
        selected: true,
        customAmount: Math.floor(Number(result.amount)).toString(),
        originalAmount: Number(result.amount),
        calculatedAmount: Number(result.amount), // Mantém valor exato
      }))
      setRebalanceItems(items)
    }
  }, [open, rebalanceResults])

  // Função para recalcular o rebalanceamento
  const recalculateRebalance = (items: RebalanceItem[]) => {
    const selectedBuyItems = items.filter(
      (item) => item.selected && item.action === 'buy',
    )
    const selectedSellItems = items.filter(
      (item) => item.selected && item.action === 'sell',
    )
    const unselectedBuyItems = items.filter(
      (item) => !item.selected && item.action === 'buy',
    )
    const unselectedSellItems = items.filter(
      (item) => !item.selected && item.action === 'sell',
    )

    // Calcula o total que precisa ser redistribuído
    const totalUnselectedBuyAmount = unselectedBuyItems.reduce(
      (sum, item) => sum + item.originalAmount,
      0,
    )
    const totalUnselectedSellAmount = unselectedSellItems.reduce(
      (sum, item) => sum + item.originalAmount,
      0,
    )

    // Redistribui proporcionalmente entre os itens selecionados
    const redistributeAmount = (
      items: RebalanceItem[],
      totalToRedistribute: number,
    ) => {
      if (items.length === 0) return items

      // Se não há nada para redistribuir, retorna os valores originais
      if (totalToRedistribute === 0) {
        return items.map((item) => ({
          ...item,
          customAmount: Math.floor(item.originalAmount).toString(),
          calculatedAmount: item.originalAmount,
        }))
      }

      const totalOriginalSelected = items.reduce(
        (sum, item) => sum + item.originalAmount,
        0,
      )

      // Evita divisão por zero
      if (totalOriginalSelected === 0) return items

      return items.map((item) => {
        const proportion = item.originalAmount / totalOriginalSelected
        const additionalAmount = totalToRedistribute * proportion
        const newAmountExact = item.originalAmount + additionalAmount // Valor exato
        const newAmountFloor = Math.floor(newAmountExact) // Valor que pode ser digitado

        return {
          ...item,
          customAmount: newAmountFloor.toString(),
          calculatedAmount: newAmountExact, // Mantém valor exato para comparação
        }
      })
    }

    // Aplica a redistribuição para buy e sell separadamente
    const updatedBuyItems = redistributeAmount(
      selectedBuyItems,
      totalUnselectedBuyAmount,
    )
    const updatedSellItems = redistributeAmount(
      selectedSellItems,
      totalUnselectedSellAmount,
    )

    // Atualiza os itens com os novos valores
    return items.map((item) => {
      if (!item.selected) {
        // Itens não selecionados mantêm seus valores originais
        return {
          ...item,
          customAmount: Math.floor(item.originalAmount).toString(),
          calculatedAmount: item.originalAmount,
        }
      }

      if (item.action === 'buy') {
        return (
          updatedBuyItems.find(
            (updated) => updated.assetName === item.assetName,
          ) || item
        )
      }

      if (item.action === 'sell') {
        return (
          updatedSellItems.find(
            (updated) => updated.assetName === item.assetName,
          ) || item
        )
      }

      return item
    })
  }

  const handleItemToggle = (index: number, checked: boolean) => {
    setRebalanceItems((prev) => {
      const updatedItems = prev.map((item, i) =>
        i === index ? { ...item, selected: checked } : item,
      )

      // sempre recalcula quando há mudança de seleção
      return recalculateRebalance(updatedItems)
    })
  }

  const handleAmountChange = (index: number, value: string) => {
    // Só permite números
    if (value === '' || /^\d+$/.test(value)) {
      const numericValue = Number(value)
      const item = rebalanceItems[index]
      const maxAllowed = Math.floor(item.calculatedAmount) // Usa floor para validação

      // Valida se o valor não é maior que o permitido
      if (numericValue <= maxAllowed || value === '') {
        setRebalanceItems((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, customAmount: value } : item,
          ),
        )
      }
    }
  }

  const handleConfirm = () => {
    const selectedItems = rebalanceItems.filter((item) => item.selected)
    onConfirm?.(selectedItems)
    onOpenChange(false)
  }

  // Botão para resetar todos os cálculos
  const handleResetCalculation = () => {
    setRebalanceItems((prev) => {
      const resetItems = prev.map((item) => ({
        ...item,
        selected: true,
        customAmount: Math.floor(item.originalAmount).toString(),
        calculatedAmount: item.originalAmount,
      }))
      return resetItems
    })
  }

  const buyResults = rebalanceItems.filter((item) => item.action === 'buy')
  const sellResults = rebalanceItems.filter((item) => item.action === 'sell')

  // Calcula totais para exibição
  const totalBuySelected = buyResults
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + Number(item.customAmount || 0), 0)

  const totalSellSelected = sellResults
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + Number(item.customAmount || 0), 0)

  const renderRebalanceSection = (
    items: RebalanceItem[],
    title: string,
    colorClass: string,
    total: number,
  ) => (
    <div className="w-1/2 rounded-[8px] bg-gray-200 p-4 dark:bg-[#171717]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-center text-[16px] dark:text-white">{title}</p>
        <p className={`text-[14px] font-semibold ${colorClass}`}>
          Total: ${total.toLocaleString()}
        </p>
      </div>
      <Separator className="my-2 bg-gray-500 dark:bg-[#F2BE38]" />
      <div className="flex max-h-[200px] w-full flex-col items-center gap-3 overflow-auto">
        {items.map((result, index) => {
          const originalIndex = rebalanceItems.findIndex(
            (item) =>
              item.assetName === result.assetName &&
              item.action === result.action,
          )

          const maxAllowed = Math.floor(result.calculatedAmount)

          return (
            <div
              key={`${result.assetName}-${result.action}-${index}`}
              className={`flex w-full flex-col gap-2 rounded-[8px] p-3 transition-all duration-200 ${
                result.selected
                  ? 'bg-gray-300 shadow-sm dark:bg-[#1C1C1C]'
                  : 'bg-gray-400 opacity-60 dark:bg-[#2A2A2A]'
              }`}
            >
              {/* Header com checkbox e asset info */}
              <div className="flex w-full items-center gap-2">
                <Checkbox
                  checked={result.selected}
                  onCheckedChange={(checked) =>
                    handleItemToggle(originalIndex, checked as boolean)
                  }
                  className="flex-shrink-0"
                />
                <img
                  src={result.assetIcon}
                  alt={result.assetName}
                  className="h-6 w-6 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-[14px] font-medium dark:text-white">
                    {result.assetName}
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400">
                    Max: ${maxAllowed.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Input de quantidade */}
              {result.selected && (
                <div className="flex items-center gap-2">
                  <p
                    className={`text-[12px] ${colorClass} flex-shrink-0 font-bold`}
                  >
                    {title === 'Buy' ? '+' : '-'}
                  </p>
                  <Input
                    type="text"
                    value={result.customAmount}
                    onChange={(e) =>
                      handleAmountChange(originalIndex, e.target.value)
                    }
                    className={`h-8 flex-1 text-[14px] ${
                      Number(result.customAmount) > maxAllowed
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                    }`}
                    placeholder="Amount"
                    max={maxAllowed}
                  />
                  <p className="flex-shrink-0 text-[12px] dark:text-white">
                    USD
                  </p>
                </div>
              )}
            </div>
          )
        })}

        {items.length === 0 && (
          <p className="py-4 text-center text-[14px] text-gray-500 dark:text-gray-400">
            No {title.toLowerCase()} operations
          </p>
        )}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto flex h-[650px] w-full max-w-[800px] flex-col border-none p-6 dark:bg-[#1C1C1C]">
        <DialogHeader>
          <DialogTitle className="text-center text-[24px] dark:text-[#F2BE38]">
            Rebalancing Parameters
          </DialogTitle>
          <p className="text-center text-[14px] text-gray-600 dark:text-gray-400">
            Select assets and adjust amounts for rebalancing
          </p>
        </DialogHeader>

        <div className="flex w-full flex-1 flex-col items-center gap-4 overflow-hidden">
          {/* Informações de balanço */}
          <div className="flex w-full justify-center gap-6 py-2">
            <div className="text-center">
              <p className="text-[12px] text-gray-500 dark:text-gray-400">
                Total Buy
              </p>
              <p className="text-[16px] font-bold text-green-600 dark:text-[#8BF067]">
                ${totalBuySelected.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-gray-500 dark:text-gray-400">
                Total Sell
              </p>
              <p className="text-[16px] font-bold text-red-600 dark:text-[#FF6666]">
                ${totalSellSelected.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-gray-500 dark:text-gray-400">
                Balance
              </p>
              <p
                className={`text-[16px] font-bold ${
                  Math.abs(totalBuySelected - totalSellSelected) < 1
                    ? 'text-green-600 dark:text-[#8BF067]'
                    : 'text-yellow-600 dark:text-[#F2BE38]'
                }`}
              >
                $
                {Math.abs(
                  totalBuySelected - totalSellSelected,
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Botão de reset */}
          <Button
            onClick={handleResetCalculation}
            variant="outline"
            className="border-[#F2BE38] text-[12px] text-[#F2BE38] hover:bg-[#F2BE38] hover:text-black"
          >
            Reset to Original Calculation
          </Button>

          <div className="flex w-full flex-1 flex-row items-start justify-center gap-6">
            {renderRebalanceSection(
              buyResults,
              'Buy',
              'text-green-600 dark:text-[#8BF067]',
              totalBuySelected,
            )}
            {renderRebalanceSection(
              sellResults,
              'Sell',
              'text-red-600 dark:text-[#FF6666]',
              totalSellSelected,
            )}
          </div>

          <DialogFooter className="flex w-full justify-center gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-[30%] rounded-[16px] border-[#F2BE38] text-[#F2BE38] hover:bg-[#F2BE38] hover:text-black"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleConfirm}
              disabled={
                rebalanceItems.filter((item) => item.selected).length === 0
              }
              className="w-[40%] rounded-[16px] bg-[#F2BE38] text-[16px] text-black hover:bg-[#D4A532] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Rebalance (
              {rebalanceItems.filter((item) => item.selected).length} items)
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
