import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { CalendarIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useParams } from 'react-router-dom'
import { useSignalStore } from '@/store/signalEffect'
import {
  requestCloseWallet,
  requestStartWallet,
} from '@/services/wallet/walleInfoService'

interface ConfirmCloseWalletModalProps {
  isOpen: boolean
  onClose: () => void
  startWallet: boolean
  fetchData: () => Promise<void>
}

export default function ConfirmCloseWalletModal({
  isOpen,
  onClose,
  startWallet,
  fetchData,
}: ConfirmCloseWalletModalProps) {
  const [inputValue, setInputValue] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const { walletUuid } = useParams()
  const [signal, setSignal] = useSignalStore((state) => [
    state.signal,
    state.setSignal,
  ])

  const isToday = (dateToCheck: Date) => {
    const today = new Date()
    return (
      dateToCheck.getDate() === today.getDate() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getFullYear() === today.getFullYear()
    )
  }
  const expectedValue = startWallet ? 'startwallet' : 'closewallet'
  const valueOfDate = startWallet ? 'was started' : 'will be closed'
  const isInputValid = inputValue === expectedValue

  const handleSendWalletAction = async () => {
    const customDate = date.toISOString()
    if (walletUuid) {
      if (startWallet) {
        await requestStartWallet(walletUuid, { customDate })
      } else {
        await requestCloseWallet(walletUuid, { customDate })
      }
    }
    setSignal(!signal)
    fetchData()
    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      setDate(new Date())
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[80%] w-[40%] max-w-full border-transparent dark:bg-[#131313] dark:text-[#fff]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="text-3xl">Confirmation</DialogTitle>
        </DialogHeader>

        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p>Choose the date that the wallet {valueOfDate}</p>

          <div className="flex w-1/2 flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
                >
                  {date.toLocaleDateString()}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  disabled={(date) => date > new Date()}
                  className="rounded-md dark:bg-[#131313] dark:text-white"
                  classNames={{
                    day_today: isToday(date)
                      ? 'bg-white text-black hover:bg-white rounded-md'
                      : 'bg-transparent text-white hover:bg-white rounded-md text-black',
                    day_selected:
                      'bg-white text-black hover:bg-white rounded-md',
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Label className="flex flex-row gap-3 text-lg">
            <p className="dark:text-[#959CB6]">Type to confirm:</p>
            <p>{expectedValue}</p>
          </Label>

          <Input
            placeholder="Type here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isInputValid) {
                handleSendWalletAction()
              }
            }}
            onPaste={(e) => e.preventDefault()}
            className="w-1/2 dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
          />
        </div>

        <DialogFooter className="flex items-end justify-end">
          <Button
            className="w-[20%] bg-[#1877F2] p-5 text-white hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
            disabled={!isInputValid}
            onClick={handleSendWalletAction}
          >
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
